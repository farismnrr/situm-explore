import { and, eq } from 'drizzle-orm'
import { z } from 'zod'
import { getDb } from '../../db/client'
import { workspaceSitumConfigs, workspaces } from '../../db/schema'
import { encryptWorkspaceApiKey } from '../../utils/workspace-credentials'
import { assertWorkspaceId } from '../../utils/workspace-owner'

const schema = z.object({ situmAccountId: z.string().trim().min(1).max(255), apiKey: z.string().min(1).max(4096), accessMode: z.enum(['VIEW_ONLY', 'VIEW_WRITE']) }).strict()

export default defineEventHandler(async (event) => {
  const parts = (getRouterParam(event, 'workspacePath') || '').split('/').filter(Boolean)
  if (parts.length !== 2 || parts[1] !== 'situm-config') throw createError({ statusCode: 404, statusMessage: 'The requested resource was not found.' })
  const workspaceId = assertWorkspaceId(parts[0] || '')
  const session = await requireUserSession(event)
  const [owned] = await getDb().select({ id: workspaces.id }).from(workspaces).where(and(eq(workspaces.id, workspaceId), eq(workspaces.ownerId, session.user.id))).limit(1)
  if (!owned) throw createError({ statusCode: 404, statusMessage: 'Workspace not found.' })

  if (getMethod(event) === 'GET') {
    const [config] = await getDb().select({ id: workspaceSitumConfigs.id, workspaceId: workspaceSitumConfigs.workspaceId, accessMode: workspaceSitumConfigs.accessMode, situmAccountId: workspaceSitumConfigs.situmAccountId, configured: workspaceSitumConfigs.id, updatedAt: workspaceSitumConfigs.updatedAt }).from(workspaceSitumConfigs).where(eq(workspaceSitumConfigs.workspaceId, workspaceId)).limit(1)
    if (!config) throw createError({ statusCode: 404, statusMessage: 'Situm configuration not found.' })
    return { ...config, configured: Boolean(config.configured) }
  }

  if (getMethod(event) !== 'PUT') throw createError({ statusCode: 405, statusMessage: 'Method not allowed.' })
  const parsed = schema.safeParse(await readBody(event))
  if (!parsed.success) throw createError({ statusCode: 400, statusMessage: 'Valid Situm configuration is required.' })
  const encryptedApiKey = encryptWorkspaceApiKey(parsed.data.apiKey)
  const [config] = await getDb().insert(workspaceSitumConfigs).values({ workspaceId, situmAccountId: parsed.data.situmAccountId, accessMode: parsed.data.accessMode, encryptedApiKey }).onConflictDoUpdate({ target: workspaceSitumConfigs.workspaceId, set: { situmAccountId: parsed.data.situmAccountId, accessMode: parsed.data.accessMode, encryptedApiKey, updatedAt: new Date() } }).returning({ id: workspaceSitumConfigs.id, workspaceId: workspaceSitumConfigs.workspaceId, situmAccountId: workspaceSitumConfigs.situmAccountId, accessMode: workspaceSitumConfigs.accessMode, updatedAt: workspaceSitumConfigs.updatedAt })
  if (!config) throw createError({ statusCode: 500, statusMessage: 'Unable to save Situm configuration.' })
  return { ...config, configured: true }
})
