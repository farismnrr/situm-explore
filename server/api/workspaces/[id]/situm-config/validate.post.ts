import SitumSDK from '@situm/sdk-js'
import { and, eq } from 'drizzle-orm'
import { getDb } from '../../../../db/client'
import { workspaceSitumConfigs, workspaces } from '../../../../db/schema'
import { decryptWorkspaceApiKey } from '../../../../utils/workspace-credentials'

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event)
  const workspaceId = getRouterParam(event, 'id') || ''
  const [config] = await getDb().select({ situmAccountId: workspaceSitumConfigs.situmAccountId, encryptedApiKey: workspaceSitumConfigs.encryptedApiKey }).from(workspaceSitumConfigs).innerJoin(workspaces, eq(workspaceSitumConfigs.workspaceId, workspaces.id)).where(and(eq(workspaceSitumConfigs.workspaceId, workspaceId), eq(workspaces.ownerId, session.user.id))).limit(1)
  if (!config) throw createError({ statusCode: 404, statusMessage: 'Situm configuration not found.' })

  let organization: { id: string }
  try {
    const sdk = new SitumSDK({ auth: { apiKey: decryptWorkspaceApiKey(config.encryptedApiKey) }, compact: true })
    organization = await sdk.cartography.getCurrentOrganization()
  } catch {
    throw createError({ statusCode: 422, statusMessage: 'Situm configuration could not be validated.' })
  }

  if (!organization.id || organization.id !== config.situmAccountId) throw createError({ statusCode: 422, statusMessage: 'Situm account context could not be validated.' })
  return { valid: true, status: 'validated', accountContext: 'matched' }
})
