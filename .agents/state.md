# Current State

_Last reviewed: 2026-08-14_

## Active Plan 026

Plan 026 production containerization is active on `plan/026-production-containerization`, based on latest `origin/main`. Phases 0–6 are complete. GHCR currently contains SHA `sha-0cf07c08afab` and `staging` multi-platform images with digest `sha256:f28855b6e459da1584c0314b7302dacc63e545bdb9b03489ad3df5d9d397873e`; the same digest was pulled back and run via pull-only Compose. Local arm64 runtime smoke is unavailable due the host emulation entrypoint issue. Pull-only staging Compose and curated ignored runtime env are now present. The candidate image audit is clean: runtime UID 10001, 83.3 MB, no secret/env/log/filesystem matches. The workflow targets local Buildx publication to GHCR for `linux/amd64` and `linux/arm64`, pull-only staging Compose, and Makefile-driven operations; no CI/PR/merge is authorized.

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
- dual workspace credentials: a verified Situm Read & Write primary credential and a separate verified Situm Read-only Viewer credential; account ID is derived server-side;
- workspace-scoped Situm, Viewer/building, and analytics context;
- reuse existing observability infrastructure;
- end-to-end correlation/tracing;
- sanitized client errors with detailed diagnostics retained server-side.

Detailed prerequisites and potential blockers live in `plans/021-025-prerequisites.md` and are intentionally handled in a later user-gated step.

## Current stacked execution

The user explicitly authorized stacked execution of Plans 021–025 without PRs or merges.

- Completed in this branch: Plan 021 Phases 1–6; identity, registration/login, sessions, conditional Google preparation, UI, and acceptance validation.
- Completed in Plan 022 branch: Phases 1–5 workspace ownership, CRUD authorization, encrypted Situm config persistence, safe validation, and acceptance.
- Completed branch: `plan/023-observability-error-boundary`
- Completed in Plan 023 branch: Phases 1–2 application OTLP lifecycle, request correlation, and nested DB/Situm spans.
- Completed in Plan 023 branch: Phase 3 safe structured errors and client reference IDs.
- Current phase: Plan 023 Phase 4 application trace/error-path acceptance.
- Completed branch: `plan/024-workspace-situm-backend-migration`
- Completed in Plan 024: Phase 1 reusable owner-scoped Situm context plus workspace-scoped config and core read routes. Lint, typecheck, and build pass; upstream status smoke remains externally dependent because the Situm read hung.
- Completed in Plan 024: Phase 2 explicit workspace routes for paths and realtime; static mutation surface remains read-only. Lint, typecheck, and build pass; upstream route smoke returned sanitized upstream 404s, with no credential exposure.
- Completed in Plan 024: Phase 3 workspace-scoped ClickHouse tables, owner-checked summary/sync routes, per-request workspace credential use, and legacy-row exclusion. Lint, typecheck, build, and bounded authorization smoke pass.
- Plan 024 complete on `plan/024-workspace-situm-backend-migration`: migrated Situm/config routes use explicit owner-scoped workspace IDs; workspace analytics writes/reads carry workspace identity; legacy unscoped analytics remain untouched and excluded. Final lint, typecheck, build, and bounded preview checks pass; external Situm upstream reads remain subject to available upstream data/permissions.
- Final audited branch: `plan/025-workspace-ux-regression`
- Completed in Plan 025: Phase 1 workspace context/UI for create, list, switch, rename, delete, Situm config replacement, safe status, and validation feedback. Production build and typecheck pass; dynamic config routing was made explicit through a safe bounded catch-all after runtime route matching was verified.
- Plan 025 complete on `plan/025-workspace-ux-regression`: production-preview regression passed for auth/session/protection, workspace CRUD/ownership, dual-credential config, owner-scoped Viewer credential issuance, visible Viewer cartography, lifecycle away/back, analytics readiness, safe errors, and cleanup. The read-write credential remains server-only; the browser Viewer now authenticates with a dedicated read-only API key (not a JWT — see below). Google runtime remains user-owned/deferred.
- Later branches must be created directly from the exact completed predecessor HEAD.

## Latest Viewer security evidence

- 2026-08-14 targeted Situm auth smoke confirmed the installed SDK's API-key exchange and bearer-JWT flow.
- Read-only and read-write temporary keys produced explicitly different JWT permission claims (`read-only` vs `read-write`), with approximately 24-hour lifetimes. The read-write JWT is broad authority and is not safe for browser Viewer use.
- A separate read-only Viewer credential is stored encrypted alongside the server credential, with write-only metadata.
- The application trace for Viewer auth was found in Tempo with `http.request` and `workspace.viewer_auth` spans. Span attributes contained only workspace/request metadata; no credentials were present.

### Viewer building-mismatch investigation and remediation (2026-08-14)

- Runtime investigation traced a live mismatch where the app requested building 19866 (PT Berjaya Inovasi Global, the org's only building under both stored credentials) but the hosted Viewer displayed a foreign building 17793 ("Home Store", not owned by this org, not returned by the Situm REST API for either credential).
- Root cause: the JWT/postMessage Viewer flow (`setAuth(jwt)` then `selectBuilding(id)`) is fire-and-forget in `@situm/sdk-js` 0.25.0 — the Promise resolving is not an acknowledgement. The hosted Viewer (Map Viewer release 1.207.0, 2026-05-29) now only accepts postMessage-delivered auth when the iframe URL includes `wait_for_auth=true`, which the installed SDK never sets; without it the Viewer boots into its own default/demo content and ignores all subsequent postMessage auth.
- Fix: migrated the Viewer to the officially documented direct-API-key pattern (`SitumSDK({ auth: { apiKey } })` → `sdk.viewer.create(...)`), which embeds a dedicated **read-only** Viewer API key directly in the iframe's first request. This avoids the postMessage race entirely — live-verified against the real hosted Viewer and the real workspace credential: building 19866 loads correctly on first attempt, confirmed via `BUILDING_SELECTED{identifier:19866}`.
- The read-only Viewer key is now, by design, visible in the browser (iframe URL/memory) once the owner-scoped, session-authenticated `/api/workspaces/:id/viewer-auth` endpoint issues it — this is the Situm-documented sanctioned pattern for a dedicated least-privilege Viewer credential and is not equivalent to exposing the primary Read & Write credential, which remains server-only. The endpoint still verifies `READ_ONLY` permission and organization match server-side before issuing the key, exactly as the prior JWT flow did.
- `SitumViewer.vue` keeps the iframe hidden until `BUILDING_SELECTED` confirms the expected building ID (bounded ~12s timeout, product-owned "Map unavailable" error with Retry on failure); a `BUILDING_SELECTED` for any other building is ignored rather than shown. Verified in both a normal and a fresh/incognito-equivalent browser context, and across navigate-away/back.
- The `[workspaceId]/viewer-auth.get.ts` specific route file was found to be dead/unreachable (shadowed at runtime by the `[...workspacePath].ts` catch-all, which had its own duplicate handler for the same path) and was removed; the catch-all is now the single source of truth for this endpoint.

## Temporary key policy correction

- The user's latest instruction supersedes the earlier revocation reminder: the two temporary Situm smoke-test keys are intentionally kept active until Plan 025 final acceptance is fully passing.
- They may be reused only for bounded local acceptance, must remain hidden and unpersisted, and must not be revoked during remediation. Final revoke/delete guidance is deferred until PASS.
- The temporary keys were loaded from ignored local `.env` for bounded acceptance and remain intentionally available until the user revokes them after this final PASS. Their values are not persisted in repository evidence.
