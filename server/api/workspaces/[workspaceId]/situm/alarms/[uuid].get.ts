import type { SitumAlarmResponse } from '#shared/situm-groups-alarms'
import { getSitumAlarm } from '../../../../../integrations/situm/groups-alarms'
import { getWorkspaceSitumApiKey } from '../../../../../utils/workspace-situm'

export default defineEventHandler(async (event): Promise<SitumAlarmResponse> => {
  const apiKey = await getWorkspaceSitumApiKey(event, getRouterParam(event, 'workspaceId') || '')
  const uuid = getRouterParam(event, 'uuid')
  if (!uuid) throw createError({ statusCode: 400, statusMessage: 'Alarm identifier is required.' })
  return { alarm: await getSitumAlarm(apiKey, uuid) }
})
