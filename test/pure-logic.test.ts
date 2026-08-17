import { strict as assert } from 'node:assert'
import { createServer } from 'node:http'
import { test } from 'node:test'
import { isValidDateRange } from '../server/utils/date-range'
import { buildAnalyticsSyncKey } from '../server/integrations/clickhouse/schema'
import { rateLimit } from '../server/utils/rate-limit'
import { boundedFetch, UpstreamTimeoutError } from '../server/utils/bounded-fetch'

test('isValidDateRange accepts a well-formed same-or-later range', () => {
  assert.equal(isValidDateRange('2026-01-01', '2026-01-31'), true)
  assert.equal(isValidDateRange('2026-01-01', '2026-01-01'), true)
})

test('isValidDateRange rejects malformed, reversed, or overlong ranges', () => {
  assert.equal(isValidDateRange('2026-01-31', '2026-01-01'), false)
  assert.equal(isValidDateRange('not-a-date', '2026-01-01'), false)
  assert.equal(isValidDateRange('2026-02-30', '2026-03-01'), false)
  assert.equal(isValidDateRange('2024-01-01', '2026-01-02'), false)
})

test('buildAnalyticsSyncKey produces a distinct deterministic key per report/date/scope', () => {
  const a = buildAnalyticsSyncKey('positioning_time', '2026-01-01', '2026-01-31', 'workspace-a:5')
  const b = buildAnalyticsSyncKey('positioning_time', '2026-01-15', '2026-02-15', 'workspace-a:5')
  const c = buildAnalyticsSyncKey('positioning_time', '2026-01-01', '2026-01-31', 'workspace-a:5')
  assert.equal(a, 'positioning_time:2026-01-01:2026-01-31:workspace-a:5')
  assert.notEqual(a, b, 'overlapping-but-different windows must produce different sync keys, so a workspace analytics prefix match cannot accidentally include the other window')
  assert.equal(a, c)
})

test('rateLimit allows up to the limit within a window, then blocks', () => {
  const key = `test:${Math.random()}`
  for (let i = 0; i < 3; i++) assert.equal(rateLimit(key, 3, 60_000), true, `request ${i} should be allowed`)
  assert.equal(rateLimit(key, 3, 60_000), false, 'request beyond the limit should be blocked')
})

test('rateLimit resets after the window elapses', () => {
  const key = `test:${Math.random()}`
  assert.equal(rateLimit(key, 1, 50), true)
  assert.equal(rateLimit(key, 1, 50), false)
})

test('rateLimit tracks distinct keys independently', () => {
  const keyA = `test:${Math.random()}`
  const keyB = `test:${Math.random()}`
  assert.equal(rateLimit(keyA, 1, 60_000), true)
  assert.equal(rateLimit(keyA, 1, 60_000), false)
  assert.equal(rateLimit(keyB, 1, 60_000), true, 'a different key must not be affected by another key exhausting its limit')
})

test('boundedFetch aborts and throws UpstreamTimeoutError when the upstream never responds', async () => {
  const server = createServer((_req, res) => { void res /* never respond */ })
  await new Promise<void>(resolve => server.listen(0, resolve))
  const address = server.address()
  const port = typeof address === 'object' && address ? address.port : 0
  const startedAt = Date.now()
  await assert.rejects(() => boundedFetch(`http://127.0.0.1:${port}/`, {}, 200), UpstreamTimeoutError)
  const elapsedMs = Date.now() - startedAt
  assert.ok(elapsedMs < 2000, `expected the bound (200ms) to be enforced, took ${elapsedMs}ms`)
  await new Promise<void>((resolve, reject) => server.close(error => (error ? reject(error) : resolve())))
})

test('boundedFetch resolves normally for a fast upstream response', async () => {
  const server = createServer((_req, res) => res.end('ok'))
  await new Promise<void>(resolve => server.listen(0, resolve))
  const address = server.address()
  const port = typeof address === 'object' && address ? address.port : 0
  const response = await boundedFetch(`http://127.0.0.1:${port}/`, {}, 5000)
  assert.equal(response.ok, true)
  await new Promise<void>((resolve, reject) => server.close(error => (error ? reject(error) : resolve())))
})
