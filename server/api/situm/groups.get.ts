import type { SitumGroupsResponse } from '#shared/situm-groups-alarms'
import { getSitumGroups } from '../../integrations/situm/groups-alarms'

export default defineEventHandler(async (event): Promise<SitumGroupsResponse> => {
  await requireUserSession(event)
  const query = getQuery(event)
  const raw = query.has_parent
  if (raw !== undefined && raw !== 'true' && raw !== 'false') throw createError({ statusCode: 400, statusMessage: 'has_parent must be a boolean.' })
  return { groups: await getSitumGroups(raw === undefined ? undefined : raw === 'true') }
})
