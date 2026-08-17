import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import { nativeDestinationFromLink, parseNativeDeepLink } from '../mobile/src/navigation/deep-link'

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
