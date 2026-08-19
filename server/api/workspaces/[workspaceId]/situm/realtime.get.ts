import type { SitumRealtimeResponse } from '#shared/situm-realtime'
import { normalizeSitumRealtimeFeaturesWithStats } from '../../../../utils/situm-realtime'
import { withServerSpan } from '../../../../utils/telemetry'
import { getWorkspaceSitumClient } from '../../../../utils/workspace-situm'

export default defineEventHandler(async (event): Promise<SitumRealtimeResponse> => {
  const { client } = await getWorkspaceSitumClient(event, getRouterParam(event, 'workspaceId') || '')
  const result = await withServerSpan(event, 'situm.realtime.get_positions', {}, () => client.realtime.getPositions())
  const normalized = normalizeSitumRealtimeFeaturesWithStats(result.features)
  await withServerSpan(event, 'situm.realtime.normalize', {
    'situm.realtime.feature_count': normalized.inputCount,
    'situm.realtime.accepted_count': normalized.acceptedCount,
    'situm.realtime.dropped_count': normalized.droppedCount,
  }, async () => undefined)
  return { positions: normalized.positions }
})
