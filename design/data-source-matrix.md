# UI Data Source Matrix

This matrix is mandatory context for Plans 004–010.

## Core rule

**Use existing real integrations where they already exist. Use typed client-side dummy data where they do not.**

Do not add server APIs, database tables, migrations, or Situm-backed feature work merely to populate the approved UI reference.

| Surface | Source during UI implementation | Mode | Rule |
| --- | --- | --- | --- |
| Public landing | Static Nuxt content | STATIC | No backend required. |
| Login | `/api/auth/login` + `useUserSession()` | REAL | Preserve existing endpoint/session behavior. |
| Logout/session identity | `nuxt-auth-utils` | REAL | Use current session; never hard-code owner identity. |
| Registration | none | DUMMY | Local validation/demo completion only; no account creation. |
| `/app/**` route protection | `middleware/auth.ts` | REAL | Keep all authenticated app routes protected. |
| PostgreSQL/application status | `/api/me` | REAL | Reuse existing route; no second health API. |
| Situm configuration presence | `/api/situm/status` | REAL | Configuration status only; not viewer-ready. |
| Situm Map Viewer | `SitumViewer.vue` + `@situm/sdk-js` | REAL | Preserve `MAP_IS_READY` and `APP_ERROR`. |
| Home metrics/activity | none | DUMMY | Typed local fixtures. |
| Dashboard business metrics/charts | none | DUMMY | Keep real system-status sections separate. |
| Buildings/floors | no app endpoint | DUMMY | No Situm discovery proxy during UI plans. |
| POIs/categories | no app endpoint | DUMMY | Local search/filter/favorite state. |
| Geofences | no app endpoint | DUMMY | Local list/stats/map navigation only. |
| Paths/routing | no app endpoint | DUMMY | Local route preview; do not imply real calculation. |
| Map Explore/Route/Layers controls | no app wrapper today | DUMMY AROUND REAL VIEWER | Real iframe remains mounted; surrounding state can be local. |
| Realtime positions | no app endpoint | DUMMY | Local simulated movement/refresh only. |
| Analytics/reports | no app endpoint | DUMMY | Local tabs/charts/tables/export demo. |
| Alarms | no app endpoint | DUMMY | Read-only local rows. |
| Users/groups | no app endpoint | DUMMY | Keep separate from app authentication identity. |
| Organization | no app endpoint | DUMMY/STATIC | Generic POC context only. |
| Viewer config/styles/images/settings | no app endpoint | DUMMY | Local toggles/selects only during UI plans. |
| Situm API-key permission label | project decision | STATIC CONTEXT | POC may use one Read & Write key; never render the key value. |

## Real integration invariants

### Authentication

Do not replace real login with the prototype's "anything works" behavior. The prototype demonstrates UX only.

### PostgreSQL

Do not create new tables/migrations for UI counters, activity, reports, settings, registration, or fixtures.

### Situm Viewer

The actual viewer is ready only after its SDK event. `/api/situm/status` must not be used to fake the `Ready` state.

### Credentials

The POC uses one Situm API key through `NUXT_PUBLIC_SITUM_API_KEY`. It may temporarily have Read & Write permission for speed during the POC. Never commit, render, fingerprint, or log its value. Revoke or replace it after the POC.

This credential decision does **not** change the UI roadmap: Plans 004–009 remain UI-first and dummy-first for product domains that do not already have a working integration.

## Dummy-data implementation rules

1. Keep data typed and centralized in a small local fixture location.
2. Use obviously synthetic values in source while keeping the user-facing product believable.
3. Do not add Nitro endpoints just to return fixture JSON.
4. Do not persist fixtures to PostgreSQL.
5. Do not create a generic repository/service layer solely for future replacement.
6. Local interactions are allowed: filters, search, sort, tabs, drawers, toggles, toasts, route previews, report tabs, local CSV generation, simulated movement.
7. Dummy actions must not claim remote Situm mutations occurred.
8. A page may be mixed real/dummy only when the source of each section is deliberate and clear in code.

## Later replacement

After the UI is accepted, separate backend/integration plans may replace selected dummy datasets with real Situm-backed behavior. Until then, the UI implementation plans should not expand backend scope.
