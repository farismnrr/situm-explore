import SitumPlugin, { MapView, SitumProvider, type MapViewRef } from '@situm/react-native'
import type { OnFloorChangedResult, OnPoiDeselectedResult, OnPoiSelectedResult, Location, Route, NavigationProgress } from '@situm/react-native'
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react'
import { ActivityIndicator, BackHandler, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native'
import { ApiError } from '../api/errors'
import type { PositioningCredentialResponse } from '../api/types'
import type { WorkspaceContext } from '../workspaces/context'
import { canStopGuidance, guidanceStateForNavigation, isCurrentLocationUsable, locationFreshnessWindowMs, navigationIsOwned, resolveFloorDisplay, resolvePoi, type GuidanceState, type LocationSnapshot, type NavigationOwnershipState } from './state'
import { colors, radii } from '../ui/theme'
import { layoutForWidth, type LayoutMode } from '../ui/layout'
import type { ForegroundPositioningSession } from '../positioning/session'

type Building = { id: number, name: string }
type Floor = { id: number, buildingId: number, level: number, name: string }
type Poi = { id: number, buildingId: number, floorId: number, name: string, categoryName?: string | null }
type Cartography = { buildings: Building[], floors: Floor[], pois: Poi[] }
type NavigationState = NavigationOwnershipState

export function NativeMapScreen({ workspaces, lifecycle, positioning, layout, fullscreen = false, onFullscreenChange }: { workspaces: WorkspaceContext, lifecycle: string, positioning: ForegroundPositioningSession, layout?: LayoutMode, fullscreen?: boolean, onFullscreenChange?: (fullscreen: boolean) => void }) {
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
    setActiveMapRequestId(pendingMapRequest.requestId); setInitialBuildingId(pendingMapRequest.buildingId)
    workspaces.consumeMapRequest(pendingMapRequest.requestId)
  }, [pendingMapRequest, workspaces])

  if (!workspaceId) return <StateCard title="Select a workspace" body="Map loads only after an owned workspace is selected." />
  if (error) return <StateCard title="Map unavailable" body={error} action={() => setRetryNonce(value => value + 1)} />
  if (!credential || !cartography) return <View style={styles.loading}><ActivityIndicator color={colors.action} /><Text style={styles.muted}>Loading workspace cartography…</Text></View>
  if (!cartography.buildings.length) return <StateCard title="No buildings available" body="This workspace has no building available for native exploration." />
  return <SitumProvider apiKey={credential.apiKey}><NativeMapRuntime key={`${workspaceId}:${activeMapRequestId ?? 'default'}`} workspaceId={workspaceId} cartography={cartography} lifecycle={lifecycle} workspaces={workspaces} positioning={positioning} initialBuildingId={initialBuildingId} layout={layout} fullscreen={fullscreen} onFullscreenChange={onFullscreenChange} /></SitumProvider>
}

function NativeMapRuntime({ workspaceId, cartography, lifecycle: _lifecycle, workspaces, positioning, initialBuildingId, layout: suppliedLayout, fullscreen, onFullscreenChange }: { workspaceId: string, cartography: Cartography, lifecycle: string, workspaces: WorkspaceContext, positioning: ForegroundPositioningSession, initialBuildingId: number | null, layout?: LayoutMode, fullscreen: boolean, onFullscreenChange?: (fullscreen: boolean) => void }) {
  const { width } = useWindowDimensions()
  const layout = suppliedLayout || layoutForWidth(width).mode
  const [buildingId, setBuildingId] = useState<number | null>(() => cartography.buildings.some(building => building.id === initialBuildingId) ? initialBuildingId : null)
  const [selectedPoi, setSelectedPoi] = useState<Poi | null>(null)
  const positioningSnapshot = useSyncExternalStore(positioning.subscribe, positioning.getSnapshot, positioning.getSnapshot)
  const positionSnapshot = positioningSnapshot.location ? { state: positioningSnapshot.state === 'active' ? 'fresh' : positioningSnapshot.state, location: positioningSnapshot.location, receivedAt: positioningSnapshot.receivedAt || 0, workspaceId: positioningSnapshot.workspaceId || workspaceId, buildingId: positioningSnapshot.buildingId || buildingId || -1 } as LocationSnapshot<Location> : null
  const [positionStale, setPositionStale] = useState(false)
  const positionState = positioningSnapshot.state === 'active' ? (positionStale ? 'stale' : 'fresh') : positioningSnapshot.state
  const locationMessage = positioningSnapshot.message
  const [navigationState, setNavigationState] = useState<NavigationState>('idle')
  const [guidanceState, setGuidanceState] = useState<GuidanceState>('browse')
  const [navigationMessage, setNavigationMessage] = useState('Choose a real place to see directions.')
  const [remainingDistance, setRemainingDistance] = useState<number | null>(null)
  const [activeFloorName, setActiveFloorName] = useState('')
  const navigationStateRef = useRef<NavigationState>('idle')
  const guidanceStateRef = useRef<GuidanceState>('browse')
  const [error, setError] = useState('')
  const mapRef = useRef<MapViewRef>(null)
  const canNavigate = isCurrentLocationUsable(positionSnapshot, workspaceId, buildingId ?? -1)
  const poi = selectedPoi ?? { id: -1 }
  const isGuidance = guidanceState !== 'browse' && guidanceState !== 'positioning-starting' && guidanceState !== 'positioning-active'
  const showStop = canStopGuidance(navigationState)

  const cancelNavigation = useCallback(() => {
    let nativeNavigationRunning = false
    try { nativeNavigationRunning = SitumPlugin.navigationIsRunning() } catch { /* native cleanup is best effort */ }
    if (!navigationIsOwned(navigationStateRef.current, nativeNavigationRunning)) return
    try { mapRef.current?.cancelNavigation(); mapRef.current?.unfollowUser() } catch { /* native cleanup is best effort */ }
    if (nativeNavigationRunning) { try { void SitumPlugin.removeNavigationUpdates() } catch { /* native cleanup is best effort */ } }
    navigationStateRef.current = 'cancelled'; guidanceStateRef.current = 'cancelled'; setNavigationState('cancelled'); setGuidanceState('cancelled'); setNavigationMessage('Directions cancelled.'); setRemainingDistance(null)
  }, [])
  navigationStateRef.current = navigationState
  guidanceStateRef.current = guidanceState

  useEffect(() => { if (buildingId === null && cartography.buildings[0]) setBuildingId(cartography.buildings[0].id) }, [buildingId, cartography.buildings])
  useEffect(() => {
    let active = true
    try {
      positioning.installNativeListeners()
      void SitumPlugin.setUseRemoteConfig(true); void SitumPlugin.configureUserHelper({ enabled: true, colorScheme: undefined })
      SitumPlugin.onNavigationStart((_route: Route) => { if (!active) return; try { mapRef.current?.followUser() } catch { /* follow is best effort */ }; setNavigationState('active'); setGuidanceState('guidance-following'); setNavigationMessage('Directions are active.'); setRemainingDistance(null) })
      SitumPlugin.onNavigationProgress((progress: NavigationProgress) => { if (!active) return; setNavigationState('active'); setGuidanceState('guidance-following'); setRemainingDistance(Math.max(0, Math.round(progress.distanceToGoal))); setNavigationMessage('Follow the route on the map.') })
      SitumPlugin.onNavigationDestinationReached((_route: Route) => { if (active) { navigationStateRef.current = 'arrived'; guidanceStateRef.current = 'arrived'; setNavigationState('arrived'); setGuidanceState('arrived'); setNavigationMessage('Destination reached.'); setRemainingDistance(0) } })
      SitumPlugin.onNavigationOutOfRoute(() => { if (active) { navigationStateRef.current = 'outside-route'; guidanceStateRef.current = 'outside-route'; setNavigationState('outside-route'); setGuidanceState('outside-route'); setNavigationMessage('You are outside the current route.') } })
      SitumPlugin.onNavigationCancellation(() => { if (active && navigationIsOwned(navigationStateRef.current, false)) { navigationStateRef.current = 'cancelled'; guidanceStateRef.current = 'cancelled'; setNavigationState('cancelled'); setGuidanceState('cancelled'); setNavigationMessage('Directions cancelled.'); setRemainingDistance(null) } })
      SitumPlugin.onNavigationError(() => { if (active) { navigationStateRef.current = 'error'; guidanceStateRef.current = 'error'; setNavigationState('error'); setGuidanceState('error'); setNavigationMessage('Directions could not be started.') } })
    } catch { setError('Situm positioning is unavailable on this build.') }
    return () => { active = false; cancelNavigation(); SitumPlugin.onNavigationStart(() => undefined); SitumPlugin.onNavigationProgress(() => undefined); SitumPlugin.onNavigationDestinationReached(() => undefined); SitumPlugin.onNavigationOutOfRoute(() => undefined); SitumPlugin.onNavigationCancellation(() => undefined); SitumPlugin.onNavigationError(() => undefined) }
  }, [buildingId, cancelNavigation, positioning])
  useEffect(() => { setPositionStale(false); if (!positioningSnapshot.receivedAt) return; const remaining = Math.max(0, locationFreshnessWindowMs - (Date.now() - positioningSnapshot.receivedAt)); const timer = setTimeout(() => setPositionStale(true), remaining); return () => clearTimeout(timer) }, [positioningSnapshot.receivedAt])
  useEffect(() => { if (positionState === 'error' || positionState === 'stopped') cancelNavigation() }, [cancelNavigation, positionState])
  useEffect(() => {
    if (!fullscreen) return
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => { onFullscreenChange?.(false); return true })
    return () => subscription.remove()
  }, [fullscreen, onFullscreenChange])

  const startPositioning = useCallback(() => { if (buildingId === null) return; setGuidanceState('positioning-starting'); void positioning.start(workspaceId, buildingId, () => workspaces.getPositioningCredential()) }, [buildingId, positioning, workspaces, workspaceId])
  const stopPositioning = useCallback(() => { cancelNavigation(); positioning.stop('explicit'); setGuidanceState('browse') }, [cancelNavigation, positioning])
  const onPoiSelected = useCallback((event: OnPoiSelectedResult) => { if (buildingId === null || Number(event.buildingIdentifier) !== buildingId) return; const poi = resolvePoi(cartography.pois, Number(event.identifier), buildingId); setSelectedPoi(poi) }, [buildingId, cartography.pois])
  const startGuidance = useCallback(() => { if (!selectedPoi || !canNavigate) return; cancelNavigation(); try { mapRef.current?.navigateToPoi({ identifier: selectedPoi.id }); try { mapRef.current?.followUser() } catch { /* follow begins again on navigation start */ }; navigationStateRef.current = 'active'; guidanceStateRef.current = guidanceStateForNavigation('active'); setNavigationState('active'); setGuidanceState('guidance-following'); setNavigationMessage('Starting directions…') } catch { navigationStateRef.current = 'error'; guidanceStateRef.current = 'error'; setNavigationState('error'); setGuidanceState('error'); setNavigationMessage('Directions could not be started.') } }, [canNavigate, cancelNavigation, selectedPoi])
  const recenter = useCallback(() => { try { mapRef.current?.followUser(); guidanceStateRef.current = 'guidance-following'; setGuidanceState('guidance-following'); setNavigationMessage('Following your position.') } catch { setNavigationMessage('Recenter is unavailable right now.') } }, [])
  const guidanceTitle = guidanceState === 'arrived' ? 'Arrived' : guidanceState === 'outside-route' ? 'Outside route' : guidanceState === 'cancelled' ? 'Directions stopped' : guidanceState === 'error' ? 'Directions unavailable' : 'Guidance'

  if (error) return <StateCard title="Map unavailable" body={error} />
  return <View style={styles.screen}>
    {buildingId ? <MapView key={`${workspaceId}:${buildingId}`} ref={mapRef} style={styles.map} configuration={{ buildingIdentifier: String(buildingId), profile: process.env.EXPO_PUBLIC_SITUM_PROFILE || undefined, language: 'en' }} onLoadError={() => setError('The selected building map could not be loaded.')} onPoiSelected={onPoiSelected} onPoiDeselected={(_event: OnPoiDeselectedResult) => { setSelectedPoi(null) }} onFloorChanged={(floor: OnFloorChangedResult) => { setActiveFloorName(floor.toFloorName) }} /> : <View style={styles.mapPlaceholder}><Text style={styles.muted}>Choose a building to load its map.</Text></View>}
    {!fullscreen ? <View pointerEvents="box-none" style={styles.overlay}>
      <TouchableOpacity accessibilityRole="button" accessibilityLabel="Enter fullscreen map" onPress={() => onFullscreenChange?.(true)} style={styles.fullscreenButton}><Text style={styles.fullscreenIcon}>⛶</Text></TouchableOpacity>
      {!isGuidance ? <View style={styles.mapControls}><TouchableOpacity accessibilityRole="button" accessibilityLabel={positionState === 'fresh' ? 'Turn off location' : 'Find my location'} onPress={positionState === 'fresh' || positionState === 'starting' ? stopPositioning : startPositioning} style={styles.locationButton}><Text style={styles.locationButtonText}>{positionState === 'fresh' ? 'Stop location' : 'Locate me'}</Text></TouchableOpacity></View> : null}
      {isGuidance && showStop ? <View style={styles.mapControls}><TouchableOpacity accessibilityRole="button" accessibilityLabel="Stop guidance" onPress={cancelNavigation} style={styles.stopButton}><Text style={styles.stopText}>Stop guidance</Text></TouchableOpacity></View> : null}
      {selectedPoi && guidanceState === 'browse' ? <View accessibilityState={{ selected: selectedPoi?.id === poi.id }} style={styles.poiSheet}><View style={styles.sheetHandle} /><Text style={styles.sheetEyebrow}>PLACE</Text><Text numberOfLines={1} style={styles.sheetTitle}>{selectedPoi.name}</Text><Text style={styles.sheetMeta}>{selectedPoi.categoryName || 'Place'}{resolveFloorDisplay(cartography.floors, selectedPoi.floorId, buildingId || -1) ? ` · ${resolveFloorDisplay(cartography.floors, selectedPoi.floorId, buildingId || -1)}` : ''}</Text><View style={styles.sheetActions}><TouchableOpacity accessibilityRole="button" accessibilityLabel="Directions" accessibilityState={{ disabled: !canNavigate }} disabled={!canNavigate} onPress={startGuidance} style={[styles.primaryButton, !canNavigate && styles.disabled]}><Text style={styles.primaryButtonText}>Directions</Text></TouchableOpacity><TouchableOpacity accessibilityRole="button" onPress={() => { mapRef.current?.deselectPoi(); setSelectedPoi(null) }} style={styles.clearButton}><Text style={styles.clearText}>Clear</Text></TouchableOpacity></View><Text style={styles.sheetHint}>{canNavigate ? 'Use real Situm positioning for guidance.' : 'Find your current location before starting directions.'}</Text></View> : null}
    </View> : null}
  </View>
}

function StateCard({ title, body, action }: { title: string, body: string, action?: () => void }) { return <View style={styles.card}><Text style={styles.cardTitle}>{title}</Text><Text style={styles.muted}>{body}</Text>{action ? <TouchableOpacity style={styles.primaryButton} onPress={action}><Text style={styles.primaryButtonText}>Try again</Text></TouchableOpacity> : null}</View> }

const styles = StyleSheet.create({
  screen: { backgroundColor: '#dfe5e9', flex: 1, overflow: 'hidden' }, map: { backgroundColor: '#dfe5e9', flex: 1, width: '100%' }, mapPlaceholder: { alignItems: 'center', flex: 1, justifyContent: 'center' }, overlay: { ...StyleSheet.absoluteFill, padding: 12 }, fullscreenButton: { alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.96)', borderColor: colors.border, borderRadius: radii.control, borderWidth: 1, bottom: 104, height: 40, justifyContent: 'center', left: 12, position: 'absolute', width: 40 }, fullscreenIcon: { color: colors.action, fontSize: 22, fontWeight: '700', lineHeight: 24 }, mapControls: { alignItems: 'flex-start', bottom: 56, gap: 8, left: 12, position: 'absolute' }, locationButton: { backgroundColor: 'rgba(255,255,255,0.96)', borderColor: colors.border, borderRadius: radii.control, borderWidth: 1, paddingHorizontal: 12, paddingVertical: 10 }, locationButtonText: { color: colors.action, fontSize: 12, fontWeight: '800' }, recenterButton: { backgroundColor: colors.action, borderRadius: radii.control, paddingHorizontal: 12, paddingVertical: 10 }, recenterText: { color: '#fff', fontSize: 12, fontWeight: '800' }, poiSheet: { backgroundColor: 'rgba(255,255,255,0.98)', borderColor: colors.border, borderRadius: radii.panel, borderWidth: 1, bottom: 34, left: 12, maxWidth: 420, padding: 14, position: 'absolute', right: 12 }, sheetHandle: { alignSelf: 'center', backgroundColor: colors.strongBorder, borderRadius: 3, height: 4, marginBottom: 9, width: 36 }, sheetEyebrow: { color: colors.muted, fontSize: 10, fontWeight: '800', letterSpacing: 1.1 }, sheetTitle: { color: colors.ink, fontSize: 18, fontWeight: '800', marginTop: 4 }, sheetMeta: { color: colors.tertiary, fontSize: 12, marginTop: 4 }, sheetActions: { alignItems: 'center', flexDirection: 'row', gap: 8, marginTop: 10 }, primaryButton: { alignItems: 'center', backgroundColor: colors.action, borderRadius: radii.control, justifyContent: 'center', minHeight: 40, paddingHorizontal: 14 }, primaryButtonText: { color: '#fff', fontSize: 12, fontWeight: '800' }, clearButton: { padding: 10 }, clearText: { color: colors.secondary, fontSize: 12, fontWeight: '700' }, sheetHint: { color: colors.muted, fontSize: 11, lineHeight: 16, marginTop: 7 }, disabled: { opacity: 0.5 }, guidanceHud: { backgroundColor: 'rgba(255,255,255,0.98)', borderColor: colors.border, borderRadius: radii.panel, borderWidth: 1, bottom: 34, left: 12, padding: 14, position: 'absolute', right: 12 }, guidanceHeader: { alignItems: 'center', flexDirection: 'row', gap: 12 }, guidanceCopy: { flex: 1 }, stopButton: { alignItems: 'center', backgroundColor: colors.ink, borderRadius: radii.control, justifyContent: 'center', minHeight: 40, paddingHorizontal: 14 }, stopText: { color: '#fff', fontSize: 12, fontWeight: '800' }, loading: { alignItems: 'center', flex: 1, gap: 12, justifyContent: 'center' }, card: { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radii.panel, borderWidth: 1, margin: 16, padding: 18 }, cardTitle: { color: colors.ink, fontSize: 18, fontWeight: '800' }, muted: { color: colors.tertiary, fontSize: 13, lineHeight: 20, marginTop: 5 }
})
