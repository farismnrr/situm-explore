import { createError } from 'h3'
import { decryptWorkspaceApiKey } from './workspace-credentials'

export type MobilePositioningConfig = { encryptedPositioningApiKey: string | null, situmAccountId: string }

export async function resolveMobilePositioningCredential(input: { workspaceId: string, userId: string, findOwnedConfig: (workspaceId: string, userId: string) => Promise<MobilePositioningConfig | undefined>, decryptApiKey?: (value: string) => string }) {
  const config = await input.findOwnedConfig(input.workspaceId, input.userId)
  if (!config) throw createError({ statusCode: 404, statusMessage: 'Workspace Situm configuration not found.' })
  if (!config.encryptedPositioningApiKey) throw createError({ statusCode: 409, statusMessage: 'Mobile positioning is not configured for this workspace.' })
  return { configured: true, workspaceId: input.workspaceId, situmAccountId: config.situmAccountId, apiKey: (input.decryptApiKey || decryptWorkspaceApiKey)(config.encryptedPositioningApiKey) }
}
