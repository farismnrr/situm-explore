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

Acceptance evidence: production preview passed auth/session/protection, workspace CRUD/switch/delete, dual-credential write-only metadata, ownership denial, sanitized errors/reference IDs, workspace analytics readiness, representative workspace Situm routes, and actual Viewer/cartography rendering. The primary Read & Write credential remains server-only. Legacy global authority is fenced and ClickHouse workspace tables are ready. Google OAuth runtime remains user-owned/deferred.

### Viewer authentication: migrated from JWT to direct read-only API key (2026-08-14)

The Viewer previously authenticated via a server-issued short-lived JWT delivered through the SDK's `setAuth()`/`selectBuilding()` postMessage calls. Runtime investigation proved this JWT/postMessage path was not viable against the currently hosted `maps.situm.com`: as of Map Viewer release 1.207.0 (2026-05-29), the hosted Viewer only accepts postMessage-delivered auth (JWT or API key) when the `wait_for_auth` query parameter is present on the iframe URL; the installed `@situm/sdk-js` 0.25.0 never sets it. Without `wait_for_auth`, the Viewer boots straight into its own unauthenticated default/demo building and silently ignores all subsequent `setAuth`/`selectBuilding` postMessages — this is what produced the "Home Store" (building 17793) mismatch instead of the workspace's actual building.

Official Situm documentation (situm.com/docs/map-viewer-quickstart-guide, situm.com/docs/managing-api-keys) documents and recommends a simpler, officially-supported alternative that sidesteps the race entirely: constructing `SitumSDK({ auth: { apiKey } })` with a dedicated **read-only** API key and calling `sdk.viewer.create({ domElement, buildingId })`. This embeds the key directly in the iframe's first request (`https://maps.situm.com?apikey=...&buildingid=...`), so the Viewer authenticates synchronously at load — no `wait_for_auth`, no `app.set_auth` postMessage, no bootstrap race. Live-verified against the real hosted Viewer and the real workspace credential: building 19866 (PT Berjaya Inovasi Global) loads correctly on the first attempt, confirmed via `BUILDING_SELECTED{identifier:19866}`.

The application now uses this pattern. `server/utils/viewer-auth.ts` (`issueWorkspaceViewerApiKey`) keeps the exact same security boundary as before — authenticated session, explicit workspace, ownership check, server-side decrypt, verify `READ_ONLY` permission and organization match — but returns the decrypted read-only key itself instead of exchanging it for a JWT. This key is, by design, visible in the browser (iframe URL and browser memory) once issued; this is the officially sanctioned pattern for a dedicated least-privilege Viewer credential, not a regression — it is not equivalent to exposing the primary Read & Write credential, which remains server-only and is never returned to the browser. The Viewer credential can be rotated/revoked independently by the workspace owner at any time.

`SitumViewer.vue` keeps the DOM element hidden (no iframe/cartography paint) until `ViewerEventType.BUILDING_SELECTED` confirms the expected building ID, with a bounded (~12s) timeout that surfaces a product-owned "Map unavailable" error with a Retry action if confirmation never arrives. A `BUILDING_SELECTED` event for any other building is ignored (stays hidden/loading) rather than shown or treated as a hard error. This "never reveal an unverified building" behavior is preserved regardless of which credential/auth mechanism the Viewer uses underneath.

Use npm run build then npm run preview.

Cover register/login/session, multiple users, workspace switching, cross-user denial, duplicate external Situm account configuration, read-only behavior, write-capable retained behavior, map/cartography, POIs, geofences, paths, realtime, analytics, groups/alarms, organization/users, static directions, mobile Viewer boundary, failure correlation, and navigate-away/back cleanup.

Use both Only Read and Read & Write workspaces if available. Missing external test credentials stay manual/unresolved rather than fabricated.

Google OAuth runtime acceptance remains user-owned unless scope expands.

## Final configuration/documentation state

Reconcile state, durable decisions/addenda, README, architecture/data-source/design docs, and .env.example to final DB-backed identity/workspace model.

Final runtime must not require global Situm API-key or process-global building-selection env values. Keep only genuine deployment-level server configuration such as session, database, workspace-credential encryption, ClickHouse, OAuth, and discovered observability settings.

Remove stale authority describing global Situm config or env-defined app users as active architecture.

See plans/021-025-prerequisites.md.
