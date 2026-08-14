import { and, eq } from 'drizzle-orm'
import { getDb } from '../db/client'
import { workspaces } from '../db/schema'

const workspaceIdPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

export function assertWorkspaceId(workspaceId: string): string {
  if (!workspaceIdPattern.test(workspaceId)) throw createError({ statusCode: 404, statusMessage: 'Workspace not found.' })
  return workspaceId
}

export async function requireOwnedWorkspace(event: Parameters<typeof requireUserSession>[0], workspaceId: string) {
  const validWorkspaceId = assertWorkspaceId(workspaceId)
  const session = await requireUserSession(event)
  const [workspace] = await getDb().select({ id: workspaces.id }).from(workspaces).where(and(eq(workspaces.id, validWorkspaceId), eq(workspaces.ownerId, session.user.id))).limit(1)
  if (!workspace) throw createError({ statusCode: 404, statusMessage: 'Workspace not found.' })
  return workspace.id
}
