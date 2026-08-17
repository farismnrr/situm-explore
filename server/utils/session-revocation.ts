import { eq, sql } from 'drizzle-orm'
import { getDb } from '../db/client'
import { users } from '../db/schema'

export async function revokeUserSessions(userId: string) {
  await getDb().update(users).set({ sessionVersion: sql`${users.sessionVersion} + 1`, updatedAt: new Date() }).where(eq(users.id, userId))
}

export async function assertCurrentSessionVersion(userId: string, version: unknown) {
  const [user] = await getDb().select({ sessionVersion: users.sessionVersion }).from(users).where(eq(users.id, userId)).limit(1)
  if (!user || (typeof version === 'number' && version !== user.sessionVersion)) {
    throw createError({ statusCode: 401, statusMessage: 'Authentication is required.' })
  }
}
