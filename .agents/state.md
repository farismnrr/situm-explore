# Current State

_Last reviewed: 2026-08-12_

## Current focus

Align the small existing codebase to a clear Nuxt 4 layered architecture before the UI roadmap expands the number of pages/components, while keeping one user-owned canonical HTML reference for later visual implementation.

## Phase

**Plan 004 planned — Phase 0 architecture alignment is ready; visual Phase 1+ remains blocked until the canonical HTML reference is populated by the user**

## Active decisions

- Root `AGENTS.md` acts as a short router into `.agents/`.
- `.agents/` is the source of truth for persistent agent state/memory/protocols, but does not contain duplicate architecture/design guidance.
- Root `ARCHITECTURE.md` is the single application architecture, folder mapping, and dependency-direction contract.
- Architecture uses Nuxt 4 native runtime boundaries: Vue app under `app/`, Nitro/server under root `server/`, genuinely cross-runtime contracts/helpers under root `shared/`.
- Apply SOLID, DRY, KISS and layered architecture pragmatically: clear responsibilities, minimal layers, abstractions only after real need/repetition.
- Root `DESIGN.md` is the single design router.
- `design/IMPLEMENTATION.md` is the single Nuxt UI translation contract.
- `design/data-source-matrix.md` defines real-vs-dummy data boundaries.
- There is exactly one HTML reference path: `design/reference/situm-explore-interactive-prototype.html`.
- The canonical HTML currently contains placeholder `Hello World` content awaiting manual replacement by the user.
- While that placeholder remains, AI must not implement/reconstruct the intended visual UI from memory, Plan 003, generic SaaS patterns, or agent taste.
- Once populated, the HTML is visual/interaction intent only; production must use Nuxt/Vue/Nuxt UI rather than copying raw HTML/CSS/JS.
- Every plan executes on its own `plan/<number>-<slug>` branch in the normal repository working directory.
- Linked Git worktrees are not required; do not create them unless the user explicitly asks.
- After each completed implementation phase, update the plan + relevant `.agents/`, validate, commit, and push.
- Do not implement plans directly on `main`.
- Do not create a PR until the user explicitly authorizes it.
- CI and unit-test infrastructure are deferred; Nuxt lint is mandatory for code-changing phases.
- Build web first; native/mobile remains deferred.
- Use one full-stack Nuxt application for frontend and backend.
- Use Nuxt UI as the production component/design foundation.
- Preserve existing real login/session, `/api/me` database behavior, and truthful Situm `MAP_IS_READY` viewer lifecycle.
- For product surfaces without an existing backend, prefer typed local dummy data instead of expanding backend/database scope.
- Current Situm POC permission boundary remains `Only Read`; do not implement remote writes.

## Architecture target

Near-term migration in Plan 004 Phase 0:

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

Do not create empty `services/`, `repositories/`, `shared/`, `layers/`, stores, or generic infrastructure merely to match a diagram. Add them only when code actually belongs there.

## Active UI roadmap

1. `plans/004-ui-foundation-public-auth.md`
   - Phase 0: Nuxt 4 architecture alignment; may run before HTML population.
   - Phase 1+: visual/public/auth implementation; requires populated HTML.
2. `plans/005-authenticated-shell-dashboard.md`
3. `plans/006-situm-map-workspace.md`
4. `plans/007-cartography-explorer.md`
5. `plans/008-operations-reports-ui.md`
6. `plans/009-ui-conformance-polish.md`

Missing backend domains stay dummy/local during Plans 004–009.

## Later real-data roadmap

- `plans/010-progressive-situm-data-integration.md` — umbrella/feasibility plan after UI acceptance.
- `plans/011-situm-buildings-pois-read-integration.md`
- `plans/012-situm-geofences-paths-routing-integration.md`
- `plans/013-situm-realtime-integration.md`
- `plans/014-situm-reports-analytics-integration.md`
- `plans/015-situm-organization-alarms-read-integration.md`

Do not start Plans 010–015 until the UI produced by Plans 004–009 is manually accepted by the user.

## Completed / closed plans

- `plans/000-resource-gathering.md`
- `plans/001-web-foundation.md`
- `plans/002-foundation-hardening.md`
- `plans/003-ui-ux-refresh.md` — closed after PR #5; its rendered UI was not accepted as the design target.

## Known foundation state

- Nuxt full-stack foundation and hardening are merged to `main`.
- Current package uses Nuxt 4 and Nuxt UI 4, but Vue app files still use Nuxt's backwards-compatible root directory layout and should be migrated once before further growth.
- Existing login/session flow is real and should be reused.
- Authenticated `/api/me` and PostgreSQL `situm_explore` behavior already exist.
- Real Situm browser viewer integration already exists with read-only credential configuration and truthful `MAP_IS_READY` readiness.
- Local credentials remain ignored and must never be committed.

## Open loops

- Execute Plan 004 Phase 0 on `plan/004-ui-foundation-public-auth` when implementation work starts; migrate existing Vue app files into Nuxt 4 `app/` and move DB client initialization beside the DB schema.
- User manually replaces the `Hello World` placeholder in `design/reference/situm-explore-interactive-prototype.html` with the approved interactive reference.
- After HTML population, continue Plan 004 Phase 1+ for visual implementation.
- Keep each subsequent UI plan narrow and reviewable.
- Only replace dummy data with real Situm reads after UI acceptance through Plans 010–015.

## Next likely action

Start Plan 004 Phase 0 from latest `origin/main` if the user asks to execute it. Read `ARCHITECTURE.md` first, perform only behavior-preserving Nuxt 4 structure alignment, validate/commit/push, then stop before visual Phase 1 if the canonical HTML is still placeholder-only. No PR until explicit user authorization.
