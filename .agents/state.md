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

- Completed in this branch: Plan 021 Phases 1–6; identity, registration/login, sessions, conditional Google preparation, UI, and acceptance validation.
- Completed in Plan 022 branch: Phases 1–5 workspace ownership, CRUD authorization, encrypted Situm config persistence, safe validation, and acceptance.
- Active branch: `plan/023-observability-error-boundary`
- Completed in Plan 023 branch: Phases 1–2 application OTLP lifecycle, request correlation, and nested DB/Situm spans.
- Completed in Plan 023 branch: Phase 3 safe structured errors and client reference IDs.
- Current phase: Plan 023 Phase 4 application trace/error-path acceptance.
- Later branches must be created directly from the exact completed predecessor HEAD.
