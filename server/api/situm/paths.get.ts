import type { SitumPathsResponse } from '#shared/situm-paths'
import { getSitumClient } from '../../integrations/situm/client'

export default defineEventHandler(async (event): Promise<SitumPathsResponse> => {
  await requireUserSession(event)
  return { paths: await getSitumClient().cartography.getPaths() }
})
