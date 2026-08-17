import assert from 'node:assert/strict'
import test from 'node:test'

process.env.EXPO_PUBLIC_API_BASE_URL = 'https://mobile-test.invalid'
const { MobileApiClient } = await import('../mobile/src/api/client')

test('Plan 031 caller cancellation reaches fetch and is not converted to a timeout', async () => {
  const originalFetch = globalThis.fetch
  let requestSignal: AbortSignal | undefined
  globalThis.fetch = ((_input: RequestInfo | URL, init?: RequestInit) => new Promise<Response>((_resolve, reject) => {
    requestSignal = init?.signal
    init?.signal?.addEventListener('abort', () => reject(new DOMException('aborted', 'AbortError')), { once: true })
  })) as typeof fetch

  try {
    const caller = new AbortController()
    const request = new MobileApiClient().get('/api/workspaces/workspace-a/situm/realtime', { signal: caller.signal, timeoutMs: 1_000 })
    caller.abort()
    await assert.rejects(request, error => error instanceof Error && error.name === 'AbortError')
    assert.equal(requestSignal?.aborted, true)
  } finally {
    globalThis.fetch = originalFetch
  }
})
