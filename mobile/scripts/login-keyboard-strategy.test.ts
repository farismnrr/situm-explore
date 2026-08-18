import { loginKeyboardAvoidingBehavior, shouldUseCompactLoginLayout } from '../src/loginKeyboardStrategy'

function equal(actual: unknown, expected: unknown) {
  if (actual !== expected) throw new Error(`expected ${String(expected)}, got ${String(actual)}`)
}

equal(loginKeyboardAvoidingBehavior('android'), undefined)
equal(loginKeyboardAvoidingBehavior('ios'), 'padding')
equal(loginKeyboardAvoidingBehavior('web'), undefined)
equal(shouldUseCompactLoginLayout(false), false)
equal(shouldUseCompactLoginLayout(true), true)
