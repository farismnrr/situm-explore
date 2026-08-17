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
9. `plans/028-032-native-mobile-roadmap.md` when executing Plans 028–032;
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

Plans 028–029 are integrated into `main`. Plan 030 native Map/positioning/navigation implementation is reviewer-approved and PR-ready pending user authorization on `plan/030-native-map-positioning-navigation`; its unpassed physical-device E2E is explicitly carried to Plan 032's terminal gate. Plans 031–032 remain gated on Plan 030 integration.

```text
roadmap/028-032-native-mobile                       [Plan 030 PR-ready; physical E2E consolidated in Plan 032]
-> Plan 028 — Native Capability, Auth & Distribution Spike [complete/integrated]
-> Plan 029 — Native App Foundation & Workspace Session [complete/integrated]
-> Plan 030 — Native Map, Positioning & Navigation [implementation approved; PR-ready]
-> Plan 031 — Native Realtime Operations
-> Plan 032 — Web/Native Handoff, Distribution & Full Regression [terminal physical-E2E gate]
```

Roadmap overview: `plans/028-032-native-mobile-roadmap.md`.

Plan 030 starts only from updated `main` after Plan 029 is integrated; each later dependent plan starts after its predecessor is integrated unless the user explicitly authorizes stacked execution.

## Transition direction

The historical pre-refactor baseline used env-defined app auth and process-global Situm account/Viewer/building context; it also produced analytics history before workspace ownership existed.

Plans 021–025 replaced those incrementally. Plans 026–027 completed production containerization plus analytics/security hardening. Plans 028–032 add a native companion client while preserving Nitro as the single application backend.

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
