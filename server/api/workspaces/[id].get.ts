import { and, eq } from 'drizzle-orm'
import { getDb } from '../../db/client'
import { workspaces } from '../../db/schema'

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event)
  const id = getRouterParam(event, 'id')
  const [workspace] = await getDb().select({ id: workspaces.id, name: workspaces.name, createdAt: workspaces.createdAt, updatedAt: workspaces.updatedAt }).from(workspaces).where(and(eq(workspaces.id, id || ''), eq(workspaces.ownerId, session.user.id))).limit(1)
  if (!workspace) throw createError({ statusCode: 404, statusMessage: 'Workspace not found.' })
  return workspace
})
