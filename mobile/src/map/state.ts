export type PositionState = 'stopped' | 'starting' | 'fresh' | 'stale' | 'error'
export type LocationSnapshot<T> = { state: PositionState, location: T | null, receivedAt: number, workspaceId: string, buildingId: number }
export type NavigationOwnershipState = 'idle' | 'active' | 'outside-route' | 'arrived' | 'cancelled' | 'error'
export type GuidanceState = 'browse' | 'positioning-starting' | 'positioning-active' | 'guidance-following' | 'guidance-free-pan' | 'outside-route' | 'arrived' | 'cancelled' | 'error'

export type FilterablePoi = { buildingId: number, name: string, categoryName?: string | null }
export type FloorDisplay = { id: number, buildingId: number, level: number, name?: string | null }
export type GuidanceIndication = { indicationType?: string | null, orientationType?: string | null, neededLevelChange?: boolean | null }

export const locationFreshnessWindowMs = 30_000

export function positionStateForLocationStatus(statusName: string): PositionState {
  if (statusName === 'STOPPED') return 'stopped'
  if (statusName === 'USER_NOT_IN_BUILDING') return 'error'
  return 'starting'
}

export function isCurrentLocationUsable<T>(snapshot: LocationSnapshot<T> | null, workspaceId: string, buildingId: number, now = Date.now()): boolean {
  return Boolean(snapshot && snapshot.state === 'fresh' && snapshot.location && snapshot.workspaceId === workspaceId && snapshot.buildingId === buildingId && now - snapshot.receivedAt <= locationFreshnessWindowMs)
}

export function resolvePoi<T extends { id: number, buildingId: number }>(pois: T[], identifier: number, buildingId: number): T | null {
  return pois.find(poi => poi.id === identifier && poi.buildingId === buildingId) ?? null
}

export function filterPois<T extends FilterablePoi>(pois: T[], buildingId: number | null, query: string): T[] {
  const normalized = query.trim().toLowerCase()
  return pois.filter(poi => poi.buildingId === buildingId && (!normalized || `${poi.name} ${poi.categoryName || ''}`.toLowerCase().includes(normalized)))
}

export function resolveFloorDisplay<T extends FloorDisplay>(floors: T[], floorId: number, buildingId: number): string | null {
  const floor = floors.find(candidate => candidate.id === floorId && candidate.buildingId === buildingId)
  if (!floor) return null
  return floor.name?.trim() || `Level ${floor.level}`
}

export function formatNavigationDistance(distanceMeters: number | null | undefined): string | null {
  if (distanceMeters == null || !Number.isFinite(distanceMeters) || distanceMeters < 0) return null
  if (distanceMeters < 1000) return `${Math.max(0, Math.round(distanceMeters))} m`
  const kilometers = distanceMeters / 1000
  return `${kilometers >= 10 ? Math.round(kilometers) : kilometers.toFixed(1)} km`
}

export function formatNavigationEta(timeSeconds: number | null | undefined): string | null {
  if (timeSeconds == null || !Number.isFinite(timeSeconds) || timeSeconds < 0) return null
  if (timeSeconds < 60) return '<1 min'
  const minutes = Math.ceil(timeSeconds / 60)
  if (minutes < 60) return `${minutes} min`
  const hours = Math.floor(minutes / 60)
  const remainder = minutes % 60
  return remainder ? `${hours} h ${remainder} min` : `${hours} h`
}

export function guidanceInstructionForIndication(indication: GuidanceIndication | null | undefined): string | null {
  if (!indication) return null
  const action = indication.indicationType?.trim().toUpperCase()
  const orientation = indication.orientationType?.trim().toUpperCase()

  if (action === 'END') return 'Arrive at destination'
  if (action === 'CHANGE_FLOOR' || indication.neededLevelChange) return 'Change floor'
  if (action === 'GO_AHEAD' || action === 'PASS_THROUGH') return 'Continue straight'
  if (action !== 'TURN') return null

  if (orientation === 'RIGHT') return 'Turn right'
  if (orientation === 'SHARP_RIGHT') return 'Turn sharply right'
  if (orientation === 'VEER_RIGHT') return 'Keep right'
  if (orientation === 'LEFT') return 'Turn left'
  if (orientation === 'SHARP_LEFT') return 'Turn sharply left'
  if (orientation === 'VEER_LEFT') return 'Keep left'
  if (orientation === 'BACKWARD') return 'Turn around'
  if (orientation === 'STRAIGHT') return 'Continue straight'
  return 'Continue on route'
}

export function navigationIsOwned(state: NavigationOwnershipState, nativeNavigationRunning: boolean): boolean {
  return nativeNavigationRunning || state === 'active' || state === 'outside-route'
}

export function canStopGuidance(state: NavigationOwnershipState, nativeNavigationRunning = false): boolean {
  return navigationIsOwned(state, nativeNavigationRunning)
}

export function guidanceStateForNavigation(state: NavigationOwnershipState): GuidanceState {
  if (state === 'active') return 'guidance-following'
  if (state === 'outside-route') return 'outside-route'
  if (state === 'arrived') return 'arrived'
  if (state === 'cancelled') return 'cancelled'
  if (state === 'error') return 'error'
  return 'browse'
}

export function guidanceStateAfterRecenter(state: GuidanceState): GuidanceState {
  return state === 'guidance-free-pan' ? 'guidance-following' : state
}
