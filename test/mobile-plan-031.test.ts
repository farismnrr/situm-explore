import assert from 'node:assert/strict'
import test from 'node:test'
import { formatSourceTime, isRealtimePosition, normalizeRealtimeResponse, realtimeFreshness, realtimePollIntervalMs, realtimeStaleAfterMs } from '../mobile/src/realtime/state'

const position = { id: 'device-1', time: '2026-08-17T00:00:00.000Z', buildingId: 10, floorId: 2, accuracy: 3.5, lat: -6.2, lng: 106.8, deviceId: 'device-1' }

test('Plan 031 validates and keeps only the minimal realtime position fields', () => {
  assert.equal(isRealtimePosition(position), true)
  assert.equal(isRealtimePosition({ ...position, lat: 'bad' }), false)
  assert.deepEqual(normalizeRealtimeResponse({ positions: [position, { invalid: true }] }), [position])
})

test('Plan 031 freshness is a display hint, not online presence', () => {
  const now = Date.parse('2026-08-17T00:00:00.000Z')
  assert.equal(realtimeFreshness('2026-08-16T23:59:30.000Z', now), 'fresh')
  assert.equal(realtimeFreshness('2026-08-16T23:57:00.000Z', now), 'older')
  assert.equal(realtimeFreshness('2026-08-16T23:50:00.000Z', now), 'stale')
  assert.equal(realtimeFreshness('not-a-time', now), 'unknown')
  assert.equal(realtimePollIntervalMs, 10_000)
  assert.equal(realtimeStaleAfterMs, 300_000)
})

test('Plan 031 source-time formatting fails closed for malformed input', () => {
  assert.match(formatSourceTime(position.time), /2026|26/)
  assert.equal(formatSourceTime('invalid'), 'Source time unavailable')
})
