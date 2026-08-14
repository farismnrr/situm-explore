import { and, eq } from 'drizzle-orm'
import { z } from 'zod'
import { getDb } from '../../db/client'
import { workspaceSitumConfigs, workspaces } from '../../db/schema'
import { encryptWorkspaceApiKey } from '../../utils/workspace-credentials'
import { assertWorkspaceId } from '../../utils/workspace-owner'
import { issueWorkspaceViewerJwt } from '../../utils/viewer-auth'
import SitumSDK, { SitumApiPermissionLevel } from '@situm/sdk-js'

const schema = z.object({ apiKey: z.string().min(1).max(4096), viewerApiKey: z.string().min(1).max(4096) }).strict()

export default defineEventHandler(async (event) => {
  const parts = (getRouterParam(event, 'workspacePath') || '').split('/').filter(Boolean)
  if (parts.length === 2 && parts[1] === 'viewer-auth') {
    if (getMethod(event) !== 'GET') throw createError({ statusCode: 405, statusMessage: 'Method not allowed.' })
    return issueWorkspaceViewerJwt(event, parts[0] || '')
  }
  if (parts.length !== 2 || parts[1] !== 'situm-config') throw createError({ statusCode: 404, statusMessage: 'The requested resource was not found.' })
  const workspaceId = assertWorkspaceId(parts[0] || '')
  const session = await requireUserSession(event)
  const [owned] = await getDb().select({ id: workspaces.id }).from(workspaces).where(and(eq(workspaces.id, workspaceId), eq(workspaces.ownerId, session.user.id))).limit(1)
  if (!owned) throw createError({ statusCode: 404, statusMessage: 'Workspace not found.' })

  if (getMethod(event) === 'GET') {
    const [config] = await getDb().select({ id: workspaceSitumConfigs.id, workspaceId: workspaceSitumConfigs.workspaceId, situmAccountId: workspaceSitumConfigs.situmAccountId, viewerConfigured: workspaceSitumConfigs.encryptedViewerApiKey, configured: workspaceSitumConfigs.id, updatedAt: workspaceSitumConfigs.updatedAt }).from(workspaceSitumConfigs).where(eq(workspaceSitumConfigs.workspaceId, workspaceId)).limit(1)
    if (!config) throw createError({ statusCode: 404, statusMessage: 'Situm configuration not found.' })
    return { ...config, configured: Boolean(config.configured), viewerConfigured: Boolean(config.viewerConfigured) }
  }

  if (getMethod(event) !== 'PUT') throw createError({ statusCode: 405, statusMessage: 'Method not allowed.' })
  const parsed = schema.safeParse(await readBody(event))
  if (!parsed.success) throw createError({ statusCode: 400, statusMessage: 'Valid Situm configuration is required.' })
  let primarySession: { organizationId: string, apiPermissionLevel: SitumApiPermissionLevel }
  try {
    const primary = new SitumSDK({ auth: { apiKey: parsed.data.apiKey }, compact: true })
    primarySession = await primary.authSession
    if (primarySession.apiPermissionLevel !== SitumApiPermissionLevel.READ_WRITE) throw new Error('Primary credential is not read-write')
    const viewer = new SitumSDK({ auth: { apiKey: parsed.data.viewerApiKey }, compact: true })
    const viewerSession = await viewer.authSession
    if (viewerSession.apiPermissionLevel !== SitumApiPermissionLevel.READ_ONLY) throw new Error('Viewer credential is not read-only')
    if (!primarySession.organizationId) throw new Error('Primary credential has no organization')
  } catch {
    throw createError({ statusCode: 422, statusMessage: 'Both Situm credentials could not be verified with the required permissions.' })
  }
  const encryptedApiKey = encryptWorkspaceApiKey(parsed.data.apiKey)
  const encryptedViewerApiKey = encryptWorkspaceApiKey(parsed.data.viewerApiKey)
  const [config] = await getDb().insert(workspaceSitumConfigs).values({ workspaceId, situmAccountId: primarySession.organizationId, encryptedApiKey, encryptedViewerApiKey }).onConflictDoUpdate({ target: workspaceSitumConfigs.workspaceId, set: { situmAccountId: primarySession.organizationId, encryptedApiKey, encryptedViewerApiKey, updatedAt: new Date() } }).returning({ id: workspaceSitumConfigs.id, workspaceId: workspaceSitumConfigs.workspaceId, situmAccountId: workspaceSitumConfigs.situmAccountId, encryptedViewerApiKey: workspaceSitumConfigs.encryptedViewerApiKey, updatedAt: workspaceSitumConfigs.updatedAt })
  if (!config) throw createError({ statusCode: 500, statusMessage: 'Unable to save Situm configuration.' })
  return { id: config.id, workspaceId: config.workspaceId, situmAccountId: config.situmAccountId, updatedAt: config.updatedAt, configured: true, viewerConfigured: Boolean(config.encryptedViewerApiKey) }
})
