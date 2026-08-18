import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const workspacePage = readFileSync(new URL('../app/pages/app/workspaces.vue', import.meta.url), 'utf8')
const passwordInput = readFileSync(new URL('../app/components/form/PasswordInput.vue', import.meta.url), 'utf8')
const workspaceConfigRoute = readFileSync(new URL('../server/api/workspaces/[...workspacePath].ts', import.meta.url), 'utf8')
const mobilePositioningRoute = readFileSync(new URL('../server/api/workspaces/[workspaceId]/mobile-positioning.get.ts', import.meta.url), 'utf8')
const mobilePositioning = readFileSync(new URL('../server/utils/mobile-positioning.ts', import.meta.url), 'utf8')

test('Plan 034 Workspace Settings provisions a distinct write-only positioning credential', () => {
  assert.match(workspacePage, /const positioningApiKey = ref\(''\)/)
  assert.match(workspacePage, /label="Positioning API key"/)
  assert.match(workspacePage, /<PasswordInput v-model="positioningApiKey"/)
  assert.match(passwordInput, /:type="visible \? 'text' : 'password'"/)
  assert.match(passwordInput, /i-lucide-eye/)
  assert.match(workspacePage, /positioningApiKey: positioningApiKey\.value/)
  assert.match(workspacePage, /positioningApiKey\.value = ''/)
  assert.match(workspacePage, /config\.positioningConfigured \? 'Configured' : 'Not configured'/)
})

test('Plan 034 omitting positioningApiKey preserves the existing encrypted value', () => {
  assert.match(workspacePage, /\.\.\.\(positioningApiKey\.value \? \{ positioningApiKey: positioningApiKey\.value \} : \{\}\)/)
  assert.match(workspaceConfigRoute, /\.\.\.\(encryptedPositioningApiKey \? \{ encryptedPositioningApiKey \} : \{\}\)/)
  assert.match(workspaceConfigRoute, /positioningConfigured: Boolean\(config\.positioningConfigured\)/)
  assert.match(workspaceConfigRoute, /positioningConfigured: workspaceSitumConfigs\.encryptedPositioningApiKey/)
  assert.match(workspaceConfigRoute, /positioningConfigured: Boolean\(config\.encryptedPositioningApiKey\)/)
})

test('Plan 034 server validation keeps positioning least-privilege and organization-bound', () => {
  assert.match(workspaceConfigRoute, /apiPermissionLevel !== SitumApiPermissionLevel\.POSITIONING/)
  assert.match(workspaceConfigRoute, /positioningSession\.organizationId !== primarySession\.organizationId/)
  assert.match(workspaceConfigRoute, /encryptWorkspaceApiKey\(parsed\.data\.positioningApiKey\)/)
  assert.match(workspaceConfigRoute, /positioningApiKey: z\.string\(\)\.min\(1\)\.max\(4096\)\.optional\(\)/)
})

test('Plan 034 mobile positioning remains owner-scoped and returns only the dedicated credential', () => {
  assert.match(mobilePositioningRoute, /requireUserSession\(event\)/)
  assert.match(mobilePositioningRoute, /encryptedPositioningApiKey: workspaceSitumConfigs\.encryptedPositioningApiKey/)
  assert.match(mobilePositioningRoute, /eq\(workspaces\.ownerId, ownerId\)/)
  assert.match(mobilePositioning, /apiKey: \(input\.decryptApiKey \|\| decryptWorkspaceApiKey\)\(config\.encryptedPositioningApiKey\)/)
  assert.doesNotMatch(mobilePositioning, /encryptedApiKey|encryptedViewerApiKey/)
})


test('Plan 034 runtime catch-all exposes owner-scoped mobile positioning route', () => {
  assert.match(workspaceConfigRoute, /parts\[1\] === 'mobile-positioning'/)
  assert.match(workspaceConfigRoute, /resolveMobilePositioningCredential/)
  assert.match(workspaceConfigRoute, /requireUserSession\(event\)/)
})
