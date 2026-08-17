import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import { formatSourceTime, isRealtimePosition, normalizeRealtimeResponse, RealtimePayloadError, realtimePollIntervalMs } from '../mobile/src/realtime/state'

const position = { id: 'device-1', time: '2026-08-17T00:00:00.000Z', buildingId: 10, floorId: 2, accuracy: 3.5, lat: -6.2, lng: 106.8, deviceId: 'device-1' }

test('Plan 031 validates and keeps only the minimal realtime position fields', () => {
  assert.equal(isRealtimePosition(position), true)
  assert.equal(isRealtimePosition({ ...position, lat: 'bad' }), false)
  assert.deepEqual(normalizeRealtimeResponse({ positions: [position] }), [position])
  assert.deepEqual(normalizeRealtimeResponse({ positions: [] }), [])
  assert.throws(() => normalizeRealtimeResponse({ positions: [position, { invalid: true }] }), RealtimePayloadError)
  assert.throws(() => normalizeRealtimeResponse({}), RealtimePayloadError)
})

test('Plan 031 exposes source time without unsupported freshness thresholds', () => {
  assert.equal(realtimePollIntervalMs, 10_000)
})

test('Plan 031 source-time formatting fails closed for malformed input', () => {
  assert.match(formatSourceTime(position.time), /2026|26/)
  assert.equal(formatSourceTime('invalid'), 'Source time unavailable')
})

test('Plan 031 Realtime rows do not render an unsupported status indicator', () => {
  const screen = readFileSync(new URL('../mobile/src/realtime/RealtimeScreen.tsx', import.meta.url), 'utf8')
  assert.doesNotMatch(screen, /styles\.dot|<View style=\{styles\.dot\}/)
  assert.doesNotMatch(screen, /dotOlder|dotStale|#168754/)
})
