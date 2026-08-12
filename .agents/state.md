# Current State

_Last reviewed: 2026-08-12_

## Current focus

Prepare the UI rebuild roadmap around one user-owned canonical HTML reference while preserving the existing Nuxt backend/auth/database/Situm behavior and using typed dummy data for product surfaces whose backend does not yet exist.

## Phase

**Plan 004 planned, blocked until canonical HTML reference is populated by the user**

## Active decisions

- Root `AGENTS.md` acts as a short router into `.agents/`.
- `.agents/` is the source of truth for persistent agent state/memory/protocols, but no longer contains a duplicate design-guidance tree.
- Root `DESIGN.md` is the single design router.
- `design/IMPLEMENTATION.md` is the single Nuxt UI translation contract.
- `design/data-source-matrix.md` defines real-vs-dummy data boundaries.
- There is exactly one HTML reference path: `design/reference/situm-explore-interactive-prototype.html`.
- The canonical HTML currently contains placeholder `Hello World` content awaiting manual replacement by the user.
- While that placeholder remains, AI must not implement/reconstruct the intended UI from memory, Plan 003, generic SaaS patterns, or agent taste.
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
- Keep architecture deliberately simple until real requirements justify more complexity.

## Active UI roadmap

1. `plans/004-ui-foundation-public-auth.md`
2. `plans/005-authenticated-shell-dashboard.md`
3. `plans/006-situm-map-workspace.md`
4. `plans/007-cartography-explorer.md`
5. `plans/008-operations-reports-ui.md`
6. `plans/009-ui-conformance-polish.md`

Do not start Plan 004 until the user has replaced the canonical HTML placeholder with the approved reference. Missing backend domains stay dummy/local during Plans 004–009.

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
- Existing login/session flow is real and should be reused.
- Authenticated `/api/me` and PostgreSQL `situm_explore` behavior already exist.
- Real Situm browser viewer integration already exists with read-only credential configuration and truthful `MAP_IS_READY` readiness.
- Local credentials remain ignored and must never be committed.

## Open loops

- User manually replaces the `Hello World` placeholder in `design/reference/situm-explore-interactive-prototype.html` with the approved interactive reference.
- After that, execute Plan 004 from latest `origin/main` on `plan/004-ui-foundation-public-auth`.
- Keep each subsequent UI plan narrow and reviewable.
- Keep currently missing domains dummy during Plans 004–009.
- Only replace dummy data with real Situm reads after UI acceptance through Plans 010–015.

## Next likely action

Wait for the user to populate the single canonical HTML reference. Then start Plan 004 from latest `origin/main`, read `DESIGN.md`, `design/IMPLEMENTATION.md`, `design/data-source-matrix.md`, the populated HTML, and execute phase by phase. No PR until explicit user authorization.
