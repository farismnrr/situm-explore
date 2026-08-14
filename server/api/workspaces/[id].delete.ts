import { and, eq } from 'drizzle-orm'
import { getDb } from '../../db/client'
import { workspaces } from '../../db/schema'

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event)
  const id = getRouterParam(event, 'id')
  const [workspace] = await getDb().delete(workspaces).where(and(eq(workspaces.id, id || ''), eq(workspaces.ownerId, session.user.id))).returning({ id: workspaces.id })
  if (!workspace) throw createError({ statusCode: 404, statusMessage: 'Workspace not found.' })
  return { ok: true }
})
