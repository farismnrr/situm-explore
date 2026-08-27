import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import { resolveWorkspaceSitumOrganization } from '../server/utils/workspace-situm-organization'

const workspaceRoute = readFileSync(new URL('../server/api/workspaces/[...workspacePath].ts', import.meta.url), 'utf8')
const errorBoundary = readFileSync(new URL('../server/plugins/error-boundary.ts', import.meta.url), 'utf8')
const workspacePage = readFileSync(new URL('../app/pages/app/workspaces.vue', import.meta.url), 'utf8')

test('first-time workspace configuration binds to its supplied Situm organization', () => {
  assert.deepEqual(resolveWorkspaceSitumOrganization({
    existingOrganizationId: null,
    hasExistingReadWrite: false,
    hasExistingReadOnly: false,
    replacingReadWrite: false,
    replacingReadOnly: true,
    suppliedOrganizationIds: ['org-b'],
  }), { ok: true, organizationId: 'org-b' })
})

test('workspace organization resolution is independent from another workspace', () => {
  const workspaceA = resolveWorkspaceSitumOrganization({
    existingOrganizationId: 'org-a',
    hasExistingReadWrite: true,
    hasExistingReadOnly: true,
    replacingReadWrite: false,
    replacingReadOnly: true,
    suppliedOrganizationIds: ['org-a'],
  })
  const workspaceB = resolveWorkspaceSitumOrganization({
    existingOrganizationId: null,
    hasExistingReadWrite: false,
    hasExistingReadOnly: false,
    replacingReadWrite: true,
    replacingReadOnly: true,
    suppliedOrganizationIds: ['org-b', 'org-b'],
  })
  assert.deepEqual(workspaceA, { ok: true, organizationId: 'org-a' })
  assert.deepEqual(workspaceB, { ok: true, organizationId: 'org-b' })
})

test('single-key replacement stays in the organization of the retained credential', () => {
  assert.deepEqual(resolveWorkspaceSitumOrganization({
    existingOrganizationId: 'org-a',
    hasExistingReadWrite: true,
    hasExistingReadOnly: true,
    replacingReadWrite: false,
    replacingReadOnly: true,
    suppliedOrganizationIds: ['org-b'],
  }), { ok: false, reason: 'workspace-org-mismatch' })
})

test('replacing every stored credential may re-bind only that workspace to another organization', () => {
  assert.deepEqual(resolveWorkspaceSitumOrganization({
    existingOrganizationId: 'org-a',
    hasExistingReadWrite: true,
    hasExistingReadOnly: true,
    replacingReadWrite: true,
    replacingReadOnly: true,
    suppliedOrganizationIds: ['org-b', 'org-b'],
  }), { ok: true, organizationId: 'org-b' })
})

test('replacing the only stored credential may also move the workspace organization', () => {
  assert.deepEqual(resolveWorkspaceSitumOrganization({
    existingOrganizationId: 'org-a',
    hasExistingReadWrite: false,
    hasExistingReadOnly: true,
    replacingReadWrite: false,
    replacingReadOnly: true,
    suppliedOrganizationIds: ['org-b'],
  }), { ok: true, organizationId: 'org-b' })
})

test('two newly supplied credentials must agree on organization', () => {
  assert.deepEqual(resolveWorkspaceSitumOrganization({
    existingOrganizationId: null,
    hasExistingReadWrite: false,
    hasExistingReadOnly: false,
    replacingReadWrite: true,
    replacingReadOnly: true,
    suppliedOrganizationIds: ['org-a', 'org-b'],
  }), { ok: false, reason: 'credential-org-mismatch' })
})

test('workspace config persistence remains owner/workspace scoped', () => {
  assert.match(workspaceRoute, /eq\(workspaces\.id, workspaceId\)/)
  assert.match(workspaceRoute, /eq\(workspaces\.ownerId, session\.user\.id\)/)
  assert.match(workspaceRoute, /where\(eq\(workspaceSitumConfigs\.workspaceId, workspaceId\)\)/)
  assert.match(workspaceRoute, /target: workspaceSitumConfigs\.workspaceId/)
})

test('safe Situm validation errors survive the global error boundary', () => {
  assert.match(errorBoundary, /SITUM_WORKSPACE_ORG_MISMATCH/)
  assert.match(errorBoundary, /publicErrorMessages\[publicCode\]/)
  assert.match(errorBoundary, /failure\.statusMessage = responseMessage/)
  assert.match(errorBoundary, /failure\.data = \{ code: responseCode, requestId \}/)
  assert.match(workspacePage, /Replace both keys together to move this workspace to another Situm organization\./)
})
