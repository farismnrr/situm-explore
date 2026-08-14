import { queryWorkspaceAnalytics } from '../../../../integrations/clickhouse/analytics'
import { isValidDateRange } from '../../../../utils/date-range'
import { requireOwnedWorkspace } from '../../../../utils/workspace-owner'

export default defineEventHandler(async (event) => {
  const workspaceId = await requireOwnedWorkspace(event, getRouterParam(event, 'workspaceId') || '')
  const q = getQuery(event), fromDate = String(q.fromDate || ''), toDate = String(q.toDate || '')
  if (!isValidDateRange(fromDate, toDate)) throw createError({ statusCode: 400, statusMessage: 'A valid date range is required.' })
  try { return await queryWorkspaceAnalytics(workspaceId, { fromDate, toDate }) } catch { throw createError({ statusCode: 503, statusMessage: 'Analytics data could not be read from ClickHouse.' }) }
})
