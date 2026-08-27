import SitumSDK, { SitumApiPermissionLevel } from '@situm/sdk-js'
import { and, eq } from 'drizzle-orm'
import { z } from 'zod'
import { getDb } from '../../db/client'
import { workspaceSitumConfigs, workspaces } from '../../db/schema'
import { resolveMobilePositioningCredential } from '../../utils/mobile-positioning'
import { issueWorkspaceViewerApiKey } from '../../utils/viewer-auth'
import { encryptWorkspaceApiKey } from '../../utils/workspace-credentials'
import { assertWorkspaceId } from '../../utils/workspace-owner'

const credential = z.string().min(1).max(4096)
const schema = z.object({
  apiKey: credential.optional(),
  viewerApiKey: credential.optional(),
}).strict().refine(value => Boolean(value.apiKey || value.viewerApiKey), { message: 'At least one credential is required.' })

type VerifiedCredential = { organizationId: string, apiPermissionLevel: SitumApiPermissionLevel }

async function verifyCredential(apiKey: string, expectedPermission: SitumApiPermissionLevel, label: 'Only Read API key' | 'Read & Write API key'): Promise<VerifiedCredential> {
  try {
    const sdk = new SitumSDK({ auth: { apiKey }, compact: true })
    const session = await sdk.authSession
    if (!session.organizationId) throw new Error('Credential has no organization')
    if (session.apiPermissionLevel !== expectedPermission) {
      throw createError({ statusCode: 422, statusMessage: `${label} has the wrong Situm permission. Use ${expectedPermission === SitumApiPermissionLevel.READ_ONLY ? 'an Only Read' : 'a Read & Write'} key.` })
    }
    return session
  } catch (error: unknown) {
    if ((error as { statusCode?: number }).statusCode === 422) throw error
    throw createError({ statusCode: 422, statusMessage: `${label} could not be verified. Check that the key is active and copied correctly.` })
  }
}

export default defineEventHandler(async (event) => {
  const parts = (getRouterParam(event, 'workspacePath') || '').split('/').filter(Boolean)
  if (parts.length === 2 && parts[1] === 'viewer-auth') {
    if (getMethod(event) !== 'GET') throw createError({ statusCode: 405, statusMessage: 'Method not allowed.' })
    return issueWorkspaceViewerApiKey(event, parts[0] || '')
  }
  if (parts.length === 2 && parts[1] === 'mobile-positioning') {
    if (getMethod(event) !== 'GET') throw createError({ statusCode: 405, statusMessage: 'Method not allowed.' })
    const workspaceId = assertWorkspaceId(parts[0] || '')
    const session = await requireUserSession(event)
    return resolveMobilePositioningCredential({
      workspaceId,
      userId: session.user.id,
      findOwnedConfig: async (ownedWorkspaceId, ownerId) => {
        const [config] = await getDb().select({ encryptedViewerApiKey: workspaceSitumConfigs.encryptedViewerApiKey, situmAccountId: workspaceSitumConfigs.situmAccountId }).from(workspaceSitumConfigs).innerJoin(workspaces, eq(workspaces.id, workspaceSitumConfigs.workspaceId)).where(and(eq(workspaceSitumConfigs.workspaceId, ownedWorkspaceId), eq(workspaces.ownerId, ownerId))).limit(1)
        return config
      },
    })
  }
  if (parts.length !== 2 || parts[1] !== 'situm-config') throw createError({ statusCode: 404, statusMessage: 'The requested resource was not found.' })
  const workspaceId = assertWorkspaceId(parts[0] || '')
  const session = await requireUserSession(event)
  const [owned] = await getDb().select({ id: workspaces.id }).from(workspaces).where(and(eq(workspaces.id, workspaceId), eq(workspaces.ownerId, session.user.id))).limit(1)
  if (!owned) throw createError({ statusCode: 404, statusMessage: 'Workspace not found.' })

  if (getMethod(event) === 'GET') {
    const [config] = await getDb().select({
      id: workspaceSitumConfigs.id,
      workspaceId: workspaceSitumConfigs.workspaceId,
      situmAccountId: workspaceSitumConfigs.situmAccountId,
      readWriteConfigured: workspaceSitumConfigs.encryptedApiKey,
      readOnlyConfigured: workspaceSitumConfigs.encryptedViewerApiKey,
      updatedAt: workspaceSitumConfigs.updatedAt,
    }).from(workspaceSitumConfigs).where(eq(workspaceSitumConfigs.workspaceId, workspaceId)).limit(1)
    if (!config) throw createError({ statusCode: 404, statusMessage: 'Situm configuration not found.' })
    return {
      ...config,
      configured: Boolean(config.readWriteConfigured || config.readOnlyConfigured),
      readWriteConfigured: Boolean(config.readWriteConfigured),
      readOnlyConfigured: Boolean(config.readOnlyConfigured),
    }
  }

  if (getMethod(event) === 'DELETE') {
    const [config] = await getDb().delete(workspaceSitumConfigs).where(eq(workspaceSitumConfigs.workspaceId, workspaceId)).returning({ id: workspaceSitumConfigs.id })
    if (!config) throw createError({ statusCode: 404, statusMessage: 'Situm configuration not found.' })
    return { ok: true }
  }

  if (getMethod(event) !== 'PUT') throw createError({ statusCode: 405, statusMessage: 'Method not allowed.' })
  const parsed = schema.safeParse(await readBody(event))
  if (!parsed.success) throw createError({ statusCode: 400, statusMessage: 'Add an Only Read or Read & Write Situm API key to save.' })

  const [existing] = await getDb().select({ situmAccountId: workspaceSitumConfigs.situmAccountId }).from(workspaceSitumConfigs).where(eq(workspaceSitumConfigs.workspaceId, workspaceId)).limit(1)
  const [readWriteSession, readOnlySession] = await Promise.all([
    parsed.data.apiKey ? verifyCredential(parsed.data.apiKey, SitumApiPermissionLevel.READ_WRITE, 'Read & Write API key') : null,
    parsed.data.viewerApiKey ? verifyCredential(parsed.data.viewerApiKey, SitumApiPermissionLevel.READ_ONLY, 'Only Read API key') : null,
  ])
  const organizationIds = [readWriteSession?.organizationId, readOnlySession?.organizationId].filter((value): value is string => Boolean(value))
  const situmAccountId = existing?.situmAccountId || organizationIds[0]
  if (!situmAccountId) throw createError({ statusCode: 422, statusMessage: 'The Situm organization could not be determined from the supplied API key.' })
  if (organizationIds.some(id => id !== situmAccountId)) throw createError({ statusCode: 422, statusMessage: 'Only Read and Read & Write API keys must belong to the same Situm organization.' })

  const encryptedApiKey = parsed.data.apiKey ? encryptWorkspaceApiKey(parsed.data.apiKey) : undefined
  const encryptedViewerApiKey = parsed.data.viewerApiKey ? encryptWorkspaceApiKey(parsed.data.viewerApiKey) : undefined
  const [config] = await getDb().insert(workspaceSitumConfigs).values({
    workspaceId,
    situmAccountId,
    ...(encryptedApiKey ? { encryptedApiKey } : {}),
    ...(encryptedViewerApiKey ? { encryptedViewerApiKey } : {}),
  }).onConflictDoUpdate({
    target: workspaceSitumConfigs.workspaceId,
    set: {
      situmAccountId,
      ...(encryptedApiKey ? { encryptedApiKey } : {}),
      ...(encryptedViewerApiKey ? { encryptedViewerApiKey } : {}),
      updatedAt: new Date(),
    },
  }).returning({
    id: workspaceSitumConfigs.id,
    workspaceId: workspaceSitumConfigs.workspaceId,
    situmAccountId: workspaceSitumConfigs.situmAccountId,
    encryptedApiKey: workspaceSitumConfigs.encryptedApiKey,
    encryptedViewerApiKey: workspaceSitumConfigs.encryptedViewerApiKey,
    updatedAt: workspaceSitumConfigs.updatedAt,
  })
  if (!config) throw createError({ statusCode: 500, statusMessage: 'Unable to save Situm configuration.' })
  return {
    id: config.id,
    workspaceId: config.workspaceId,
    situmAccountId: config.situmAccountId,
    updatedAt: config.updatedAt,
    configured: Boolean(config.encryptedApiKey || config.encryptedViewerApiKey),
    readWriteConfigured: Boolean(config.encryptedApiKey),
    readOnlyConfigured: Boolean(config.encryptedViewerApiKey),
  }
})
