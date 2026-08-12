import { eq } from 'drizzle-orm'
import { appSettings } from '../db/schema'
import { getDb } from '../utils/db'

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event)
  try {
    const records = await getDb().select({ key: appSettings.key, value: appSettings.value }).from(appSettings).where(eq(appSettings.key, 'foundation')).limit(1)
    return { status: records[0] ? 'connected' : 'connected-empty', setting: records[0] ?? null, email: session.user?.email }
  } catch (error: unknown) {
    if ((error as { code?: string }).code === '42P01') return { status: 'not-migrated', setting: null, email: session.user?.email }
    throw createError({ statusCode: 503, statusMessage: 'Database is unavailable.' })
  }
})
