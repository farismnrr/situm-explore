# Situm Explore

Situm Explore is a single full-stack Nuxt application using Nuxt UI and Nitro server routes.

## Setup

```sh
npm install
cp .env.example .env
npm run dev
```

Required configuration:

- `NUXT_SESSION_PASSWORD`: at least 32 characters; used by maintained `nuxt-auth-utils` for sealed secure sessions.
- `AUTH_EMAIL` and `AUTH_PASSWORD_HASH`: the single owner credential. Generate the scrypt hash with `hashPassword` from `nuxt-auth-utils`; login verifies it with `verifyPassword`.
- `DATABASE_URL` for the shared PostgreSQL instance. The application-owned schema is fixed as `situm_explore`.
- `NUXT_PUBLIC_SITUM_VIEWER_API_KEY` and `NUXT_PUBLIC_SITUM_BUILDING_ID`: a dedicated read-only/browser-safe Situm Map Viewer credential and building identifier. The key is public because the SDK requires it in the browser; do not use a discovery, administration, or server credential here.

## Database

Drizzle owns only the dedicated `situm_explore` schema. Review `drizzle/0000_silent_stick.sql`, then run `npm run db:migrate`; migrations are never applied automatically. The protected `/api/me` endpoint reads the `foundation` record from `app_settings` and reports a safe empty or not-migrated state.

## Situm

The protected dashboard creates the official `@situm/sdk-js` Map Viewer with the configured public API key and building ID. Missing configuration and SDK initialization errors are shown in the UI.
