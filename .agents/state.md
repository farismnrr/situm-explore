# Current State

_Last reviewed: 2026-08-12_

## Current focus

Pause implementation while the user manually identifies the remaining UI fidelity issues for **Plan 009B — Final UI Fidelity Punch List**.

## Current roadmap state

**Plan 009A is closed with known UI gaps.**

The user explicitly chose to close 009A because the overall cumulative UI is safe enough to stop that recovery loop, while also stating that the UI is **not yet 100% final**.

This means:

- 009A closure is administrative/historical;
- it is not a claim of pixel-perfect conformance;
- it is not the final UI acceptance gate for Plan 010;
- remaining user-identified UI issues belong to Plan 009B.

## Plan 009A closure truth

Closed plan: `plans/009a-ui-prototype-fidelity-recovery.md`
Closed branch baseline before closure-doc commits: `af012f4`

Passed/verified before closure:

- `git diff --check`;
- lint;
- clean-config typecheck;
- build;
- unauthenticated protected-route redirect;
- invalid/missing login behavior;
- anonymous `/api/me` protection;
- `/api/situm/status` configuration-only semantics;
- source-level Situm Viewer `MAP_IS_READY` / `APP_ERROR` lifecycle preservation;
- no new Situm product-domain integration;
- no known secret leakage.

Not claimed as completed in 009A:

- configured successful-login happy path;
- logout after successful authenticated session;
- authenticated `/api/me` + configured PostgreSQL happy path;
- configured Situm Viewer reaching real runtime ready state;
- full rendered route-by-route visual acceptance.

Do not retroactively mark those as passed merely because 009A is closed.

## Plan 009B

Plan file: `plans/009b-ui-final-fidelity-punch-list.md`
Status: **pending-user-scope**
Expected branch when execution is later authorized: `plan/009b-ui-final-fidelity-punch-list`

The user is currently identifying which UI surfaces still have issues.

Do not invent the 009B scope from old audit notes, generic design taste, or assumptions. Wait for the user's concrete punch list, then convert the placeholder plan into an executable checklist.

## Active contracts

- `AGENTS.md` — root router/workflow.
- `ARCHITECTURE.md` — full-stack Nuxt architecture contract; SOLID/DRY/KISS/layering remain mandatory.
- `DESIGN.md` — visual authority router.
- `design/IMPLEMENTATION.md` — prototype -> Nuxt/Vue/Nuxt UI translation contract.
- `design/data-source-matrix.md` — existing-real vs dummy/local data boundary.
- `design/reference/situm-explore-interactive-prototype.html` — canonical visual/interaction reference unless superseded by the user's newer explicit direction.
- `plans/009b-ui-final-fidelity-punch-list.md` — next UI plan, pending user scope.

## Runtime/data boundary remains unchanged

Keep real:

- `/api/auth/login`;
- `useUserSession()` / logout / auth middleware;
- `/api/me` and PostgreSQL/Drizzle behavior;
- `/api/situm/status` configuration semantics;
- real Situm Viewer creation;
- `MAP_IS_READY` / `APP_ERROR` / initialization errors.

Keep local/dummy until later integration plans:

- registration;
- product metrics/activity;
- cartography product records;
- route previews;
- realtime product data;
- analytics/reports;
- alarms/users/groups/organization;
- new map tools/settings not already part of the real Viewer lifecycle.

## Backend roadmap gate

**Do not start Plan 010 yet.**

Plan 010 and later Situm integration plans remain blocked until:

1. the user supplies and reviews the Plan 009B scope;
2. Plan 009B is completed, or the user explicitly decides it is unnecessary/skipped after review;
3. the final rendered UI baseline is explicitly accepted by the user.

No PR or merge is authorized by the 009A closure.

## Next action

Wait for the user's concrete list of remaining UI issues. When supplied, update Plan 009B with exact routes/states/expected results and execute it only after normal branch/workflow checks.
