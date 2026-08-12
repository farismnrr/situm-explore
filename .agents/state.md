# Current State

_Last reviewed: 2026-08-12_

## Current focus

Execute a gap-free sequential Situm Explore POC roadmap: Nuxt 4 architecture alignment -> complete approved UI with dummy/local data for missing domains -> user UI acceptance -> selective Situm integrations.

## Phase

**Plan 008 is in progress on a deliberately stacked branch based on completed Plan 007, per the user's explicit unattended-run override.**

## Active contracts

- `AGENTS.md` — root router and sequential-plan guard.
- `.agents/protocols/git-workflow.md` + `plans/README.md` — branch/phase/push/PR/integration workflow.
- `ARCHITECTURE.md` — Nuxt 4 folder/layer/dependency source of truth.
- `DESIGN.md` — design router.
- `design/IMPLEMENTATION.md` — HTML -> Nuxt UI translation contract.
- `design/data-source-matrix.md` — Plans 004–009 real-vs-dummy contract.
- `design/reference/situm-explore-interactive-prototype.html` — only visual/interaction reference once user-populated.

Historical plans/session notes are evidence only and do not override current contracts.

## Sequential execution rule

```text
finish + validate plan branch
-> push
-> user review
-> explicit PR/integration authorization
-> dependency lands in main
-> sync main
-> create next plan branch from updated origin/main
```

Do not start a dependent plan from stale `main` or silently stack branches. Stacked branches require explicit user request.

## Architecture target

Plan 004 Phase 0 owns:

```text
app.vue                     -> app/app.vue
app.config.ts               -> app/app.config.ts
assets/                     -> app/assets/
components/                 -> app/components/
middleware/                 -> app/middleware/
pages/                      -> app/pages/
server/utils/db.ts          -> server/db/client.ts
server/db/schema.ts         -> unchanged
server/api/**               -> routes preserved
```

Do not create empty services/repositories/shared/layers/stores/generic infrastructure just to match diagrams.

## UI/data boundary — Plans 004–009

Keep real:

- `/api/auth/login`, `useUserSession()`, logout, server session authorization;
- `/api/me` and PostgreSQL/Drizzle behavior;
- `/api/situm/status` as configuration status only;
- existing Situm Viewer creation, `MAP_IS_READY`, `APP_ERROR`, init errors.

Keep typed dummy/local until after UI acceptance:

- registration;
- product metrics/activity;
- Buildings/Floors/POIs/Categories product data;
- Geofences/Paths/routes;
- all newly represented Map Explore/Route/Layers/tools beyond existing Viewer lifecycle;
- Realtime;
- Reports/Analytics;
- Alarms;
- Users/Groups/Organization;
- newly represented Viewer settings/config/style/image behavior.

Canonical synthetic records should be reused from `app/data/prototype/` after Plan 004 migration.

## Situm POC setup

- Env: `NUXT_PUBLIC_SITUM_API_KEY` + `NUXT_PUBLIC_SITUM_BUILDING_ID`.
- One time-boxed POC key may have Read & Write permission; revoke/replace after POC.
- Never persist/log/render the key value.
- Missing local building ID may be discovered through `GET https://api.situm.com/api/v1/buildings` with `X-API-KEY`, writing only selected ID to ignored `.env`.
- Do not silently guess among genuinely ambiguous buildings.
- Broader key permission does not expand Plans 004–009.

## UI roadmap

1. **004** — architecture Phase 0, then Landing/Login/Register after HTML is populated. Ends with login still using existing `/dashboard`.
2. **005** — authenticated layout; `app/app.vue` activates `NuxtLayout`; atomically creates `/app/**`, moves login to `/app`, keeps real Viewer reachable at `/app/map`, retires/redirects legacy dashboard UI.
3. **006** — approved Map workspace around existing real Viewer; all newly introduced map tools stay local/dummy.
4. **007** — dummy Buildings/Floors/POIs/Geofences/Paths; canonical fixtures reused.
5. **008** — dummy/local Realtime, Analytics, Alarms, Users/Groups, Organization, Settings.
6. **009** — whole-product HTML conformance, responsive/accessibility, foundation regression, architecture/DRY, docs gate.

Plan 010 cannot start until Plan 009 is integrated and the user explicitly accepts the complete UI.

## Later Situm integration roadmap

10. **010** — feasibility/capability/data-contract/ownership mapping only; no fixture replacement or writes.
11. **011** — Buildings/Floors/POIs/Categories.
12. **012** — Geofences/Paths/Routing.
13. **013** — Realtime positions plus only device metadata needed by accepted Realtime UI.
14. **014** — Reports/Analytics.
15. **015** — Organization/Users/Groups/Alarms where valuable.
16. **016** — **conditional** remaining accepted Viewer/settings/write actions (map config/styles/images, favorites or other real Viewer actions, narrow mutations) only when Plan 010 records an explicit go-list. If no real action is needed, mark `skipped-not-needed` and do not implement it.

Later plans also execute sequentially through integrated `main`. Any Nitro/server Situm data route must use existing app session authorization; never create an unauthenticated generic Situm proxy.

## Completed / historical

- Plans 000–002: completed foundation/resource work.
- Plan 003: closed historical UI attempt; rendered result was not accepted as current design target.

## Current open loop

The canonical HTML still contains only `Hello World`. The user intends to replace it manually with the approved interactive prototype.

Plan 004 Phase 0 may run before replacement, but visual work stops at the reference guard if placeholder remains. Prefer populating the HTML before full sequential execution so the Plan 004 branch does not need to pause mid-plan.

## Audit status

Repository-wide pre-execution audit corrected:

- stale credential/env/context wording;
- sequential branch dependency ambiguity;
- Plan 004 -> 005 missing-route/login transition;
- Nuxt layout activation requirement in Plan 005;
- temporary real-Viewer reachability during route migration;
- accidental permission for new Situm API/SDK wiring inside UI plans;
- duplicate dummy fixture ownership ambiguity;
- Plan 010 duplicate implementation overlap;
- missing server-session guard requirement for future Situm Nitro routes;
- missing device ownership for Realtime;
- missing ownership for remaining Viewer/settings/write actions via conditional Plan 016;
- stale project goals/preferences/knowledge/package metadata.

The only intentional visual blocker is the user-populated canonical HTML.

## Next action

Complete Plan 008, then continue the authorized stacked branch sequence through Plan 009 without merging or opening PRs.
