import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import { RealtimePollCoordinator } from '../mobile/src/realtime/state'

function deferred<T>() {
  let resolve!: (value: T) => void
  let reject!: (reason?: unknown) => void
  const promise = new Promise<T>((resolvePromise, rejectPromise) => { resolve = resolvePromise; reject = rejectPromise })
  return { promise, resolve, reject }
}

test('Realtime polling never overlaps an interval request', async () => {
  const requests: AbortSignal[] = []
  const first = deferred<unknown>()
  const coordinator = new RealtimePollCoordinator(async signal => { requests.push(signal); await first.promise })

  coordinator.poll()
  coordinator.poll()
  assert.equal(requests.length, 1)

  first.resolve(undefined)
  await new Promise(resolve => setImmediate(resolve))
  coordinator.poll()
  assert.equal(requests.length, 2)
  coordinator.dispose()
})

test('manual refresh supersedes an older request without allowing its completion to own the cycle', async () => {
  const requests: AbortSignal[] = []
  const first = deferred<unknown>()
  const second = deferred<unknown>()
  const coordinator = new RealtimePollCoordinator(async signal => {
    requests.push(signal)
    await (requests.length === 1 ? first.promise : second.promise)
  })

  coordinator.poll()
  coordinator.refresh()
  assert.equal(requests.length, 2)
  assert.equal(requests[0]?.aborted, true)

  first.resolve(undefined)
  await Promise.resolve()
  assert.equal(requests[1]?.aborted, false)
  second.resolve(undefined)
  await Promise.resolve()
  coordinator.dispose()
})

test('native positioning sends the verified explicit realtime upload cadence while preserving building scope', () => {
  const source = readFileSync(new URL('../mobile/src/positioning/session.ts', import.meta.url), 'utf8')
  assert.match(source, /realtimeUpdateInterval:\s*'REALTIME'/)
  assert.match(source, /buildingIdentifier:\s*buildingId/)
})
