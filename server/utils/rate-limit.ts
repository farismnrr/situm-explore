type Bucket = { count: number, resetAt: number }

const buckets = new Map<string, Bucket>()

// Single-process, in-memory fixed-window limiter. Deliberately not
// distributed: this app runs as one Nitro server process (see Plan 026),
// so a shared store like Redis is not justified for this purpose.
export function rateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now()
  pruneExpired(now)
  const bucket = buckets.get(key)
  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs })
    return true
  }
  if (bucket.count >= limit) return false
  bucket.count += 1
  return true
}

// Cleanup piggybacks on normal limiter operation (no background timers):
// every call sheds already-expired buckets so the map cannot grow without
// bound as more unique identities are seen.
function pruneExpired(now: number): void {
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key)
  }
}

export function requireRateLimit(event: Parameters<typeof getRequestIP>[0], scope: string, limit: number, windowMs: number): void {
  // The staging/production deployment (deploy/staging.compose.yml) publishes
  // the Nitro server directly on the host port with no reverse proxy in
  // front of it, so there is no trusted contract that sanitizes
  // X-Forwarded-For. Trusting that client-supplied header here would let an
  // unauthenticated caller rotate it to bypass this limiter entirely.
  // Use only the server-observed socket address (xForwardedFor: false).
  const ip = getRequestIP(event, { xForwardedFor: false }) || 'unknown'
  if (!rateLimit(`${scope}:${ip}`, limit, windowMs)) throw createError({ statusCode: 429, statusMessage: 'Too many requests. Try again later.' })
}
