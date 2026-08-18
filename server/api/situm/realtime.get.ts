import type { SitumRealtimeResponse } from '#shared/situm-realtime'
import { normalizeSitumRealtimeFeatures } from '../../utils/situm-realtime'
import { getSitumClient } from '../../integrations/situm/client'

export default defineEventHandler(async (event): Promise<SitumRealtimeResponse> => {
  await requireUserSession(event)
  const result = await getSitumClient().realtime.getPositions()
  return { positions: normalizeSitumRealtimeFeatures(result.features) }
})
