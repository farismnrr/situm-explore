import SitumSDK from '@situm/sdk-js'
import { and, eq } from 'drizzle-orm'
import { getDb } from '../../../../db/client'
import { workspaceSitumConfigs, workspaces } from '../../../../db/schema'
import { decryptWorkspaceApiKey } from '../../../../utils/workspace-credentials'
import { assertWorkspaceId } from '../../../../utils/workspace-owner'

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event)
  const workspaceId = assertWorkspaceId(getRouterParam(event, 'workspaceId') || '')
  const [config] = await getDb().select({ situmAccountId: workspaceSitumConfigs.situmAccountId, encryptedApiKey: workspaceSitumConfigs.encryptedApiKey }).from(workspaceSitumConfigs).innerJoin(workspaces, eq(workspaceSitumConfigs.workspaceId, workspaces.id)).where(and(eq(workspaceSitumConfigs.workspaceId, workspaceId), eq(workspaces.ownerId, session.user.id))).limit(1)
  if (!config) throw createError({ statusCode: 404, statusMessage: 'Situm configuration not found.' })
  try {
    const sdk = new SitumSDK({ auth: { apiKey: decryptWorkspaceApiKey(config.encryptedApiKey) }, compact: true })
    const organization = await sdk.cartography.getCurrentOrganization()
    if (!organization.id || organization.id !== config.situmAccountId) throw new Error('Account context mismatch')
  } catch {
    throw createError({ statusCode: 422, statusMessage: 'Situm configuration could not be validated.' })
  }
  return { valid: true, status: 'validated', accountContext: 'matched' }
})
