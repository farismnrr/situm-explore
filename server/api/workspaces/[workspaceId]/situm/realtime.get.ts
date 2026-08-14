import type { SitumRealtimeResponse } from '#shared/situm-realtime'
import { getWorkspaceSitumClient } from '../../../../utils/workspace-situm'

export default defineEventHandler(async (event): Promise<SitumRealtimeResponse> => {
  const { client } = await getWorkspaceSitumClient(event, getRouterParam(event, 'workspaceId') || '')
  const result = await client.realtime.getPositions()
  return { positions: result.features.map((feature: { properties: { deviceId?: string, time: Date, buildingId: number, floorId: number, accuracy: number }, geometry: { coordinates: number[] } }, index: number) => ({ id: feature.properties.deviceId || `${feature.properties.buildingId}-${feature.properties.floorId}-${index}`, time: feature.properties.time.toISOString(), buildingId: feature.properties.buildingId, floorId: feature.properties.floorId, accuracy: feature.properties.accuracy, lat: feature.geometry.coordinates[1]!, lng: feature.geometry.coordinates[0]!, deviceId: feature.properties.deviceId })) }
})
