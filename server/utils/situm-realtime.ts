import type { SitumRealtimePosition } from '#shared/situm-realtime'

type RealtimeFeature = {
  properties?: { deviceId?: unknown, time?: unknown, buildingId?: unknown, floorId?: unknown, accuracy?: unknown }
  geometry?: { coordinates?: unknown }
}

function normalizeTime(value: unknown): string | null {
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? null : value.toISOString()
  if (typeof value !== 'string' && typeof value !== 'number') return null
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : date.toISOString()
}

export function normalizeSitumRealtimeFeature(feature: RealtimeFeature, index: number): SitumRealtimePosition | null {
  const properties = feature.properties
  const coordinates = feature.geometry?.coordinates
  if (!properties || !Array.isArray(coordinates) || coordinates.length < 2) return null
  const buildingId = Number(properties.buildingId)
  const floorId = Number(properties.floorId)
  const accuracy = Number(properties.accuracy)
  const lng = Number(coordinates[0])
  const lat = Number(coordinates[1])
  const time = normalizeTime(properties.time)
  if (![buildingId, floorId, accuracy, lat, lng].every(Number.isFinite) || !time) return null
  const deviceId = typeof properties.deviceId === 'string' && properties.deviceId.trim() ? properties.deviceId : undefined
  return { id: deviceId || `${buildingId}-${floorId}-${index}`, time, buildingId, floorId, accuracy, lat, lng, ...(deviceId ? { deviceId } : {}) }
}

export function normalizeSitumRealtimeFeatures(features: unknown): SitumRealtimePosition[] {
  if (!Array.isArray(features)) return []
  return features.map((feature, index) => normalizeSitumRealtimeFeature(feature as RealtimeFeature, index)).filter((position): position is SitumRealtimePosition => position !== null)
}
