# Plan 021 — Identity & Auth Foundation

Status: complete; production auth/UI acceptance passed. Google OAuth runtime remains separately deferred.

Branch: plan/021-auth-identity-foundation

Depends on: roadmap/021-025-backend-refactor reviewed and integrated into main under the normal Git workflow.

## Goal

Replace the current single-user environment-based login with database-backed application users while keeping the existing sealed Nuxt session model.

## Scope

- PostgreSQL/Drizzle user identity model with normalized unique email identity.
- Working email/password registration, login, logout, session, /api/me, and real /register UI.
- Password hashing/verification through the installed project auth utility; never store plaintext passwords.
- Google OAuth provider wiring through provider identity schema, callback/config, and .env.example; real OAuth acceptance is deferred to the user.
- Existing protected APIs remain protected server-side.
- Remove AUTH_EMAIL / AUTH_PASSWORD_HASH as active auth authority after the DB path is accepted; no env fallback bypass.

## Identity / OAuth rules

- App users have stable app IDs independent of provider IDs.
- Provider identities are unique by provider + provider account identifier.
- Email/password and Google identities must not create duplicate app users for the same normalized email without a deliberate rule.
- Verify the exact Google user payload from installed nuxt-auth-utils. Only auto-link an existing account when the provider supplies a verified email that safely matches the normalized app-user email; otherwise stop that linking path rather than guessing.
- Google access/refresh tokens are not app session identity and are not persisted without a concrete product requirement.

## Public-auth safety baseline

- Validate/normalize registration and login input.
- Use generic invalid-credential responses for login.
- Enforce a reasonable password-length policy without unnecessary composition rules.
- Audit CSRF/cookie/session defaults for state-changing authenticated requests.
- Add the smallest practical login/register abuse protection supported by the current runtime. Do not provision Redis or another service solely for rate limiting; document any durability limitation.

## Execution

### Stacked execution progress

- [x] Phase 1 — audit existing auth/session/database/runtime contracts.
- [x] Phase 2 — add and apply PostgreSQL users/provider-identities schema and migrations.
- [x] Phase 3 — implement registration and password login.
- [x] Phase 4 — migrate session identity and protected API continuity.
- [x] Phase 5 — prepare conditional Google provider wiring.
- [x] Phase 6 — update auth UI and complete acceptance validation.

1. Audit auth routes, middleware, session typing, login UI, DB schema/migrations, Nuxt config, and installed nuxt-auth-utils behavior.
2. Verify DATABASE_URL, app-schema migration rights, and NUXT_SESSION_PASSWORD.
3. Add the smallest user/provider-identity schema needed for password + Google identities.
4. Implement registration and password login.
5. Migrate session identity from env config to stable DB user identity; old env-derived sessions may be invalidated rather than preserved ambiguously.
6. Add Google OAuth callback/config readiness using official provider support and env placeholders.
7. Add/update /register and login UI only as needed for real auth behavior.
8. Validate migration, register/login/logout/session, duplicate-email handling, unauthenticated 401, protected API continuity, lint, typecheck, build, and production-preview smoke.

## Configuration / blockers

Required for acceptance:
- DATABASE_URL with app-schema migration rights.
- NUXT_SESSION_PASSWORD (at least 32 characters).

Prepared but not required for acceptance:
- NUXT_OAUTH_GOOGLE_CLIENT_ID
- NUXT_OAUTH_GOOGLE_CLIENT_SECRET
- optional NUXT_OAUTH_GOOGLE_REDIRECT_URL

Google Console callback URL must match the implemented provider route before manual OAuth testing.

See plans/021-025-prerequisites.md.

## Boundaries

- No workspace model yet.
- No Google runtime acceptance in this plan.
- No password reset/email verification/account deletion unless separately approved.
- No auth bypass/dev-login path.
