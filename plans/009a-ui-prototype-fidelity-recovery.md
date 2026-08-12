# Plan 009A — UI Prototype Fidelity Recovery

Status: **closed-with-known-ui-gaps**
Branch: `plan/009a-ui-prototype-fidelity-recovery`
Closed baseline: `af012f4`
Depends on: cumulative Plans 004–009 implementation present in this branch history
Superseded for remaining UI fidelity work by: Plan 009B (pending user scope)
Blocks Plan 010 indirectly until Plan 009B is complete and the user explicitly accepts the rendered UI

## Historical outcome

Plan 009A materially recovered the cumulative Plans 004–009 Nuxt UI toward the canonical interactive prototype while preserving the real authentication, PostgreSQL/Drizzle foundation, and existing Situm Viewer lifecycle.

The user has explicitly chosen to **close Plan 009A now even though the UI is not considered 100% visually final**. This closure is an administrative roadmap boundary, not a claim of pixel-perfect conformance and not final UI acceptance for Plan 010.

Do not reopen 009A for newly identified visual punch-list items. Remaining user-identified UI issues belong to Plan 009B once the user provides the concrete scope.

## Completed recovery scope

Closure Phases 0–6 were implemented, reviewed, committed, and pushed. The recovery included:

- reconciliation of the diverged Plan 009 / 009A history without wholesale merging the sibling branch;
- removal of the derived duplicate map fixture and restoration of canonical fixture ownership;
- global visual foundation, density, accessibility, and interaction-semantic repair;
- landing, login, and register fidelity recovery;
- authenticated shell and responsive breakpoint recovery;
- route-by-route product density/composition recovery;
- map workspace/shared overlay recovery;
- selective SOLID/DRY/KISS architecture cleanup while keeping Nuxt UI as the production component foundation.

## Validation truth at closure

Passed/verified:

- `git diff --check`;
- `npm run lint` (one previously recorded geofences warning may remain);
- `npm run typecheck` from the branch-clean `nuxt.config.ts`;
- `npm run build`;
- unauthenticated protected-route redirect behavior;
- invalid/missing login response behavior;
- anonymous `/api/me` protection;
- `/api/situm/status` remains configuration-only;
- source-level `MAP_IS_READY` / `APP_ERROR` Viewer lifecycle preservation;
- no new Situm product-domain integration was introduced;
- no known secret was committed/rendered/logged.

Not completed as part of 009A closure:

- successful configured login happy-path runtime verification;
- logout happy-path runtime verification after a successful session;
- authenticated `/api/me` + configured PostgreSQL happy-path runtime verification;
- configured Situm Viewer runtime reaching the real ready state;
- complete manual/rendered route-by-route visual acceptance against the canonical prototype.

These unchecked runtime/visual gates are **not being marked as passed**. The user has chosen to close 009A with those known limitations and continue remaining UI fidelity work in Plan 009B.

## Architecture/runtime boundary preserved

Keep real:

- `/api/auth/login`;
- `useUserSession()` / logout / auth middleware;
- `/api/me` and PostgreSQL/Drizzle behavior;
- `/api/situm/status` configuration semantics;
- real `SitumViewer` creation;
- `ViewerEventType.MAP_IS_READY`;
- `ViewerEventType.APP_ERROR` and initialization/missing-config handling.

Keep local/dummy until later integration plans:

- registration;
- Home/Dashboard product metrics/activity;
- cartography product records;
- route previews and local navigation actions;
- realtime product data;
- analytics/reports;
- alarms/users/groups/organization;
- new map tools/settings beyond the existing real Viewer lifecycle.

## Final boundary

Plan 009A is historical after this closure.

Do not use its older checkboxes as proof that the complete UI was accepted. Current authority for remaining UI work is the future Plan 009B scope supplied by the user, together with `DESIGN.md`, `design/IMPLEMENTATION.md`, and the canonical HTML reference.

**Do not start Plan 010 merely because 009A is closed.** Plan 010 remains blocked until Plan 009B is completed (or explicitly skipped by the user after review) and the user explicitly accepts the final rendered UI baseline.

No PR or merge is authorized by this closure.
