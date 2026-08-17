export type PositionState = 'stopped' | 'starting' | 'fresh' | 'stale' | 'error'
export type LocationSnapshot<T> = { state: PositionState, location: T | null, receivedAt: number, workspaceId: string, buildingId: number }

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
