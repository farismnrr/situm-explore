import SitumSDK, { SitumApiPermissionLevel } from '@situm/sdk-js'
import { and, eq } from 'drizzle-orm'
import type { H3Event } from 'h3'
import { getDb } from '../db/client'
import { workspaceSitumConfigs, workspaces } from '../db/schema'
import { decryptWorkspaceApiKey } from './workspace-credentials'
import { assertWorkspaceId } from './workspace-owner'
import { withServerSpan } from './telemetry'

export async function issueWorkspaceViewerJwt(event: H3Event, workspaceId: string) {
  const validWorkspaceId = assertWorkspaceId(workspaceId)
  const session = await requireUserSession(event)
  return withServerSpan(event, 'workspace.viewer_auth', { workspace_id: validWorkspaceId }, async () => {
    const [config] = await getDb().select({ encryptedViewerApiKey: workspaceSitumConfigs.encryptedViewerApiKey }).from(workspaceSitumConfigs).innerJoin(workspaces, eq(workspaceSitumConfigs.workspaceId, workspaces.id)).where(and(eq(workspaces.id, validWorkspaceId), eq(workspaces.ownerId, session.user.id))).limit(1)
    if (!config?.encryptedViewerApiKey) throw createError({ statusCode: 404, statusMessage: 'A read-only Viewer credential is not configured.' })
    try {
      const sdk = new SitumSDK({ auth: { apiKey: decryptWorkspaceApiKey(config.encryptedViewerApiKey) }, compact: true })
      const auth = await sdk.authSession
      if (auth.apiPermissionLevel !== SitumApiPermissionLevel.READ_ONLY) throw new Error('Viewer credential is not read-only')
      return { jwt: auth.jwt }
    } catch {
      throw createError({ statusCode: 422, statusMessage: 'A valid read-only Viewer credential could not be issued.' })
    }
  })
}
