import { assertCurrentSessionVersion } from '../utils/session-revocation'

export default defineEventHandler(async (event) => {
  const header = getRequestHeader(event, 'x-nuxt-session')
  const cookie = getRequestHeader(event, 'cookie')
  if (!header && !cookie?.match(/(?:^|;\s*)nuxt-session=/)) return
  const session = await getUserSession(event)
  if (session.user) await assertCurrentSessionVersion(session.user.id, session.user.sessionVersion)
})
