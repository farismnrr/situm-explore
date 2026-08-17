import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { getDb } from '../../db/client'
import { users } from '../../db/schema'

const loginSchema = z.object({
  email: z.string().trim().email().max(320),
  password: z.string().min(1).max(128),
})

export default defineEventHandler(async (event) => {
  requireRateLimit(event, 'auth:login', 10, 60_000)

  const parsed = loginSchema.safeParse(await readBody(event))
  if (!parsed.success) throw createError({ statusCode: 400, statusMessage: 'Email and password are required.' })

  const email = parsed.data.email.toLowerCase()
  const record = await getDb().select({ id: users.id, email: users.email, passwordHash: users.passwordHash, sessionVersion: users.sessionVersion }).from(users).where(eq(users.email, email)).limit(1)
  const passwordMatches = record[0]?.passwordHash ? await verifyPassword(record[0].passwordHash, parsed.data.password) : false

  if (!record[0] || !passwordMatches) throw createError({ statusCode: 401, statusMessage: 'Invalid credentials.' })

  await setUserSession(event, { user: { id: record[0].id, email: record[0].email, sessionVersion: record[0].sessionVersion } })
  return { ok: true }
})
