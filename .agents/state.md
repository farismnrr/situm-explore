# Current State

_Last reviewed: 2026-08-12_

## Current focus

Rebuild the web UI from the user-approved interactive HTML reference, preserving the existing Nuxt backend/auth/database/Situm behavior and using typed dummy data for product surfaces whose backend does not yet exist.

## Phase

**Plan 004 — UI foundation/public/auth planned**

## Active decisions

- Root `AGENTS.md` acts as a short router into `.agents/`.
- `.agents/` is the source of truth for persistent agent context.
- Every conversation creates a concise session entry.
- Every plan executes on its own `plan/<number>-<slug>` branch in the normal repository working directory.
- Linked Git worktrees are not required; do not create them unless the user explicitly asks for them.
- After each completed implementation phase, update the plan + relevant `.agents/`, validate, commit, and push the plan branch.
- Do not implement plans directly on `main`.
- Do not create a PR until the user explicitly authorizes it.
- CI and unit-test infrastructure are deferred for now; Nuxt lint is mandatory for code-changing phases.
- Build web first; native/mobile remains deferred.
- Use one full-stack Nuxt application for frontend and backend.
- Use Nuxt UI.
- UI direction is clean minimalist SaaS, light mode only.
- The canonical visual source of truth is `design/reference/situm-explore-interactive-prototype.html`.
- `design/ui-reference.html` is only a compatibility wrapper pointing at the canonical reference.
- Use the approved navigation-arrow mark, not an `S` lettermark.
- The approved UI now includes a compact authenticated sidebar; Plan 003's no-sidebar conclusion is superseded.
- Preserve existing real login/session, `/api/me` database behavior, and truthful Situm `MAP_IS_READY` viewer lifecycle.
- For UI surfaces without an existing backend, prefer typed local dummy data instead of expanding backend/database scope.
- Current Situm POC permission boundary remains `Only Read`; do not implement remote writes.
- Keep architecture deliberately simple until real requirements justify more complexity.

## Active UI roadmap

1. `plans/004-ui-foundation-public-auth.md`
2. `plans/005-authenticated-shell-dashboard.md`
3. `plans/006-situm-map-workspace.md`
4. `plans/007-cartography-explorer.md`
5. `plans/008-operations-reports-ui.md`
6. `plans/009-ui-conformance-polish.md`

These plans should be executed first. Missing backend domains stay dummy/local during this roadmap.

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
- `plans/003-ui-ux-refresh.md` — closed after PR #5, but its rendered UI was **not accepted as the design target** because it was too far from the user's expectation. The approved HTML prototype supersedes its visual decisions.

## Known foundation state

- Nuxt full-stack foundation and hardening are merged to `main`.
- Existing login/session flow is real and should be reused.
- Authenticated `/api/me` and PostgreSQL `situm_explore` behavior already exist.
- Real Situm browser viewer integration already exists with read-only credential configuration and truthful `MAP_IS_READY` readiness.
- Local credentials remain ignored and must never be committed.

## Open loops

- Execute Plan 004 from latest `origin/main` on `plan/004-ui-foundation-public-auth`.
- Keep each subsequent UI plan narrow and reviewable.
- Keep currently missing domains dummy during Plans 004–009.
- Only replace dummy data with real Situm reads after UI acceptance through Plans 010–015.

## Next likely action

Create/switch to `plan/004-ui-foundation-public-auth`, read `DESIGN.md`, the canonical HTML reference, `design/IMPLEMENTATION.md`, and execute Plan 004 phase by phase. Commit/push each phase; no PR until explicit user authorization.
