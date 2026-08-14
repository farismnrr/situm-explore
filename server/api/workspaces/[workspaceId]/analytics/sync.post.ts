import { syncSitumReport, type AnalyticsReport } from '../../../../integrations/situm/reports'
import { isValidDateRange } from '../../../../utils/date-range'
import { requireOwnedWorkspace } from '../../../../utils/workspace-owner'
import { getWorkspaceSitumApiKey } from '../../../../utils/workspace-situm'

export default defineEventHandler(async (event) => {
  const workspaceId = await requireOwnedWorkspace(event, getRouterParam(event, 'workspaceId') || '')
  const apiKey = await getWorkspaceSitumApiKey(event, workspaceId)
  const body = await readBody<{ report?: AnalyticsReport, fromDate?: string, toDate?: string, buildingId?: number, buildingIds?: number[] }>(event)
  if (!body?.report || !['visitors', 'positioning_time', 'geofencing_stay_time'].includes(body.report) || !body.fromDate || !body.toDate || !isValidDateRange(body.fromDate, body.toDate)) throw createError({ statusCode: 400, statusMessage: 'A valid analytics sync request is required.' })
  return syncSitumReport({ workspaceId, apiKey, report: body.report, fromDate: body.fromDate, toDate: body.toDate, buildingId: body.buildingId, buildingIds: body.buildingIds })
})
