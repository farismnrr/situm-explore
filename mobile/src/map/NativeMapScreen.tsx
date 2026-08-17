import SitumPlugin, { MapView, type MapViewRef } from '@situm/react-native'
import type { OnFloorChangedResult, OnPoiDeselectedResult, OnPoiSelectedResult, Location, LocationStatus, Error as SitumError, Route, NavigationProgress } from '@situm/react-native'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { ApiError } from '../api/errors'
import type { PositioningCredentialResponse } from '../api/types'
import type { WorkspaceContext } from '../workspaces/context'

type Building = { id: number, name: string }
type Floor = { id: number, buildingId: number, level: number, name: string }
type Poi = { id: number, buildingId: number, floorId: number, name: string, categoryName?: string | null }
type Cartography = { buildings: Building[], floors: Floor[], pois: Poi[] }
type PositionState = 'stopped' | 'starting' | 'fresh' | 'stale' | 'error'
type NavigationState = 'idle' | 'active' | 'outside-route' | 'arrived' | 'cancelled' | 'error'

export function NativeMapScreen({ workspaces, lifecycle }: { workspaces: WorkspaceContext, lifecycle: string }) {
  const [credential, setCredential] = useState<PositioningCredentialResponse | null>(null)
  const [cartography, setCartography] = useState<Cartography | null>(null)
  const [buildingId, setBuildingId] = useState<number | null>(null)
  const [selectedPoi, setSelectedPoi] = useState<Poi | null>(null)
  const [positionState, setPositionState] = useState<PositionState>('stopped')
  const [location, setLocation] = useState<Location | null>(null)
  const [locationMessage, setLocationMessage] = useState('Location is off until you choose Start positioning.')
  const [navigationState, setNavigationState] = useState<NavigationState>('idle')
  const [navigationMessage, setNavigationMessage] = useState('Choose a real place to see directions.')
  const [error, setError] = useState('')
  const mapRef = useRef<MapViewRef>(null)
  const workspaceId = workspaces.selectedWorkspaceId

  useEffect(() => {
    let cancelled = false
    setCredential(null); setCartography(null); setBuildingId(null); setSelectedPoi(null); setError('')
    if (!workspaceId) return
    Promise.all([
      workspaces.getPositioningCredential(),
      workspaces.auth.api.get<Cartography>(`/api/workspaces/${workspaceId}/situm/cartography`),
    ]).then(([nextCredential, nextCartography]) => {
      if (cancelled) return
      setCredential(nextCredential)
      setCartography(nextCartography)
    }).catch((cause: unknown) => {
      if (cancelled) return
      setError(cause instanceof ApiError ? cause.message : 'Map data is unavailable for this workspace.')
    })
    return () => { cancelled = true }
  }, [workspaceId, workspaces])

  useEffect(() => {
    if (!credential) return
    let active = true
    try {
      SitumPlugin.init()
      void SitumPlugin.setApiKey(credential.apiKey)
      void SitumPlugin.setUseRemoteConfig(true)
      void SitumPlugin.configureUserHelper({ enabled: true, colorScheme: undefined })
      SitumPlugin.onLocationUpdate((next: Location) => { if (active) { setLocation(next); setPositionState('fresh'); setLocationMessage('Live position received from Situm.') } })
      SitumPlugin.onLocationStatus((status: LocationStatus) => { if (active) { setPositionState(status.statusName === 'STOPPED' ? 'stopped' : 'starting'); setLocationMessage(status.statusName) } })
      SitumPlugin.onLocationError((cause: SitumError) => { if (active) { setPositionState('error'); setLocationMessage(cause.message || 'Situm could not determine a position.') } })
      SitumPlugin.onLocationStopped(() => { if (active) setPositionState('stopped') })
      SitumPlugin.onNavigationStart((_route: Route) => { if (active) { setNavigationState('active'); setNavigationMessage('Directions are active.') } })
      SitumPlugin.onNavigationProgress((progress: NavigationProgress) => { if (active) setNavigationMessage(`Directions in progress. ${Math.round(progress.distanceToGoal)} m remaining.`) })
      SitumPlugin.onNavigationDestinationReached((_route: Route) => { if (active) { setNavigationState('arrived'); setNavigationMessage('Destination reached.') } })
      SitumPlugin.onNavigationOutOfRoute(() => { if (active) { setNavigationState('outside-route'); setNavigationMessage('You are outside the route. Situm is recalculating.') } })
      SitumPlugin.onNavigationCancellation(() => { if (active) { setNavigationState('cancelled'); setNavigationMessage('Directions cancelled.') } })
      SitumPlugin.onNavigationError(() => { if (active) { setNavigationState('error'); setNavigationMessage('Directions could not be started.') } })
    } catch {
      setError('Situm positioning is unavailable on this build.')
    }
    return () => {
      active = false
      try { if (SitumPlugin.navigationIsRunning()) void SitumPlugin.removeNavigationUpdates() } catch { /* native cleanup is best effort */ }
      try { if (SitumPlugin.positioningIsRunning()) SitumPlugin.removeLocationUpdates() } catch { /* native cleanup is best effort */ }
      SitumPlugin.onLocationUpdate(() => undefined)
      SitumPlugin.onLocationStatus(() => undefined)
      SitumPlugin.onLocationError(() => undefined)
      SitumPlugin.onLocationStopped(() => undefined)
    }
  }, [credential])

  useEffect(() => {
    if (lifecycle !== 'active' && SitumPlugin.positioningIsRunning()) {
      try { SitumPlugin.removeLocationUpdates(); setPositionState('stopped'); setLocationMessage('Location paused while the app is in the background.') } catch { setPositionState('error') }
    }
  }, [lifecycle])

  const startPositioning = useCallback(() => {
    if (!buildingId) return
    setPositionState('starting'); setLocationMessage('Requesting the permissions needed for indoor positioning…')
    try { SitumPlugin.requestLocationUpdates({ buildingIdentifier: buildingId }) } catch { setPositionState('error'); setLocationMessage('Location permission or a device sensor is unavailable.') }
  }, [buildingId])
  const stopPositioning = useCallback(() => { try { SitumPlugin.removeLocationUpdates(); setPositionState('stopped'); setLocationMessage('Location is stopped.') } catch { setPositionState('error') } }, [])
  const selectBuilding = useCallback((id: number) => { if (SitumPlugin.positioningIsRunning()) stopPositioning(); setBuildingId(id); setSelectedPoi(null); setNavigationState('idle') }, [stopPositioning])
  const buildingPois = useMemo(() => cartography?.pois.filter(poi => poi.buildingId === buildingId).slice(0, 20) ?? [], [cartography, buildingId])

  if (!workspaceId) return <StateCard title="Select a workspace" body="Map loads only after an owned workspace is selected." />
  if (error) return <StateCard title="Map unavailable" body={error} action={() => setError('')} />
  if (!credential || !cartography) return <View style={styles.loading}><ActivityIndicator color="#111827" /><Text style={styles.muted}>Loading workspace cartography…</Text></View>
  if (!cartography.buildings.length) return <StateCard title="No buildings available" body="This workspace has no building available for native exploration." />
  return <View style={styles.screen}>
    <View style={styles.header}><Text style={styles.eyebrow}>EXPLORE</Text><Text style={styles.title}>Where do you want to go?</Text><Text style={styles.muted}>Real workspace cartography and Situm positioning.</Text></View>
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.choices}>{cartography.buildings.map(building => <TouchableOpacity key={building.id} onPress={() => selectBuilding(building.id)} style={[styles.choice, building.id === buildingId && styles.choiceActive]}><Text style={[styles.choiceText, building.id === buildingId && styles.choiceTextActive]}>{building.name}</Text></TouchableOpacity>)}</ScrollView>
    {!buildingId ? <StateCard title="Choose a building" body="Select a real building from this workspace to load its native map." /> : <>
      <View style={styles.mapFrame}><MapView key={`${workspaceId}:${buildingId}`} ref={mapRef} style={styles.map} configuration={{ buildingIdentifier: String(buildingId), situmApiKey: credential.apiKey, profile: process.env.EXPO_PUBLIC_SITUM_PROFILE || undefined, language: 'en' }} onLoad={() => setLocationMessage('Map ready. Start positioning when you need your location.')} onLoadError={() => setError('The selected building map could not be loaded.')} onPoiSelected={onPoiSelected(setSelectedPoi, buildingId)} onPoiDeselected={onPoiDeselected(setSelectedPoi)} onFloorChanged={(floor: OnFloorChangedResult) => setLocationMessage(`Map level: ${floor.toFloorName}`)} /></View>
      <View style={styles.controls}><View style={styles.row}><Text style={styles.statusTitle}>Position</Text><Text style={styles.status}>{positionState === 'fresh' ? 'Fresh' : positionState}</Text><TouchableOpacity style={styles.smallButton} onPress={positionState === 'fresh' || positionState === 'starting' ? stopPositioning : startPositioning}><Text style={styles.smallButtonText}>{positionState === 'fresh' || positionState === 'starting' ? 'Stop' : 'Start positioning'}</Text></TouchableOpacity></View><Text style={styles.muted}>{locationMessage}{location?.position?.floorIdentifier ? ` · Floor ${location.position.floorIdentifier}` : ''}</Text></View>
      <Text style={styles.sectionLabel}>LEVELS</Text><ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.choices}>{cartography.floors.filter(floor => floor.buildingId === buildingId).map(floor => <TouchableOpacity key={floor.id} style={styles.poiChoice} onPress={() => mapRef.current?.selectFloor(floor.id)}><Text style={styles.choiceText}>{floor.name || `Level ${floor.level}`}</Text></TouchableOpacity>)}</ScrollView>
      {selectedPoi ? <View style={styles.poiCard}><Text style={styles.statusTitle}>{selectedPoi.name}</Text><Text style={styles.muted}>{selectedPoi.categoryName || 'Place'} · real Situm POI</Text><View style={styles.row}><TouchableOpacity disabled={!location} style={[styles.smallButton, !location && styles.disabled]} onPress={() => { if (SitumPlugin.navigationIsRunning()) void SitumPlugin.removeNavigationUpdates(); mapRef.current?.navigateToPoi({ identifier: selectedPoi.id }); setNavigationState('active'); setNavigationMessage('Starting directions…') }}><Text style={styles.smallButtonText}>Directions</Text></TouchableOpacity><TouchableOpacity style={styles.textButton} onPress={() => { mapRef.current?.deselectPoi(); setSelectedPoi(null) }}><Text style={styles.textButtonText}>Clear</Text></TouchableOpacity></View><Text style={styles.muted}>{location ? navigationMessage : 'Start positioning to get directions from your current location.'}</Text></View> : null}
      <Text style={styles.sectionLabel}>PLACES</Text><ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.choices}>{buildingPois.map(poi => <TouchableOpacity key={poi.id} style={styles.poiChoice} onPress={() => { mapRef.current?.selectPoi(poi.id); setSelectedPoi(poi) }}><Text style={styles.choiceText}>{poi.name}</Text></TouchableOpacity>)}</ScrollView>
    </>}
  </View>
}

function onPoiSelected(setSelectedPoi: (poi: Poi | null) => void, buildingId: number) { return (event: OnPoiSelectedResult) => { if (Number(event.buildingIdentifier) === buildingId) setSelectedPoi({ id: Number(event.identifier), buildingId, floorId: 0, name: `Place ${event.identifier}` }) } }
function onPoiDeselected(setSelectedPoi: (poi: Poi | null) => void) { return (_event: OnPoiDeselectedResult) => setSelectedPoi(null) }
function StateCard({ title, body, action }: { title: string, body: string, action?: () => void }) { return <View style={styles.card}><Text style={styles.cardTitle}>{title}</Text><Text style={styles.muted}>{body}</Text>{action ? <TouchableOpacity style={styles.smallButton} onPress={action}><Text style={styles.smallButtonText}>Try again</Text></TouchableOpacity> : null}</View> }

const styles = StyleSheet.create({ screen: { flex: 1 }, loading: { alignItems: 'center', flex: 1, gap: 12, justifyContent: 'center' }, header: { marginBottom: 12 }, eyebrow: { color: '#8b939e', fontSize: 11, fontWeight: '800', letterSpacing: 1.2 }, title: { color: '#111827', fontSize: 25, fontWeight: '800', marginTop: 4 }, muted: { color: '#6a7380', fontSize: 13, lineHeight: 20, marginTop: 5 }, choices: { gap: 8, paddingBottom: 12 }, choice: { borderColor: '#d6dbe0', borderRadius: 9, borderWidth: 1, paddingHorizontal: 11, paddingVertical: 9 }, choiceActive: { backgroundColor: '#111827', borderColor: '#111827' }, choiceText: { color: '#555d67', fontSize: 12 }, choiceTextActive: { color: '#fff', fontWeight: '700' }, mapFrame: { backgroundColor: '#e9edf0', borderColor: '#d6dbe0', borderRadius: 14, borderWidth: 1, height: 360, overflow: 'hidden' }, map: { flex: 1 }, controls: { backgroundColor: '#fff', borderColor: '#e2e5e9', borderRadius: 12, borderWidth: 1, marginTop: 10, padding: 12 }, row: { alignItems: 'center', flexDirection: 'row', gap: 10 }, statusTitle: { color: '#111827', flex: 1, fontSize: 14, fontWeight: '800' }, status: { color: '#126d45', fontSize: 12, fontWeight: '700' }, smallButton: { alignItems: 'center', backgroundColor: '#111827', borderRadius: 8, justifyContent: 'center', minHeight: 38, paddingHorizontal: 12 }, disabled: { opacity: 0.55 }, smallButtonText: { color: '#fff', fontSize: 12, fontWeight: '700' }, textButton: { padding: 10 }, textButtonText: { color: '#555d67', fontSize: 12, fontWeight: '700' }, poiCard: { backgroundColor: '#fff', borderColor: '#d6dbe0', borderRadius: 12, borderWidth: 1, marginTop: 10, padding: 12 }, sectionLabel: { color: '#8b939e', fontSize: 11, fontWeight: '800', letterSpacing: 1.1, marginTop: 16 }, poiChoice: { backgroundColor: '#fff', borderColor: '#d6dbe0', borderRadius: 9, borderWidth: 1, paddingHorizontal: 11, paddingVertical: 9 }, card: { backgroundColor: '#fff', borderColor: '#e2e5e9', borderRadius: 14, borderWidth: 1, marginTop: 14, padding: 16 }, cardTitle: { color: '#111827', fontSize: 18, fontWeight: '800', marginTop: 5 } })
