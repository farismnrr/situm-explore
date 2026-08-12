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
- `DATABASE_URL` and optional `DB_SCHEMA` (default `situm_explore`).
- `NUXT_PUBLIC_SITUM_API_KEY` and `NUXT_PUBLIC_SITUM_BUILDING_ID`: the official Situm browser SDK credential and building identifier. The API key is explicitly public because the SDK requires it in the browser.

## Database

Drizzle owns only the dedicated `situm_explore` schema. Review `drizzle/0000_silent_stick.sql`, then run `npm run db:migrate`; migrations are never applied automatically. The protected `/api/me` endpoint reads the `foundation` record from `app_settings` and reports a safe empty or not-migrated state.

## Situm

The protected dashboard creates the official `@situm/sdk-js` Map Viewer with the configured public API key and building ID. Missing configuration and SDK initialization errors are shown in the UI.
