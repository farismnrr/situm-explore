export type NativeDestination = 'map' | 'realtime'

export interface NativeDeepLink {
  destination: NativeDestination
  workspaceId?: string
  buildingId?: number
}

function safeWorkspaceId(value: string | null) {
  return value && /^[a-zA-Z0-9_-]{1,128}$/.test(value) ? value : undefined
}

function safeBuildingId(value: string | null) {
  if (!value || !/^\d{1,12}$/.test(value)) return undefined
  const id = Number(value)
  return Number.isSafeInteger(id) && id > 0 ? id : undefined
}

export function parseNativeDeepLink(raw: string | null | undefined): NativeDeepLink | null {
  if (!raw) return null
  let url: URL
  try { url = new URL(raw) } catch { return null }
  const scheme = url.protocol.toLowerCase()
  const customScheme = scheme === 'situm-explore:' || scheme === 'situm-explore-dev:' || scheme === 'situm-explore-staging:'
  if (!customScheme && scheme !== 'https:') return null
  const parts = [url.hostname, ...url.pathname.split('/').filter(Boolean)].filter(Boolean)
  if (parts[0] === 'app') parts.shift()
  const route = parts.at(-1)
  if (route !== 'map' && route !== 'realtime') return null
  const destination = route === 'realtime' ? 'realtime' : 'map'
  const link: NativeDeepLink = {
    destination,
    ...(safeWorkspaceId(url.searchParams.get('workspaceId')) ? { workspaceId: safeWorkspaceId(url.searchParams.get('workspaceId')) } : {}),
    ...(destination === 'map' && safeBuildingId(url.searchParams.get('buildingId')) ? { buildingId: safeBuildingId(url.searchParams.get('buildingId')) } : {})
  }
  return link
}

export function nativeDestinationFromLink(link: NativeDeepLink | null): 'explore' | 'realtime' {
  return link?.destination === 'realtime' ? 'realtime' : 'explore'
}
