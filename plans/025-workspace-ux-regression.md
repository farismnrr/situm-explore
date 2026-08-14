# Plan 025 — Workspace UX & Full Regression

Status: complete; Viewer security acceptance passed with a dual-credential model. Google OAuth runtime remains externally deferred.

Branch: plan/025-workspace-ux-regression

Depends on: Plan 024 accepted and integrated into updated main.

## Current stacked execution

- [x] Phase 1 — workspace context composable and authenticated workspace management UI.
- [x] Phase 2 — full production-preview/browser regression and final documentation closeout.

## Goal

Finish product-facing workspace flow and validate the completed backend refactor end-to-end.

## Workspace UX

- create, rename, delete, switch private workspaces;
- add/replace workspace Situm configuration;
- explain supported product key types: Situm Only Read or Read & Write;
- show validation/detected-capability status without showing the stored credential again;
- selected workspace stays consistent across authenticated surfaces while requests carry explicit workspace context;
- deleting the selected workspace moves to another owned workspace or a truthful no-workspace onboarding state;
- no invite/member UI.

## Access-aware UX

- Read-only workspace: reads stay available; attempted mutations produce clear read-only/forbidden feedback and never fake success.
- Write-capable workspace: retain only already verified editing scenarios.
- Backend enforcement remains authoritative even when frontend guards exist.
- Upstream rejection becomes safe product feedback, never raw Situm/internal text.
- Unsupported/intermediate Situm permissions show configuration guidance instead of full-write UI.

## Correlation/support UX

Apply Plans 023–024 correlation/error behavior. Unexpected failures may show a support/reference id while details remain server-side. Do not dump raw server errors into toast text or browser console.

## Full regression

Acceptance evidence: production preview passed auth/session/protection, workspace CRUD/switch/delete, dual-credential write-only metadata, ownership denial, sanitized errors/reference IDs, workspace analytics readiness, representative workspace Situm routes, and actual Viewer/cartography rendering. The primary Read & Write credential remained server-only; the separate Only Read credential produced a verified read-only JWT for `Viewer.setAuth(jwt)`. The Viewer iframe rendered cartography and survived navigate-away/back. Legacy global authority is fenced and ClickHouse workspace tables are ready. Google OAuth runtime remains user-owned/deferred.

Use npm run build then npm run preview.

Cover register/login/session, multiple users, workspace switching, cross-user denial, duplicate external Situm account configuration, read-only behavior, write-capable retained behavior, map/cartography, POIs, geofences, paths, realtime, analytics, groups/alarms, organization/users, static directions, mobile Viewer boundary, failure correlation, and navigate-away/back cleanup.

Use both Only Read and Read & Write workspaces if available. Missing external test credentials stay manual/unresolved rather than fabricated.

Google OAuth runtime acceptance remains user-owned unless scope expands.

## Final configuration/documentation state

Reconcile state, durable decisions/addenda, README, architecture/data-source/design docs, and .env.example to final DB-backed identity/workspace model.

Final runtime must not require global Situm API-key or process-global building-selection env values. Keep only genuine deployment-level server configuration such as session, database, workspace-credential encryption, ClickHouse, OAuth, and discovered observability settings.

Remove stale authority describing global Situm config or env-defined app users as active architecture.

See plans/021-025-prerequisites.md.
