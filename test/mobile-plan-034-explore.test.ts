import assert from 'node:assert/strict'
import test from 'node:test'
import { guidanceStateAfterRecenter, guidanceStateForNavigation, isCurrentLocationUsable, navigationIsOwned, type LocationSnapshot } from '../mobile/src/map/state'

test('Plan 034 guidance model enters following from active navigation', () => {
  assert.equal(guidanceStateForNavigation('active'), 'guidance-following')
  assert.equal(guidanceStateForNavigation('outside-route'), 'outside-route')
  assert.equal(guidanceStateForNavigation('arrived'), 'arrived')
})

test('Plan 034 recenter restores follow only from free-pan', () => {
  assert.equal(guidanceStateAfterRecenter('guidance-free-pan'), 'guidance-following')
  assert.equal(guidanceStateAfterRecenter('arrived'), 'arrived')
})

test('Plan 034 stop ownership and stale-position guard remain fail-closed', () => {
  assert.equal(navigationIsOwned('active', false), true)
  assert.equal(navigationIsOwned('idle', false), false)
  const snapshot: LocationSnapshot<{ id: string }> = { state: 'fresh', location: { id: 'real' }, receivedAt: 1_000, workspaceId: 'w', buildingId: 7 }
  assert.equal(isCurrentLocationUsable(snapshot, 'w', 7, 1_001), true)
  assert.equal(isCurrentLocationUsable(snapshot, 'w', 7, 31_001), false)
  assert.equal(isCurrentLocationUsable(snapshot, 'other', 7, 1_001), false)
})
