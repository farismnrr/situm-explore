import type { SitumAlarmsResponse } from '#shared/situm-groups-alarms'
import { getSitumAlarms, isSupportedAlarmType } from '../../integrations/situm/groups-alarms'

export default defineEventHandler(async (event): Promise<SitumAlarmsResponse> => {
  await requireUserSession(event)
  const query = getQuery(event)
  const buildingId = query.building_id
  if (typeof buildingId !== 'string' || !/^\d+$/.test(buildingId)) throw createError({ statusCode: 400, statusMessage: 'building_id must be a numeric identifier.' })
  if (Number(buildingId) < 1) throw createError({ statusCode: 400, statusMessage: 'building_id must be a positive identifier.' })
  const params = new URLSearchParams({ building_id: buildingId })
  for (const key of ['organization_id', 'created_by', 'startDate', 'endDate', 'secondsFromCreation']) {
    if (query[key] !== undefined) { if (typeof query[key] !== 'string' || !query[key]) throw createError({ statusCode: 400, statusMessage: `${key} is invalid.` }); params.set(key, query[key] as string) }
  }
  for (const key of ['organization_id', 'created_by']) if (query[key] !== undefined && typeof query[key] === 'string' && !/^\d+$/.test(query[key])) throw createError({ statusCode: 400, statusMessage: `${key} must be numeric.` })
  if (query.secondsFromCreation !== undefined && (typeof query.secondsFromCreation !== 'string' || !/^\d+$/.test(query.secondsFromCreation))) throw createError({ statusCode: 400, statusMessage: 'secondsFromCreation must be a non-negative integer.' })
  const dates = ['startDate', 'endDate'].map(key => query[key]).filter((value): value is string => typeof value === 'string').map(value => Date.parse(value))
  if (dates.some(value => !Number.isFinite(value)) || (dates.length === 2 && dates[0] !== undefined && dates[1] !== undefined && dates[0] > dates[1])) throw createError({ statusCode: 400, statusMessage: 'startDate and endDate must be valid and ordered.' })
  if (query.active !== undefined) { if (query.active !== 'true' && query.active !== 'false') throw createError({ statusCode: 400, statusMessage: 'active must be a boolean.' }); params.set('active', query.active as string) }
  if (query.type !== undefined) { const types = Array.isArray(query.type) ? query.type : [query.type]; if (!types.every(type => typeof type === 'string' && isSupportedAlarmType(type))) throw createError({ statusCode: 400, statusMessage: 'type is unsupported.' }); types.forEach(type => params.append('type', type as string)) }
  return { alarms: await getSitumAlarms(params) }
})
