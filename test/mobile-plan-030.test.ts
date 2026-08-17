import { strict as assert } from 'node:assert'
import { test } from 'node:test'
import { isCurrentLocationUsable, positionStateForLocationStatus, resolvePoi } from '../mobile/src/map/state'

test('Plan 030 maps USER_NOT_IN_BUILDING to a safe positioning error', () => {
  assert.equal(positionStateForLocationStatus('STOPPED'), 'stopped')
  assert.equal(positionStateForLocationStatus('USER_NOT_IN_BUILDING'), 'error')
  assert.equal(positionStateForLocationStatus('CALCULATING'), 'starting')
})

test('Plan 030 directions require a fresh location for the active workspace and building', () => {
  const now = 10_000
  const location = { position: { buildingIdentifier: '42' } }
  assert.equal(isCurrentLocationUsable({ state: 'fresh', location, receivedAt: now - 1_000, workspaceId: 'workspace-a', buildingId: 42 }, 'workspace-a', 42, now), true)
  assert.equal(isCurrentLocationUsable({ state: 'stale', location, receivedAt: now - 1_000, workspaceId: 'workspace-a', buildingId: 42 }, 'workspace-a', 42, now), false)
  assert.equal(isCurrentLocationUsable({ state: 'fresh', location, receivedAt: now - 1_000, workspaceId: 'workspace-a', buildingId: 42 }, 'workspace-b', 42, now), false)
  assert.equal(isCurrentLocationUsable({ state: 'fresh', location, receivedAt: now - 1_000, workspaceId: 'workspace-a', buildingId: 42 }, 'workspace-a', 7, now), false)
  assert.equal(isCurrentLocationUsable({ state: 'fresh', location, receivedAt: now - 31_000, workspaceId: 'workspace-a', buildingId: 42 }, 'workspace-a', 42, now), false)
})

test('Plan 030 resolves selected POIs only from real active-building cartography', () => {
  const pois = [{ id: 11, buildingId: 42, floorId: 3, name: 'Lobby', categoryName: 'Entrance' }, { id: 11, buildingId: 7, floorId: 9, name: 'Other Lobby' }]
  assert.deepEqual(resolvePoi(pois, 11, 42), pois[0])
  assert.equal(resolvePoi(pois, 12, 42), null)
  assert.equal(resolvePoi(pois, 11, 7), pois[1])
})
