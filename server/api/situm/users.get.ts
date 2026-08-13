import type { SitumUsersResponse } from '#shared/situm-users'
import { getSitumClient } from '../../integrations/situm/client'

export default defineEventHandler(async (event): Promise<SitumUsersResponse> => {
  await requireUserSession(event)
  const result = await getSitumClient().user.getUsers()
  return { users: result.data.map(user => ({ id: user.id, email: user.email, fullName: user.fullName, role: user.role, buildingIds: user.buildingIds })) }
})
