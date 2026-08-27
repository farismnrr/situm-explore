import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import { isAsyncDataLoading, isWorkspaceRequestLoading } from '../app/utils/async-state'

test('web async loading treats idle and pending as unresolved states', () => {
  assert.equal(isAsyncDataLoading('idle'), true)
  assert.equal(isAsyncDataLoading('pending'), true)
  assert.equal(isAsyncDataLoading('success'), false)
  assert.equal(isAsyncDataLoading('error'), false)
})

test('workspace requests stay loading until the workspace list resolves and while an owned request is unresolved', () => {
  assert.equal(isWorkspaceRequestLoading(false, null, 'idle'), true)
  assert.equal(isWorkspaceRequestLoading(false, 'workspace-a', 'success'), true)
  assert.equal(isWorkspaceRequestLoading(true, 'workspace-a', 'idle'), true)
  assert.equal(isWorkspaceRequestLoading(true, 'workspace-a', 'pending'), true)
  assert.equal(isWorkspaceRequestLoading(true, 'workspace-a', 'success'), false)
  assert.equal(isWorkspaceRequestLoading(true, null, 'idle'), false)
})

test('Alarms does not render a pre-fetch building prompt and uses resolved loading state', () => {
  const source = readFileSync(new URL('../app/pages/app/alarms.vue', import.meta.url), 'utf8')
  assert.doesNotMatch(source, /title="Select a building"/)
  assert.match(source, /const cartographyLoading = computed/)
  assert.match(source, /const alarmLoading = computed/)
  assert.match(source, /v-if="loading" class="space-y-2" aria-label="Loading alarm rows"/)
  assert.match(source, /String\(cartographyStatus\) === 'success' && buildings\.length === 0/)
})

test('Map waits for workspace and cartography before mounting SitumViewer', () => {
  const map = readFileSync(new URL('../app/pages/app/map.vue', import.meta.url), 'utf8')
  const viewer = readFileSync(new URL('../app/components/situm/SitumViewer.vue', import.meta.url), 'utf8')
  assert.match(map, /v-if="!workspaceLoaded"/)
  assert.match(map, /v-if="cartographyLoading"/)
  assert.match(map, /v-else-if="viewerAvailable" ref="viewer"/)
  assert.match(viewer, /<USkeleton v-else-if="!buildingConfirmed"/)
  assert.doesNotMatch(viewer, /title="Loading map"/)
  assert.doesNotMatch(viewer, /Preparing the read-only Viewer/)
})

test('data-driven web surfaces share workspace-aware loading guards', () => {
  for (const path of [
    '../app/pages/app/buildings.vue',
    '../app/pages/app/pois.vue',
    '../app/pages/app/geofences.vue',
    '../app/pages/app/groups.vue',
    '../app/pages/app/users.vue',
    '../app/pages/app/organization.vue',
    '../app/pages/app/paths.vue',
    '../app/pages/app/dashboard.vue',
    '../app/pages/app/analytics.vue',
    '../app/pages/app/index.vue'
  ]) {
    const source = readFileSync(new URL(path, import.meta.url), 'utf8')
    assert.match(source, /isWorkspaceRequestLoading/, `${path} should guard unresolved workspace requests`)
  }
})

test('workspace configuration does not claim Not configured while its read is unresolved', () => {
  const source = readFileSync(new URL('../app/pages/app/workspaces.vue', import.meta.url), 'utf8')
  assert.match(source, /const configLoading = ref\(true\)/)
  assert.match(source, /v-if="configLoading"/)
  assert.match(source, /v-else-if="config"/)
  assert.match(source, /<UAlert v-else color="neutral" variant="subtle" title="Connect only what you need"/)
})
