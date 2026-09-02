import { useEffect, useMemo, useRef, useState } from 'react'
import { Image, PanResponder, StyleSheet, Text, View, type LayoutChangeEvent } from 'react-native'
import Svg, { Circle, G, Polygon, Polyline, Text as SvgText } from 'react-native-svg'
import type { SitumCartographyBuilding, SitumCartographyFloor, SitumCartographyPoi } from '../../../shared/situm-cartography'
import { fitMapFrame, projectCartesianToFrame, projectCartesianToMap } from './customMapGeometry'
import { routeSegmentsForFloor, type IndoorPosition, type IndoorRoute } from './customRoute'

export type CustomIndoorLocation = IndoorPosition & { accuracy?: number, bearingDegrees?: number }

type Props = {
  building: SitumCartographyBuilding
  floor: SitumCartographyFloor
  pois: SitumCartographyPoi[]
  selectedPoi: SitumCartographyPoi | null
  currentLocation: CustomIndoorLocation | null
  route: IndoorRoute | null
  recenterNonce: number
  onPoiPress: (poi: SitumCartographyPoi) => void
}

type Viewport = { width: number, height: number }
type Offset = { x: number, y: number }

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))
const touchDistance = (touches: readonly { pageX: number, pageY: number }[]) => {
  if (touches.length < 2) return 0
  return Math.hypot(touches[1]!.pageX - touches[0]!.pageX, touches[1]!.pageY - touches[0]!.pageY)
}

function headingTriangle(x: number, y: number, radius: number, degreesClockwise: number) {
  const angle = (degreesClockwise - 90) * Math.PI / 180
  const tip = { x: x + Math.cos(angle) * radius * 1.85, y: y + Math.sin(angle) * radius * 1.85 }
  const left = { x: x + Math.cos(angle + 2.35) * radius, y: y + Math.sin(angle + 2.35) * radius }
  const right = { x: x + Math.cos(angle - 2.35) * radius, y: y + Math.sin(angle - 2.35) * radius }
  return `${tip.x},${tip.y} ${left.x},${left.y} ${right.x},${right.y}`
}

export function CustomIndoorMap({ building, floor, pois, selectedPoi, currentLocation, route, recenterNonce, onPoiPress }: Props) {
  const [viewport, setViewport] = useState<Viewport>({ width: 0, height: 0 })
  const [scale, setScale] = useState(1)
  const [offset, setOffset] = useState<Offset>({ x: 0, y: 0 })
  const gesture = useRef({ x: 0, y: 0, scale: 1, distance: 0 })
  const dimensions = building.dimensions
  const frame = useMemo(() => fitMapFrame(dimensions, viewport), [dimensions, viewport])
  const floorPois = useMemo(() => pois.filter(poi => poi.floorId === floor.id).slice(0, 100), [floor.id, pois])
  const routeSegments = useMemo(() => routeSegmentsForFloor(route, floor.id), [floor.id, route])
  const strokeUnit = Math.max(dimensions.width, dimensions.length) / 190
  const poiRadius = Math.max(strokeUnit * 1.65, 0.7)
  const userRadius = Math.max(strokeUnit * 2.2, 1.1)

  const resetToLocation = () => {
    setScale(1)
    if (!currentLocation || currentLocation.floorId !== floor.id || !frame.width || !frame.height) {
      setOffset({ x: 0, y: 0 })
      return
    }
    const point = projectCartesianToFrame(currentLocation, dimensions, frame)
    setOffset({
      x: viewport.width / 2 - (frame.left + point.x),
      y: viewport.height / 2 - (frame.top + point.y),
    })
  }

  useEffect(() => { resetToLocation() }, [recenterNonce])
  useEffect(() => {
    setScale(1)
    setOffset({ x: 0, y: 0 })
  }, [building.id, floor.id])

  const panResponder = useMemo(() => PanResponder.create({
    onStartShouldSetPanResponder: () => false,
    onMoveShouldSetPanResponder: (event, state) => event.nativeEvent.touches.length >= 2 || Math.abs(state.dx) > 3 || Math.abs(state.dy) > 3,
    onPanResponderGrant: event => {
      const touches = event.nativeEvent.touches
      gesture.current = { x: offset.x, y: offset.y, scale, distance: touchDistance(touches) }
    },
    onPanResponderMove: (event, state) => {
      const touches = event.nativeEvent.touches
      if (touches.length >= 2) {
        const distance = touchDistance(touches)
        if (gesture.current.distance > 0 && distance > 0) setScale(clamp(gesture.current.scale * distance / gesture.current.distance, 0.8, 4.5))
        return
      }
      setOffset({ x: gesture.current.x + state.dx, y: gesture.current.y + state.dy })
    },
  }), [offset.x, offset.y, scale])

  const onLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout
    setViewport({ width, height })
  }

  const user = currentLocation?.floorId === floor.id ? projectCartesianToMap(currentLocation, dimensions) : null
  const selected = selectedPoi?.floorId === floor.id ? projectCartesianToMap(selectedPoi.location, dimensions) : null
  const bearing = currentLocation?.bearingDegrees == null ? null : currentLocation.bearingDegrees - building.rotation

  return (
    <View accessibilityLabel="Custom indoor map" onLayout={onLayout} style={styles.viewport} {...panResponder.panHandlers}>
      <View style={styles.backdropGrid} pointerEvents="none" />
      {frame.width > 0 && frame.height > 0 ? (
        <View
          style={[
            styles.mapSurface,
            { width: frame.width, height: frame.height, left: frame.left, top: frame.top, transform: [{ translateX: offset.x }, { translateY: offset.y }, { scale }] },
          ]}
        >
          {floor.mapUrl ? <Image accessibilityLabel={`Floor plan ${floor.name}`} source={{ uri: floor.mapUrl }} resizeMode="stretch" style={StyleSheet.absoluteFill} /> : <View style={styles.missingPlan}><Text style={styles.missingPlanText}>Floor plan unavailable</Text></View>}
          <Svg height="100%" pointerEvents="box-none" viewBox={`0 0 ${dimensions.width} ${dimensions.length}`} width="100%" style={StyleSheet.absoluteFill}>
            {routeSegments.map((segment, index) => (
              <Polyline
                key={`route-${index}`}
                fill="none"
                points={segment.map(point => {
                  const mapped = projectCartesianToMap(point, dimensions)
                  return `${mapped.x},${mapped.y}`
                }).join(' ')}
                stroke="#ffffff"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={strokeUnit * 4.4}
              />
            ))}
            {routeSegments.map((segment, index) => (
              <Polyline
                key={`route-core-${index}`}
                fill="none"
                points={segment.map(point => {
                  const mapped = projectCartesianToMap(point, dimensions)
                  return `${mapped.x},${mapped.y}`
                }).join(' ')}
                stroke="#246BFD"
                strokeDasharray={`${strokeUnit * 6} ${strokeUnit * 2}`}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={strokeUnit * 2.5}
              />
            ))}

            {floorPois.map(poi => {
              const point = projectCartesianToMap(poi.location, dimensions)
              const isSelected = selectedPoi?.id === poi.id
              return (
                <G key={poi.id} onPress={() => onPoiPress(poi)}>
                  <Circle cx={point.x} cy={point.y} fill={isSelected ? '#246BFD' : '#ffffff'} r={isSelected ? poiRadius * 1.7 : poiRadius} stroke={isSelected ? '#ffffff' : '#5B6B7C'} strokeWidth={strokeUnit * 0.55} />
                  {isSelected ? <Circle cx={point.x} cy={point.y} fill="#ffffff" r={poiRadius * 0.48} /> : null}
                </G>
              )
            })}

            {selected ? (
              <G>
                <Circle cx={selected.x} cy={selected.y} fill="#246BFD" opacity={0.18} r={poiRadius * 4.2} />
                <Circle cx={selected.x} cy={selected.y} fill="#246BFD" r={poiRadius * 1.9} stroke="#ffffff" strokeWidth={strokeUnit * 0.8} />
                <Circle cx={selected.x} cy={selected.y} fill="#ffffff" r={poiRadius * 0.55} />
                <SvgText fill="#10233F" fontSize={strokeUnit * 4.1} fontWeight="700" textAnchor="middle" x={selected.x} y={selected.y - poiRadius * 3.2}>{selectedPoi?.name.slice(0, 24)}</SvgText>
              </G>
            ) : null}

            {user ? (
              <G>
                {currentLocation?.accuracy && currentLocation.accuracy > 0 ? <Circle cx={user.x} cy={user.y} fill="#246BFD" opacity={0.11} r={currentLocation.accuracy} stroke="#246BFD" strokeOpacity={0.28} strokeWidth={strokeUnit * 0.4} /> : null}
                {bearing != null ? <Polygon fill="#246BFD" opacity={0.28} points={headingTriangle(user.x, user.y, userRadius * 2.7, bearing)} /> : null}
                <Circle cx={user.x} cy={user.y} fill="#ffffff" r={userRadius * 1.7} />
                <Circle cx={user.x} cy={user.y} fill="#246BFD" r={userRadius} />
                <Circle cx={user.x} cy={user.y} fill="#ffffff" r={userRadius * 0.3} />
              </G>
            ) : null}
          </Svg>
        </View>
      ) : null}
      <View pointerEvents="none" style={styles.brandlessBadge}><Text style={styles.brandlessBadgeText}>{floor.name}</Text></View>
    </View>
  )
}

const styles = StyleSheet.create({
  viewport: { backgroundColor: '#E8EDF1', flex: 1, overflow: 'hidden' },
  backdropGrid: { backgroundColor: '#E8EDF1', bottom: 0, left: 0, opacity: 0.9, position: 'absolute', right: 0, top: 0 },
  mapSurface: { backgroundColor: '#F8FAFC', elevation: 4, overflow: 'hidden', position: 'absolute', shadowColor: '#10233F', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.14, shadowRadius: 8 },
  missingPlan: { alignItems: 'center', backgroundColor: '#F8FAFC', bottom: 0, justifyContent: 'center', left: 0, position: 'absolute', right: 0, top: 0 },
  missingPlanText: { color: '#7B8794', fontSize: 12 },
  brandlessBadge: { backgroundColor: 'rgba(16,35,63,0.78)', borderRadius: 10, bottom: 12, paddingHorizontal: 10, paddingVertical: 6, position: 'absolute', right: 12 },
  brandlessBadgeText: { color: '#ffffff', fontSize: 10, fontWeight: '800' },
})
