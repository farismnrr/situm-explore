import { strict as assert } from 'node:assert'
import { test } from 'node:test'
import { layoutForWidth, layoutModeForWidth } from '../mobile/src/ui/layout'

test('Plan 033 shared layout mode stays deterministic across reference breakpoints', () => {
  assert.equal(layoutModeForWidth(390), 'phone')
  assert.equal(layoutModeForWidth(700), 'tablet')
  assert.equal(layoutModeForWidth(1050), 'wide')
  assert.equal(layoutModeForWidth(1800), 'veryWide')
  assert.equal(layoutForWidth(390).isPhone, true)
  assert.equal(layoutForWidth(1280).railWidth, 208)
  assert.equal(layoutForWidth(1800).contentPadding, 34)
})
