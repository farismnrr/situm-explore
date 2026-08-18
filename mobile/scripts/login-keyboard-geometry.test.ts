import { clampLoginScrollOffset, requiredLoginScrollShift } from '../src/loginKeyboardGeometry'

function equal(actual: number, expected: number) {
  if (actual !== expected) throw new Error(`expected ${expected}, got ${actual}`)
}

equal(requiredLoginScrollShift({ focusedBottom: 320, actionBottom: 360, keyboardTop: 388, safetyMargin: 12 }), 0)
equal(requiredLoginScrollShift({ focusedBottom: 400, actionBottom: 360, keyboardTop: 388, safetyMargin: 12 }), 24)
equal(requiredLoginScrollShift({ focusedBottom: 400, actionBottom: 450, keyboardTop: 388, safetyMargin: 12 }), 74)
equal(requiredLoginScrollShift({ focusedBottom: 400, actionBottom: 450, keyboardTop: 388, safetyMargin: -12 }), 62)
equal(requiredLoginScrollShift({ focusedBottom: Number.NaN, actionBottom: 450, keyboardTop: 388, safetyMargin: 12 }), 74)
equal(requiredLoginScrollShift({ focusedBottom: 400, actionBottom: 450, keyboardTop: Number.NaN, safetyMargin: 12 }), 0)
equal(clampLoginScrollOffset(-20, 100), 0)
equal(clampLoginScrollOffset(42, 100), 42)
equal(clampLoginScrollOffset(200, 100), 100)
equal(clampLoginScrollOffset(42, -1), 0)
equal(requiredLoginScrollShift({ focusedBottom: 368, actionBottom: 368, keyboardTop: 388, safetyMargin: 12 }), 0)
