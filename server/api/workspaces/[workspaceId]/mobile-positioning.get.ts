import { and, eq } from 'drizzle-orm'
import { getDb } from '../../../db/client'
import { workspaceSitumConfigs, workspaces } from '../../../db/schema'
import { decryptWorkspaceApiKey } from '../../../utils/workspace-credentials'
import { assertWorkspaceId } from '../../../utils/workspace-owner'

export default defineEventHandler(async (event) => {
  const workspaceId = assertWorkspaceId(getRouterParam(event, 'workspaceId') || '')
  const session = await requireUserSession(event)
  const [config] = await getDb().select({ encryptedPositioningApiKey: workspaceSitumConfigs.encryptedPositioningApiKey, situmAccountId: workspaceSitumConfigs.situmAccountId }).from(workspaceSitumConfigs).innerJoin(workspaces, eq(workspaces.id, workspaceSitumConfigs.workspaceId)).where(and(eq(workspaceSitumConfigs.workspaceId, workspaceId), eq(workspaces.ownerId, session.user.id))).limit(1)
  if (!config) throw createError({ statusCode: 404, statusMessage: 'Workspace Situm configuration not found.' })
  if (!config.encryptedPositioningApiKey) throw createError({ statusCode: 409, statusMessage: 'Mobile positioning is not configured for this workspace.' })
  return { configured: true, workspaceId, situmAccountId: config.situmAccountId, apiKey: decryptWorkspaceApiKey(config.encryptedPositioningApiKey) }
})
