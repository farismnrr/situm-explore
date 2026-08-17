export type MapDeepLinkRequest = { requestId: number, buildingId: number | null }

export function createMapDeepLinkRequest(requestId: number, buildingId: number | null): MapDeepLinkRequest {
  return { requestId, buildingId }
}

export function consumeMapDeepLinkRequest(current: MapDeepLinkRequest | null, requestId: number): MapDeepLinkRequest | null {
  return current?.requestId === requestId ? null : current
}
