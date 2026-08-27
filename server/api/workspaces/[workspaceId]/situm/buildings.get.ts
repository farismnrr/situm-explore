import { getWorkspaceSitumClient } from '../../../../utils/workspace-situm'

export default defineEventHandler(async (event) => {
  const { client } = await getWorkspaceSitumClient(event, getRouterParam(event, 'workspaceId') || '')
  const buildings = await client.cartography.getBuildings({ view: 'compact' })
  return {
    buildings: buildings.map(building => ({ id: building.id, name: building.name }))
  }
})
