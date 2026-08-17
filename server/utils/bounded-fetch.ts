export class UpstreamTimeoutError extends Error {
  constructor(url: string) {
    super(`Upstream request timed out: ${new URL(url).pathname}`)
    this.name = 'UpstreamTimeoutError'
  }
}

// AbortController-based bounded fetch for app-owned outbound calls. Never
// includes request headers/body in the thrown error to avoid leaking
// credentials into logs.
export async function boundedFetch(url: string, init: RequestInit = {}, timeoutMs = 10_000): Promise<Response> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  try {
    return await fetch(url, { ...init, signal: controller.signal })
  } catch (error) {
    if (controller.signal.aborted) throw new UpstreamTimeoutError(url)
    throw error
  } finally {
    clearTimeout(timer)
  }
}
