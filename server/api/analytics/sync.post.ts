import { syncSitumReport, type AnalyticsReport } from '../../integrations/situm/reports'

export default defineEventHandler(async (event) => {
  await requireUserSession(event)
  const body = await readBody<{ report?: AnalyticsReport, fromDate?: string, toDate?: string, buildingId?: number, buildingIds?: number[], timeZone?: string, grouping?: string }>(event)
  if (!body || !['visitors', 'positioning_time', 'geofencing_stay_time'].includes(body.report || '')) throw createError({ statusCode: 400, statusMessage: 'A supported analytics report is required.' })
  if (!body.fromDate || !body.toDate || !/^\d{4}-\d{2}-\d{2}$/.test(body.fromDate) || !/^\d{4}-\d{2}-\d{2}$/.test(body.toDate) || body.fromDate > body.toDate) throw createError({ statusCode: 400, statusMessage: 'A valid date range is required.' })
  if (body.report === 'geofencing_stay_time' ? !body.buildingIds?.length : body.buildingId === undefined) throw createError({ statusCode: 400, statusMessage: 'A supported building filter is required.' })
  if (body.buildingId !== undefined && (!Number.isInteger(body.buildingId) || body.buildingId < 1)) throw createError({ statusCode: 400, statusMessage: 'Building ID must be a positive integer.' })
  if (body.buildingIds?.some(id => !Number.isInteger(id) || id < 1)) throw createError({ statusCode: 400, statusMessage: 'Building IDs must be positive integers.' })
  return syncSitumReport({ report: body.report!, fromDate: body.fromDate, toDate: body.toDate, buildingId: body.buildingId, buildingIds: body.buildingIds, timeZone: body.timeZone, grouping: body.grouping })
})
