# Current State

_Last reviewed: 2026-08-17_

## Active Plan 028 — Native Capability, Auth & Distribution Spike

The native roadmap was integrated into `main` via PR #22 (merge commit `e9091107f6676e15a0a5887629bb62e84aede0aa`). Plan 028 is active on `plan/028-native-capability-auth-spike`, created from that exact updated `origin/main`. Phases 0–2 are complete; Phase 3 least-privilege Situm auth proof is next. No native product Map/Realtime implementation has started. The sequence remains Plan 028 -> Plan 029 -> Plan 030 -> Plan 031 -> Plan 032, with each later plan gated on predecessor integration.

Locked product policy for this roadmap:

- web Map remains available on desktop/tablet layouts that pass explicit Viewer usability acceptance;
- phone web Map becomes a native open/install handoff after the native Map exists;
- web Realtime becomes a native open/install handoff on desktop/tablet/phone after native Realtime exists;
- React Native + Expo development builds + `@situm/react-native` is the target stack, subject to Plan 028 exact-version/capability proof;
- Phase 1 froze Expo 57.0.13 / React Native 0.86.2 / React 19.2.3 / `@situm/react-native` 3.19.2 / `react-native-webview` 13.16.1, Android min/compile/target 24/36/36, JDK 21.0.10, Kotlin 2.1.20 and Gradle 9.3.1. A disposable Expo prebuild plus Android `assembleDebug` passed with New Architecture enabled; iOS compile/runtime remain macOS/device-gated.
- The future native package will be standalone under `mobile/`; Plan 029 must create it without npm workspaces or a production app in Plan 028.
- Phase 2 source proof confirms MapView, cartography, positioning, navigation, permission helper, generic realtime data, and Share Live Location APIs. It does not prove generic remote-map overlays/focus, runtime payload semantics, background permission safety, or iOS compile/runtime. Unsupported reference interactions remain truthful fallbacks.
- the existing Nitro backend and PostgreSQL application identity/workspace model remain authoritative for both clients;
- the server-side Read & Write Situm credential must never be exposed to mobile; Plan 028 must freeze a proven short-lived-token or dedicated Positioning-credential contract before Plan 029 implementation.

Normal workflow: Plan 028 is executing from integrated `origin/main`; later plans start sequentially from updated `origin/main` only after their predecessor is reviewed and integrated, unless the user explicitly authorizes stacked branches.

## Plan 027 (complete/integrated)

Plan 027 (analytics correctness & security hardening) is complete and integrated into `main` via PR #21 (merge commit `0c45aab8f188129bcb4a61678c1d3c2d8ea8cce3`). All phases 0–8 plus the pre-PR review remediation passed before integration; its former plan branch was deleted local/remote after merge.

- Remediated: rate-limit identity no longer trusts client-supplied `X-Forwarded-For` (this deployment publishes Nitro directly on the host port with no proxy — see `deploy/staging.compose.yml`); limiter now prunes expired buckets on every call; the window-reset test now genuinely crosses the boundary; the ClickHouse workspace-isolation regression assertion was trivial and is now a real cross-workspace query check; `analytics_workspace_sync_runs` deletion now has regression coverage (all 4 workspace-owned tables); the regression script's undeclared `dotenv` import was removed in favor of `--env-file=.env`.
- Live-verified: 12 login attempts with a distinct spoofed `X-Forwarded-For` per request still hit 429 after 10, against the real production bundle on an isolated port; existing staging container was untouched.

- Phase 0 complete: dependency confirmed (PR #20 merged into main), branch created from up-to-date main, stale "Plan 026 active" references in `AGENTS.md`/`.agents/state.md` reconciled.
- Phase 1 complete: `queryWorkspaceAnalytics` now scopes reads by `workspace_id` + exact requested-window `source_window_id` prefix (same pattern as the legacy query path), preventing double-counting across overlapping/re-synced windows and making positioning/geofencing obey the requested date window. `buildingId`/`geofenceId` filters from the UI are now parsed, validated, and applied in `summary.get.ts`. `sync.post.ts` body is now validated with a zod schema instead of a bare TS generic. Lint and typecheck pass.
- Phase 2 complete: workspace deletion (`[id].delete.ts`) now verifies ownership, then runs a bounded parameter-bound ClickHouse cleanup (`deleteWorkspaceAnalytics`) against exactly the four `analytics_workspace_*` tables before deleting the Postgres row; ClickHouse cleanup failure aborts the whole deletion (503) rather than reporting success with orphaned analytics. Legacy/unscoped analytics tables are never touched. Lint/typecheck pass; local `shared-clickhouse` container (port 8124) is reachable for live regression evidence in Phase 7.
- Phase 3 complete: added `server/utils/rate-limit.ts` (KISS in-memory per-process fixed-window limiter, no Redis) and applied it to `/api/auth/register` (5/min/IP) and `/api/auth/login` (10/min/IP) before any expensive work. Registration now checks for an existing account before calling `hashPassword` (was previously reversed). Login already skipped hashing for unknown emails, so only the rate limit was added there. Generic invalid-login response unchanged. Lint/typecheck pass.
- Phase 4 complete: workspace Situm config save (`[...workspacePath].ts` PUT) now rejects a Viewer credential whose `organizationId` does not match the primary credential's `organizationId`, in addition to the existing READ_WRITE/READ_ONLY checks; failure is sanitized into the existing generic 422 and occurs before persistence. Primary credential remains server-only. Lint/typecheck pass.
- Phase 5 complete: added `server/utils/bounded-fetch.ts` (AbortController-based, 10s default) and applied it to the three app-owned raw `fetch` calls (`situm/reports.ts`, `situm/groups-alarms.ts`, `telemetry-logs.ts`), sanitizing timeouts into existing error patterns without leaking credentials. `@situm/sdk-js` 0.25.0 exposes an undocumented `timeouts?: Record<string,number>` SDK config field; left unset per "no evidence, no implementation" since key semantics aren't documented — recorded as an intentionally unresolved item, not a fix. Lint/typecheck pass.
- Phase 6 complete: added `server/middleware/security-headers.ts` (X-Content-Type-Options, Referrer-Policy, X-Frame-Options DENY, conservative Permissions-Policy), live-verified via local dev server curl. CSP intentionally NOT shipped — no live-verified network trace of the hosted Situm Viewer's actual script/frame/connect origins exists in this repo, and a guessed allowlist risks breaking the map (this repo has already hit one Viewer-behavior surprise; see the building-mismatch investigation above). Recorded as an open, documented limitation.
- Phase 7 complete: no new test framework installed (used native `node --test` + already-present `tsx`; added `npm test`). `test/pure-logic.test.ts` (8 tests) covers date-range/sync-key/rate-limit/bounded-fetch pure logic. `test/regression/analytics-clickhouse.regression.ts` (manual, requires reachable ClickHouse) exercises the actual production `queryWorkspaceAnalytics`/`deleteWorkspaceAnalytics` against the real local ClickHouse instance — 10/10 checks passed proving no double-counting, correct date/building/geofence filtering, workspace isolation, and zero-row-after-deletion with unrelated workspace intact. Auth ordering and org-mismatch are covered by direct code evidence (credential/timing-gated, not scriptable here).
- Phase 8 complete: full validation passed (`git diff --check`, `npm run lint`, `npm run typecheck`, `npm run build`, `npm test`, manual ClickHouse regression). Production-preview runtime smoke against the real built `.output/server/index.mjs` bundle (isolated port, existing staging container `deploy-situm-explore-1` left untouched) confirmed: security headers live on root, unauthenticated workspace API still 401s, login rate limit trips 429 after 10/min, registration rate limit trips 429 after 5/min. Synthetic test accounts created during the smoke were deleted from `situm_explore.users` afterward. Plan 027 status set to complete; no PR/merge performed.

## Plan 026 (integrated)

Plan 026 production containerization is complete and integrated into `main` via PR #20. All phases 0–11 passed. GHCR staging points to multi-platform digest `sha256:8702053da46d1f03feffe9fc598a17006de3ebf236cf00f97cd3b28f774fe38b`, with immutable `sha-7a981ed0254e`; the update was pulled/recreated by Make without a build and rollback to `sha-0cf07c08afab` is documented. `make staging-migrate` is an explicit operator action using only `DATABASE_URL` from curated staging env with the repository's Drizzle CLI; web startup never migrates. Local arm64 runtime smoke is unavailable due the host emulation entrypoint issue. Pull-only staging Compose and curated ignored runtime env are present. The candidate image audit is clean: runtime UID 10001, 83.3 MB, no secret/env/log/filesystem matches. Full local staging and final clean-room Make sequence passed health/restart, auth protection, PostgreSQL, ClickHouse, OTEL, external-state, and secret checks; credential-backed Situm account checks remain user-owned/unavailable. The workflow targets local Buildx publication to GHCR for `linux/amd64` and `linux/arm64`, pull-only staging Compose, and Makefile-driven operations; no CI/PR/merge was authorized.

## Integrated baseline

Plans 017–020 are complete and integrated into `main` by PR #12.

The Plans 021–025 backend-refactor roadmap and reconciled documentation are integrated into `main` by PR #13.

## Completed roadmap

```text
Plan 021 — Identity & Auth Foundation                       [complete]
Plan 022 — Private Workspaces & Situm Configuration         [complete]
Plan 023 — Observability, Correlation & Safe Error Boundary [complete]
Plan 024 — Workspace-scoped Situm Backend Migration         [complete]
Plan 025 — Workspace UX & Full Regression                   [complete; Google OAuth deferred]
```

Plans 021–025 are complete and integrated; their former planning/stacked branches are historical.

The former roadmap planning branch is historical after PR #13 and is not an implementation base.

## Current authority

Read `.agents/memory/decisions.md`, `ARCHITECTURE.md`, `plans/README.md`, `plans/028-032-native-mobile-roadmap.md` for the approved next roadmap, the capability matrix when relevant, and the active plan. Read `.agents/memory/roadmap-021-025.md` / `plans/021-025-prerequisites.md` only when completed backend-roadmap history is materially relevant.

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

The former stacked execution of Plans 021–025 is complete; its branch-by-branch notes below are historical evidence.

- Completed in this branch: Plan 021 Phases 1–6; identity, registration/login, sessions, conditional Google preparation, UI, and acceptance validation.
- Completed in Plan 022 branch: Phases 1–5 workspace ownership, CRUD authorization, encrypted Situm config persistence, safe validation, and acceptance.
- Completed branch: `plan/023-observability-error-boundary`
- Completed in Plan 023 branch: Phases 1–2 application OTLP lifecycle, request correlation, and nested DB/Situm spans.
- Completed in Plan 023 branch: Phase 3 safe structured errors and client reference IDs.
- Plan 023 Phase 4 application trace/error-path acceptance completed; the phase note below is historical evidence.
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
