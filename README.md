# Situm Explore

Situm Explore is a single full-stack Nuxt application using Nuxt UI and Nitro server routes.

## Setup

```sh
npm install
cp .env.example .env
npm run dev
```

Required configuration for the **current baseline**:

- `NUXT_SESSION_PASSWORD`: at least 32 characters; used by `nuxt-auth-utils` for sealed sessions.
- `AUTH_EMAIL` and `AUTH_PASSWORD_HASH`: configured-owner login credential.
- `DATABASE_URL`: shared PostgreSQL instance; the application-owned schema is `situm_explore`.
- `NUXT_PUBLIC_SITUM_API_KEY`: **legacy current Map Viewer POC credential only**. Current `SitumViewer` still requires it; do not reuse this public value for new REST/domain backend integrations.
- `NUXT_PUBLIC_SITUM_BUILDING_ID`: building loaded by the current Map Viewer. This is an identifier, not a secret.

Plan 010 is migrating the product contract so future Situm REST/domain reads use private Nitro runtime credentials behind authenticated app routes. Browser Viewer authentication is treated as a separate boundary and will use the smallest safe mechanism verified against the current Situm SDK before the legacy public credential is retired.

### Discover the Situm building ID during the current legacy setup

If local `.env` contains the legacy Viewer key but `NUXT_PUBLIC_SITUM_BUILDING_ID` is blank, a developer may discover accessible buildings locally using Situm's REST API, then write only the selected building ID to ignored `.env`.

Do not commit `.env`, API keys, JWTs, or credential-bearing command output.

This discovery step is setup for the existing Viewer only; it does not authorize application REST integrations from the browser.

## Database

Drizzle owns only the dedicated `situm_explore` schema. Review migrations before running `npm run db:migrate`; migrations are never applied automatically. The protected `/api/me` endpoint reports safe application/database state.

## Authentication

The authenticated workspace is rooted at `/app`. Login uses the existing Nitro endpoint/session flow and `/app/**` remains protected by the current auth middleware plus server-side guards for protected API routes.

The current POC does not have a real self-service account-registration backend. Plan 010 may remove the historical dummy `/register` flow rather than pretending an account is created.

## Situm integration roadmap

The current `main` baseline contains a real embedded Situm Map Viewer plus prototype data around many product screens. Starting with Plan 010, those prototype behaviors are classified before backend integration:

- real web Situm capability -> retained and assigned to Plans 011–016;
- app-owned web behavior -> retained as product functionality;
- device/native-only capability -> removed from the web product and reserved for a possible future native roadmap;
- unsupported/fake/low-value Situm-domain behavior -> removed.

Current roadmap:

```text
010  capability pruning + security/data contract
011  Buildings/Floors/POIs/Categories
012  Geofences/Paths/static directions
013  Realtime monitoring
014  Reports/Analytics
015  Organization/Users/Groups/Alarms read-only
016  remaining web-safe Viewer/Settings capabilities (conditional)
```

Device indoor positioning/bluedot and motion-aware navigation are intentionally outside this Nuxt web roadmap.

See `design/data-source-matrix.md` for the current capability/source authority.
