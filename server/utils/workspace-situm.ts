import SitumSDK from '@situm/sdk-js'
import { and, eq } from 'drizzle-orm'
import { getDb } from '../db/client'
import { workspaceSitumConfigs, workspaces } from '../db/schema'
import { decryptWorkspaceApiKey } from './workspace-credentials'
import { assertWorkspaceId } from './workspace-owner'

export async function getWorkspaceSitumClient(event: Parameters<typeof requireUserSession>[0], workspaceId: string) {
  workspaceId = assertWorkspaceId(workspaceId)
  const session = await requireUserSession(event)
  const [config] = await getDb().select({ workspaceId: workspaceSitumConfigs.workspaceId, situmAccountId: workspaceSitumConfigs.situmAccountId, encryptedApiKey: workspaceSitumConfigs.encryptedApiKey }).from(workspaceSitumConfigs).innerJoin(workspaces, eq(workspaceSitumConfigs.workspaceId, workspaces.id)).where(and(eq(workspaces.id, workspaceId), eq(workspaces.ownerId, session.user.id))).limit(1)
  if (!config) throw createError({ statusCode: 404, statusMessage: 'Workspace Situm configuration not found.' })
  return { client: new SitumSDK({ auth: { apiKey: decryptWorkspaceApiKey(config.encryptedApiKey) }, compact: true }), situmAccountId: config.situmAccountId }
}

export async function getWorkspaceSitumApiKey(event: Parameters<typeof requireUserSession>[0], workspaceId: string) {
  workspaceId = assertWorkspaceId(workspaceId)
  const session = await requireUserSession(event)
  const [config] = await getDb().select({ encryptedApiKey: workspaceSitumConfigs.encryptedApiKey }).from(workspaceSitumConfigs).innerJoin(workspaces, eq(workspaceSitumConfigs.workspaceId, workspaces.id)).where(and(eq(workspaces.id, workspaceId), eq(workspaces.ownerId, session.user.id))).limit(1)
  if (!config) throw createError({ statusCode: 404, statusMessage: 'Workspace Situm configuration not found.' })
  return decryptWorkspaceApiKey(config.encryptedApiKey)
}
