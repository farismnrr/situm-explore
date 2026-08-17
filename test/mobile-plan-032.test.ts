import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import { nativeDestinationFromLink, parseNativeDeepLink } from '../mobile/src/navigation/deep-link'
import { mapViewerBreakpoint } from '../app/composables/useMapViewerCapability'

test('Plan 032 parses only non-secret Map and Realtime routing context', () => {
  assert.deepEqual(parseNativeDeepLink('situm-explore://map?workspaceId=workspace_a&buildingId=42'), { destination: 'map', workspaceId: 'workspace_a', buildingId: 42 })
  assert.deepEqual(parseNativeDeepLink('situm-explore-dev://realtime?workspaceId=workspace_a'), { destination: 'realtime', workspaceId: 'workspace_a' })
  assert.deepEqual(parseNativeDeepLink('https://mobile.example.test/app/map?workspaceId=workspace_a&buildingId=42'), { destination: 'map', workspaceId: 'workspace_a', buildingId: 42 })
  assert.deepEqual(parseNativeDeepLink('situm-explore://map?session=secret&apiKey=secret'), { destination: 'map' })
  assert.deepEqual(parseNativeDeepLink('situm-explore://map?workspaceId=not.allowed'), { destination: 'map' })
  assert.equal(parseNativeDeepLink('https://mobile.example.test/app/settings'), null)
  assert.equal(nativeDestinationFromLink(parseNativeDeepLink('situm-explore://realtime')), 'realtime')
})

test('Plan 032 native lifecycle owns one deep-link listener and rechecks workspace context', () => {
  const app = readFileSync(new URL('../mobile/App.tsx', import.meta.url), 'utf8')
  const context = readFileSync(new URL('../mobile/src/workspaces/context.ts', import.meta.url), 'utf8')
  const parser = readFileSync(new URL('../mobile/src/navigation/deep-link.ts', import.meta.url), 'utf8')
  assert.match(app, /Linking\.getInitialURL\(\)/)
  assert.match(app, /Linking\.addEventListener\('url'/)
  assert.match(app, /linkSubscription\.remove\(\)/)
  assert.match(context, /if \(link\.workspaceId\) this\.select\(link\.workspaceId\)/)
  assert.match(context, /That workspace is not available to this account/)
  assert.doesNotMatch(parser, /session|apiKey|password|bearer/i)
})

test('Plan 032 shared web gate contains no credential-bearing handoff fields', () => {
  const gate = readFileSync(new URL('../app/components/native/NativeAppGate.vue', import.meta.url), 'utf8')
  assert.match(gate, /QRCode\.toDataURL/)
  assert.match(gate, /Copy app link/)
  assert.match(gate, /androidStoreUrl|iosStoreUrl/)
  assert.doesNotMatch(gate, /session|password|apiKey|credential|bearer/i)
})

test('Plan 032 Map capability is geometry-based and gates Viewer work before fetch', () => {
  const map = readFileSync(new URL('../app/pages/app/map.vue', import.meta.url), 'utf8')
  assert.deepEqual(mapViewerBreakpoint, { minWidth: 768, minHeight: 600 })
  assert.match(map, /watch\(\[selectedWorkspaceId, isMapViewerCapable\]/)
  assert.match(map, /if \(workspaceId && capable\) refreshCartography\(\)/)
  assert.match(map, /<NativeAppGate feature="map"/)
  assert.doesNotMatch(map, /useDesktopViewport|Desktop required/)
})
