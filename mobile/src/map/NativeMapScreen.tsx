import SitumPlugin, { MapView, SitumProvider, type MapViewRef } from '@situm/react-native'
import type { Indication, Location, NavigationProgress, OnFloorChangedResult, OnPoiDeselectedResult, OnPoiSelectedResult, Route } from '@situm/react-native'
import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react'
import { ActivityIndicator, BackHandler, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, useWindowDimensions, View } from 'react-native'
import { ApiError } from '../api/errors'
import type { PositioningCredentialResponse } from '../api/types'
import type { ForegroundPositioningSession } from '../positioning/session'
import { layoutForWidth, type LayoutMode } from '../ui/layout'
import { colors, radii } from '../ui/theme'
import type { WorkspaceContext } from '../workspaces/context'
import {
  canStopGuidance,
  filterPois,
  formatNavigationDistance,
  formatNavigationEta,
  guidanceInstructionForIndication,
  guidanceStateForNavigation,
  isCurrentLocationUsable,
  locationFreshnessWindowMs,
  navigationIsOwned,
  resolveFloorDisplay,
  resolvePoi,
  type GuidanceState,
  type LocationSnapshot,
  type NavigationOwnershipState,
} from './state'

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
    setCredential(null)
    setCartography(null)
    setError('')
    if (!workspaceId) return

    Promise.all([
      workspaces.getPositioningCredential(),
      workspaces.auth.api.get<Cartography>(`/api/workspaces/${workspaceId}/situm/cartography`),
    ]).then(([nextCredential, nextCartography]) => {
      if (!cancelled) {
        setCredential(nextCredential)
        setCartography(nextCartography)
      }
    }).catch((cause: unknown) => {
      if (!cancelled) setError(cause instanceof ApiError ? cause.message : 'Map data is unavailable for this workspace.')
    })

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
  if (!credential || !cartography) return <View style={styles.loading}><ActivityIndicator color={colors.action} /><Text style={styles.muted}>Loading workspace cartography…</Text></View>
  if (!cartography.buildings.length) return <StateCard title="No buildings available" body="This workspace has no building available for native exploration." />

  return (
    <SitumProvider apiKey={credential.apiKey}>
      <NativeMapRuntime
        key={`${workspaceId}:${activeMapRequestId ?? 'default'}`}
        workspaceId={workspaceId}
        cartography={cartography}
        lifecycle={lifecycle}
        workspaces={workspaces}
        positioning={positioning}
        initialBuildingId={initialBuildingId}
        layout={layout}
        fullscreen={fullscreen}
        onFullscreenChange={onFullscreenChange}
      />
    </SitumProvider>
  )
}

function NativeMapRuntime({ workspaceId, cartography, lifecycle: _lifecycle, workspaces, positioning, initialBuildingId, layout: suppliedLayout, fullscreen, onFullscreenChange }: { workspaceId: string, cartography: Cartography, lifecycle: string, workspaces: WorkspaceContext, positioning: ForegroundPositioningSession, initialBuildingId: number | null, layout?: LayoutMode, fullscreen: boolean, onFullscreenChange?: (fullscreen: boolean) => void }) {
  const { width } = useWindowDimensions()
  const layout = suppliedLayout || layoutForWidth(width).mode
  const isPhone = layout === 'phone'
  const [buildingId, setBuildingId] = useState<number | null>(() => cartography.buildings.some(building => building.id === initialBuildingId) ? initialBuildingId : null)
  const [selectedPoi, setSelectedPoi] = useState<Poi | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchFocused, setSearchFocused] = useState(false)
  const [floorMenuOpen, setFloorMenuOpen] = useState(false)
  const positioningSnapshot = useSyncExternalStore(positioning.subscribe, positioning.getSnapshot, positioning.getSnapshot)
  const positionSnapshot = positioningSnapshot.location ? {
    state: positioningSnapshot.state === 'active' ? 'fresh' : positioningSnapshot.state,
    location: positioningSnapshot.location,
    receivedAt: positioningSnapshot.receivedAt || 0,
    workspaceId: positioningSnapshot.workspaceId || workspaceId,
    buildingId: positioningSnapshot.buildingId || buildingId || -1,
  } as LocationSnapshot<Location> : null
  const [positionStale, setPositionStale] = useState(false)
  const positionState = positioningSnapshot.state === 'active' ? (positionStale ? 'stale' : 'fresh') : positioningSnapshot.state
  const locationMessage = positioningSnapshot.message
  const [navigationState, setNavigationState] = useState<NavigationState>('idle')
  const [guidanceState, setGuidanceState] = useState<GuidanceState>('browse')
  const [navigationMessage, setNavigationMessage] = useState('Choose a real place to see directions.')
  const [navigationProgress, setNavigationProgress] = useState<NavigationProgress | null>(null)
  const [activeFloorName, setActiveFloorName] = useState('')
  const navigationStateRef = useRef<NavigationState>('idle')
  const guidanceStateRef = useRef<GuidanceState>('browse')
  const [error, setError] = useState('')
  const mapRef = useRef<MapViewRef>(null)
  const canNavigate = isCurrentLocationUsable(positionSnapshot, workspaceId, buildingId ?? -1)
  const isGuidanceActive = navigationState === 'active' || navigationState === 'outside-route'
  const showStop = canStopGuidance(navigationState)
  const building = cartography.buildings.find(candidate => candidate.id === buildingId) ?? null
  const buildingFloors = useMemo(() => cartography.floors.filter(floor => floor.buildingId === buildingId).sort((a, b) => b.level - a.level), [buildingId, cartography.floors])
  const visibleSearchResults = useMemo(() => filterPois(cartography.pois, buildingId, searchQuery).slice(0, 7), [buildingId, cartography.pois, searchQuery])
  const currentFloorLabel = activeFloorName || 'Floors'
  const progressDistance = formatNavigationDistance(navigationProgress?.distanceToGoal)
  const stepDistance = formatNavigationDistance(navigationProgress?.distanceToEndStep)
  const progressEta = formatNavigationEta(navigationProgress?.timeToGoal)
  const progressInstruction = guidanceInstructionForIndication(navigationProgress?.nextIndication) || navigationMessage
  const poi = selectedPoi ?? { id: -1 }

  const cancelNavigation = useCallback(() => {
    let nativeNavigationRunning = false
    try { nativeNavigationRunning = SitumPlugin.navigationIsRunning() } catch { /* native cleanup is best effort */ }
    if (!navigationIsOwned(navigationStateRef.current, nativeNavigationRunning)) return

    try {
      mapRef.current?.cancelNavigation()
      mapRef.current?.unfollowUser()
    } catch { /* native cleanup is best effort */ }

    if (nativeNavigationRunning) {
      try { void SitumPlugin.removeNavigationUpdates() } catch { /* native cleanup is best effort */ }
    }

    navigationStateRef.current = 'cancelled'
    guidanceStateRef.current = 'cancelled'
    setNavigationState('cancelled')
    setGuidanceState('cancelled')
    setNavigationMessage('Directions stopped.')
    setNavigationProgress(null)
  }, [])

  navigationStateRef.current = navigationState
  guidanceStateRef.current = guidanceState

  useEffect(() => {
    if (buildingId === null && cartography.buildings[0]) setBuildingId(cartography.buildings[0].id)
  }, [buildingId, cartography.buildings])

  useEffect(() => {
    let active = true
    try {
      positioning.installNativeListeners()
      void SitumPlugin.setUseRemoteConfig(true)
      void SitumPlugin.configureUserHelper({ enabled: true, colorScheme: undefined })
      SitumPlugin.onNavigationStart((_route: Route) => {
        if (!active) return
        try { mapRef.current?.followUser() } catch { /* follow is best effort */ }
        setNavigationState('active')
        setGuidanceState('guidance-following')
        setNavigationMessage('Follow the route on the map.')
        setNavigationProgress(null)
        setSearchFocused(false)
        setFloorMenuOpen(false)
      })
      SitumPlugin.onNavigationProgress((progress: NavigationProgress) => {
        if (!active) return
        setNavigationState('active')
        setGuidanceState('guidance-following')
        setNavigationProgress(progress)
        setNavigationMessage('Follow the route on the map.')
        const floorIdentifier = progress.closestLocationInRoute?.position?.floorIdentifier
        if (floorIdentifier) {
          const floor = cartography.floors.find(candidate => String(candidate.id) === String(floorIdentifier))
          if (floor) setActiveFloorName(floor.name || `Level ${floor.level}`)
        }
      })
      SitumPlugin.onNavigationDestinationReached((_route: Route) => {
        if (!active) return
        navigationStateRef.current = 'arrived'
        guidanceStateRef.current = 'arrived'
        setNavigationState('arrived')
        setGuidanceState('arrived')
        setNavigationMessage('Destination reached.')
        setNavigationProgress(current => current ? { ...current, distanceToGoal: 0, timeToGoal: 0 } : null)
      })
      SitumPlugin.onNavigationOutOfRoute(() => {
        if (!active) return
        navigationStateRef.current = 'outside-route'
        guidanceStateRef.current = 'outside-route'
        setNavigationState('outside-route')
        setGuidanceState('outside-route')
        setNavigationMessage('You are outside the current route.')
      })
      SitumPlugin.onNavigationCancellation(() => {
        if (!active || !navigationIsOwned(navigationStateRef.current, false)) return
        navigationStateRef.current = 'cancelled'
        guidanceStateRef.current = 'cancelled'
        setNavigationState('cancelled')
        setGuidanceState('cancelled')
        setNavigationMessage('Directions stopped.')
        setNavigationProgress(null)
      })
      SitumPlugin.onNavigationError(() => {
        if (!active) return
        navigationStateRef.current = 'error'
        guidanceStateRef.current = 'error'
        setNavigationState('error')
        setGuidanceState('error')
        setNavigationMessage('Directions could not be started.')
        setNavigationProgress(null)
      })
    } catch {
      setError('Situm positioning is unavailable on this build.')
    }

    return () => {
      active = false
      cancelNavigation()
      SitumPlugin.onNavigationStart(() => undefined)
      SitumPlugin.onNavigationProgress(() => undefined)
      SitumPlugin.onNavigationDestinationReached(() => undefined)
      SitumPlugin.onNavigationOutOfRoute(() => undefined)
      SitumPlugin.onNavigationCancellation(() => undefined)
      SitumPlugin.onNavigationError(() => undefined)
    }
  }, [cancelNavigation, cartography.floors, positioning])

  useEffect(() => {
    setPositionStale(false)
    if (!positioningSnapshot.receivedAt) return
    const remaining = Math.max(0, locationFreshnessWindowMs - (Date.now() - positioningSnapshot.receivedAt))
    const timer = setTimeout(() => setPositionStale(true), remaining)
    return () => clearTimeout(timer)
  }, [positioningSnapshot.receivedAt])

  useEffect(() => {
    if (positionState === 'fresh' && guidanceStateRef.current === 'positioning-starting') {
      guidanceStateRef.current = 'positioning-active'
      setGuidanceState('positioning-active')
    }
    if (positionState === 'error' || positionState === 'stopped') {
      cancelNavigation()
      if (guidanceStateRef.current === 'positioning-starting' || guidanceStateRef.current === 'positioning-active') {
        guidanceStateRef.current = 'browse'
        setGuidanceState('browse')
      }
    }
  }, [cancelNavigation, positionState])

  useEffect(() => {
    if (!fullscreen) return
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      onFullscreenChange?.(false)
      return true
    })
    return () => subscription.remove()
  }, [fullscreen, onFullscreenChange])

  const startPositioning = useCallback(() => {
    if (buildingId === null) return
    setGuidanceState('positioning-starting')
    void positioning.start(workspaceId, buildingId, () => workspaces.getPositioningCredential())
  }, [buildingId, positioning, workspaces, workspaceId])

  const stopPositioning = useCallback(() => {
    cancelNavigation()
    positioning.stop('explicit')
    setGuidanceState('browse')
    setNavigationState('idle')
    setNavigationProgress(null)
  }, [cancelNavigation, positioning])

  const onPoiSelected = useCallback((event: OnPoiSelectedResult) => {
    if (buildingId === null || Number(event.buildingIdentifier) !== buildingId) return
    const nextPoi = resolvePoi(cartography.pois, Number(event.identifier), buildingId)
    setSelectedPoi(nextPoi)
    if (nextPoi) setSearchQuery(nextPoi.name)
    setSearchFocused(false)
  }, [buildingId, cartography.pois])

  const selectPoi = useCallback((nextPoi: Poi) => {
    setSelectedPoi(nextPoi)
    setSearchQuery(nextPoi.name)
    setSearchFocused(false)
    setFloorMenuOpen(false)
    try {
      mapRef.current?.selectFloor(nextPoi.floorId)
      mapRef.current?.selectPoi(nextPoi.id)
    } catch { /* map selection is best effort; POI state is still real cartography */ }
    const floorLabel = resolveFloorDisplay(cartography.floors, nextPoi.floorId, nextPoi.buildingId)
    if (floorLabel) setActiveFloorName(floorLabel)
  }, [cartography.floors])

  const clearDestination = useCallback(() => {
    try { mapRef.current?.deselectPoi() } catch { /* best effort */ }
    setSelectedPoi(null)
    setSearchQuery('')
    setSearchFocused(false)
  }, [])

  const startGuidance = useCallback(() => {
    if (!selectedPoi || !canNavigate) return
    cancelNavigation()
    try {
      mapRef.current?.navigateToPoi({ identifier: selectedPoi.id })
      try { mapRef.current?.followUser() } catch { /* follow begins again on navigation start */ }
      navigationStateRef.current = 'active'
      guidanceStateRef.current = guidanceStateForNavigation('active')
      setNavigationState('active')
      setGuidanceState('guidance-following')
      setNavigationMessage('Starting directions…')
      setNavigationProgress(null)
      setSearchFocused(false)
      setFloorMenuOpen(false)
    } catch {
      navigationStateRef.current = 'error'
      guidanceStateRef.current = 'error'
      setNavigationState('error')
      setGuidanceState('error')
      setNavigationMessage('Directions could not be started.')
    }
  }, [canNavigate, cancelNavigation, selectedPoi])

  const recenter = useCallback(() => {
    try {
      mapRef.current?.followUser()
      guidanceStateRef.current = isGuidanceActive ? 'guidance-following' : guidanceStateRef.current
      if (isGuidanceActive) setGuidanceState('guidance-following')
      setNavigationMessage(isGuidanceActive ? 'Following your position.' : navigationMessage)
    } catch {
      setNavigationMessage('Recenter is unavailable right now.')
    }
  }, [isGuidanceActive, navigationMessage])

  const chooseFloor = useCallback((floor: Floor) => {
    try { mapRef.current?.selectFloor(floor.id) } catch { /* best effort */ }
    setActiveFloorName(floor.name || `Level ${floor.level}`)
    setFloorMenuOpen(false)
  }, [])

  const resetGuidanceOutcome = useCallback(() => {
    setNavigationState('idle')
    setGuidanceState(positionState === 'fresh' ? 'positioning-active' : 'browse')
    setNavigationMessage('Choose a real place to see directions.')
    setNavigationProgress(null)
  }, [positionState])

  if (error) return <StateCard title="Map unavailable" body={error} />

  const showGuidanceHud = isGuidanceActive || guidanceState === 'arrived' || guidanceState === 'cancelled' || guidanceState === 'error'
  const isBrowseMode = !showGuidanceHud
  const searchOpen = isBrowseMode && searchFocused
  const showDestinationSheet = selectedPoi && isBrowseMode && !searchFocused

  return (
    <View style={styles.screen}>
      {buildingId ? (
        <MapView
          key={`${workspaceId}:${buildingId}`}
          ref={mapRef}
          style={styles.map}
          configuration={{ buildingIdentifier: String(buildingId), profile: process.env.EXPO_PUBLIC_SITUM_PROFILE || undefined, language: 'en' }}
          onLoadError={() => setError('The selected building map could not be loaded.')}
          onPoiSelected={onPoiSelected}
          onPoiDeselected={(_event: OnPoiDeselectedResult) => {
            if (!searchFocused) {
              setSelectedPoi(null)
              setSearchQuery('')
            }
          }}
          onFloorChanged={(floor: OnFloorChangedResult) => { setActiveFloorName(floor.toFloorName) }}
        />
      ) : (
        <View style={styles.mapPlaceholder}><Text style={styles.muted}>Choose a building to load its map.</Text></View>
      )}

      {!fullscreen ? (
        <View pointerEvents="box-none" style={styles.overlay}>
          {!showGuidanceHud ? (
            <View style={[styles.searchDock, isPhone ? styles.searchDockPhone : styles.searchDockLarge]}>
              <View style={styles.searchCard}>
                <View style={styles.searchRow}>
                  <View style={styles.searchIconWrap}><Text style={styles.searchIcon}>⌕</Text></View>
                  <TextInput
                    accessibilityLabel="Search places"
                    autoCorrect={false}
                    placeholder="Where do you want to go?"
                    placeholderTextColor={colors.muted}
                    returnKeyType="search"
                    style={styles.searchInput}
                    value={searchQuery}
                    onFocus={() => setSearchFocused(true)}
                    onChangeText={(value) => {
                      setSearchQuery(value)
                      setSearchFocused(true)
                      if (selectedPoi && value !== selectedPoi.name) {
                        try { mapRef.current?.deselectPoi() } catch { /* best effort */ }
                        setSelectedPoi(null)
                      }
                    }}
                    onSubmitEditing={() => { if (visibleSearchResults[0]) selectPoi(visibleSearchResults[0]) }}
                  />
                  {searchQuery ? (
                    <TouchableOpacity accessibilityRole="button" accessibilityLabel="Clear destination search" hitSlop={8} onPress={clearDestination} style={styles.searchClear}>
                      <Text style={styles.searchClearText}>×</Text>
                    </TouchableOpacity>
                  ) : null}
                </View>

                <View style={styles.contextRow}>
                  <View style={styles.contextBuilding}>
                    <Text numberOfLines={1} style={styles.contextBuildingText}>{building?.name || 'Building'}</Text>
                  </View>
                  {buildingFloors.length ? (
                    <TouchableOpacity accessibilityRole="button" accessibilityLabel={activeFloorName ? `Choose floor, current ${activeFloorName}` : 'Choose floor'} onPress={() => setFloorMenuOpen(value => !value)} style={styles.floorTrigger}>
                      <Text style={styles.floorTriggerIcon}>▱</Text>
                      <Text numberOfLines={1} style={styles.floorTriggerText}>{currentFloorLabel}</Text>
                      <Text style={styles.floorTriggerChevron}>{floorMenuOpen ? '⌃' : '⌄'}</Text>
                    </TouchableOpacity>
                  ) : null}
                </View>

                {floorMenuOpen ? (
                  <ScrollView accessibilityLabel="Floor choices" contentContainerStyle={styles.floorChoices} horizontal showsHorizontalScrollIndicator={false}>
                    {buildingFloors.map(floor => {
                      const label = floor.name || `Level ${floor.level}`
                      const active = label === currentFloorLabel
                      return (
                        <TouchableOpacity accessibilityRole="button" accessibilityLabel={`Floor ${label}`} accessibilityState={{ selected: active }} key={floor.id} onPress={() => chooseFloor(floor)} style={[styles.floorChip, active && styles.floorChipActive]}>
                          <Text style={[styles.floorChipText, active && styles.floorChipTextActive]}>{label}</Text>
                        </TouchableOpacity>
                      )
                    })}
                  </ScrollView>
                ) : null}

                {searchOpen ? (
                  <ScrollView accessibilityLabel="Place search results" keyboardShouldPersistTaps="handled" style={styles.searchResults}>
                    {visibleSearchResults.length ? visibleSearchResults.map(result => (
                      <TouchableOpacity
                        accessibilityRole="button"
                        accessibilityLabel={`Select place ${result.name}`}
                        key={result.id}
                        onPress={() => selectPoi(result)}
                        style={styles.searchResult}
                      >
                        <View style={styles.resultPin}><Text style={styles.resultPinText}>•</Text></View>
                        <View style={styles.resultCopy}>
                          <Text numberOfLines={1} style={styles.resultTitle}>{result.name}</Text>
                          <Text numberOfLines={1} style={styles.resultMeta}>{result.categoryName || 'Place'}{resolveFloorDisplay(cartography.floors, result.floorId, result.buildingId) ? ` · ${resolveFloorDisplay(cartography.floors, result.floorId, result.buildingId)}` : ''}</Text>
                        </View>
                        <Text style={styles.resultArrow}>›</Text>
                      </TouchableOpacity>
                    )) : (
                      <View style={styles.searchEmpty}><Text style={styles.searchEmptyText}>No matching places in this building.</Text></View>
                    )}
                  </ScrollView>
                ) : null}
              </View>
            </View>
          ) : null}

          <View style={styles.mapControls}>
            <MapControlButton label="Enter fullscreen map" visibleLabel={isPhone ? undefined : 'Full screen'} symbol="⛶" onPress={() => onFullscreenChange?.(true)} />
            {isGuidanceActive ? (
              <MapControlButton label="Recenter on my location" visibleLabel={isPhone ? undefined : 'Recenter'} symbol="⌖" tone="primary" onPress={recenter} />
            ) : (
              <MapControlButton
                label={positionState === 'fresh' ? 'Turn off location' : 'Find my location'}
                visibleLabel={isPhone ? undefined : (positionState === 'starting' ? 'Locating…' : positionState === 'fresh' ? 'Stop location' : 'Locate me')}
                symbol="⌖"
                tone={positionState === 'fresh' ? 'primary' : 'neutral'}
                disabled={positionState === 'starting'}
                onPress={positionState === 'fresh' || positionState === 'starting' ? stopPositioning : startPositioning}
              />
            )}
          </View>

          {!showGuidanceHud && positionState !== 'stopped' && positionState !== 'fresh' ? (
            <View style={[styles.locationStatus, isPhone ? styles.locationStatusPhone : styles.locationStatusLarge]}>
              <ActivityIndicator color={positionState === 'error' ? colors.danger : colors.action} size="small" />
              <Text numberOfLines={2} style={styles.locationStatusText}>{locationMessage || (positionState === 'starting' ? 'Finding your indoor position…' : positionState === 'stale' ? 'Refreshing your indoor position…' : 'Location needs attention.')}</Text>
            </View>
          ) : null}

          {showDestinationSheet ? (
            <View accessibilityState={{ selected: selectedPoi?.id === poi.id }} style={[styles.poiSheet, isPhone ? styles.poiSheetPhone : styles.poiSheetLarge]}>
              <View style={styles.sheetHandle} />
              <View style={styles.destinationHeader}>
                <View style={styles.destinationIcon}><Text style={styles.destinationIconText}>●</Text></View>
                <View style={styles.destinationCopy}>
                  <Text style={styles.sheetEyebrow}>DESTINATION</Text>
                  <Text numberOfLines={1} style={styles.sheetTitle}>{selectedPoi.name}</Text>
                  <Text numberOfLines={1} style={styles.sheetMeta}>{selectedPoi.categoryName || 'Place'}{resolveFloorDisplay(cartography.floors, selectedPoi.floorId, buildingId || -1) ? ` · ${resolveFloorDisplay(cartography.floors, selectedPoi.floorId, buildingId || -1)}` : ''}</Text>
                </View>
                <TouchableOpacity accessibilityRole="button" accessibilityLabel="Clear destination" onPress={clearDestination} style={styles.destinationClose}><Text style={styles.destinationCloseText}>×</Text></TouchableOpacity>
              </View>

              <View style={styles.sheetActions}>
                {canNavigate ? (
                  <TouchableOpacity accessibilityRole="button" accessibilityLabel="Directions" onPress={startGuidance} style={styles.primaryButton}>
                    <Text style={styles.primaryButtonText}>Directions</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity accessibilityRole="button" accessibilityLabel="Locate me for directions" disabled={positionState === 'starting'} onPress={startPositioning} style={[styles.primaryButton, positionState === 'starting' && styles.disabled]}>
                    <Text style={styles.primaryButtonText}>{positionState === 'starting' ? 'Locating…' : 'Locate me'}</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity accessibilityRole="button" accessibilityLabel="Search another place" onPress={() => setSearchFocused(true)} style={styles.secondaryButton}>
                  <Text style={styles.secondaryButtonText}>Change</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.sheetHint}>{canNavigate ? 'Situm will calculate and render the route from your current indoor position.' : 'A fresh indoor position is required before real Situm navigation can start.'}</Text>
            </View>
          ) : null}

          {showGuidanceHud ? (
            <>
              <View style={[styles.guidanceTop, isPhone ? styles.guidanceTopPhone : styles.guidanceTopLarge, navigationState === 'outside-route' && styles.guidanceWarning]}>
                <View style={styles.guidanceTurnIcon}><Text style={styles.guidanceTurnText}>{guidanceSymbol(navigationProgress?.nextIndication)}</Text></View>
                <View style={styles.guidanceTopCopy}>
                  <Text style={styles.guidanceEyebrow}>{guidanceState === 'arrived' ? 'ARRIVED' : navigationState === 'outside-route' ? 'ROUTE UPDATE' : guidanceState === 'error' ? 'NAVIGATION' : guidanceState === 'cancelled' ? 'NAVIGATION' : 'NEXT'}</Text>
                  <Text numberOfLines={2} style={styles.guidanceInstruction}>{progressInstruction}</Text>
                  {selectedPoi ? <Text numberOfLines={1} style={styles.guidanceDestination}>to {selectedPoi.name}{stepDistance && isGuidanceActive ? ` · ${stepDistance}` : ''}</Text> : null}
                </View>
              </View>

              <View style={[styles.guidanceBottom, isPhone ? styles.guidanceBottomPhone : styles.guidanceBottomLarge]}>
                <View style={styles.guidanceMetricGroup}>
                  <View style={styles.guidanceMetric}>
                    <Text style={styles.guidanceMetricValue}>{progressEta || '—'}</Text>
                    <Text style={styles.guidanceMetricLabel}>ETA</Text>
                  </View>
                  <View style={styles.guidanceDivider} />
                  <View style={styles.guidanceMetric}>
                    <Text style={styles.guidanceMetricValue}>{progressDistance || (guidanceState === 'arrived' ? '0 m' : '—')}</Text>
                    <Text style={styles.guidanceMetricLabel}>Remaining</Text>
                  </View>
                  {activeFloorName ? <><View style={styles.guidanceDivider} /><View style={styles.guidanceMetric}><Text numberOfLines={1} style={styles.guidanceMetricValue}>{activeFloorName}</Text><Text style={styles.guidanceMetricLabel}>Floor</Text></View></> : null}
                </View>
                {showStop ? (
                  <TouchableOpacity accessibilityRole="button" accessibilityLabel="Stop guidance" onPress={cancelNavigation} style={styles.stopButton}><Text style={styles.stopText}>Stop</Text></TouchableOpacity>
                ) : (
                  <TouchableOpacity accessibilityRole="button" accessibilityLabel="Return to map browsing" onPress={resetGuidanceOutcome} style={styles.doneButton}><Text style={styles.doneText}>Done</Text></TouchableOpacity>
                )}
              </View>
            </>
          ) : null}
        </View>
      ) : null}
    </View>
  )
}

function guidanceSymbol(indication: Indication | null | undefined) {
  const action = indication?.indicationType?.toUpperCase()
  const orientation = indication?.orientationType?.toUpperCase()
  if (action === 'CHANGE_FLOOR' || indication?.neededLevelChange) return '⇅'
  if (action === 'END') return '✓'
  if (orientation?.includes('LEFT')) return '↰'
  if (orientation?.includes('RIGHT')) return '↱'
  if (orientation === 'BACKWARD') return '↶'
  return '↑'
}

function MapControlButton({ label, visibleLabel, symbol, tone = 'neutral', disabled = false, onPress }: { label: string, visibleLabel?: string, symbol: string, tone?: 'neutral' | 'primary', disabled?: boolean, onPress: () => void }) {
  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={[styles.mapControlButton, tone === 'primary' && styles.mapControlButtonPrimary, disabled && styles.disabled]}
    >
      <Text style={[styles.mapControlSymbol, tone === 'primary' && styles.mapControlSymbolPrimary]}>{symbol}</Text>
      {visibleLabel ? <Text style={[styles.mapControlLabel, tone === 'primary' && styles.mapControlLabelPrimary]}>{visibleLabel}</Text> : null}
    </TouchableOpacity>
  )
}

function StateCard({ title, body, action }: { title: string, body: string, action?: () => void }) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.muted}>{body}</Text>
      {action ? <TouchableOpacity style={styles.primaryButton} onPress={action}><Text style={styles.primaryButtonText}>Try again</Text></TouchableOpacity> : null}
    </View>
  )
}

const styles = StyleSheet.create({
  screen: { backgroundColor: '#dfe5e9', flex: 1, overflow: 'hidden' },
  map: { backgroundColor: '#dfe5e9', flex: 1, width: '100%' },
  mapPlaceholder: { alignItems: 'center', flex: 1, justifyContent: 'center' },
  overlay: { ...StyleSheet.absoluteFill },
  searchDock: { position: 'absolute', top: 14, zIndex: 5 },
  searchDockPhone: { left: 12, right: 12 },
  searchDockLarge: { left: 16, width: 460 },
  searchCard: { backgroundColor: 'rgba(255,255,255,0.98)', borderColor: 'rgba(255,255,255,0.86)', borderRadius: 18, borderWidth: 1, elevation: 8, overflow: 'hidden', shadowColor: '#0f172a', shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.12, shadowRadius: 16 },
  searchRow: { alignItems: 'center', flexDirection: 'row', minHeight: 54, paddingHorizontal: 12 },
  searchIconWrap: { alignItems: 'center', height: 34, justifyContent: 'center', width: 34 },
  searchIcon: { color: colors.action, fontSize: 26, lineHeight: 28 },
  searchInput: { color: colors.ink, flex: 1, fontSize: 15, fontWeight: '600', minHeight: 50, paddingHorizontal: 6, paddingVertical: 0 },
  searchClear: { alignItems: 'center', height: 36, justifyContent: 'center', width: 36 },
  searchClearText: { color: colors.tertiary, fontSize: 24, lineHeight: 26 },
  contextRow: { alignItems: 'center', borderTopColor: colors.border, borderTopWidth: 1, flexDirection: 'row', gap: 8, minHeight: 38, paddingHorizontal: 12, paddingVertical: 6 },
  contextBuilding: { flex: 1 },
  contextBuildingText: { color: colors.tertiary, fontSize: 11, fontWeight: '700' },
  floorTrigger: { alignItems: 'center', backgroundColor: colors.soft, borderRadius: 9, flexDirection: 'row', gap: 5, maxWidth: 180, minHeight: 30, paddingHorizontal: 9 },
  floorTriggerIcon: { color: colors.action, fontSize: 14 },
  floorTriggerText: { color: colors.secondary, flexShrink: 1, fontSize: 11, fontWeight: '700' },
  floorTriggerChevron: { color: colors.muted, fontSize: 12 },
  floorChoices: { gap: 7, paddingBottom: 10, paddingHorizontal: 12, paddingTop: 4 },
  floorChip: { borderColor: colors.strongBorder, borderRadius: radii.pill, borderWidth: 1, minHeight: 30, paddingHorizontal: 11, paddingVertical: 6 },
  floorChipActive: { backgroundColor: colors.action, borderColor: colors.action },
  floorChipText: { color: colors.secondary, fontSize: 11, fontWeight: '700' },
  floorChipTextActive: { color: '#fff' },
  searchResults: { borderTopColor: colors.border, borderTopWidth: 1, maxHeight: 258 },
  searchResult: { alignItems: 'center', borderBottomColor: colors.border, borderBottomWidth: 1, flexDirection: 'row', gap: 10, minHeight: 58, paddingHorizontal: 12, paddingVertical: 8 },
  resultPin: { alignItems: 'center', backgroundColor: colors.soft, borderRadius: 16, height: 32, justifyContent: 'center', width: 32 },
  resultPinText: { color: colors.action, fontSize: 22, lineHeight: 24 },
  resultCopy: { flex: 1 },
  resultTitle: { color: colors.ink, fontSize: 13, fontWeight: '700' },
  resultMeta: { color: colors.muted, fontSize: 11, marginTop: 3 },
  resultArrow: { color: colors.muted, fontSize: 24 },
  searchEmpty: { padding: 16 },
  searchEmptyText: { color: colors.muted, fontSize: 12, textAlign: 'center' },
  mapControls: { bottom: 18, gap: 8, left: 16, position: 'absolute' },
  mapControlButton: { alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.97)', borderColor: colors.border, borderRadius: 13, borderWidth: 1, elevation: 5, flexDirection: 'row', gap: 7, justifyContent: 'center', minHeight: 44, minWidth: 44, paddingHorizontal: 11, shadowColor: '#0f172a', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.1, shadowRadius: 8 },
  mapControlButtonPrimary: { backgroundColor: colors.action, borderColor: colors.action },
  mapControlSymbol: { color: colors.action, fontSize: 20, fontWeight: '800' },
  mapControlSymbolPrimary: { color: '#fff' },
  mapControlLabel: { color: colors.secondary, fontSize: 11, fontWeight: '800' },
  mapControlLabelPrimary: { color: '#fff' },
  locationStatus: { alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.96)', borderColor: colors.border, borderRadius: 12, borderWidth: 1, bottom: 18, flexDirection: 'row', gap: 9, paddingHorizontal: 12, paddingVertical: 9, position: 'absolute' },
  locationStatusPhone: { left: 70, right: 12 },
  locationStatusLarge: { left: 160, maxWidth: 360 },
  locationStatusText: { color: colors.secondary, flexShrink: 1, fontSize: 11, lineHeight: 15 },
  poiSheet: { backgroundColor: 'rgba(255,255,255,0.98)', borderColor: 'rgba(255,255,255,0.9)', borderRadius: 18, borderWidth: 1, bottom: 16, elevation: 9, padding: 15, position: 'absolute', shadowColor: '#0f172a', shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.15, shadowRadius: 16 },
  poiSheetPhone: { left: 12, right: 12 },
  poiSheetLarge: { left: 126, width: 410 },
  sheetHandle: { alignSelf: 'center', backgroundColor: colors.strongBorder, borderRadius: 3, height: 4, marginBottom: 10, width: 36 },
  destinationHeader: { alignItems: 'center', flexDirection: 'row', gap: 11 },
  destinationIcon: { alignItems: 'center', backgroundColor: '#eaf1ff', borderRadius: 18, height: 36, justifyContent: 'center', width: 36 },
  destinationIconText: { color: colors.action, fontSize: 16 },
  destinationCopy: { flex: 1 },
  destinationClose: { alignItems: 'center', height: 36, justifyContent: 'center', width: 36 },
  destinationCloseText: { color: colors.tertiary, fontSize: 24 },
  sheetEyebrow: { color: colors.muted, fontSize: 9, fontWeight: '800', letterSpacing: 1.1 },
  sheetTitle: { color: colors.ink, fontSize: 17, fontWeight: '800', marginTop: 2 },
  sheetMeta: { color: colors.tertiary, fontSize: 11, marginTop: 3 },
  sheetActions: { alignItems: 'center', flexDirection: 'row', gap: 8, marginTop: 12 },
  primaryButton: { alignItems: 'center', backgroundColor: colors.action, borderRadius: 11, flex: 1, justifyContent: 'center', minHeight: 42, paddingHorizontal: 14 },
  primaryButtonText: { color: '#fff', fontSize: 12, fontWeight: '800' },
  secondaryButton: { alignItems: 'center', borderColor: colors.strongBorder, borderRadius: 11, borderWidth: 1, justifyContent: 'center', minHeight: 42, paddingHorizontal: 14 },
  secondaryButtonText: { color: colors.secondary, fontSize: 12, fontWeight: '700' },
  sheetHint: { color: colors.muted, fontSize: 10, lineHeight: 14, marginTop: 9 },
  disabled: { opacity: 0.55 },
  guidanceTop: { backgroundColor: 'rgba(255,255,255,0.98)', borderColor: 'rgba(255,255,255,0.92)', borderRadius: 18, borderWidth: 1, elevation: 10, flexDirection: 'row', gap: 13, padding: 14, position: 'absolute', top: 14, shadowColor: '#0f172a', shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.16, shadowRadius: 18 },
  guidanceTopPhone: { left: 12, right: 12 },
  guidanceTopLarge: { left: 16, width: 470 },
  guidanceWarning: { borderColor: '#f59e0b' },
  guidanceTurnIcon: { alignItems: 'center', backgroundColor: colors.action, borderRadius: 15, height: 54, justifyContent: 'center', width: 54 },
  guidanceTurnText: { color: '#fff', fontSize: 30, fontWeight: '700', lineHeight: 34 },
  guidanceTopCopy: { flex: 1 },
  guidanceEyebrow: { color: colors.muted, fontSize: 9, fontWeight: '900', letterSpacing: 1.2 },
  guidanceInstruction: { color: colors.ink, fontSize: 18, fontWeight: '800', lineHeight: 22, marginTop: 2 },
  guidanceDestination: { color: colors.tertiary, fontSize: 11, marginTop: 5 },
  guidanceBottom: { alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.98)', borderColor: 'rgba(255,255,255,0.92)', borderRadius: 18, borderWidth: 1, bottom: 16, elevation: 9, flexDirection: 'row', gap: 12, padding: 12, position: 'absolute', shadowColor: '#0f172a', shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.15, shadowRadius: 16 },
  guidanceBottomPhone: { left: 12, right: 12 },
  guidanceBottomLarge: { left: 126, width: 520 },
  guidanceMetricGroup: { alignItems: 'center', flex: 1, flexDirection: 'row' },
  guidanceMetric: { flex: 1, minWidth: 62 },
  guidanceMetricValue: { color: colors.ink, fontSize: 13, fontWeight: '800' },
  guidanceMetricLabel: { color: colors.muted, fontSize: 9, marginTop: 2 },
  guidanceDivider: { backgroundColor: colors.border, height: 30, marginHorizontal: 8, width: 1 },
  stopButton: { alignItems: 'center', backgroundColor: '#111827', borderRadius: 11, justifyContent: 'center', minHeight: 42, paddingHorizontal: 16 },
  stopText: { color: '#fff', fontSize: 12, fontWeight: '800' },
  doneButton: { alignItems: 'center', backgroundColor: colors.action, borderRadius: 11, justifyContent: 'center', minHeight: 42, paddingHorizontal: 16 },
  doneText: { color: '#fff', fontSize: 12, fontWeight: '800' },
  loading: { alignItems: 'center', flex: 1, gap: 12, justifyContent: 'center' },
  card: { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radii.panel, borderWidth: 1, margin: 16, padding: 18 },
  cardTitle: { color: colors.ink, fontSize: 18, fontWeight: '800' },
  muted: { color: colors.tertiary, fontSize: 13, lineHeight: 20, marginTop: 5 },
})
