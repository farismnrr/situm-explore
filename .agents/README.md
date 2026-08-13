# Agent Context System

`.agents/` is the persistent context layer for Situm Explore.

Root `AGENTS.md` is the router. `.agents/state.md` owns current focus/blockers; durable decisions own current project decisions; sessions/plans are chronological evidence and may become stale.

## Mandatory implementation reads

1. `AGENTS.md`;
2. `.agents/identity.md`;
3. `.agents/state.md`;
4. relevant protocols;
5. `.agents/memory/decisions.md`;
6. while Plans 021–025 are active: `.agents/memory/roadmap-021-025.md`, `plans/021-025-prerequisites.md`, and `design/ROADMAP-021-025-OVERRIDES.md`;
7. `ARCHITECTURE.md`;
8. `plans/README.md`;
9. `design/data-source-matrix.md` when Situm scope matters;
10. active plan;
11. presentation contracts for UI work.

## Truth hierarchy

When guidance conflicts, prefer:

1. user's latest explicit instruction;
2. current `.agents/state.md` and active durable roadmap decisions/addenda;
3. roadmap transition override while the roadmap is active;
4. current root architecture/design contracts where not explicitly superseded;
5. active plan + capability matrix;
6. current source/runtime behavior;
7. historical plans/session notes;
8. agent inference.

Historical files do not regain authority merely because they contain more detail.

## Current scope

Plans 017–020 are complete/integrated into `main` by PR #12.

Plans 021–025 are the active backend-refactor roadmap on planning branch `roadmap/021-025-backend-refactor`. Normal workflow requires planning integration before Plan 021 starts; no stacked implementation authorization currently exists.

The roadmap replaces the pre-refactor env-defined user/global-Situm runtime with DB-backed users, private workspaces, encrypted workspace credentials, observability/correlation, workspace-scoped Situm/analytics behavior, and final permission-aware UX.

## Evidence / persistence rules

For external Situm behavior, verify exact official/current contracts and installed SDK compatibility. Missing material evidence stays unresolved.

Before each implementation-phase commit, update plan/state/session evidence, required durable decisions, run validation, review diff, commit, and push. Never persist credentials, API keys, JWTs, passwords, session cookies, encryption-key values, or sensitive payloads.
