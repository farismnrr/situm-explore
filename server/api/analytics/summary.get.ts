import { queryAnalytics } from '../../integrations/clickhouse/analytics'

export default defineEventHandler(async (event) => {
  await requireUserSession(event)
  const q = getQuery(event)
  const fromDate = String(q.fromDate || ''), toDate = String(q.toDate || '')
  if (!/^\d{4}-\d{2}-\d{2}$/.test(fromDate) || !/^\d{4}-\d{2}-\d{2}$/.test(toDate) || fromDate > toDate || (Date.parse(toDate) - Date.parse(fromDate)) / 86400000 > 366) throw createError({ statusCode: 400, statusMessage: 'A valid date range is required.' })
  const buildingId = q.buildingId === undefined ? undefined : Number(q.buildingId)
  if (buildingId !== undefined && (!Number.isInteger(buildingId) || buildingId < 1)) throw createError({ statusCode: 400, statusMessage: 'Building ID must be a positive integer.' })
  const geofenceId = q.geofenceId === undefined ? undefined : String(q.geofenceId)
  if (geofenceId !== undefined && (!geofenceId || geofenceId.length > 128)) throw createError({ statusCode: 400, statusMessage: 'Geofence ID is invalid.' })
  try { return await queryAnalytics({ fromDate, toDate, buildingId, geofenceId }) } catch { throw createError({ statusCode: 503, statusMessage: 'Analytics data could not be read from ClickHouse.' }) }
})
