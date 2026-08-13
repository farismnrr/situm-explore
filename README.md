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
- `NUXT_SITUM_API_KEY`: private Nitro credential reserved for future authenticated Situm REST/domain reads. It must never enter browser runtime config or client bundles.
- `NUXT_PUBLIC_SITUM_BUILDING_ID`: building loaded by the current Map Viewer. This is an identifier, not a secret.

Plan 010 freezes the product contract so future Situm REST/domain reads use `NUXT_SITUM_API_KEY` through private Nitro runtime credentials behind authenticated `/api/situm/*` routes. Browser Viewer authentication remains a separate legacy boundary until a later plan verifies and migrates it safely.

### Discover the Situm building ID during the current legacy setup

If local `.env` contains the legacy Viewer key but `NUXT_PUBLIC_SITUM_BUILDING_ID` is blank, an operator may discover accessible buildings as a local/server-side setup step using Situm's REST API, then write only the selected building ID to ignored `.env`. This is not a browser feature and does not authorize a generic proxy.

Do not commit `.env`, API keys, JWTs, or credential-bearing command output.

This discovery step is setup for the existing Viewer only; it does not authorize application REST integrations from the browser.

## Database

Drizzle owns only the dedicated `situm_explore` schema. Review migrations before running `npm run db:migrate`; migrations are never applied automatically. The protected `/api/me` endpoint reports safe application/database state.

## Authentication

The authenticated workspace is rooted at `/app`. Login uses the existing Nitro endpoint/session flow and `/app/**` remains protected by the current auth middleware. Protected product API routes, including `/api/situm/*`, must enforce the existing server-side session independently of client route middleware.

The current POC does not have a real self-service account-registration backend; the historical dummy `/register` flow is removed. `/api/situm/status` reports configuration presence only and is not a Situm health check or Viewer readiness signal.

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
