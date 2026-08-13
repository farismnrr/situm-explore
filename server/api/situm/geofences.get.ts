import type { SitumGeofencesResponse } from '#shared/situm-geofences'
import { getSitumClient } from '../../integrations/situm/client'

export default defineEventHandler(async (event): Promise<SitumGeofencesResponse> => {
  await requireUserSession(event)
  const result = await getSitumClient().cartography.getGeofences()
  return { geofences: result.data.map(geofence => ({ id: geofence.id, buildingId: geofence.buildingId, floorId: geofence.floorId, name: geofence.name, type: geofence.type, info: geofence.info ?? '', geometric: geofence.geometric })) }
})
