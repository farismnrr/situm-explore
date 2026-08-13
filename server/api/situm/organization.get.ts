import type { SitumOrganizationResponse } from '#shared/situm-organization'
import { getSitumClient } from '../../integrations/situm/client'

export default defineEventHandler(async (event): Promise<SitumOrganizationResponse> => {
  await requireUserSession(event)
  const organization = await getSitumClient().cartography.getCurrentOrganization()
  return { organization: { id: organization.id, name: organization.name, supportEmail: organization.support_email } }
})
