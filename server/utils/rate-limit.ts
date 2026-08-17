type Bucket = { count: number, resetAt: number }

const buckets = new Map<string, Bucket>()

// Single-process, in-memory fixed-window limiter. Deliberately not
// distributed: this app runs as one Nitro server process (see Plan 026),
// so a shared store like Redis is not justified for this purpose.
export function rateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now()
  const bucket = buckets.get(key)
  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs })
    return true
  }
  if (bucket.count >= limit) return false
  bucket.count += 1
  return true
}

export function requireRateLimit(event: Parameters<typeof getRequestIP>[0], scope: string, limit: number, windowMs: number): void {
  const ip = getRequestIP(event, { xForwardedFor: true }) || 'unknown'
  if (!rateLimit(`${scope}:${ip}`, limit, windowMs)) throw createError({ statusCode: 429, statusMessage: 'Too many requests. Try again later.' })
}
