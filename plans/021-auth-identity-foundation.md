# Plan 021 — Identity & Auth Foundation

Status: **ready / next**

Branch: `plan/021-auth-identity-foundation`

## Goal

Replace the current single-user environment-based login with database-backed application users while keeping the existing Nuxt session model.

## Scope

- PostgreSQL/Drizzle user identity model.
- Working email/password registration, login, logout, session, and `/api/me`.
- Google OAuth provider wiring through schema, callback/config, and `.env.example`; runtime OAuth acceptance is deferred to the user.
- Existing protected APIs remain protected server-side.

## Execution

1. Audit current auth routes, middleware, session typing, login UI, Drizzle schema/migrations, Nuxt config, and installed `nuxt-auth-utils` behavior.
2. Add the smallest user/auth identity schema needed for password + Google identities.
3. Implement registration and password login using the project's current auth utilities.
4. Migrate session identity from environment configuration to the database.
5. Add Google OAuth callback/config readiness using official provider support and environment placeholders.
6. Validate DB migration, register/login/logout/session behavior, unauthenticated 401 behavior, lint, typecheck, build, and production-preview smoke.

## Boundaries

- No workspace model yet.
- No Google runtime acceptance in this plan.
- No password reset/email verification unless separately approved.
- No auth bypass/dev-login path.
