# Plans

Plans are executable implementation checklists for Codex.

## Mandatory execution workflow

Before executing or continuing Plans 021–025, read:

1. `AGENTS.md`;
2. `.agents/README.md`;
3. `.agents/state.md`;
4. `.agents/memory/decisions.md`;
5. `.agents/memory/roadmap-021-025.md`;
6. `.agents/protocols/git-workflow.md`;
7. `ARCHITECTURE.md`;
8. `plans/021-025-prerequisites.md`;
9. `design/data-source-matrix.md` when Situm/product scope matters;
10. active plan;
11. `DESIGN.md` / `design/IMPLEMENTATION.md` for presentation changes.

Historical plans/sessions/branches are evidence only. Current state, durable decisions, architecture, and the active plan are current authority.

## Git workflow

- one plan = one dedicated plan branch;
- never implement directly on `main`;
- no force-push/destructive rewrite as normal workflow;
- PR creation/review and merge are user-gated;
- normal dependent plans start after prerequisite work is integrated into updated `main`;
- stacked implementation requires explicit user authorization recorded in state.

## Completed roadmap

Plans 017–020, including Plan 019A, are complete/integrated by PR #12.

## Active backend-refactor roadmap

```text
roadmap/021-025-backend-refactor              [planning; must integrate before Plan 021]
-> Plan 021 — Identity & Auth Foundation       [ready after roadmap integration]
-> Plan 022 — Private Workspaces + Situm       [queued after 021 integration]
-> Plan 023 — Observability + Safe Errors      [queued after 022 integration]
-> Plan 024 — Workspace Situm Backend          [queued after 023 integration]
-> Plan 025 — Workspace UX + Full Regression   [queued after 024 integration]
```

Roadmap overview: `plans/021-025-backend-refactor-roadmap.md`.
Prerequisites/blockers: `plans/021-025-prerequisites.md`.

## Transition direction

Current baseline code still contains env-defined app auth, process-global Situm account/Viewer/building context, and analytics history created before workspace ownership existed.

Plans 021–024 replace those incrementally. Plan 025 performs final UX/regression plus post-migration documentation reconciliation.

Do not remove a working old path before its replacement is implemented and accepted.

## Capability evidence gate

For Situm behavior: **no evidence, no implementation**. Verify exact endpoint/SDK method, installed-version compatibility, auth/permission, inputs/fields/events, browser/server ownership, web/native ownership, and failure semantics. Missing material contracts stay unresolved/absent.

## Validation

Baseline code checks:

- `git diff --check`;
- `npm run lint`;
- `npm run typecheck`;
- `npm run build`.

Runtime/browser acceptance uses production build + `npm run preview`, not Nuxt dev mode.
