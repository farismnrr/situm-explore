import type { SitumCartographyResponse } from '#shared/situm-cartography'
import { getWorkspaceSitumClient } from '../../../../utils/workspace-situm'

export default defineEventHandler(async (event): Promise<SitumCartographyResponse> => {
  const { client } = await getWorkspaceSitumClient(event, getRouterParam(event, 'workspaceId') || '')
  const [buildings, floors, categories, pois] = await Promise.all([
    client.cartography.getBuildings({ view: 'compact' }),
    client.cartography.getFloors(),
    client.cartography.getPoiCategories(),
    client.cartography.getPois({ view: 'compact' }),
  ])
  return {
    buildings: buildings.map(building => ({ id: building.id, name: building.name, description: building.description ?? '', location: building.location, dimensions: building.dimensions, rotation: building.rotation })),
    floors: floors.map(floor => ({ id: floor.id, buildingId: floor.buildingId, level: floor.level, name: floor.name ?? `Level ${floor.level}`, mapUrl: (floor.maps as unknown as { mapUrl: string }).mapUrl })),
    categories: categories.map(category => ({ id: category.id, name: category.nameEn, code: category.code, iconUrl: category.iconUrl, selectedIconUrl: category.selectedIconUrl })),
    pois: pois.map(poi => ({ id: poi.id, buildingId: poi.buildingId, floorId: poi.floorId, name: poi.name, categoryId: poi.categoryId, categoryName: poi.categoryName, info: poi.info, type: poi.type, location: poi.location })),
  }
})
