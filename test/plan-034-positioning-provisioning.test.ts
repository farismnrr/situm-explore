import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const workspacePage = readFileSync(new URL('../app/pages/app/workspaces.vue', import.meta.url), 'utf8')
const passwordInput = readFileSync(new URL('../app/components/form/PasswordInput.vue', import.meta.url), 'utf8')
const workspaceConfigRoute = readFileSync(new URL('../server/api/workspaces/[...workspacePath].ts', import.meta.url), 'utf8')
const mobilePositioningRoute = readFileSync(new URL('../server/api/workspaces/[workspaceId]/mobile-positioning.get.ts', import.meta.url), 'utf8')
const mobilePositioning = readFileSync(new URL('../server/utils/mobile-positioning.ts', import.meta.url), 'utf8')
const workspaceSitum = readFileSync(new URL('../server/utils/workspace-situm.ts', import.meta.url), 'utf8')
const schema = readFileSync(new URL('../server/db/schema.ts', import.meta.url), 'utf8')

test('workspace settings exposes exactly Only Read and Read & Write credential inputs', () => {
  assert.match(workspacePage, /label="Only Read API key"/)
  assert.match(workspacePage, /label="Read & Write API key"/)
  assert.match(workspacePage, /<FormPasswordInput v-model="viewerApiKey"/)
  assert.match(workspacePage, /<FormPasswordInput v-model="apiKey"/)
  assert.match(passwordInput, /:type="visible \? 'text' : 'password'"/)
  assert.doesNotMatch(workspacePage, /Positioning API key/)
  assert.doesNotMatch(workspacePage, /positioningApiKey/)
})

test('workspace credential saves are independent and omitted keys are preserved', () => {
  assert.match(workspacePage, /!apiKey\.value && !viewerApiKey\.value/)
  assert.match(workspacePage, /\.\.\.\(apiKey\.value \? \{ apiKey: apiKey\.value \} : \{\}\)/)
  assert.match(workspacePage, /\.\.\.\(viewerApiKey\.value \? \{ viewerApiKey: viewerApiKey\.value \} : \{\}\)/)
  assert.match(workspaceConfigRoute, /apiKey: credential\.optional\(\)/)
  assert.match(workspaceConfigRoute, /viewerApiKey: credential\.optional\(\)/)
  assert.match(workspaceConfigRoute, /\.\.\.\(encryptedApiKey \? \{ encryptedApiKey \} : \{\}\)/)
  assert.match(workspaceConfigRoute, /\.\.\.\(encryptedViewerApiKey \? \{ encryptedViewerApiKey \} : \{\}\)/)
})

test('server validates the two Situm permission levels and organization boundary', () => {
  assert.match(workspaceConfigRoute, /SitumApiPermissionLevel\.READ_WRITE, 'Read & Write API key'/)
  assert.match(workspaceConfigRoute, /SitumApiPermissionLevel\.READ_ONLY, 'Only Read API key'/)
  assert.match(workspaceConfigRoute, /resolveWorkspaceSitumOrganization/)
  assert.match(workspaceConfigRoute, /SITUM_CREDENTIAL_ORG_MISMATCH/)
  assert.match(workspaceConfigRoute, /SITUM_WORKSPACE_ORG_MISMATCH/)
  assert.doesNotMatch(workspaceConfigRoute, /SitumApiPermissionLevel\.POSITIONING/)
})

test('mobile positioning is owner-scoped and receives only the stored Only Read key', () => {
  assert.match(mobilePositioningRoute, /requireUserSession\(event\)/)
  assert.match(mobilePositioningRoute, /encryptedViewerApiKey: workspaceSitumConfigs\.encryptedViewerApiKey/)
  assert.match(mobilePositioningRoute, /eq\(workspaces\.ownerId, ownerId\)/)
  assert.match(mobilePositioning, /decryptWorkspaceApiKey\)\(config\.encryptedViewerApiKey\)/)
  assert.doesNotMatch(mobilePositioning, /encryptedApiKey/)
  assert.doesNotMatch(mobilePositioning, /encryptedPositioningApiKey/)
})

test('read helpers use Only Read while Read & Write remains a separate server-only helper', () => {
  assert.match(workspaceSitum, /getWorkspaceSitumClient[\s\S]*config\.encryptedViewerApiKey/)
  assert.match(workspaceSitum, /getWorkspaceSitumApiKey[\s\S]*config\.encryptedViewerApiKey/)
  assert.match(workspaceSitum, /getWorkspaceSitumReadWriteClient/)
  assert.match(workspaceSitum, /getWorkspaceSitumReadWriteClient[\s\S]*config\.encryptedApiKey/)
})

test('active schema contains exactly two Situm credential columns', () => {
  assert.match(schema, /encryptedApiKey: varchar\('encrypted_api_key'/)
  assert.match(schema, /encryptedViewerApiKey: varchar\('encrypted_viewer_api_key'/)
  assert.doesNotMatch(schema, /encryptedPositioningApiKey/)
})
