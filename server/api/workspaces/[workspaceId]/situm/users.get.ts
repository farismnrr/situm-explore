import { getWorkspaceSitumClient } from '../../../../utils/workspace-situm'

export default defineEventHandler(async (event) => {
  const { client } = await getWorkspaceSitumClient(event, getRouterParam(event, 'workspaceId') || '')
  const users = await client.user.getUsers()
  return { users: users.data.map(user => ({ id: user.id, email: user.email, fullName: user.fullName, role: user.role, buildingIds: user.buildingIds })) }
})
