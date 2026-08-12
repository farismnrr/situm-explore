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
- `NUXT_PUBLIC_SITUM_API_KEY` and `NUXT_PUBLIC_SITUM_BUILDING_ID`: Situm POC API key and building identifier. The POC intentionally uses one key for the browser viewer and later Situm integrations; a Read & Write key may be used temporarily for speed and should be revoked/replaced after the POC.

## Database

Drizzle owns only the dedicated `situm_explore` schema. Review `drizzle/0000_silent_stick.sql`, then run `npm run db:migrate`; migrations are never applied automatically. The protected `/api/me` endpoint reads the `foundation` record from `app_settings` and reports a safe empty or not-migrated state.

## Situm

The protected dashboard creates the official `@situm/sdk-js` Map Viewer with the configured POC API key and building ID. Missing configuration and SDK initialization errors are shown in the UI.
