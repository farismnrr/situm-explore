import type { SitumGeofencesResponse } from '#shared/situm-geofences'
import { getWorkspaceSitumClient } from '../../../../utils/workspace-situm'

export default defineEventHandler(async (event): Promise<SitumGeofencesResponse> => {
  const { client } = await getWorkspaceSitumClient(event, getRouterParam(event, 'workspaceId') || '')
  try {
    const result = await client.cartography.getGeofences()
    return { geofences: result.data.map(geofence => ({ id: geofence.id, buildingId: geofence.buildingId, floorId: geofence.floorId, name: geofence.name, type: geofence.type, info: geofence.info ?? '', geometric: geofence.geometric })) }
  } catch { throw createError({ statusCode: 502, statusMessage: 'Situm geofence data is unavailable.' }) }
})
