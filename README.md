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
- `NUXT_PUBLIC_SITUM_API_KEY`: the single Situm POC API key. The POC may temporarily use a Read & Write key for speed; revoke/replace it after the POC.
- `NUXT_PUBLIC_SITUM_BUILDING_ID`: the building loaded by the Map Viewer. It may be filled manually or discovered locally from Situm using the configured API key.

### Discover the Situm building ID

If the local `.env` already contains `NUXT_PUBLIC_SITUM_API_KEY` but `NUXT_PUBLIC_SITUM_BUILDING_ID` is blank, the agent may discover accessible buildings with the official Situm REST endpoint:

```sh
curl -fsS \
  -H "X-API-KEY: ${NUXT_PUBLIC_SITUM_API_KEY}" \
  https://api.situm.com/api/v1/buildings
```

The agent should inspect the returned building names/IDs, select the intended POC building, and write only the selected ID to the ignored local `.env` as `NUXT_PUBLIC_SITUM_BUILDING_ID`. Do not commit `.env`, API-key values, or credential-bearing command output.

## Database

Drizzle owns only the dedicated `situm_explore` schema. Review `drizzle/0000_silent_stick.sql`, then run `npm run db:migrate`; migrations are never applied automatically. The protected `/api/me` endpoint reads the `foundation` record from `app_settings` and reports a safe empty or not-migrated state.

## Situm

The authenticated workspace is rooted at `/app`; its `/app/map` route creates the official `@situm/sdk-js` Map Viewer with the configured POC API key and building ID. Missing configuration and SDK initialization errors are shown in the UI. The legacy `/dashboard` URL redirects to `/app/map` for compatibility.

During the UI roadmap, the Home and Dashboard product metrics and the surrounding product-domain screens use typed local prototype fixtures. The real session, `/api/me`, and Situm Viewer lifecycle remain active; `/api/situm/status` reports configuration only and is not a substitute for Viewer readiness.
