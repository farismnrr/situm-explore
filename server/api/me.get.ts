import { eq } from 'drizzle-orm'
import { appSettings, users } from '../db/schema'
import { getDb } from '../db/client'

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event)
  const user = await getDb().select({ id: users.id, email: users.email }).from(users).where(eq(users.id, session.user.id)).limit(1)
  if (!user[0]) {
    await clearUserSession(event)
    throw createError({ statusCode: 401, statusMessage: 'Authentication required.' })
  }
  try {
    const records = await getDb().select({ key: appSettings.key, value: appSettings.value }).from(appSettings).where(eq(appSettings.key, 'foundation')).limit(1)
    return { status: records[0] ? 'connected' : 'connected-empty', setting: records[0] ?? null, user: user[0] }
  } catch (error: unknown) {
    if ((error as { code?: string }).code === '42P01') return { status: 'not-migrated', setting: null, user: user[0] }
    throw createError({ statusCode: 503, statusMessage: 'Database is unavailable.' })
  }
})
