# Agent Context System

`.agents/` is the persistent context layer for Situm Explore.

Root `AGENTS.md` is the router. `.agents/state.md` owns current focus/blockers; durable decisions own current project decisions; sessions/completed plans are chronological evidence and may become stale.

## Mandatory implementation reads

1. `AGENTS.md`;
2. `.agents/identity.md`;
3. `.agents/state.md`;
4. relevant protocols;
5. `.agents/memory/decisions.md`;
6. for completed-roadmap context: `.agents/memory/roadmap-021-025.md` and `plans/021-025-prerequisites.md`;
7. `ARCHITECTURE.md`;
8. `plans/README.md`;
9. `design/data-source-matrix.md` when Situm/product scope matters;
10. active plan;
11. `DESIGN.md` / `design/IMPLEMENTATION.md` for presentation changes.

## Truth hierarchy

When guidance conflicts, prefer:

1. user's latest explicit instruction;
2. current `.agents/state.md` and active durable decisions;
3. current architecture/design contracts;
4. active plan + current capability matrix;
5. current source/runtime behavior;
6. historical plans/session notes;
7. agent inference.

Historical files do not regain authority merely because they contain more detail.

## Current scope

Plans 017–020 are complete/integrated into `main` by PR #12.

Plans 026–032 are complete and integrated. The approved native companion roadmap now spans Plans 028–034: Plan 033 owns final native UI/UX reference reconciliation, and Plan 034 owns terminal full-E2E acceptance/roadmap closeout.

Plans 021–032 are integrated historical execution. Current roadmap authority is `plans/028-034-native-mobile-roadmap.md`; Plan 033 is the next executable plan from updated `main`, and Plan 034 starts only after Plan 033 integration unless the user explicitly authorizes stacking.

The roadmap moves the product from the pre-refactor env-defined user/global Situm runtime to DB-backed users, private workspaces, protected workspace configuration, workspace-scoped Situm/analytics context, reused observability, end-to-end correlation, and safe client errors.

## Documentation policy

Current authority files are reconciled for Plans 021–025. Do not use completed plan/session wording to override them.

Historical plan/session files are intentionally preserved as evidence. Do not rewrite history merely to make old execution notes sound current.

## Evidence / persistence rules

For external Situm behavior, verify exact official/current contracts and installed SDK compatibility. Missing material evidence stays unresolved.

Before each implementation-phase commit, update plan/state/session evidence and required durable decisions, run validation, review the diff, commit, and push.

Never persist real credentials, API keys, JWTs, passwords, session cookies, encryption-key values, or sensitive payloads in repository context.
