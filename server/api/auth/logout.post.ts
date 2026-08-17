import { revokeUserSessions } from '../../utils/session-revocation'

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)
  if (session.user) await revokeUserSessions(session.user.id)
  await clearUserSession(event)
  return { ok: true }
})
