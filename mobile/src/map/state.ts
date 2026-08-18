export type PositionState = 'stopped' | 'starting' | 'fresh' | 'stale' | 'error'
export type LocationSnapshot<T> = { state: PositionState, location: T | null, receivedAt: number, workspaceId: string, buildingId: number }
export type NavigationOwnershipState = 'idle' | 'active' | 'outside-route' | 'arrived' | 'cancelled' | 'error'

export type FilterablePoi = { buildingId: number, name: string, categoryName?: string | null }
export type FloorDisplay = { id: number, buildingId: number, level: number, name?: string | null }

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

export function navigationIsOwned(state: NavigationOwnershipState, nativeNavigationRunning: boolean): boolean {
  return nativeNavigationRunning || state === 'active' || state === 'outside-route'
}

export function canStopGuidance(state: NavigationOwnershipState, nativeNavigationRunning = false): boolean {
  return navigationIsOwned(state, nativeNavigationRunning)
}
