import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import { ForegroundPositioningSession } from '../mobile/src/positioning/session'

function fakeNative() {
  let running = false; let startCount = 0; let stopCount = 0
  let update = (_location: unknown) => undefined; let status = (_value: { statusName: string }) => undefined; let error = (_value: unknown) => undefined; let stopped = () => undefined
  return {
    get running() { return running }, get startCount() { return startCount }, get stopCount() { return stopCount },
    setApiKey: async (_key: string) => undefined,
    requestLocationUpdates: () => { running = true; startCount++ },
    removeLocationUpdates: () => { if (running) { running = false; stopCount++ } },
    positioningIsRunning: () => running,
    onLocationUpdate: (callback: typeof update) => { update = callback }, onLocationStatus: (callback: typeof status) => { status = callback }, onLocationError: (callback: typeof error) => { error = callback }, onLocationStopped: (callback: typeof stopped) => { stopped = callback },
    emitLocation: (location: unknown) => update(location), emitStatus: (value: { statusName: string }) => status(value), emitError: (value: unknown) => error(value), emitStopped: () => stopped(),
  }
}

const permittedSession = (native: ReturnType<typeof fakeNative>) => new ForegroundPositioningSession(native, async () => true)

test('Plan 035 does not start positioning without explicit user action', () => {
  const native = fakeNative(); const session = permittedSession(native)
  session.setWorkspace('workspace-a')
  assert.equal(native.startCount, 0); assert.equal(session.getSnapshot().state, 'stopped')
})


test('Plan 035 requests runtime permissions before starting native positioning', async () => {
  const native = fakeNative(); let permissionRequests = 0; const session = new ForegroundPositioningSession(native, async () => { permissionRequests++; return true })
  await session.start('workspace-a', 10, async () => ({ apiKey: 'positioning-only-test-fixture' }))
  assert.equal(permissionRequests, 1); assert.equal(native.startCount, 1)
})

test('Plan 035 requests permission before fetching the positioning credential', async () => {
  const native = fakeNative(); const order: string[] = []
  const session = new ForegroundPositioningSession(native, async () => { order.push('permission'); return true })
  await session.start('workspace-a', 10, async () => { order.push('credential'); return { apiKey: 'positioning-only-test-fixture' } })
  assert.deepEqual(order, ['permission', 'credential']); assert.equal(native.startCount, 1)
})

test('Plan 035 fails closed when runtime positioning permissions are denied', async () => {
  const native = fakeNative(); const session = new ForegroundPositioningSession(native, async () => false)
  await session.start('workspace-a', 10, async () => ({ apiKey: 'positioning-only-test-fixture' }))
  assert.equal(native.startCount, 0); assert.equal(native.running, false); assert.equal(session.getSnapshot().state, 'error')
  assert.match(session.getSnapshot().message, /permissions are required/i)
})

test('Plan 035 keeps one active session across tab consumers and repeated starts', async () => {
  const native = fakeNative(); const session = permittedSession(native)
  await session.start('workspace-a', 10, async () => ({ apiKey: 'positioning-only-test-fixture' }))
  await session.start('workspace-a', 10, async () => ({ apiKey: 'unused' }))
  assert.equal(native.startCount, 1); assert.equal(native.stopCount, 0)
  assert.equal(session.getSnapshot().workspaceId, 'workspace-a')
})

test('Plan 035 explicit stop is idempotent and clears protected location state', async () => {
  const native = fakeNative(); const session = permittedSession(native)
  await session.start('workspace-a', 10, async () => ({ apiKey: 'positioning-only-test-fixture' }))
  native.emitLocation({ position: { buildingIdentifier: '10' } }); session.stop('explicit'); session.stop('explicit')
  assert.equal(native.stopCount, 1); assert.equal(session.getSnapshot().state, 'stopped'); assert.equal(session.getSnapshot().location, null)
})

test('Plan 035 logout stops the shared session before auth teardown', async () => {
  const native = fakeNative(); const session = permittedSession(native)
  await session.start('workspace-a', 10, async () => ({ apiKey: 'positioning-only-test-fixture' })); session.stop('logout')
  assert.equal(native.stopCount, 1); assert.equal(session.getSnapshot().location, null); assert.equal(session.getSnapshot().state, 'stopped')
})

test('Plan 035 workspace switch invalidates the old session and stale callbacks', async () => {
  const native = fakeNative(); const session = permittedSession(native)
  await session.start('workspace-a', 10, async () => ({ apiKey: 'positioning-only-test-fixture' })); session.setWorkspace('workspace-b')
  native.emitLocation({ position: { buildingIdentifier: '10' } })
  assert.equal(native.stopCount, 1); assert.equal(session.getSnapshot().workspaceId, 'workspace-b'); assert.equal(session.getSnapshot().location, null)
})

test('Plan 035 background stops foreground-only positioning without auto-restart', async () => {
  const native = fakeNative(); const session = permittedSession(native)
  await session.start('workspace-a', 10, async () => ({ apiKey: 'positioning-only-test-fixture' })); session.setLifecycle('background'); session.setLifecycle('active')
  assert.equal(native.stopCount, 1); assert.equal(native.startCount, 1); assert.equal(session.getSnapshot().state, 'stopped')
})

test('Plan 035 native stopped and fatal callbacks fail closed and stop the native producer', async () => {
  const native = fakeNative(); const session = permittedSession(native)
  await session.start('workspace-a', 10, async () => ({ apiKey: 'positioning-only-test-fixture' })); native.emitError({ code: '8002' })
  assert.equal(native.stopCount, 1); assert.equal(native.running, false); assert.equal(session.getSnapshot().state, 'error'); assert.equal(session.getSnapshot().location, null)
  native.emitStopped(); assert.equal(native.stopCount, 1); assert.equal(session.getSnapshot().state, 'stopped'); assert.equal(session.getSnapshot().location, null)
})

test('Plan 035 USER_NOT_IN_BUILDING is fatal and stops the native producer', async () => {
  const native = fakeNative(); const session = permittedSession(native)
  await session.start('workspace-a', 10, async () => ({ apiKey: 'positioning-only-test-fixture' })); native.emitStatus({ statusName: 'USER_NOT_IN_BUILDING' })
  assert.equal(native.stopCount, 1); assert.equal(native.running, false); assert.equal(session.getSnapshot().state, 'error'); assert.equal(session.getSnapshot().location, null)
})

test('Plan 035 screen ownership does not stop positioning on Explore unmount and Realtime remains server-mediated', () => {
  const map = readFileSync(new URL('../mobile/src/map/NativeMapScreen.tsx', import.meta.url), 'utf8')
  const realtime = readFileSync(new URL('../mobile/src/realtime/RealtimeScreen.tsx', import.meta.url), 'utf8')
  const route = readFileSync(new URL('../server/api/workspaces/[workspaceId]/situm/realtime.get.ts', import.meta.url), 'utf8')
  assert.match(map, /positioning\.start\(workspaceId, buildingId/); assert.match(map, /positioning\.stop\('explicit'\)/)
  assert.doesNotMatch(map, /positioningIsRunning\(\)\) SitumPlugin\.removeLocationUpdates\(\)/)
  assert.doesNotMatch(realtime, /getPositioningCredential|mobile-positioning|SitumPlugin/)
  assert.match(route, /result\.features\.map/); assert.doesNotMatch(route, /devicesInfo/)
})
