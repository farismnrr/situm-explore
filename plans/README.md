# Plans

Plans are executable implementation checklists for Codex.

## Mandatory execution workflow

Before executing or continuing plan work, read:

1. `AGENTS.md`;
2. `.agents/README.md`;
3. `.agents/state.md`;
4. `.agents/memory/decisions.md` when roadmap/product boundaries matter;
5. `.agents/protocols/git-workflow.md`;
6. `ARCHITECTURE.md`;
7. `design/data-source-matrix.md` when Situm/product capability scope matters;
8. the active/follow-up plan;
9. `DESIGN.md` / `design/IMPLEMENTATION.md` for presentation changes.

Historical plans/sessions/branches are evidence only. Current state/contracts override stale wording.

## Branch rule

- one plan = one dedicated plan branch;
- never implement directly on `main`;
- no force-push/destructive history rewrite as normal workflow;
- PR creation/review and merge remain user-gated;
- do not merge/cherry-pick stale plan branches merely to simulate a stack.

## Explicit stacked mode

The user authorized uninterrupted stacked execution for the feature lineage below. That stacked run is complete and integrated into `main` by PR #12.

Completed chain:

```text
roadmap/017-020-next-features
-> plan/017-situm-analytics-clickhouse            [complete]
-> plan/018-situm-groups-alarms-read              [complete]
-> plan/019-situm-realtime-viewer-trajectory      [complete]
-> plan/019a-situm-static-directions-foundation   [complete]
-> plan/020-situm-static-directions-v2            [complete]
```

The user inserted Plan 019A after the first Plan 020 Phase 0 attempt exposed a sequencing blocker: a real directions runtime proof required production command wiring that did not yet exist. Both plans are now complete.

The earlier `plan/020-situm-static-directions` branch created before 019A is superseded as an execution base. Its Phase 0 evidence may be consulted historically where still accurate, but it is not current authority and must not be merged/cherry-picked into the completed lineage.

Do not delete the stale Plan 020 branch unless the user explicitly asks.

## Completed Plans 019A and 020

`plans/019a-situm-static-directions-foundation.md` completed:

- minimal typed `SitumViewer` static-directions start/cancel commands;
- route selection using real numeric Situm POI IDs rather than display-name strings;
- connection of the existing `/app/map` Route scaffold to the single Viewer instance;
- conservative static-route feedback only from verified behavior;
- hydrated Playwright proof against the real configured Viewer/account;
- valid route, replacement where available, cancel/clear, local invalid-input prevention, navigate-away/back cleanup, mobile non-mount, and browser secret checks.

Plan 019A deliberately implements the smallest verified surface before runtime proof. This is not a relaxation of the evidence gate: installed SDK signatures, numeric POI endpoint identifiers, and Viewer ownership are already verified; unverified route result/details/events/tags remain absent.

`plans/020-situm-static-directions.md` completed the evidence-backed product polish, regression smoke, and closeout for that verified surface. PR #12 integrated Plans 017–020 into `main`; no successor plan is active.

## Historical worker-only execution rule

For the completed stacked run:

- implementation and fixes for each implementation phase go specifically to the configured `worker` subagent;
- parent agent owns orchestration, review, plan/state/session persistence, commits, pushes, and phase/plan transitions;
- use targeted follow-up with the same worker when practical;
- if the configured worker cannot be spawned, stop rather than substituting another agent/model;
- no PR and no merge during the run.

## Capability evidence gate

For Situm behavior: **no evidence, no implementation**.

Verify exact endpoint/SDK method, installed-version compatibility, auth/permission, request inputs, consumed fields/events, browser/server ownership, web/native ownership, and relevant failure/empty/runtime semantics.

Do not invent:

- Viewer methods/events;
- endpoint/payload fields;
- route results/details;
- permissions;
- fake fallback data;
- native positioning/navigation behavior.

If a material contract is missing, keep that exact sub-capability `UNRESOLVED`/absent.

## Architecture/security

The final Situm credential model remains exactly two keys:

- `NUXT_PUBLIC_SITUM_API_KEY` — browser Viewer only;
- `NUXT_SITUM_API_KEY` — private Nitro Situm operations.

Additional rules:

- private credentials never enter browser/public runtime config, responses, logs, docs, or built client assets;
- protected product API routes require the app session;
- no generic unauthenticated Situm proxy;
- no raw Viewer instance or generic invoke escape hatch;
- browser Viewer behavior stays owned by the single `SitumViewer` integration;
- native handset positioning/live navigation remains outside the Nuxt web roadmap;
- Plan 017's ClickHouse remains a server-side analytics store; PostgreSQL/Drizzle remains the relational app store.

## Phase completion

A phase is complete only when applicable truth is recorded:

1. plan checklist/status updated;
2. `.agents/state.md` and session evidence updated;
3. required validation run;
4. implementation reviewed;
5. completed phase committed and pushed;
6. unresolved/manual items remain explicitly unresolved rather than falsely checked.

Repository baseline checks remain:

- `git diff --check`;
- `npm run lint`;
- `npm run typecheck`;
- `npm run build`.

Plan-specific runtime/browser checks are additional requirements.
