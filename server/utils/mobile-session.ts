import type { SessionConfig } from 'h3'

export const MOBILE_SESSION_MAX_AGE = 60 * 60 * 24 * 7

export function mobileSessionConfig(): SessionConfig {
  const session = useRuntimeConfig().session as { password?: string, cookie?: SessionConfig['cookie'] }
  if (!session.password) throw createError({ statusCode: 503, statusMessage: 'Session protection is unavailable.' })
  return { password: session.password, maxAge: MOBILE_SESSION_MAX_AGE, sessionHeader: 'x-nuxt-session', cookie: session.cookie }
}
