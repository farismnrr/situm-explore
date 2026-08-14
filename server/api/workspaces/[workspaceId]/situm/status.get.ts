import { getWorkspaceSitumClient } from '../../../../utils/workspace-situm'

export default defineEventHandler(async (event) => {
  const { client, accessMode, situmAccountId } = await getWorkspaceSitumClient(event, getRouterParam(event, 'workspaceId') || '')
  try {
    const organization = await client.cartography.getCurrentOrganization()
    return { configured: true, reachable: true, accessMode, accountContext: situmAccountId === organization.id ? 'matched' : 'mismatched' }
  } catch {
    return { configured: true, reachable: false, accessMode, accountContext: 'unverified' }
  }
})
