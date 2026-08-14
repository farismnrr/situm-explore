import { getWorkspaceSitumClient } from '../../../../utils/workspace-situm'

export default defineEventHandler(async (event) => {
  const { client, situmAccountId } = await getWorkspaceSitumClient(event, getRouterParam(event, 'workspaceId') || '')
  try {
    const organization = await client.cartography.getCurrentOrganization()
    const auth = await client.authSession
    return { configured: true, reachable: true, writeCapable: auth.apiPermissionLevel === 'read-write', accountContext: situmAccountId === organization.id ? 'matched' : 'mismatched' }
  } catch {
    return { configured: true, reachable: false, accountContext: 'unverified' }
  }
})
