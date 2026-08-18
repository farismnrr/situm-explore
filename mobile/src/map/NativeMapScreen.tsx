import SitumPlugin, { MapView, SitumProvider, type MapViewRef } from '@situm/react-native'
import type { OnFloorChangedResult, OnPoiDeselectedResult, OnPoiSelectedResult, Location, LocationStatus, Error as SitumError, Route, NavigationProgress } from '@situm/react-native'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ActivityIndicator, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, useWindowDimensions, View } from 'react-native'
import { ApiError } from '../api/errors'
import type { PositioningCredentialResponse } from '../api/types'
import type { WorkspaceContext } from '../workspaces/context'
import { canStopGuidance, filterPois, isCurrentLocationUsable, locationFreshnessWindowMs, navigationIsOwned, positionStateForLocationStatus, resolveFloorDisplay, resolvePoi, type LocationSnapshot, type NavigationOwnershipState, type PositionState } from './state'
import { colors, radii } from '../ui/theme'
import { layoutForWidth, type LayoutMode } from '../ui/layout'

type Building = { id: number, name: string }
type Floor = { id: number, buildingId: number, level: number, name: string }
type Poi = { id: number, buildingId: number, floorId: number, name: string, categoryName?: string | null }
type Cartography = { buildings: Building[], floors: Floor[], pois: Poi[] }
type NavigationState = NavigationOwnershipState

export function NativeMapScreen({ workspaces, lifecycle, layout }: { workspaces: WorkspaceContext, lifecycle: string, layout?: LayoutMode }) {
  const [credential, setCredential] = useState<PositioningCredentialResponse | null>(null)
  const [cartography, setCartography] = useState<Cartography | null>(null)
  const [error, setError] = useState('')
  const [retryNonce, setRetryNonce] = useState(0)
  const workspaceId = workspaces.selectedWorkspaceId
  const pendingMapRequest = workspaces.mapRequest
  const [activeMapRequestId, setActiveMapRequestId] = useState<number | null>(() => pendingMapRequest?.requestId ?? null)
  const [initialBuildingId, setInitialBuildingId] = useState<number | null>(() => pendingMapRequest?.buildingId ?? null)
  const handledMapRequestId = useRef<number | null>(null)
  useEffect(() => {
    let cancelled = false
    setCredential(null); setCartography(null); setError('')
    if (!workspaceId) return
    Promise.all([workspaces.getPositioningCredential(), workspaces.auth.api.get<Cartography>(`/api/workspaces/${workspaceId}/situm/cartography`)]).then(([nextCredential, nextCartography]) => {
      if (!cancelled) { setCredential(nextCredential); setCartography(nextCartography) }
    }).catch((cause: unknown) => { if (!cancelled) setError(cause instanceof ApiError ? cause.message : 'Map data is unavailable for this workspace.') })
    return () => { cancelled = true }
  }, [workspaceId, workspaces, retryNonce])
  useEffect(() => {
    if (!pendingMapRequest || handledMapRequestId.current === pendingMapRequest.requestId) return
    handledMapRequestId.current = pendingMapRequest.requestId
    setActiveMapRequestId(pendingMapRequest.requestId)
    setInitialBuildingId(pendingMapRequest.buildingId)
    workspaces.consumeMapRequest(pendingMapRequest.requestId)
  }, [pendingMapRequest, workspaces])
  if (!workspaceId) return <StateCard title="Select a workspace" body="Map loads only after an owned workspace is selected." />
  if (error) return <StateCard title="Map unavailable" body={error} action={() => setRetryNonce(value => value + 1)} />
  if (!credential || !cartography) return <View style={styles.loading}><ActivityIndicator color="#111827" /><Text style={styles.muted}>Loading workspace cartography…</Text></View>
  if (!cartography.buildings.length) return <StateCard title="No buildings available" body="This workspace has no building available for native exploration." />
  return <SitumProvider apiKey={credential.apiKey}><NativeMapRuntime key={`${workspaceId}:${activeMapRequestId ?? 'default'}`} workspaceId={workspaceId} cartography={cartography} lifecycle={lifecycle} initialBuildingId={initialBuildingId} layout={layout} /></SitumProvider>
}

function NativeMapRuntime({ workspaceId, cartography, lifecycle, initialBuildingId, layout: suppliedLayout }: { workspaceId: string, cartography: Cartography, lifecycle: string, initialBuildingId: number | null, layout?: LayoutMode }) {
  const { width } = useWindowDimensions(); const layout = suppliedLayout || layoutForWidth(width).mode
  const [buildingId, setBuildingId] = useState<number | null>(() => cartography.buildings.some(building => building.id === initialBuildingId) ? initialBuildingId : null)
  const [selectedPoi, setSelectedPoi] = useState<Poi | null>(null)
  const [poiUnavailable, setPoiUnavailable] = useState(false)
  const [positionSnapshot, setPositionSnapshot] = useState<LocationSnapshot<Location> | null>(null)
  const [positionState, setPositionState] = useState<PositionState>('stopped')
  const [locationMessage, setLocationMessage] = useState('Your location is off. Find your location when you want directions.')
  const [navigationState, setNavigationState] = useState<NavigationState>('idle')
  const [navigationMessage, setNavigationMessage] = useState('Choose a real place to see directions.')
  const [search, setSearch] = useState(''); const [activeFloorName, setActiveFloorName] = useState('')
  const navigationStateRef = useRef<NavigationState>('idle')
  const [error, setError] = useState('')
  const mapRef = useRef<MapViewRef>(null)
  const location = positionSnapshot?.location ?? null
  const canNavigate = isCurrentLocationUsable(positionSnapshot, workspaceId, buildingId ?? -1)
  const invalidatePosition = useCallback((nextState: PositionState, message: string) => { setPositionSnapshot(null); setPositionState(nextState); setLocationMessage(message) }, [])
  const cancelNavigation = useCallback(() => {
    let nativeNavigationRunning = false
    try { nativeNavigationRunning = SitumPlugin.navigationIsRunning() } catch { /* native cleanup is best effort */ }
    if (!navigationIsOwned(navigationStateRef.current, nativeNavigationRunning)) return
    try { mapRef.current?.cancelNavigation() } catch { /* native cleanup is best effort */ }
    if (nativeNavigationRunning) {
      try { void SitumPlugin.removeNavigationUpdates() } catch { /* native cleanup is best effort */ }
    }
    navigationStateRef.current = 'cancelled'; setNavigationState('cancelled'); setNavigationMessage('Directions cancelled.')
  }, [])
  navigationStateRef.current = navigationState

  useEffect(() => {
    if (buildingId === null && cartography.buildings[0]) setBuildingId(cartography.buildings[0].id)
  }, [buildingId, cartography.buildings])
  useEffect(() => {
    let active = true
    try {
      void SitumPlugin.setUseRemoteConfig(true)
      void SitumPlugin.configureUserHelper({ enabled: true, colorScheme: undefined })
      SitumPlugin.onLocationUpdate((next: Location) => {
        if (!active || buildingId === null || Number(next.position?.buildingIdentifier) !== buildingId) return
        const receivedAt = Date.now(); setPositionSnapshot({ state: 'fresh', location: next, receivedAt, workspaceId, buildingId }); setPositionState('fresh'); setLocationMessage('Live position received from Situm.')
      })
      SitumPlugin.onLocationStatus((status: LocationStatus) => {
        if (!active) return
        const nextState = positionStateForLocationStatus(status.statusName)
        if (nextState === 'stopped') { cancelNavigation(); invalidatePosition('stopped', 'Location is stopped.') }
        else if (nextState === 'error') { cancelNavigation(); invalidatePosition('error', 'Situm could not determine a position in the selected building.') }
        else { setPositionState(nextState); setLocationMessage('Situm is determining your indoor position…') }
      })
      SitumPlugin.onLocationError((_cause: SitumError) => { if (active) { cancelNavigation(); invalidatePosition('error', 'Situm could not determine a position.') } })
      SitumPlugin.onLocationStopped(() => { if (active) { cancelNavigation(); invalidatePosition('stopped', 'Location is stopped.') } })
      SitumPlugin.onNavigationStart((_route: Route) => { if (active) { setNavigationState('active'); setNavigationMessage('Directions are active.') } })
      SitumPlugin.onNavigationProgress((progress: NavigationProgress) => { if (active) setNavigationMessage(`Directions in progress. ${Math.round(progress.distanceToGoal)} m remaining.`) })
      SitumPlugin.onNavigationDestinationReached((_route: Route) => { if (active) { setNavigationState('arrived'); setNavigationMessage('Destination reached.') } })
      SitumPlugin.onNavigationOutOfRoute(() => { if (active) { navigationStateRef.current = 'outside-route'; setNavigationState('outside-route'); setNavigationMessage('You are outside the current route.') } })
      SitumPlugin.onNavigationCancellation(() => { if (active && navigationIsOwned(navigationStateRef.current, false)) { navigationStateRef.current = 'cancelled'; setNavigationState('cancelled'); setNavigationMessage('Directions cancelled.') } })
      SitumPlugin.onNavigationError(() => { if (active) { setNavigationState('error'); setNavigationMessage('Directions could not be started.') } })
    } catch { setError('Situm positioning is unavailable on this build.') }
    return () => { active = false; cancelNavigation(); try { if (SitumPlugin.positioningIsRunning()) SitumPlugin.removeLocationUpdates() } catch { /* native cleanup is best effort */ }; SitumPlugin.onLocationUpdate(() => undefined); SitumPlugin.onLocationStatus(() => undefined); SitumPlugin.onLocationError(() => undefined); SitumPlugin.onLocationStopped(() => undefined) }
  }, [buildingId, cancelNavigation, invalidatePosition, workspaceId])
  useEffect(() => {
    if (!positionSnapshot || positionSnapshot.state !== 'fresh') return
    const remaining = Math.max(0, locationFreshnessWindowMs - (Date.now() - positionSnapshot.receivedAt))
    const timer = setTimeout(() => { setPositionSnapshot(snapshot => snapshot ? { ...snapshot, state: 'stale' } : null); setPositionState('stale'); setLocationMessage('Your last location is no longer current. Find your location again before getting directions.') }, remaining)
    return () => clearTimeout(timer)
  }, [positionSnapshot])
  useEffect(() => {
    if (lifecycle === 'active') return
    cancelNavigation(); try { if (SitumPlugin.positioningIsRunning()) SitumPlugin.removeLocationUpdates() } catch { /* native cleanup is best effort */ }; invalidatePosition('stopped', 'Location paused while the app is in the background.')
  }, [cancelNavigation, invalidatePosition, lifecycle])
  const startPositioning = useCallback(() => { if (buildingId === null) return; invalidatePosition('starting', 'Requesting the permissions needed for indoor positioning…'); try { SitumPlugin.requestLocationUpdates({ buildingIdentifier: buildingId }) } catch { invalidatePosition('error', 'Location permission or a device sensor is unavailable.') } }, [buildingId, invalidatePosition])
  const stopPositioning = useCallback(() => { cancelNavigation(); try { SitumPlugin.removeLocationUpdates(); invalidatePosition('stopped', 'Location is stopped.') } catch { invalidatePosition('error', 'Location could not be stopped safely.') } }, [cancelNavigation, invalidatePosition])
  const selectBuilding = useCallback((id: number) => { cancelNavigation(); try { if (SitumPlugin.positioningIsRunning()) SitumPlugin.removeLocationUpdates() } catch { /* native cleanup is best effort */ }; invalidatePosition('stopped', 'Find your location when you want directions in this building.'); setBuildingId(id); setSelectedPoi(null); setPoiUnavailable(false); setNavigationState('idle'); setNavigationMessage('Choose a real place to see directions.') }, [cancelNavigation, invalidatePosition])
  const onPoiSelected = useCallback((event: OnPoiSelectedResult) => { if (buildingId === null || Number(event.buildingIdentifier) !== buildingId) return; const poi = resolvePoi(cartography.pois, Number(event.identifier), buildingId); setSelectedPoi(poi); setPoiUnavailable(!poi) }, [buildingId, cartography.pois])
  const buildingPois = useMemo(() => cartography.pois.filter(poi => poi.buildingId === buildingId), [cartography.pois, buildingId])
  const filteredPois = useMemo(() => filterPois(cartography.pois, buildingId, search), [cartography.pois, buildingId, search])
  if (error) return <StateCard title="Map unavailable" body={error} />
  return <ScrollView style={styles.screen} contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
    <View style={styles.welcome}><Text style={styles.eyebrow}>{cartography.buildings.find(building => building.id === buildingId)?.name || 'EXPLORE'}</Text><Text style={styles.title}>Where do you want to go?</Text><Text style={styles.muted}>Find a place, see where you are, or get indoor directions.</Text><View style={styles.searchBox}><TextInput accessibilityLabel="Search places" placeholder="Search rooms, places, or facilities" placeholderTextColor={colors.muted} value={search} onChangeText={setSearch} style={styles.searchInput} /></View><ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.choices}>{buildingPois.slice(0, 6).map(poi => <TouchableOpacity accessibilityRole="button" accessibilityState={{ selected: selectedPoi?.id === poi.id }} key={poi.id} style={[styles.choice, selectedPoi?.id === poi.id && styles.choiceActive]} onPress={() => { mapRef.current?.selectPoi(poi.id); setSelectedPoi(poi); setPoiUnavailable(false) }}><Text style={[styles.choiceText, selectedPoi?.id === poi.id && styles.choiceTextActive]}>{poi.name}</Text></TouchableOpacity>)}</ScrollView></View>
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.choices}>{cartography.buildings.map(building => <TouchableOpacity accessibilityRole="button" accessibilityState={{ selected: building.id === buildingId }} key={building.id} onPress={() => selectBuilding(building.id)} style={[styles.choice, building.id === buildingId && styles.choiceActive]}><Text style={[styles.choiceText, building.id === buildingId && styles.choiceTextActive]}>{building.name}</Text></TouchableOpacity>)}</ScrollView>
    {!buildingId ? <StateCard title="Choose a building" body="Select a real building from this workspace to load its native map." /> : <>
      <View style={[styles.mapLayout, (layout === 'tablet' || layout === 'wide' || layout === 'veryWide') && styles.mapLayoutWide]}><View style={styles.mapColumn}><View style={[styles.mapFrame, (layout === 'tablet' || layout === 'wide' || layout === 'veryWide') && styles.mapFrameWide]}><MapView key={`${workspaceId}:${buildingId}`} ref={mapRef} style={styles.map} configuration={{ buildingIdentifier: String(buildingId), profile: process.env.EXPO_PUBLIC_SITUM_PROFILE || undefined, language: 'en' }} onLoad={() => setLocationMessage('Map ready. Find my location when you want to see where you are.')} onLoadError={() => setError('The selected building map could not be loaded.')} onPoiSelected={onPoiSelected} onPoiDeselected={(_event: OnPoiDeselectedResult) => { setSelectedPoi(null); setPoiUnavailable(false) }} onFloorChanged={(floor: OnFloorChangedResult) => { setActiveFloorName(floor.toFloorName); setLocationMessage(`Map level: ${floor.toFloorName}`) }} /></View><View style={styles.controls}><View style={styles.row}><Text style={styles.statusTitle}>{positionState === 'fresh' ? 'Your location is on' : 'Your location is off'}</Text><TouchableOpacity accessibilityRole="button" accessibilityLabel={positionState === 'fresh' || positionState === 'starting' ? 'Turn off location' : 'Find my location'} accessibilityState={{ disabled: false }} style={styles.smallButton} onPress={positionState === 'fresh' || positionState === 'starting' ? stopPositioning : startPositioning}><Text style={styles.smallButtonText}>{positionState === 'fresh' || positionState === 'starting' ? 'Stop' : 'Find my location'}</Text></TouchableOpacity></View><Text style={styles.muted}>{positionState === 'stopped' ? 'You can still browse places and plan a route. Turn on location only when you want to see where you are.' : locationMessage}{location?.position?.floorIdentifier ? ` · Floor ${location.position.floorIdentifier}` : ''}</Text></View><Text style={styles.sectionLabel}>LEVELS</Text><ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.choices}>{cartography.floors.filter(floor => floor.buildingId === buildingId).map(floor => { const display = floor.name || `Level ${floor.level}`; return <TouchableOpacity accessibilityRole="button" accessibilityState={{ selected: display === activeFloorName }} key={floor.id} style={[styles.poiChoice, display === activeFloorName && styles.choiceActive]} onPress={() => mapRef.current?.selectFloor(floor.id)}><Text style={[styles.choiceText, display === activeFloorName && styles.choiceTextActive]}>{display}</Text></TouchableOpacity> })}</ScrollView></View><View style={styles.detailColumn}>{poiUnavailable ? <View style={styles.poiCard}><Text style={styles.statusTitle}>Place unavailable</Text><Text style={styles.muted}>The selected map place is not present in this workspace building's cartography.</Text></View> : null}{selectedPoi ? <View style={styles.poiCard}><Text style={styles.eyebrow}>PLACE</Text><Text style={styles.statusTitle}>{selectedPoi.name}</Text><Text style={styles.muted}>{selectedPoi.categoryName || 'Place'} · {cartography.buildings.find(building => building.id === buildingId)?.name}{resolveFloorDisplay(cartography.floors, selectedPoi.floorId, buildingId) ? ` · ${resolveFloorDisplay(cartography.floors, selectedPoi.floorId, buildingId)}` : ''}</Text><View style={styles.row}>{canStopGuidance(navigationState) ? <TouchableOpacity accessibilityRole="button" accessibilityLabel="Stop guidance" style={styles.secondarySmallButton} onPress={cancelNavigation}><Text style={styles.secondarySmallButtonText}>Stop guidance</Text></TouchableOpacity> : <TouchableOpacity accessibilityRole="button" accessibilityLabel="Directions" accessibilityState={{ disabled: !canNavigate }} disabled={!canNavigate} style={[styles.smallButton, !canNavigate && styles.disabled]} onPress={() => { cancelNavigation(); mapRef.current?.navigateToPoi({ identifier: selectedPoi.id }); setNavigationState('active'); setNavigationMessage('Starting directions…') }}><Text style={styles.smallButtonText}>Directions</Text></TouchableOpacity>}<TouchableOpacity accessibilityRole="button" style={styles.textButton} onPress={() => { mapRef.current?.deselectPoi(); setSelectedPoi(null) }}><Text style={styles.textButtonText}>Clear</Text></TouchableOpacity></View><Text style={styles.muted}>{canNavigate ? navigationMessage : 'Find your location and wait for a current fix in this building to get directions.'}</Text></View> : <View style={styles.poiCard}><Text style={styles.statusTitle}>Select a place</Text><Text style={styles.muted}>{search && !filteredPois.length ? 'No places match your search.' : 'Choose a real place on the map or from the list below.'}</Text></View>}<Text style={styles.sectionLabel}>PLACES</Text><ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.choices}>{filteredPois.slice(0, 30).map(poi => <TouchableOpacity accessibilityRole="button" accessibilityState={{ selected: selectedPoi?.id === poi.id }} key={poi.id} style={[styles.poiChoice, selectedPoi?.id === poi.id && styles.choiceActive]} onPress={() => { mapRef.current?.selectPoi(poi.id); setSelectedPoi(poi); setPoiUnavailable(false) }}><Text style={[styles.choiceText, selectedPoi?.id === poi.id && styles.choiceTextActive]}>{poi.name}</Text></TouchableOpacity>)}</ScrollView></View></View>
    </>}
  </ScrollView>
}

function StateCard({ title, body, action }: { title: string, body: string, action?: () => void }) { return <View style={styles.card}><Text style={styles.cardTitle}>{title}</Text><Text style={styles.muted}>{body}</Text>{action ? <TouchableOpacity style={styles.smallButton} onPress={action}><Text style={styles.smallButtonText}>Try again</Text></TouchableOpacity> : null}</View> }
const styles = StyleSheet.create({ screen: { flex: 1 }, scrollContent: { paddingBottom: 20 }, loading: { alignItems: 'center', flex: 1, gap: 12, justifyContent: 'center' }, header: { marginBottom: 12 }, welcome: { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radii.panel, borderWidth: 1, marginBottom: 12, padding: 18 }, eyebrow: { color: colors.muted, fontSize: 11, fontWeight: '800', letterSpacing: 1.2 }, title: { color: colors.ink, fontSize: 25, fontWeight: '800', letterSpacing: -0.5, marginTop: 4 }, muted: { color: colors.tertiary, fontSize: 13, lineHeight: 20, marginTop: 5 }, searchBox: { backgroundColor: colors.soft, borderColor: colors.strongBorder, borderRadius: radii.control, borderWidth: 1, marginTop: 16 }, searchInput: { color: colors.ink, fontSize: 13, minHeight: 46, paddingHorizontal: 13 }, choices: { gap: 8, paddingBottom: 12, paddingTop: 10 }, choice: { borderColor: colors.strongBorder, borderRadius: radii.control, borderWidth: 1, paddingHorizontal: 11, paddingVertical: 9 }, choiceActive: { backgroundColor: colors.action, borderColor: colors.action }, choiceText: { color: colors.secondary, fontSize: 12 }, choiceTextActive: { color: '#fff', fontWeight: '700' }, mapLayout: { flexDirection: 'column' }, mapLayoutWide: { flexDirection: 'row', gap: 12 }, mapColumn: { flex: 1, minWidth: 0 }, detailColumn: { flex: 0.72, minWidth: 260 }, mapFrame: { backgroundColor: '#e9edf0', borderColor: colors.strongBorder, borderRadius: radii.panel, borderWidth: 1, height: 555, overflow: 'hidden' }, mapFrameWide: { height: 650 }, map: { flex: 1 }, controls: { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radii.card, borderWidth: 1, marginTop: 10, padding: 12 }, row: { alignItems: 'center', flexDirection: 'row', gap: 10 }, statusTitle: { color: colors.ink, flex: 1, fontSize: 14, fontWeight: '800' }, smallButton: { alignItems: 'center', backgroundColor: colors.action, borderRadius: radii.control, justifyContent: 'center', minHeight: 40, paddingHorizontal: 12 }, secondarySmallButton: { alignItems: 'center', backgroundColor: colors.surface, borderColor: colors.strongBorder, borderRadius: radii.control, borderWidth: 1, justifyContent: 'center', minHeight: 40, paddingHorizontal: 12 }, secondarySmallButtonText: { color: colors.ink, fontSize: 12, fontWeight: '700' }, disabled: { opacity: 0.55 }, smallButtonText: { color: '#fff', fontSize: 12, fontWeight: '700' }, textButton: { padding: 10 }, textButtonText: { color: colors.secondary, fontSize: 12, fontWeight: '700' }, poiCard: { backgroundColor: colors.surface, borderColor: colors.strongBorder, borderRadius: radii.card, borderWidth: 1, marginTop: 10, padding: 14 }, sectionLabel: { color: colors.muted, fontSize: 11, fontWeight: '800', letterSpacing: 1.1, marginTop: 16 }, poiChoice: { backgroundColor: colors.surface, borderColor: colors.strongBorder, borderRadius: radii.control, borderWidth: 1, paddingHorizontal: 11, paddingVertical: 9 }, card: { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radii.panel, borderWidth: 1, marginTop: 14, padding: 16 }, cardTitle: { color: colors.ink, fontSize: 18, fontWeight: '800', marginTop: 5 } })
