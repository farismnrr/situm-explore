# Current State

_Last reviewed: 2026-08-13_

## Canonical execution baseline

The UI roadmap through Plan 009B, Situm roadmap Plans 010–016A, and manual UI refinements through PRs #10/#11 are integrated into `main`.

The current cumulative feature lineage is executing as stacked branches. Completed plans in this lineage:

- Plan 017 — Situm Analytics & Reports with local ClickHouse: **complete**;
- Plan 018 — Groups & Alarms read-only: **complete**;
- Plan 019 — Realtime Viewer overlay: **complete**, including hydrated Playwright smoke; trajectory remains explicitly unresolved/omitted.

Final pushed Plan 019 HEAD:

`513f65e820635e05a22a54270f3bf21f5925e6c8`

## Active plan — 019A

The user explicitly inserted Plan 019A before Plan 020 to resolve the static-directions sequencing problem.

Active plan:

- `plans/019a-situm-static-directions-foundation.md`
- branch: `plan/019a-situm-static-directions-foundation`
- base: exact final Plan 019 HEAD above
- status: **complete — manual production-preview acceptance passed**

Plan 019A owns the smallest production-safe static-directions foundation and the real hydrated browser test in the same plan.

Required outcome:

```text
real Situm POIs with numeric ids
-> typed SitumViewer start/cancel directions commands
-> existing /app/map Route tab wired to real POI ids
-> Viewer-owned real route rendering
-> Playwright valid-route / replace / cancel / cleanup smoke
```

This is static web directions only. It is not live navigation.

## Why Plan 019A exists

The first Plan 020 Phase 0 attempt discovered a chicken-and-egg blocker:

- runtime evidence required calling real `startDirections(...)`;
- the current app had no directions command surface to invoke it;
- the command surface was originally scheduled for a later Plan 020 implementation phase.

The installed/current evidence is already sufficient for the minimal foundation:

- `@situm/sdk-js@0.25.0` exposes `startDirections(...)` and `cancelDirections()`;
- current configured cartography exposes at least two real POIs with numeric Situm IDs;
- numeric POI IDs are the currently evidenced route endpoints;
- `/app/map` already has a Route UI scaffold but it currently stores display names and does not invoke Viewer directions;
- `SitumViewer.vue` currently has no directions commands;
- local Playwright/Chrome exists and was successfully used for hydrated Plan 019 Viewer smoke;
- installed SDK does not expose a reliable product route-result payload, so no distance/duration/steps/geometry may be invented.

Plan 019A therefore implements only the verified minimal command/UI wiring first, then uses the production UI for the required route runtime proof.

## Updated branch chain

The user's current authorized stacked sequence is now:

```text
roadmap/017-020-next-features
-> plan/017-situm-analytics-clickhouse            [complete]
-> plan/018-situm-groups-alarms-read              [complete]
-> plan/019-situm-realtime-viewer-trajectory      [complete]
-> plan/019a-situm-static-directions-foundation   [ACTIVE]
-> plan/020-situm-static-directions                [queued after 019A]
```

Each successor must start from the exact final validated/pushed HEAD of the preceding plan.

The earlier `plan/020-situm-static-directions` branch created before Plan 019A is **superseded as an execution base**. Do not merge/cherry-pick it into 019A. Its Phase 0 evidence is historical input only where still accurate. After 019A completes, Plan 020 must start from the exact final Plan 019A HEAD.

Do not delete the stale Plan 020 branch unless the user explicitly asks.

## Plan 019A execution rules

- implementation/fixes for each phase are delegated specifically to the configured `worker` subagent;
- parent agent owns orchestration, review, plan/state/session updates, commits, pushes, and phase transitions;
- if the configured worker cannot be spawned, stop rather than silently substituting another agent/model;
- do not create a PR or merge;
- do not wait for user confirmation between correctly completed phases;
- use existing local Playwright/Chrome for hydrated browser smoke;
- read the real local `.env` for runtime configuration without printing/persisting secrets;
- authenticate through the normal app login flow;
- no auth bypass/dev-login/test-only public escape hatch.

## Static-directions evidence boundary

For Situm behavior: **no evidence, no implementation**.

Plan 019A may implement only currently verified behavior:

- numeric POI-id From/To endpoints;
- typed `startDirections`;
- typed `cancelDirections`;
- verified route-type enum mapping only where needed;
- Viewer readiness/input validation;
- Viewer-owned route rendering;
- conservative Promise/readiness/error feedback.

Keep unresolved/absent unless runtime evidence proves otherwise:

- route completion/result events;
- route distance/duration/steps/instructions/geometry;
- included/excluded tag behavior when configured cartography exposes no meaningful tags;
- live navigation/current-position/rerouting semantics.

Never expose a raw Viewer instance or generic invoke surface.

## Final Situm credential contract

Exactly two Situm keys remain intentional:

- `NUXT_PUBLIC_SITUM_API_KEY` — browser Viewer credential only;
- `NUXT_SITUM_API_KEY` — single private Nitro credential for server-side Situm operations.

Private credentials, auth/session secrets, ClickHouse credentials, and PostgreSQL credentials must never enter browser/public runtime config, logs, docs, plans, session notes, or error payloads.

## Validation baseline

Every implementation phase runs applicable checks:

- `git diff --check`;
- `npm run lint`;
- `npm run typecheck`;
- `npm run build`.

Plan 019A additionally requires hydrated Playwright smoke for a real route start, replacement where the two-POI dataset permits, cancel/clear, input validation, navigate-away/back cleanup, mobile non-mount, and browser-visible secret regression.

## Next action

Plan 019A Phase 0 reconfirmation completed on 2026-08-13 from exact Plan 019 HEAD `513f65e820635e05a22a54270f3bf21f5925e6c8`. Installed SDK declarations/source, numeric POI endpoint IDs, and the scaffold-only Route tab/current `SitumViewer` gap remained as previously verified; no contract change was found.

Plan 019A Phase 1 completed on 2026-08-13. `SitumViewer` now exposes only typed numeric-ID `startDirections` and `cancelDirections` commands, validates positive integer endpoints, preserves readiness guards, and cancels directions during unmount. No raw Viewer, generic invoke, navigation, location, event, or synthetic route-detail surface was added. Diff check, lint, typecheck, and build passed. Phase 2 is next.

Plan 019A Phase 2 implementation completed. The Route tab uses real current-building POIs with numeric IDs, validates empty/same endpoints, invokes typed Viewer start/cancel, and exposes only truthful request/clear feedback.

Authenticated production-preview rerun initially reproduced a no-route result after two 30-second route observation windows, but the subsequent user-authorized manual production-preview acceptance is the current runtime authority: cartography rendered fully, forward and reverse routes rendered, cancel removed the active route, navigate-away/back cleanup passed, and mobile Viewer non-mount passed. Non-blocking observations were recorded without adding synthetic route details/status. Plan 019A is complete.

Plan 019A is complete at its validated manual-acceptance result. Its final pushed HEAD must be the exact base for Plan 020. The stale pre-019A Plan 020 remote branch must not be reused; if replacing it requires a force-push or shared-history rewrite, stop and report that git blocker rather than rewriting it silently.

Do not resume the stale pre-019A Plan 020 branch. After Plan 019A is fully validated/committed/pushed, create the new Plan 020 execution branch from the exact final Plan 019A HEAD and continue product completion.
