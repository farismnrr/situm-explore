import type { SitumRealtimePosition, SitumRealtimeResponse } from '../../../shared/situm-realtime'

export const realtimePollIntervalMs = 10_000
export const realtimeStaleAfterMs = 5 * 60 * 1000

export type RealtimeLoadState = 'idle' | 'loading' | 'ready' | 'empty' | 'error'
export type RealtimeFreshness = 'fresh' | 'older' | 'stale' | 'unknown'

export function isRealtimePosition(value: unknown): value is SitumRealtimePosition {
  if (!value || typeof value !== 'object') return false
  const position = value as Partial<SitumRealtimePosition>
  return typeof position.id === 'string' && position.id.length > 0 && typeof position.time === 'string' && Number.isFinite(Date.parse(position.time)) && typeof position.buildingId === 'number' && Number.isFinite(position.buildingId) && typeof position.floorId === 'number' && Number.isFinite(position.floorId) && typeof position.accuracy === 'number' && Number.isFinite(position.accuracy) && typeof position.lat === 'number' && Number.isFinite(position.lat) && typeof position.lng === 'number' && Number.isFinite(position.lng) && (position.deviceId === undefined || typeof position.deviceId === 'string')
}

export function normalizeRealtimeResponse(value: unknown): SitumRealtimePosition[] {
  if (!value || typeof value !== 'object' || !Array.isArray((value as Partial<SitumRealtimeResponse>).positions)) return []
  return (value as SitumRealtimeResponse).positions.filter(isRealtimePosition)
}

export function realtimeFreshness(time: string, now = Date.now()): RealtimeFreshness {
  const sourceTime = Date.parse(time)
  if (!Number.isFinite(sourceTime)) return 'unknown'
  const age = Math.max(0, now - sourceTime)
  if (age <= 60_000) return 'fresh'
  if (age <= realtimeStaleAfterMs) return 'older'
  return 'stale'
}

export function formatSourceTime(time: string, locale = 'en-US') {
  const sourceTime = Date.parse(time)
  if (!Number.isFinite(sourceTime)) return 'Source time unavailable'
  return new Intl.DateTimeFormat(locale, { dateStyle: 'short', timeStyle: 'short' }).format(sourceTime)
}
