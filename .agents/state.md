# Current State

_Last reviewed: 2026-08-13_

## Integrated baseline

Plans 017–020 are complete and integrated into `main` by PR #12.

The Plans 021–025 backend-refactor roadmap and reconciled documentation are integrated into `main` by PR #13.

## Active roadmap

```text
Plan 021 — Identity & Auth Foundation                       [complete]
Plan 022 — Private Workspaces & Situm Configuration         [complete]
Plan 023 — Observability, Correlation & Safe Error Boundary [complete]
Plan 024 — Workspace-scoped Situm Backend Migration         [complete]
Plan 025 — Workspace UX & Full Regression                   [complete; Google OAuth deferred]
```

Stacked implementation of Plans 021–025 was explicitly authorized for this branch; no commits or pushes are performed by the worker.

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
- Active branch: `plan/024-workspace-situm-backend-migration`
- Completed in Plan 024: Phase 1 reusable owner-scoped Situm context plus workspace-scoped config and core read routes. Lint, typecheck, and build pass; upstream status smoke remains externally dependent because the Situm read hung.
- Completed in Plan 024: Phase 2 explicit workspace routes for paths and realtime; static mutation surface remains read-only. Lint, typecheck, and build pass; upstream route smoke returned sanitized upstream 404s, with no credential exposure.
- Completed in Plan 024: Phase 3 workspace-scoped ClickHouse tables, owner-checked summary/sync routes, per-request workspace credential use, and legacy-row exclusion. Lint, typecheck, build, and bounded authorization smoke pass.
- Plan 024 complete on `plan/024-workspace-situm-backend-migration`: migrated Situm/config routes use explicit owner-scoped workspace IDs; workspace analytics writes/reads carry workspace identity; legacy unscoped analytics remain untouched and excluded. Final lint, typecheck, build, and bounded preview checks pass; external Situm upstream reads remain subject to available upstream data/permissions.
- Current phase: create Plan 025 from exact Plan 024 HEAD.
- Active branch: `plan/025-workspace-ux-regression`
- Completed in Plan 025: Phase 1 workspace context/UI for create, list, switch, rename, delete, Situm config replacement, safe status, and validation feedback. Production build and typecheck pass; dynamic config routing was made explicit through a safe bounded catch-all after runtime route matching was verified.
- Plan 025 complete on `plan/025-workspace-ux-regression`: production-preview regression passed for auth/session/protection, workspace CRUD/ownership, dual-credential config, owner-scoped Viewer auth, visible Viewer cartography, lifecycle away/back, analytics readiness, safe errors, and cleanup. The read-write credential remains server-only; the read-only Viewer JWT is the only browser authority. Google runtime remains user-owned/deferred.
- Later branches must be created directly from the exact completed predecessor HEAD.

## Latest Viewer security evidence

- 2026-08-14 targeted Situm auth smoke confirmed the installed SDK's API-key exchange and bearer-JWT flow.
- Read-only and read-write temporary keys produced explicitly different JWT permission claims (`read-only` vs `read-write`), with approximately 24-hour lifetimes. The read-write JWT is broad authority and is not safe for browser Viewer use.
- A separate read-only Viewer credential is stored encrypted alongside the server credential, with write-only metadata. The owner-scoped production route exchanges it for a temporary JWT and verifies `read-only` permission before returning it. The read-write-derived JWT and both long-lived keys remain server-only.
- Production-preview Chrome acceptance loaded the actual Situm Viewer iframe with a rendered canvas (`783x495`), cartography DOM content, and no Viewer error; the parent UI reached Ready. Navigating away/back recreated the authenticated route successfully. Cross-user Viewer-token access returned safe denial.
- The application trace for Viewer auth was found in Tempo with `http.request` and `workspace.viewer_auth` spans. Span attributes contained only workspace/request metadata; no credentials or JWTs were present.

## Temporary key policy correction

- The user's latest instruction supersedes the earlier revocation reminder: the two temporary Situm smoke-test keys are intentionally kept active until Plan 025 final acceptance is fully passing.
- They may be reused only for bounded local acceptance, must remain hidden and unpersisted, and must not be revoked during remediation. Final revoke/delete guidance is deferred until PASS.
- The temporary keys were loaded from ignored local `.env` for bounded acceptance and remain intentionally available until the user revokes them after this final PASS. Their values are not persisted in repository evidence.
