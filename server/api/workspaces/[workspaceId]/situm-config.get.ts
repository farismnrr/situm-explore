import { and, eq } from 'drizzle-orm'
import { getDb } from '../../../db/client'
import { workspaceSitumConfigs, workspaces } from '../../../db/schema'

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event)
  const workspaceId = getRouterParam(event, 'workspaceId') || ''
  const [config] = await getDb().select({ id: workspaceSitumConfigs.id, workspaceId: workspaceSitumConfigs.workspaceId, accessMode: workspaceSitumConfigs.accessMode, situmAccountId: workspaceSitumConfigs.situmAccountId, configured: workspaceSitumConfigs.id, updatedAt: workspaceSitumConfigs.updatedAt }).from(workspaceSitumConfigs).innerJoin(workspaces, eq(workspaceSitumConfigs.workspaceId, workspaces.id)).where(and(eq(workspaceSitumConfigs.workspaceId, workspaceId), eq(workspaces.ownerId, session.user.id))).limit(1)
  if (!config) throw createError({ statusCode: 404, statusMessage: 'Situm configuration not found.' })
  return { ...config, configured: Boolean(config.configured) }
})
