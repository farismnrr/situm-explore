# Current State

_Last reviewed: 2026-08-13_

## Integrated baseline

Plans 017–020 are complete and integrated into `main` by PR #12.

The Plans 021–025 backend-refactor roadmap and reconciled documentation are integrated into `main` by PR #13.

## Active roadmap

```text
Plan 021 — Identity & Auth Foundation                       [ready / next]
Plan 022 — Private Workspaces & Situm Configuration         [queued]
Plan 023 — Observability, Correlation & Safe Error Boundary [queued]
Plan 024 — Workspace-scoped Situm Backend Migration         [queued]
Plan 025 — Workspace UX & Full Regression                   [queued]
```

No stacked implementation authorization exists. Plan 021 must start from updated `main`; later plans remain sequential dependencies.

The former roadmap planning branch is historical after PR #13 and is not an implementation base.

## Current authority

Read `.agents/memory/decisions.md`, `.agents/memory/roadmap-021-025.md`, `ARCHITECTURE.md`, `plans/README.md`, `plans/021-025-prerequisites.md`, the capability matrix when relevant, and the active plan.

Historical plans, sessions, and branches remain evidence only.

## Locked direction

- database-backed application users;
- working email/password registration/login;
- Google OAuth prepared for later manual acceptance;
- many private single-owner workspaces per user;
- workspace-managed Situm configuration;
- `VIEW_ONLY` / `VIEW_WRITE` product modes with upstream permission authoritative;
- workspace-scoped Situm, Viewer/building, and analytics context;
- reuse existing observability infrastructure;
- end-to-end correlation/tracing;
- sanitized client errors with detailed diagnostics retained server-side.

Detailed prerequisites and potential blockers live in `plans/021-025-prerequisites.md` and are intentionally handled in a later user-gated step.

## Current stacked execution

The user explicitly authorized stacked execution of Plans 021–025 without PRs or merges.

- Active branch: `plan/021-auth-identity-foundation`
- Completed in this branch: Plan 021 Phase 1 audit and Phase 2 identity schema/migration.
- Completed in this branch: Plan 021 Phases 1–3 through registration/password login.
- Current phase: Plan 021 Phase 4 session identity and protected API continuity.
- Later branches must be created directly from the exact completed predecessor HEAD.
