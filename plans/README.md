# Plans

Plans are executable implementation checklists for Codex.

## Mandatory execution workflow

Before executing or continuing plan work, read:

1. `AGENTS.md`;
2. `.agents/README.md`;
3. `.agents/state.md`;
4. `.agents/memory/decisions.md`;
5. `.agents/protocols/git-workflow.md`;
6. `ARCHITECTURE.md`;
7. `design/data-source-matrix.md` when Situm/product capability scope matters;
8. the active plan;
9. `DESIGN.md` / `design/IMPLEMENTATION.md` for presentation changes.

Historical plans/sessions/branches are evidence only. Current state and active-plan authority override stale wording.

## Git workflow

- one plan = one dedicated plan branch;
- never implement directly on `main`;
- no force-push/destructive rewrite as normal workflow;
- PR creation/review and merge are user-gated;
- normal dependent plans start after the preceding plan is integrated into updated `main`;
- stacked implementation requires explicit user authorization in `.agents/state.md`.

## Completed roadmap

Plans 017–020, including Plan 019A, are complete and integrated into `main` by PR #12.

## Active backend-refactor roadmap

Roadmap overview:

`plans/021-025-backend-refactor-roadmap.md`

```text
Plan 021 — Identity & Auth Foundation                       [ready / next]
Plan 022 — Private Workspaces & Situm Configuration         [queued]
Plan 023 — Observability, Correlation & Safe Error Boundary [queued]
Plan 024 — Workspace-scoped Situm Backend Migration         [queued]
Plan 025 — Workspace UX & Full Regression                   [queued]
```

Planning branch:

`roadmap/021-025-backend-refactor`

No stacked implementation authorization exists for this roadmap at creation.

## Transition direction

The current integrated runtime still contains the previous single-user/global-Situm configuration. Plans 021–024 replace that incrementally with DB-backed users, private workspaces, workspace-managed Situm configuration, permission-aware backend behavior, observability reuse, and end-to-end correlation. Plan 025 performs final UX/regression and documentation reconciliation.

Do not remove a working old path before its replacement is implemented and accepted.

## Capability evidence gate

For Situm behavior: **no evidence, no implementation**.

Verify exact endpoint/SDK method, installed-version compatibility, auth/permission, request inputs, consumed fields/events, browser/server ownership, web/native ownership, and relevant failure semantics. Missing material contracts remain unresolved/absent.

## Phase completion

A phase is complete only when applicable truth is recorded, validation is run, implementation is reviewed, changes are committed/pushed, and unresolved/manual items remain explicitly unresolved.

Baseline checks:

- `git diff --check`;
- `npm run lint`;
- `npm run typecheck`;
- `npm run build`.

Runtime/browser acceptance uses production build + preview, not Nuxt dev mode.
