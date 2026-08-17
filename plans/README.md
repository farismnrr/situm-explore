# Plans

Plans are executable implementation checklists for Codex.

## Mandatory execution workflow

Before executing current plans, read:

1. `AGENTS.md`;
2. `.agents/README.md`;
3. `.agents/state.md`;
4. `.agents/memory/decisions.md`;
5. `.agents/memory/roadmap-021-025.md` when completed backend-roadmap context matters;
6. `.agents/protocols/git-workflow.md`;
7. `ARCHITECTURE.md`;
8. `plans/021-025-prerequisites.md` when historical prerequisite context matters;
9. `plans/028-033-native-mobile-roadmap.md` when executing Plans 028–033;
10. `design/data-source-matrix.md` when Situm/product scope matters;
11. active plan;
12. `DESIGN.md` / `design/IMPLEMENTATION.md` for presentation changes.

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

## Completed backend-refactor roadmap

```text
roadmap/021-025-backend-refactor              [complete/integrated]
-> Plan 021 — Identity & Auth Foundation       [complete/integrated]
-> Plan 022 — Private Workspaces + Situm       [complete/integrated]
-> Plan 023 — Observability + Safe Errors      [complete/integrated]
-> Plan 024 — Workspace Situm Backend          [complete/integrated]
-> Plan 025 — Workspace UX + Full Regression   [complete/integrated; Google OAuth deferred]
```

Roadmap overview: `plans/021-025-backend-refactor-roadmap.md`.
Prerequisites/blockers: `plans/021-025-prerequisites.md`.

## Completed Plans 026–027

- Plan 026 — Production Containerization: complete/integrated via PR #20.
- Plan 027 — Analytics Correctness & Security Hardening: complete/integrated via PR #21.

## Approved native companion roadmap

Plans 028–031 are integrated into `main`. Plan 032 implementation is complete pending integration; Plan 033 owns the consolidated full-E2E terminal gate, including every still-unpassed physical-device check from Plans 030–031 and every cross-client item introduced by Plan 032.

```text
roadmap/032-033-e2e-split                         [Plans 032–033 remaining]
-> Plan 028 — Native Capability, Auth & Distribution Spike [complete/integrated]
-> Plan 029 — Native App Foundation & Workspace Session [complete/integrated]
-> Plan 030 — Native Map, Positioning & Navigation [complete/integrated; physical E2E carried to Plan 033]
-> Plan 031 — Native Realtime Operations [complete/integrated; physical E2E carried to Plan 033]
-> Plan 032 — Web/Native Handoff & Distribution
-> Plan 033 — Full E2E Acceptance & Roadmap Closeout [terminal hard gate]
```

Roadmap overview: `plans/028-033-native-mobile-roadmap.md`.

Plan 032 starts only from updated `main` after Plan 031 is integrated; Plan 033 starts after Plan 032 is integrated unless the user explicitly authorizes stacked execution.

## Transition direction

The historical pre-refactor baseline used env-defined app auth and process-global Situm account/Viewer/building context; it also produced analytics history before workspace ownership existed.

Plans 021–025 replaced those incrementally. Plans 026–027 completed production containerization plus analytics/security hardening. Plans 028–033 add and fully accept a native companion client while preserving Nitro as the single application backend.

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
