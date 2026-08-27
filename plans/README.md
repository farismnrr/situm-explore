# Plans

Plans are executable implementation checklists for Codex.

## Mandatory execution workflow

Before executing a future active plan, read:

1. `AGENTS.md`;
2. `.agents/README.md`;
3. `.agents/state.md`;
4. `.agents/memory/decisions.md`;
5. `.agents/memory/roadmap-021-025.md` when completed backend-roadmap context matters;
6. `.agents/protocols/git-workflow.md`;
7. `ARCHITECTURE.md`;
8. `plans/021-025-prerequisites.md` when historical prerequisite context matters;
9. `plans/028-034-native-mobile-roadmap.md` when historical native-roadmap context matters;
10. `design/data-source-matrix.md` when Situm/product scope matters;
11. explicitly active plan, when one exists;
12. `DESIGN.md` / `design/IMPLEMENTATION.md` for presentation changes.

Historical plans/sessions/branches are evidence only. Current state, durable decisions, architecture, and any explicitly active future plan are current authority.

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

## Completed native companion roadmap

Plans 028–035 are closed/integrated. Plan 034 was administratively closed by explicit user decision with truthful documented limitations rather than a fabricated full-E2E PASS. Plan 035 then remediated the Realtime/foreground-positioning lifecycle, physically verified own-device positioning plus server-mediated Realtime on the POS, and was integrated together with Android release/distribution polish through PR #32 at merge commit `840c0f9`.

```text
roadmap/033-034-native-ui-reconciliation          [historical/closed]
-> Plan 028 — Native Capability, Auth & Distribution Spike [complete/integrated]
-> Plan 029 — Native App Foundation & Workspace Session [complete/integrated]
-> Plan 030 — Native Map, Positioning & Navigation [complete/integrated]
-> Plan 031 — Native Realtime Operations [complete/integrated]
-> Plan 032 — Web/Native Handoff & Distribution [complete/integrated]
-> Plan 033 — Native UI/UX Reference Reconciliation [complete/integrated]
-> Plan 034 — Full E2E Acceptance & Roadmap Closeout [closed; documented limitations retained]
-> Plan 035 — Realtime Remediation [complete/integrated via PR #32]
```

Roadmap history: `plans/028-034-native-mobile-roadmap.md`. Plan 036 — Realtime Reliability is **complete / integrated via PR #35** at merge commit `7a87afb`. Historical Plan 034 limitations remain evidence unless a future scoped plan explicitly reopens them.

## Active / unintegrated work

- Plan 037 — Web Loading-State Hygiene: implementation complete at `cb00201c` on `plan/037-loading-state-hygiene`; automated validation passed and branch pushed; not yet integrated or deployed.
- Plan 038 — Two-Key Situm Credential Model: stacked implementation complete on `plan/038-two-key-situm-credentials`; automated validation passed; migration and local production-style Compose deployment passed on 2026-08-27; authenticated browser Viewer, GHCR publication, and physical Android Only Read positioning acceptance remain pending.

## Transition direction

The historical pre-refactor baseline used env-defined app auth and process-global Situm account/Viewer/building context; it also produced analytics history before workspace ownership existed.

Plans 021–025 replaced those incrementally. Plans 026–027 completed production containerization plus analytics/security hardening. Plans 028–035 established and closed the native companion work while preserving Nitro as the single application backend.

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
