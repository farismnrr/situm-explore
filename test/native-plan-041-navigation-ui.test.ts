import { strict as assert } from 'node:assert'
import { test } from 'node:test'
import { formatNavigationDistance, formatNavigationEta, guidanceInstructionForIndication } from '../mobile/src/map/state'

test('Plan 041 formats only valid Situm navigation distance values', () => {
  assert.equal(formatNavigationDistance(0), '0 m')
  assert.equal(formatNavigationDistance(149.6), '150 m')
  assert.equal(formatNavigationDistance(1250), '1.3 km')
  assert.equal(formatNavigationDistance(-1), null)
  assert.equal(formatNavigationDistance(Number.NaN), null)
})

test('Plan 041 formats Situm time-to-goal without inventing missing ETA', () => {
  assert.equal(formatNavigationEta(20), '<1 min')
  assert.equal(formatNavigationEta(61), '2 min')
  assert.equal(formatNavigationEta(3660), '1 h 1 min')
  assert.equal(formatNavigationEta(undefined), null)
})

test('Plan 041 translates documented Situm indication action/orientation strings', () => {
  assert.equal(guidanceInstructionForIndication({ indicationType: 'TURN', orientationType: 'RIGHT' }), 'Turn right')
  assert.equal(guidanceInstructionForIndication({ indicationType: 'TURN', orientationType: 'VEER_LEFT' }), 'Keep left')
  assert.equal(guidanceInstructionForIndication({ indicationType: 'GO_AHEAD', orientationType: 'STRAIGHT' }), 'Continue straight')
  assert.equal(guidanceInstructionForIndication({ indicationType: 'CHANGE_FLOOR', orientationType: 'INVALID_ORIENTATION', neededLevelChange: true }), 'Change floor')
  assert.equal(guidanceInstructionForIndication({ indicationType: 'END', orientationType: 'INVALID_ORIENTATION' }), 'Arrive at destination')
  assert.equal(guidanceInstructionForIndication({ indicationType: 'UNKNOWN', orientationType: 'UNKNOWN' }), null)
})
