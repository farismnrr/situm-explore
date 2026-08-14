import type { SitumGroupsResponse } from '#shared/situm-groups-alarms'
import { getSitumGroups } from '../../../../integrations/situm/groups-alarms'
import { getWorkspaceSitumApiKey } from '../../../../utils/workspace-situm'

export default defineEventHandler(async (event): Promise<SitumGroupsResponse> => {
  const apiKey = await getWorkspaceSitumApiKey(event, getRouterParam(event, 'workspaceId') || '')
  const raw = getQuery(event).has_parent
  if (raw !== undefined && raw !== 'true' && raw !== 'false') throw createError({ statusCode: 400, statusMessage: 'has_parent must be a boolean.' })
  return { groups: await getSitumGroups(apiKey, raw === undefined ? undefined : raw === 'true') }
})
