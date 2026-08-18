import type { SitumRealtimeResponse } from '#shared/situm-realtime'
import { normalizeSitumRealtimeFeatures } from '../../../../utils/situm-realtime'
import { getWorkspaceSitumClient } from '../../../../utils/workspace-situm'

export default defineEventHandler(async (event): Promise<SitumRealtimeResponse> => {
  const { client } = await getWorkspaceSitumClient(event, getRouterParam(event, 'workspaceId') || '')
  const result = await client.realtime.getPositions()
  return { positions: normalizeSitumRealtimeFeatures(result.features) }
})
