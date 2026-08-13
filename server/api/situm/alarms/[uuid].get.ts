import type { SitumAlarmResponse } from '#shared/situm-groups-alarms'
import { getSitumAlarm } from '../../../integrations/situm/groups-alarms'

export default defineEventHandler(async (event): Promise<SitumAlarmResponse> => {
  await requireUserSession(event)
  const uuid = getRouterParam(event, 'uuid')
  if (!uuid) throw createError({ statusCode: 400, statusMessage: 'Alarm identifier is required.' })
  return { alarm: await getSitumAlarm(uuid) }
})
