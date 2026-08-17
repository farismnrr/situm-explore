import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { getDb } from '../../db/client'
import { users } from '../../db/schema'

const registrationSchema = z.object({
  email: z.string().trim().email().max(320),
  password: z.string().min(8).max(128),
})

export default defineEventHandler(async (event) => {
  requireRateLimit(event, 'auth:register', 5, 60_000)

  const parsed = registrationSchema.safeParse(await readBody(event))
  if (!parsed.success) throw createError({ statusCode: 400, statusMessage: 'A valid email and password are required.' })

  const email = parsed.data.email.toLowerCase()

  const existing = await getDb().select({ id: users.id }).from(users).where(eq(users.email, email)).limit(1)
  if (existing[0]) throw createError({ statusCode: 409, statusMessage: 'An account with that email already exists.' })

  const passwordHash = await hashPassword(parsed.data.password)

  try {
    const [user] = await getDb().insert(users).values({ email, passwordHash }).returning({ id: users.id, email: users.email })
    if (!user) throw createError({ statusCode: 500, statusMessage: 'Unable to create account.' })
    await setUserSession(event, { user: { id: user.id, email: user.email } })
    return { ok: true, user: { id: user.id, email: user.email } }
  } catch (error: unknown) {
    if ((error as { code?: string }).code === '23505') throw createError({ statusCode: 409, statusMessage: 'An account with that email already exists.' })
    throw error
  }
})
