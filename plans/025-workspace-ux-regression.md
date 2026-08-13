# Plan 025 — Workspace UX & Full Regression

Status: **queued after Plan 024 integration**

Branch: `plan/025-workspace-ux-regression`

## Goal

Finish the product-facing workspace flow and validate the completed backend refactor end-to-end.

## Workspace UX

- create, rename, delete, and switch private workspaces;
- add or replace workspace Situm configuration;
- explain that supported Situm key types are Only Read or Read & Write;
- show validation/configuration status without showing the stored value again;
- keep the selected workspace consistent across authenticated product surfaces;
- no invite/member UI.

## Access-aware UX

- Read-only workspace: reading stays available and edit actions show clear read-only guidance.
- Write-capable workspace: retain the already verified editing scenarios.
- If the backend rejects an action, show safe product feedback rather than raw upstream/internal text.
- Unsupported/intermediate Situm permission levels show configuration guidance instead of full-write UI.

## Correlation/support UX

Apply the request correlation/error behavior from Plans 023–024. Unexpected failures may show a support/reference id while detailed diagnostics remain server-side.

## Full regression

Use `npm run build` then `npm run preview`.

Cover register/login/session, multiple workspace switching, read-only behavior, write-capable retained behavior, map/cartography, POIs, geofences, paths, realtime, analytics, groups/alarms, static directions, mobile Viewer boundary, failure correlation, and navigate-away/back cleanup.

Google OAuth runtime acceptance remains manual/user-owned unless scope is explicitly expanded.

## Closeout

Reconcile `.agents/state.md`, durable decisions, architecture/data-source docs, and `.env.example` to the final DB-backed identity/workspace model. Remove stale authority describing global Situm configuration as the active architecture.
