import { getWorkspaceSitumClient } from '../../../../utils/workspace-situm'

export default defineEventHandler(async (event) => {
  const { client } = await getWorkspaceSitumClient(event, getRouterParam(event, 'workspaceId') || '')
  const organization = await client.cartography.getCurrentOrganization()
  return { organization: { id: organization.id, name: organization.name, supportEmail: organization.support_email } }
})
