import { and, eq } from 'drizzle-orm'
import { getDb } from '../db/client'
import { workspaces } from '../db/schema'

export async function requireOwnedWorkspace(event: Parameters<typeof requireUserSession>[0], workspaceId: string) {
  const session = await requireUserSession(event)
  const [workspace] = await getDb().select({ id: workspaces.id }).from(workspaces).where(and(eq(workspaces.id, workspaceId), eq(workspaces.ownerId, session.user.id))).limit(1)
  if (!workspace) throw createError({ statusCode: 404, statusMessage: 'Workspace not found.' })
  return workspace.id
}
