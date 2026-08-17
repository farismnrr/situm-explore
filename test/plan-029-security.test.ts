import { strict as assert } from 'node:assert'
import { createServer } from 'node:http'
import { test } from 'node:test'
import { createApp, eventHandler, sealSession, toNodeListener, useSession } from 'h3'
import { createMobileSessionConfig, MOBILE_SESSION_MAX_AGE } from '../server/utils/mobile-session'
import { isCurrentSessionVersion } from '../server/utils/session-revocation'

test('mobile session seals and authenticates the named nuxt session through x-nuxt-session', async () => {
  const config = createMobileSessionConfig({ name: 'nuxt-session', password: 'plan-029-test-password-0123456789012345' })
  const app = createApp()
  app.use('/login', eventHandler(async (event) => {
    const session = await useSession(event, config)
    await session.update({ user: { id: 'user-029' }, sessionVersion: 0 })
    return { session: await sealSession(event, config) }
  }))
  app.use('/protected', eventHandler(async (event) => {
    const session = await useSession(event, config)
    return { userId: session.data.user?.id, sessionVersion: session.data.sessionVersion }
  }))

  const server = createServer(toNodeListener(app))
  await new Promise<void>(resolve => server.listen(0, resolve))
  const address = server.address()
  const port = typeof address === 'object' && address ? address.port : 0
  try {
    const login = await fetch(`http://127.0.0.1:${port}/login`).then(response => response.json() as Promise<{ session: string }>)
    assert.ok(login.session.length > 0)
    const protectedResponse = await fetch(`http://127.0.0.1:${port}/protected`, { headers: { 'x-nuxt-session': login.session } }).then(response => response.json() as Promise<{ userId: string, sessionVersion: number }>)
    assert.deepEqual(protectedResponse, { userId: 'user-029', sessionVersion: 0 })
  } finally {
    await new Promise<void>((resolve, reject) => server.close(error => error ? reject(error) : resolve()))
  }
})

test('mobile session contract keeps the frozen seven-day maximum age', () => {
  assert.equal(createMobileSessionConfig({ password: 'test' }).maxAge, MOBILE_SESSION_MAX_AGE)
  assert.equal(createMobileSessionConfig({ password: 'test' }).name, 'nuxt-session')
})

test('session version validation fails closed for legacy, invalid, mismatched, and revoked sessions', () => {
  assert.equal(isCurrentSessionVersion(undefined, 0), false, 'legacy session without a version must fail')
  assert.equal(isCurrentSessionVersion('0', 0), false, 'string version must fail')
  assert.equal(isCurrentSessionVersion(0.5, 0), false, 'fractional version must fail')
  assert.equal(isCurrentSessionVersion(0, 0), true, 'matching version must pass')
  assert.equal(isCurrentSessionVersion(1, 0), false, 'mismatched version must fail')
  assert.equal(isCurrentSessionVersion(0, 1), false, 'old version after revocation must fail')
})

test('mobile positioning response contract exposes only the dedicated authority fields', () => {
  const response = { configured: true, workspaceId: 'workspace-029', situmAccountId: 'org-029', apiKey: 'positioning-only-test-value' }
  assert.deepEqual(Object.keys(response).sort(), ['apiKey', 'configured', 'situmAccountId', 'workspaceId'])
  assert.equal('encryptedApiKey' in response, false)
  assert.equal('encryptedViewerApiKey' in response, false)
})
