import { queryWorkspaceAnalytics } from '../../../../integrations/clickhouse/analytics'
import { ensureClickHouseSchema } from '../../../../integrations/clickhouse/schema'
import { isValidDateRange } from '../../../../utils/date-range'
import { requireOwnedWorkspace } from '../../../../utils/workspace-owner'

export default defineEventHandler(async (event) => {
  const workspaceId = await requireOwnedWorkspace(event, getRouterParam(event, 'workspaceId') || '')
  const q = getQuery(event), fromDate = String(q.fromDate || ''), toDate = String(q.toDate || '')
  if (!isValidDateRange(fromDate, toDate)) throw createError({ statusCode: 400, statusMessage: 'A valid date range is required.' })
  const rawBuildingId = q.buildingId === undefined || q.buildingId === '' ? undefined : Number(q.buildingId)
  if (rawBuildingId !== undefined && (!Number.isInteger(rawBuildingId) || rawBuildingId <= 0)) throw createError({ statusCode: 400, statusMessage: 'A valid buildingId is required.' })
  const rawGeofenceId = q.geofenceId === undefined || q.geofenceId === '' ? undefined : String(q.geofenceId)
  if (rawGeofenceId !== undefined && !/^[a-zA-Z0-9_-]{1,64}$/.test(rawGeofenceId)) throw createError({ statusCode: 400, statusMessage: 'A valid geofenceId is required.' })
  try { await ensureClickHouseSchema(); return await queryWorkspaceAnalytics(workspaceId, { fromDate, toDate, buildingId: rawBuildingId, geofenceId: rawGeofenceId }) } catch { throw createError({ statusCode: 503, statusMessage: 'Analytics data could not be read from ClickHouse.' }) }
})
