import { and, eq } from 'drizzle-orm'
import { getDb } from '../../../db/client'
import { workspaceSitumConfigs, workspaces } from '../../../db/schema'
import { resolveMobilePositioningCredential } from '../../../utils/mobile-positioning'
import { assertWorkspaceId } from '../../../utils/workspace-owner'

export default defineEventHandler(async (event) => {
  const workspaceId = assertWorkspaceId(getRouterParam(event, 'workspaceId') || '')
  const session = await requireUserSession(event)
  return resolveMobilePositioningCredential({
    workspaceId,
    userId: session.user.id,
    findOwnedConfig: async (ownedWorkspaceId, ownerId) => {
      const [config] = await getDb().select({ encryptedViewerApiKey: workspaceSitumConfigs.encryptedViewerApiKey, situmAccountId: workspaceSitumConfigs.situmAccountId }).from(workspaceSitumConfigs).innerJoin(workspaces, eq(workspaces.id, workspaceSitumConfigs.workspaceId)).where(and(eq(workspaceSitumConfigs.workspaceId, ownedWorkspaceId), eq(workspaces.ownerId, ownerId))).limit(1)
      return config
    },
  })
})
