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
8. the active/follow-up plan, if one exists;
9. `DESIGN.md` / `design/IMPLEMENTATION.md` for presentation changes.

Historical plans are evidence only. Current state/contracts override stale plan wording.

## Branch rule

- one plan = one dedicated plan branch;
- never implement directly on `main`;
- reuse an existing valid plan branch instead of recreating/resetting it;
- no force-push/destructive history rewrite as normal workflow;
- PR creation/review is user-gated;
- merge remains explicitly user-gated.

## Dependency modes

### Normal mode

A dependent plan starts from updated `main` only after its dependency has been reviewed and integrated.

### Explicit stacked mode

Stacking is allowed only when the user explicitly authorizes it and current `.agents/state.md`/durable context records that decision.

In stacked mode:

```text
complete Plan N
-> validate + update plan/.agents
-> commit + push Plan N
-> take Plan N final HEAD
-> create/continue the next plan from that HEAD
```

Do not branch a stacked dependent plan from stale `main` and do not merge/cherry-pick merely to simulate the stack.

## Current roadmap state

The UI roadmap through Plan 009B and the Situm roadmap Plans 010–016A are complete/integrated. The user's final UI/mobile refinement pass is also integrated into `main` through PRs #10 and #11.

The new roadmap is prepared on `roadmap/017-020-next-features` and has explicit stacked execution authorization:

1. `plans/017-situm-analytics-clickhouse.md` — **ready / next active**;
2. `plans/018-situm-groups-alarms-read.md` — queued;
3. `plans/019-situm-realtime-viewer-trajectory.md` — queued;
4. `plans/020-situm-static-directions.md` — queued.

Required branch chain:

```text
roadmap/017-020-next-features
-> plan/017-situm-analytics-clickhouse
-> plan/018-situm-groups-alarms-read
-> plan/019-situm-realtime-viewer-trajectory
-> plan/020-situm-static-directions
```

Do **not** replay Plans 010–016A. The old credential-split Plan 017 draft was superseded by Plan 016A and is historical only; the new Plan 017 is the analytics/ClickHouse plan above.

The abandoned `chore/ui-refine-login-map-feedback` branch is superseded by the UI refinement already integrated into `main`; do not use it as a base.

## Current stacked-run rules

For Plans 017–020 only, the user explicitly authorized:

- uninterrupted sequential execution without waiting for confirmation between phases/plans;
- implementation/testing of every phase delegated specifically to the configured `worker` subagent;
- parent agent owns orchestration, review, plan/state updates, commits, pushes, and phase/plan transitions;
- if the configured `worker` profile cannot be spawned, stop and report the blocker rather than substituting another agent/model;
- after a plan is validated/committed/pushed, create the next branch from that exact final HEAD;
- no PR and no merge during the entire 017–020 run.

Optional sub-capabilities that a plan explicitly marks conditional may remain unresolved if exact evidence/runtime is insufficient. Core behavior must never be faked merely to check a box.

## Plan 017 ClickHouse rule

Plan 017 must reuse the user's existing local ClickHouse instance.

- Do not install/provision another ClickHouse server.
- Do not add Docker/Compose for ClickHouse.
- Discover the real local connection safely; do not print/persist credentials or ask the user to paste secrets.
- Inspect the existing instance before creating app-owned objects and never alter/drop unrelated databases/tables.
- ClickHouse access is Nitro/server-only.
- PostgreSQL/Drizzle remains the relational app store.
- No background worker/queue/cron is required for the PoC; the plan uses an explicit analytics sync operation.

## Capability evidence gate

For Situm behavior: **no evidence, no implementation**.

Official endpoint/SDK existence alone is not enough when the UI requires specific filters, fields, permissions, or error semantics. Verify the exact contract actually consumed.

If material evidence is missing, keep the feature unresolved/absent rather than inventing it.

Do not treat lack of an `@situm/sdk-js` wrapper as proof the Situm REST API lacks a capability; server-side Nitro integrations may use exact official REST endpoints when verified and appropriate.

## Architecture/security

Follow `ARCHITECTURE.md` and keep implementation small.

The final Situm credential model intentionally uses exactly two keys:

- `NUXT_PUBLIC_SITUM_API_KEY` — browser Viewer only;
- `NUXT_SITUM_API_KEY` — single private Nitro credential for all server-side Situm operations.

Additional rules:

- do not introduce separate private read/write keys without a concrete future requirement;
- protected product `/api/situm/*` routes require the app session;
- no generic unauthenticated Situm proxy;
- private credentials never enter browser/public runtime config, logs, docs, or error payloads;
- no speculative services/repositories/stores/caches/workers;
- browser Viewer behavior stays owned by the single Viewer integration;
- native handset positioning/navigation stays outside the Nuxt web roadmap.

## Phase completion

A phase is only complete when applicable checks are truthfully recorded:

1. plan checklist/status updated;
2. `.agents` persistence updated;
3. required validation run;
4. phase committed and pushed;
5. unresolved/manual-smoke items remain visibly unchecked or explicitly marked pending/unresolved.

Repository baseline checks remain `git diff --check`, `npm run lint`, `npm run typecheck`, and `npm run build`; each active plan adds its own runtime checks.

CI and a standalone unit-test runner remain deferred unless a later requirement changes that decision.
