# Current State

_Last reviewed: 2026-08-12_

## Current focus

Execute a gap-free sequential roadmap for the Situm Explore POC: first align the existing small Nuxt codebase to the Nuxt 4 architecture contract, then implement the full approved UI from the single user-owned HTML reference with dummy/local data for missing domains, then integrate selected Situm data/capabilities in later dedicated plans.

## Phase

**Plan 004 is next. Phase 0 architecture/setup may run now; visual Phase 1+ remains blocked until the user replaces the canonical `Hello World` HTML placeholder.**

## Active contracts

- `AGENTS.md` — root agent router and sequential-plan guard.
- `.agents/protocols/git-workflow.md` + `plans/README.md` — branch/phase/push/PR/integration workflow.
- `ARCHITECTURE.md` — Nuxt 4 folder/layer/dependency source of truth.
- `DESIGN.md` — design source-of-truth router.
- `design/IMPLEMENTATION.md` — HTML -> Nuxt UI translation contract.
- `design/data-source-matrix.md` — Plans 004–009 real-vs-dummy contract.
- `design/reference/situm-explore-interactive-prototype.html` — only visual/interaction reference once populated by the user.

Historical plans/session notes are evidence only and do not override these current contracts.

## Sequential execution rule

For every dependent plan:

```text
finish + validate plan branch
-> push
-> user reviews
-> user explicitly authorizes PR/integration
-> dependency lands in main
-> sync main
-> create next plan branch from updated origin/main
```

Do not start a dependent plan from stale `main` and do not silently stack branches. Stacked branches require explicit user request.

## Nuxt architecture target

Plan 004 Phase 0 owns the one-time migration:

```text
app.vue                     -> app/app.vue
app.config.ts               -> app/app.config.ts
assets/                     -> app/assets/
components/                 -> app/components/ with shallow product grouping
middleware/                 -> app/middleware/
pages/                      -> app/pages/
server/utils/db.ts          -> server/db/client.ts
server/db/schema.ts         -> unchanged
server/api/**               -> routes preserved
```

Do not create empty `services/`, `repositories/`, `shared/`, `layers/`, stores, or generic infrastructure solely to match a diagram.

## Current UI/data boundary

Plans 004–009 are UI-first and dummy-first for product domains without an existing integration.

Keep real:

- `/api/auth/login`, `useUserSession()`, logout, server session authorization;
- `/api/me` and PostgreSQL/Drizzle behavior;
- `/api/situm/status` as configuration status only;
- existing `SitumViewer` creation, `MAP_IS_READY`, `APP_ERROR`, and initialization errors.

Keep dummy/local until after UI acceptance:

- registration;
- business metrics/activity;
- Buildings/Floors/POIs/Categories product data;
- Geofences/Paths and route previews;
- all newly represented Map Explore/Route/Layers controls beyond the existing Viewer lifecycle;
- Realtime;
- Reports/Analytics;
- Alarms;
- Users/Groups/Organization;
- newly represented Viewer settings/config/style/image behavior.

Canonical synthetic records should be reused across screens from `app/data/prototype/` once Plan 004 migrates the app structure.

## Situm POC setup

- Env: `NUXT_PUBLIC_SITUM_API_KEY` and `NUXT_PUBLIC_SITUM_BUILDING_ID`.
- The single time-boxed POC key may have Read & Write permission for speed; revoke/replace it after the POC.
- Never persist/log/render the key value.
- If building ID is missing locally, agent may GET `https://api.situm.com/api/v1/buildings` with `X-API-KEY` and write only the selected ID to ignored local `.env`.
- Do not silently guess if multiple building candidates are genuinely ambiguous.
- Broader key permission does not expand Plans 004–009.

## UI roadmap

1. `plans/004-ui-foundation-public-auth.md`
   - Phase 0: Nuxt 4 architecture/setup alignment; may run before HTML population.
   - Phase 1+: Landing/Login/Register; requires populated HTML.
   - Ends with real login still going to existing `/dashboard` so the plan is independently usable.
2. `plans/005-authenticated-shell-dashboard.md`
   - After Plan 004 lands in main.
   - Atomically creates `/app/**`, changes login continuation to `/app`, redirects/retires legacy dashboard UI, and keeps the real Viewer reachable at `/app/map`.
3. `plans/006-situm-map-workspace.md`
   - Approved map workspace around the existing real Viewer; all new product controls remain dummy/local.
4. `plans/007-cartography-explorer.md`
   - Buildings/Floors, POIs, Geofences, Paths dummy UI; reuse canonical fixtures.
5. `plans/008-operations-reports-ui.md`
   - Realtime, Reports, Alarms, Users/Groups, Organization, Settings dummy/local UI.
6. `plans/009-ui-conformance-polish.md`
   - Whole-product HTML conformance, responsive/accessibility, regression, architecture/DRY, docs gate.

Plan 010 cannot start until Plan 009 is integrated and the user explicitly accepts the complete UI.

## Later Situm integration roadmap

- `plans/010-progressive-situm-data-integration.md` — feasibility/capability/data-contract mapping only; no fixture replacement.
- `plans/011-situm-buildings-pois-read-integration.md` — Buildings/Floors/POIs/Categories.
- `plans/012-situm-geofences-paths-routing-integration.md` — Geofences/Paths/Routing.
- `plans/013-situm-realtime-integration.md` — Realtime.
- `plans/014-situm-reports-analytics-integration.md` — Reports/Analytics.
- `plans/015-situm-organization-alarms-read-integration.md` — Organization/Users/Groups/Alarms where still valuable.

These later plans also execute sequentially through integrated `main`. Real write actions are not implicitly included; if still needed for the POC, create a later explicit mutation plan.

## Completed / historical

- Plans 000, 001, 002: completed foundation/resource work.
- Plan 003: complete/closed historical UI attempt; rendered result was not accepted as the current design target.

## Current blocker / open loop

The canonical HTML file in the repository still contains only `Hello World`. The user intends to replace it manually with the approved interactive prototype.

Plan 004 Phase 0 may run before that replacement. After Phase 0, visual work must stop if the HTML is still placeholder-only.

## Audit status

A repository-wide pre-execution audit on 2026-08-12 corrected:

- stale Read-Only credential wording;
- Plan 010 implementation overlap with Plans 011–015;
- sequential branch dependency ambiguity;
- Plan 004 -> Plan 005 missing-route/login transition;
- temporary loss risk for the real Viewer during route migration;
- accidental permission for new Situm SDK/API wiring inside UI plans;
- duplicate dummy-fixture ownership ambiguity;
- stale durable goals/preferences/knowledge and project package description.

The remaining intentional boundary before UI work is the user-populated canonical HTML.

## Next action

When implementation begins, start Plan 004 from latest `origin/main`, execute Phase 0, validate/commit/push, and wait at the HTML guard if the canonical reference is still placeholder-only. No PR/integration without explicit user authorization.
