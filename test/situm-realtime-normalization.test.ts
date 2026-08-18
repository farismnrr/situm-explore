import assert from 'node:assert/strict'
import test from 'node:test'
import { normalizeSitumRealtimeFeatures } from '../server/utils/situm-realtime'

test('Realtime normalizes actual SDK string timestamps without assuming Date instances', () => {
  const positions = normalizeSitumRealtimeFeatures([{ properties: { deviceId: '632206322861', time: '2026-08-18T06:47:48.979Z', buildingId: 19866, floorId: 69905, accuracy: 1.3430399 }, geometry: { coordinates: [106.896613, -6.150659] } }])
  assert.deepEqual(positions, [{ id: '632206322861', deviceId: '632206322861', time: '2026-08-18T06:47:48.979Z', buildingId: 19866, floorId: 69905, accuracy: 1.3430399, lat: -6.150659, lng: 106.896613 }])
})

test('Realtime keeps Date timestamps supported and drops malformed upstream features', () => {
  const positions = normalizeSitumRealtimeFeatures([
    { properties: { time: new Date('2026-08-18T06:47:48.979Z'), buildingId: 19866, floorId: 69905, accuracy: 2 }, geometry: { coordinates: [106.8, -6.1] } },
    { properties: { time: 'not-a-date', buildingId: 19866, floorId: 69905, accuracy: 2 }, geometry: { coordinates: [106.8, -6.1] } },
  ])
  assert.equal(positions.length, 1)
  assert.equal(positions[0]?.id, '19866-69905-0')
})
