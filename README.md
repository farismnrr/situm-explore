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
- `NUXT_PUBLIC_SITUM_API_KEY`: browser-visible Map Viewer credential only. Use the minimum Situm role that supports retained Viewer behavior and never reuse it as the server REST credential.
- `NUXT_SITUM_API_KEY`: single private Nitro credential for all server-side Situm operations. It must never enter browser runtime config or client bundles.
- `NUXT_PUBLIC_SITUM_BUILDING_ID`: building loaded by the current Map Viewer. This is an identifier, not a secret.

The final Situm credential model intentionally uses exactly **two Situm keys**: one public Viewer key and one private Nitro key. Do not introduce separate private read/write keys without a concrete future requirement.

## Current status

Plans 010–016 plus Plan 016A are complete on the cumulative branch `plan/016a-situm-credential-split-runtime-verification`.

Plan 016A completed the final credential/config boundary, Nuxt 4 TypeScript configuration cleanup, static/security validation, and live runtime smoke for the implemented Situm server read paths. `/api/situm/status` reports server and Viewer configuration separately without exposing credential values.

The cumulative branch is ready for user-gated PR review/integration into `main`.

Do not commit `.env`, API keys, JWTs, or credential-bearing command output.

## Database

Drizzle owns only the dedicated `situm_explore` schema. Review migrations before running `npm run db:migrate`; migrations are never applied automatically. The protected `/api/me` endpoint reports safe application/database state.

## Authentication

The authenticated workspace is rooted at `/app`. Login uses the existing Nitro endpoint/session flow and `/app/**` remains protected by the current auth middleware. Protected product API routes, including `/api/situm/*`, must enforce the existing server-side session independently of client route middleware.

The current POC does not have a self-service account-registration backend; the historical dummy `/register` flow is removed. `/api/situm/status` requires the app session and reports private Situm configuration presence only; Viewer configuration is reported separately. It is not a Situm health check or Viewer readiness signal.

Plan 017 analytics uses the existing local ClickHouse instance through the server-only `CLICKHOUSE_URL`, `CLICKHOUSE_USER`, `CLICKHOUSE_PASSWORD`, and `CLICKHOUSE_DB` variables documented in `.env.example`. The authenticated `/api/health` endpoint reports ClickHouse availability separately from Situm configuration without returning connection details. The app-owned `situm_explore_analytics` schema uses `ReplacingMergeTree` keyed by report window and row dimensions; sync identity keys provide deterministic re-sync foundations. Do not add a second ClickHouse server or expose these variables through public runtime config.

## Situm integration roadmap

The completed cumulative roadmap is:

```text
010   capability pruning + security/data contract
011   Buildings/Floors/POIs/Categories
012   Geofences/Paths/static directions evidence boundary
013   Realtime monitoring
014   Reports/Analytics — skipped/unresolved implementation
015   Organization/Users + Groups/Alarms evidence boundary
016   verified web-safe Viewer/Settings capabilities
016A  credential/config/runtime hardening + live verification
```

Implemented Situm server read paths have been runtime-smoked with configured credentials. Remaining evidence-gated areas such as full Reports/Analytics, Groups, Alarms, richer routing results, and some realtime/Viewer semantics should become Plan 017 or later only when exact official contracts and concrete product scope justify them.

Device indoor positioning/bluedot and movement-aware navigation are intentionally outside this Nuxt web roadmap.

See `design/data-source-matrix.md` and `.agents/state.md` for current capability/source authority and unresolved follow-up scope.
