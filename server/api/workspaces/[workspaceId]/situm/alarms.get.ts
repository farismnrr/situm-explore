import type { SitumAlarmsResponse } from '#shared/situm-groups-alarms'
import { getSitumAlarms, isSupportedAlarmType } from '../../../../integrations/situm/groups-alarms'
import { getWorkspaceSitumApiKey } from '../../../../utils/workspace-situm'

export default defineEventHandler(async (event): Promise<SitumAlarmsResponse> => {
  const apiKey = await getWorkspaceSitumApiKey(event, getRouterParam(event, 'workspaceId') || '')
  const query = getQuery(event); const buildingId = query.building_id
  if (typeof buildingId !== 'string' || !/^\d+$/.test(buildingId) || Number(buildingId) < 1) throw createError({ statusCode: 400, statusMessage: 'A positive building identifier is required.' })
  const params = new URLSearchParams({ building_id: buildingId })
  for (const key of ['organization_id', 'created_by', 'startDate', 'endDate', 'secondsFromCreation']) if (query[key] !== undefined && typeof query[key] === 'string' && query[key]) params.set(key, query[key] as string)
  if (query.active === 'true' || query.active === 'false') params.set('active', query.active as string)
  if (query.type !== undefined) for (const type of (Array.isArray(query.type) ? query.type : [query.type])) if (typeof type === 'string' && isSupportedAlarmType(type)) params.append('type', type)
  return { alarms: await getSitumAlarms(apiKey, params) }
})
