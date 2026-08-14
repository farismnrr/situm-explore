import { and, eq } from 'drizzle-orm'
import { getDb } from '../../db/client'
import { workspaces } from '../../db/schema'

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event)
  return getDb().select({ id: workspaces.id, name: workspaces.name, createdAt: workspaces.createdAt, updatedAt: workspaces.updatedAt })
    .from(workspaces)
    .where(and(eq(workspaces.ownerId, session.user.id)))
    .orderBy(workspaces.createdAt)
})
