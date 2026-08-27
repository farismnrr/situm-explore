export type WorkspaceSitumOrganizationResolution =
  | { ok: true, organizationId: string }
  | { ok: false, reason: 'credential-org-mismatch' | 'workspace-org-mismatch' | 'org-undetermined' }

interface WorkspaceSitumOrganizationInput {
  existingOrganizationId?: string | null
  hasExistingReadWrite: boolean
  hasExistingReadOnly: boolean
  replacingReadWrite: boolean
  replacingReadOnly: boolean
  suppliedOrganizationIds: string[]
}

/**
 * Resolve the Situm organization for one workspace update.
 *
 * An existing organization is sticky only while at least one stored credential is
 * retained. Replacing every stored credential is an explicit workspace re-bind and
 * may move that workspace to another Situm organization.
 */
export function resolveWorkspaceSitumOrganization(input: WorkspaceSitumOrganizationInput): WorkspaceSitumOrganizationResolution {
  const uniqueSuppliedOrganizations = [...new Set(input.suppliedOrganizationIds)]
  if (uniqueSuppliedOrganizations.length > 1) return { ok: false, reason: 'credential-org-mismatch' }

  const retainsReadWrite = input.hasExistingReadWrite && !input.replacingReadWrite
  const retainsReadOnly = input.hasExistingReadOnly && !input.replacingReadOnly
  const retainsExistingCredential = retainsReadWrite || retainsReadOnly
  const suppliedOrganizationId = uniqueSuppliedOrganizations[0]
  const organizationId = retainsExistingCredential ? input.existingOrganizationId : suppliedOrganizationId

  if (!organizationId) return { ok: false, reason: 'org-undetermined' }
  if (suppliedOrganizationId && retainsExistingCredential && suppliedOrganizationId !== input.existingOrganizationId) {
    return { ok: false, reason: 'workspace-org-mismatch' }
  }

  return { ok: true, organizationId }
}
