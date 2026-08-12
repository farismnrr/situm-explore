# UI Data Source Matrix

This matrix is mandatory context for **Plans 004–009**. Plan 010 reads it only as the baseline describing what the accepted UI kept real vs dummy before later integrations begin.

## Core rule during Plans 004–009

**Preserve real integrations that already exist. Use typed local dummy data for product domains that do not.**

Do not add new Situm backend/REST/SDK product-domain integrations, database tables, migrations, or fake fixture APIs merely to complete the approved UI reference.

| Surface | Source during UI implementation | Mode | Rule |
| --- | --- | --- | --- |
| Public landing | Static Nuxt content | STATIC | No backend required. |
| Login | `/api/auth/login` + `useUserSession()` | REAL | Preserve existing endpoint/session behavior. |
| Logout/session identity | `nuxt-auth-utils` | REAL | Use current session; never hard-code owner identity. |
| Registration | none | DUMMY | Local validation/demo completion only; no account creation. |
| `/app/**` route protection | `app/middleware/auth.ts` after Plan 004 migration | REAL | Plan 005 moves unauthenticated app navigation to `/login`. |
| PostgreSQL/application status | `/api/me` | REAL | Reuse existing route; no second health API. |
| Situm configuration presence | `/api/situm/status` | REAL | Configuration status only; never call this viewer readiness. |
| Situm Map Viewer | `SitumViewer` + `@situm/sdk-js` | REAL EXISTING | Preserve viewer creation, `MAP_IS_READY`, `APP_ERROR`, and initialization-error behavior. |
| Public/auth visual composition | canonical HTML translated through Nuxt UI | REFERENCE | HTML is UI/UX evidence only, not code architecture. |
| Home metrics/activity | `app/data/prototype/` | DUMMY | Typed local fixtures. |
| Dashboard business metrics/charts | `app/data/prototype/` | DUMMY | Keep real foundation/system status separate. |
| Buildings/floors product lists | `app/data/prototype/` | DUMMY | No application Situm discovery endpoint during UI plans. |
| POIs/categories | `app/data/prototype/` | DUMMY | Local search/filter/favorite state. |
| Geofences | `app/data/prototype/` | DUMMY | Local list/stats/map context only. |
| Paths/routing | `app/data/prototype/` | DUMMY | Local route preview; never claim real calculation. |
| New Map Explore/Route/Layers controls | local Vue state + prototype fixtures around real Viewer | DUMMY AROUND REAL VIEWER | Do not add new Viewer/REST capability calls in Plans 004–009. |
| Realtime positions | `app/data/prototype/` | DUMMY | Local simulated movement/refresh only. |
| Analytics/reports | `app/data/prototype/` | DUMMY | Local tabs/charts/tables/export demo. |
| Alarms | `app/data/prototype/` | DUMMY | Read-only local rows. |
| Users/groups | `app/data/prototype/` | DUMMY | Keep separate from app authentication identity. |
| Organization | local synthetic/static context | DUMMY/STATIC | Do not call Situm organization APIs during UI plans. |
| Viewer config/styles/images/settings | local Vue state | DUMMY | No new Situm setting/config/style calls during UI plans. |
| Situm credential permission label | project decision | STATIC CONTEXT | If shown, use truthful current `Read & Write (POC)` or neutral configured wording; never show the key. |

## Real integration invariants

### Authentication

Do not replace real login with the prototype's `anything works` behavior.

Transition contract:

- Plan 004 login continues to existing `/dashboard` because `/app` does not exist yet.
- Plan 005 atomically creates `/app/**`, moves login continuation to `/app`, and keeps the real Viewer reachable at `/app/map`.

### PostgreSQL

Do not create new tables/migrations for UI counters, activity, reports, settings, registration, or fixtures.

### Situm Viewer

The actual Viewer is ready only after its SDK event. `/api/situm/status` must not fake the `Ready` state.

The broader POC key permission does not authorize new product-domain SDK/REST behavior in Plans 004–009.

### Credentials

The POC uses one Situm API key through `NUXT_PUBLIC_SITUM_API_KEY` plus `NUXT_PUBLIC_SITUM_BUILDING_ID`.

The key may temporarily have Read & Write permission for speed. Never commit, render, fingerprint, or log its value. Revoke/replace it after the POC.

A missing local building ID may be discovered as documented in `.env.example`, `README.md`, and Plan 004 Phase 0. That discovery is setup, not a product-domain integration.

## Dummy-data implementation rules

1. Keep data typed and centralized under `app/data/prototype/` after the Plan 004 Nuxt 4 migration.
2. Use synthetic values in source while keeping rendered product data believable.
3. Do not add Nitro endpoints merely to return fixture JSON.
4. Do not persist fixtures to PostgreSQL.
5. Do not create generic repository/service layers around fixtures.
6. **One logical synthetic resource gets one canonical fixture record.** Reuse building/POI/user/device records across global search, Map UI, Cartography UI, and Operations UI rather than duplicating them.
7. Local interactions are allowed: filters, search, sort, tabs, drawers, toggles, toasts, route previews, report tabs, local CSV generation, simulated movement.
8. Dummy actions must not claim a remote Situm mutation occurred.
9. A page may mix real foundation status and dummy product data only when the source boundary is deliberate and obvious in code.

## Later replacement

After Plan 009 is integrated and the user explicitly accepts the complete UI:

- Plan 010 maps/validates capabilities and data contracts only; it does not replace dummy data.
- Plans 011–015 replace selected dummy domains sequentially with real Situm data/capabilities.
- Real mutation/write actions, if still needed for the POC, require a later explicit plan rather than leaking backward into the UI roadmap.
