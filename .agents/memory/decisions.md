# Decisions

This file contains **currently active durable decisions**. Completed execution history belongs in plans/session evidence, not as competing active instructions.

## Repository-native agent context

- Root `AGENTS.md` stays concise and routes persistent context into `.agents/`.
- `.agents/state.md` owns current focus, blockers, branch, and next action.
- Session logs and completed plans are historical evidence and may become stale.
- Never persist credentials, API keys, passwords, tokens, session cookies, encryption-key values, or unnecessary sensitive payloads.

Status: active.

## Viewer authentication decision

- The final integrated Plan-025 path uses a dual-credential model: the primary Read & Write credential remains server-only.
- A separate Read-only Viewer API key is owner-scoped, verified READ_ONLY + org match server-side, and then intentionally visible to the browser for Situm's documented direct-api-key Viewer flow.
- The prior JWT/postMessage flow is historical evidence, not the current model.
- No temporary credential or generated JWT may be persisted in repository files, logs, traces, session evidence, or browser storage.

Status: active security boundary; Viewer authentication is integrated.

## Temporary Situm smoke-key acceptance policy (2026-08-14)

- The user explicitly superseded the earlier immediate-revocation reminder: temporary read-only and read-write smoke keys remain intentionally active until all Plan 025 acceptance is passing.
- They may be reused only for bounded local acceptance, must remain hidden, and must never be persisted in repository files, session evidence, logs, traces, browser storage, or Git history.
- Do not remind the user to revoke them while remediation/retest remains incomplete. After final Plan 025 PASS, remind the user to revoke/delete both keys.

Status: active user policy.

## Full-stack Nuxt backend/web architecture

- The existing Nuxt 4 application with Nitro server routes remains the single web application and application backend for Situm Explore.
- Plans 028–032 may add a React Native companion **client**, but not a second backend/service or separate application authority.
- Use Nuxt UI, `nuxt-auth-utils`, PostgreSQL/Drizzle in the application-owned `situm_explore` schema, and the existing ClickHouse analytics integration for the web/backend runtime.
- Keep `app/`, `server/`, and genuinely shared `shared/` boundaries Nuxt-native; share contracts with mobile only when they are genuinely runtime-neutral.
- KISS is the default tie-breaker. Do not add generic repositories/services, DI, global stores, event buses, caches, workers, or a second backend without concrete need.

Status: active.

## Web vs native Situm boundary

- The Nuxt web product remains the operations/admin/exploration/analytics client; Nitro remains the single application backend.
- Plans 028–032 add a separate React Native companion client rather than turning the Nuxt application into a hybrid/mobile wrapper.
- Device indoor positioning, sensor/permission handling, handset blue-dot positioning, mobile navigation/rerouting, and the product's mobile Realtime experience belong to the native companion roadmap.
- Web Map remains the product path for desktop/tablet layouts that pass explicit Viewer usability acceptance; phone web Map will hand off to native only after the native Map is accepted.
- Web Realtime will intentionally hand off to native on desktop/tablet/phone after native Realtime is accepted. This is a product policy, not a claim that Situm web APIs are technically incapable of realtime reads.
- Situm-domain UI without a truthful owner is removed or left unresolved rather than faked.

Status: active; Plan 030 implementation is in progress/blocked at physical acceptance.

## Native companion technology and credential direction (Plans 028–032)

- Target stack: React Native + Expo development builds + `@situm/react-native`, subject to Plan 028 freezing the exact supported dependency/platform matrix from current evidence.
- Expo Go is not the runtime target for Situm native code; native development builds are required by the current official integration model.
- Mobile reuses the same application users/workspaces and Nitro authorization boundary; no second backend or mobile-only identity database.
- The workspace Read & Write Situm credential remains server-only and must never be embedded, returned, or persisted in the mobile app.
- Plan 028 must choose the least-privilege mobile Situm auth contract from evidence: prefer a proven short-lived token if the current React Native wrapper exposes it; otherwise use a dedicated Positioning-permission workspace credential, encrypted server-side and handled with approved OS secure storage when persistence is required.
- Read-only Realtime authority should remain server-mediated unless the native product requirement and current SDK contract prove a narrower safe direct path.
- Deep links may carry only non-secret navigation context. Application sessions, Situm credentials and tokens must never be placed in URLs/QR codes.

Status: approved roadmap direction; Plans 028–029 are integrated and their exact auth/session/distribution contracts are authoritative.

### Plan 028 Phase 1 native build matrix (2026-08-17)

- Freeze Expo 57.0.13, React Native 0.86.2, React 19.2.3, `@situm/react-native` 3.19.2, and `react-native-webview` 13.16.1 for the evidence track.
- Freeze Android min/compile/target SDK 24/36/36, JDK 21.0.10, Kotlin 2.1.20, and Gradle wrapper 9.3.1. Android compilation under Expo SDK 57 / React Native 0.86 New Architecture is proven by a disposable `assembleDebug`; this is not a claim of full wrapper New Architecture compatibility.
- The Situm package's Android Gradle module supplies its own Situm Maven repository sufficiently for the clean proof; do not add an app-owned config plugin or patch unless later evidence requires it.
- Use a standalone future `mobile/` package rather than npm workspaces. Plan 029 owns production project creation.
- Effective iOS app baseline is 16.4 with Xcode 26.4+; wrapper iOS dependency is SitumSDK 3.41.0 through CocoaPods. Linux source/package evidence is available, but iOS compile/runtime remain macOS/device-gated.

Status: active Plan 028 Phase 1 evidence; later capability/auth phases may supersede exact selections only with new proof.

### Plan 028 Phase 2 wrapper capability boundary (2026-08-17)

- The installed 3.19.2 wrapper source proves `SitumProvider`, WebView-backed `MapView`, building/floor/POI reads and selection, positioning/status/error callbacks, navigation, permission user-helper, generic `requestRealTimeUpdates`, and Share Live Location method surfaces.
- Generic realtime returns `RealTimeData.locations` with `Location` fields such as position/building/floor and accuracy; it does not provide a public MapView remote-marker/focus API. Native Realtime must use a truthful list/detail fallback unless a separate proven overlay path is found.
- Building selection has no public imperative selector; downstream code must own MapView lifecycle/remount and stale-state clearing. Background location is not requested by default; Android foreground service and iOS authorization differences require later device proof.
- The 3.19.2 npm tarball omits the `lib/` files referenced by its package `types`/`module` fields. Android/Metro source integration works, but Plan 029 must recheck TypeScript package resolution before selecting a non-speculative workaround.

Status: active Plan 028 Phase 2 evidence; runtime/device proof and auth decisions remain open.

### Plan 028 Phase 3 Situm mobile auth boundary (2026-08-17)

- Native v1 uses a dedicated workspace Situm Positioning API key, encrypted at rest server-side and issued only after the authenticated app session proves workspace ownership. It is separate from the server-only Read & Write primary and browser Read-only Viewer key.
- Read-only Realtime and broad GET operations remain server-mediated; the Positioning key is not widened for them.
- JWT support in the wrapper is source-proven but unselected because no complete issuer/claims/lifetime/refresh/revocation contract is proven for Situm Explore. Revisit only with current evidence.

Status: active Plan 028 Phase 3 evidence; transport/storage implementation remains in later phases.

### Plan 028 Phase 4 application session boundary (2026-08-17)

- Native uses the same `nuxt-auth-utils` sealed PostgreSQL-user session through an `x-nuxt-session` header. Plan 029 must add a mobile login response that issues this opaque sealed value; it is not a second identity or JWT system.
- Freeze a 7-day mobile session maximum age, OS secure storage later selected by Phase 5, explicit server logout, and no credential/token values in URLs or logs. Cookie-only React Native persistence is not proven.
- Existing `requireUserSession` ownership checks remain authoritative for every native request; client-provided user/workspace identity is never trusted.

Status: active Plan 028 Phase 4 evidence; implementation and revocation/version checks remain gated by later phases.

### Plan 028 Phase 5 secure storage and distribution (2026-08-17)

- Use `expo-secure-store` `~15.0.x` (registry version inspected: 15.0.8) for the sealed application session and any future Situm Positioning material. Treat both as bearer-equivalent authentication secrets; never place them in URLs, deep links, QR codes, logs, analytics, crash metadata, AsyncStorage or plaintext persistence.
- Freeze Android/iOS identity as `com.situm.explore`; custom schemes are `situm-explore-dev://`, `situm-explore-staging://`, and `situm-explore://`. Deep-link context is limited to untrusted `workspace`, `building`, and `feature` hints for `/map` or `/realtime`, followed by authenticated re-authorization.
- Own local Expo development builds and Gradle Android debug/direct-internal artifacts. iOS compilation/device/archive and all signing/store delivery are macOS/Apple-account gates. Do not select EAS without new evidence; keep all signing material external/ignored.

Status: active Plan 028 Phase 5 evidence; HTTPS association and store distribution remain external gates.

### Plan 029 Expo 57 dependency authority (2026-08-17)

- Superseding decision: the Plan 029 Expo 57 mobile app uses `expo-secure-store` `~57.0.1` as the only approved persistent storage boundary for bearer-equivalent session/Situm material, `expo-status-bar` `~57.0.1`, and TypeScript `~6.0.3`. This is based on the actual Expo 57 package compatibility evidence and validation performed in the real `mobile/` package.
- The earlier Plan 028 `expo-secure-store` `~15.0.x` decision remains historical evidence for that spike and must not be treated as the current Plan 029 dependency authority.

Status: durable Plan 029 dependency decision; no production credential persistence outside SecureStore.

### Plan 028 Phase 6 readiness gate (2026-08-17)

- Plan 028 is complete as an evidence spike. Plan 029 implementation is active: the published wrapper TypeScript `lib/` omission was rechecked in the real package and handled through its documented source entry with a narrow mobile TypeScript path; the mobile session response now uses the same sealed h3 value over `x-nuxt-session`, seven-day expiry, and a server-side user session-version revocation check. Device/iOS/release gates remain explicit.
- The approved native reference remains authoritative for presentation; capability evidence overrides any depicted interaction. Remote-position map focus is unproven and gets a list/detail fallback. Background location is not default, Realtime identity/status semantics remain backend-truth-bound, and no fake capability is permitted.

Status: complete Plan 028; Plan 029 readiness GO with explicit external/runtime gates.

## Plans 021–025 identity/workspace model

- Real application users are persisted in PostgreSQL.
- Email/password registration/login is acceptance-critical.
- Google OAuth is prepared through schema/provider/config plumbing; real OAuth runtime acceptance is deferred to the user.
- One application user may own many private workspaces.
- A workspace has exactly one application owner in this roadmap; no invite/member/team hierarchy is introduced.
- Different application users may independently configure workspaces that refer to the same external Situm account/organization.
- Situm organization identity is external metadata, not application tenancy.

Status: active runtime architecture.

## Plan 026 production containerization

- The Makefile is canonical for routine Docker, Buildx, release, and staging operations; raw Docker/Buildx/Compose commands are diagnosis-only.
- Local laptop builds/pushes publish GHCR multi-platform images for `linux/amd64` and `linux/arm64`; a 64-bit Orange Pi consumes `linux/arm64`; no CI is used.
- Builds use the approved filtered local context helper; routine root-dot context is prohibited. Compose is pull-only and contains neither `build:` nor `context:`.
- Runtime secrets are external only and `.env` is never baked into images. PostgreSQL, ClickHouse, and observability remain external/reused.
- Staging updates run `pull -> recreate -> health -> smoke`; immutable SHA tags/digests provide rollback. `staging-migrate` is explicit and never runs at startup.

Status: active durable runtime decision.

## Situm credential integration

The previous two-global-env-key model is **historical** and replaced by the current dual-credential architecture.

- Situm configuration is owned by an authenticated workspace and persisted server-side;
- stored long-lived workspace credentials use authenticated encryption at rest;
- browser code must not receive the stored long-lived workspace Read & Write API key;
- workspace configuration requires a primary credential verified as Situm Read & Write and a separate Viewer credential verified as Situm Read-only; account/organization ID is derived server-side from the primary auth session;
- verified upstream permission remains authoritative;
- unsupported/intermediate permission states are handled conservatively;
- workspace/account/building context is workspace-scoped, never process-global.

Viewer authentication changes remain evidence-gated against current official Situm contracts and the installed SDK. The integrated direct Read-only Viewer API-key flow remains authoritative unless newer evidence proves a safer compatible replacement; never widen browser authority or expose the Read & Write credential silently.

Status: active durable runtime decision; integration is complete.

## Evidence-backed Situm integration

- **No evidence, no implementation.**
- Verify exact endpoint/SDK method, installed-version compatibility, browser/server ownership, web/native ownership, auth/permission, request inputs, consumed fields/events, and relevant failure/empty/runtime semantics.
- Missing material evidence stays `UNRESOLVED`/absent.
- Direct authenticated Nitro REST remains valid when the installed SDK lacks a suitable wrapper and the official endpoint is verified.
- The single `SitumViewer.vue` instance remains the Viewer lifecycle owner; expose only small typed commands, never raw Viewer access or a generic invoke escape hatch.

Status: active.

## ClickHouse analytics boundary

- Reuse the user's existing local ClickHouse instance; do not provision another ClickHouse server or Docker/Compose stack.
- PostgreSQL/Drizzle remains relational application storage; ClickHouse remains analytics storage.
- Browser code never connects directly to ClickHouse or receives ClickHouse credentials.
- Analytics reads are workspace-isolated.
- Legacy unscoped analytics rows must not be assigned arbitrarily to a user/workspace. Preserve them non-destructively unless attribution is proven or the user supplies a retention/migration policy.

Status: active.

## Observability and safe errors

- Reuse the user's existing observability stack and supported protocols; do not provision duplicate observability infrastructure by assumption.
- Propagate request correlation/trace context from browser through Nitro and meaningful downstream boundaries.
- Do not put secrets or sensitive payloads into headers, baggage, logs, spans, or client errors.
- Client responses expose sanitized product errors; detailed critical/internal diagnostics remain server-side in observability.

Status: active durable runtime decision.

## Static directions boundary

- Static routes use real known Situm POIs/endpoints and numeric POI IDs already proven by the completed directions work.
- Viewer owns route calculation/rendering.
- No `startNavigation`, browser `My location`, indoor positioning, live rerouting, or synthetic route distance/duration/steps/geometry/ETA.
- Unresolved route lifecycle/result contracts remain absent until exact evidence exists.

Status: active product boundary.

## Git workflow default

- One plan = one dedicated `plan/<number>-<slug>` branch in the normal repository working directory.
- Never implement a plan directly on `main`.
- Each completed phase updates plan/relevant `.agents`, validates, commits, and pushes.
- PR creation/integration is user-gated.
- Normal dependent plans start only after the preceding dependency is integrated into updated `main`.
- Stacked execution requires explicit user authorization recorded in current state.
- Do not force-push or destructively rewrite shared history as normal workflow.

Status: active.

## Completed roadmap transition

Plans 017–020, Plans 021–025, and Plans 026–030 are complete/integrated historical execution. Plan 031 is the active Native Realtime Operations branch; Plan 032 remains the dependent terminal handoff/distribution/full-regression plan, with consolidated physical-device E2E reserved for Plan 032.

The following are historical context only:

- `.agents/memory/roadmap-021-025.md`;
- `plans/021-025-prerequisites.md`;
- `design/ROADMAP-021-025-OVERRIDES.md`.

The Plans 028–032 roadmap is the current planning authority. Plans 028–030 are integrated; Plan 031 is active and Plan 032 remains gated on Plan 031 integration.

Status: active.

## Auth abuse protection (Plan 027)

- Rate limiting for `/api/auth/login` and `/api/auth/register` uses a KISS in-memory, per-process, fixed-window limiter (`server/utils/rate-limit.ts`), not Redis/a shared store. This is deliberate: the repository runs as a single Nitro process (see Plan 026 production containerization target); a distributed store would be infrastructure the current architecture does not justify. Revisit only if the runtime becomes genuinely multi-instance.
- Registration checks for an existing account before running the expensive scrypt password hash, to avoid unauthenticated CPU/memory amplification. Login already avoided hashing for unknown emails and was left as-is; only rate limiting was added there. Generic invalid-credentials responses are unchanged.
- **Trusted-proxy stance (Plan 027 review remediation):** the limiter derives client identity from the server-observed socket address only (`getRequestIP(event, { xForwardedFor: false })`), never from client-supplied `X-Forwarded-For`. Evidence: `deploy/staging.compose.yml` publishes the Nitro container directly on the host port (`"${STAGING_PORT:-3005}:3000"`) with no reverse proxy in the deployment, so nothing sanitizes that header before it reaches the app — trusting it would let any caller rotate the header to bypass throttling entirely (live-verified: 12 rotated-header login attempts still hit 429 after 10). Revisit only if a trusted reverse proxy is introduced in front of Nitro with a proven, documented forwarding contract; do not flip this back to trusting `X-Forwarded-For` without that evidence.
- The limiter map self-prunes expired buckets on every `rateLimit()` call (no background timers) so memory stays bounded as more unique client identities are seen.

Status: active durable runtime decision.

## Browser security headers (Plan 027)

- Safe, universal response headers (X-Content-Type-Options, Referrer-Policy, X-Frame-Options: DENY, conservative Permissions-Policy) are applied via `server/middleware/security-headers.ts` and are live-verified.
- A Content-Security-Policy was deliberately NOT added. The Situm Map Viewer's exact script/frame/connect origins are not proven by any live network trace in this repo, and this repo has already hit one real Viewer-behavior surprise (the wait_for_auth/postMessage building-mismatch investigation). A guessed CSP risks silently breaking the map for every user. Revisit only with a live browser network trace against the real hosted Viewer to derive a proven allowlist.

Status: active durable security decision; CSP is an open, intentionally documented limitation, not solved.

## Plan 029 native remediation

- Direct mobile h3 sealing must use the explicit `nuxt-session` session name and the native transport remains `x-nuxt-session`; session-version checks fail closed for missing or invalid values.
- Workspace restoration persists only the selected workspace ID through `expo-secure-store`; workspace credentials remain transient and are never persisted by the context.
- The native shell uses horizontal phone navigation, compact tablet/POS and wide rails, SVG brand/Lucide-style icons, and Foreground/Background lifecycle labels that do not imply network connectivity.

Status: active durable runtime/security decision.

## Plan 030 native Map/positioning/navigation (2026-08-17)

- Native MapView is owned by the authenticated workspace context and must remount when workspace/building changes; it receives only the dedicated owner-authorized Positioning credential. The Read & Write primary and browser Viewer credentials remain server-side/mobile-inaccessible.
- The installed `@situm/react-native` 3.19.2 surface is consumed through a narrow local TypeScript declaration boundary because the published package omits its referenced `lib/` files; Metro/Android use the installed package source/native module. This workaround mirrors only the proven MapView, positioning, user-helper, floor/POI, and navigation surface and is not evidence of iOS runtime support.
- Positioning uses Situm User Helper plus Remote Configuration and starts only from the explicit foreground Map action. No background location or Realtime/Share Live Location is enabled in Plan 030.
- Real-device positioning, blue-dot, floor transition, POI, and navigation claims require physical supported-device evidence. Plan 030 implementation is approved without claiming those outcomes; the unpassed device checks are explicitly transferred to Plan 032's consolidated hard final E2E gate.

Status: active durable native product/security boundary.

## Consolidated native physical-E2E gate (2026-08-17)

- Plans 030 and 031 may be reviewed/integrated after their implementation/build/test/runtime contracts are approved, even when physical-device-only evidence is unavailable.
- Any device-dependent item remains explicitly unpassed and must be enumerated as Plan 032 carry-over; deferral never converts missing evidence into acceptance.
- Plan 032 is the terminal non-deferrable gate. It must run the accumulated supported-Android physical E2E for Map/positioning/navigation and the frozen Realtime scope before roadmap closeout/merge.
- Android Studio emulator evidence may supplement launch/UI/WebView/non-sensor regression, but it cannot prove real indoor positioning, BLE/Wi-Fi/sensor behavior, blue-dot/floor transitions, or equivalent physical-device semantics.

Status: active durable roadmap acceptance decision.

## Plan 031 Realtime execution baseline (2026-08-17)

- Realtime Positions is operational device-position monitoring; Situm Share Live Location is a separate session-based feature and must not be conflated with it.
- The current owner-scoped Nitro Realtime route is the preferred remote-monitoring boundary and exposes only position/device identity, source time, building/floor, accuracy, coordinates, and optional device ID.
- No friendly person identity, online/idle/offline presence, trajectory, generic remote marker, or remote focus semantics exist unless Phase 0 proves them from exact current evidence.
- Remote monitoring remains server-mediated unless a narrower/equivalent least-privilege native path is proven. The dedicated mobile Positioning credential must not be widened for convenience.

Status: active Plan 031 execution baseline; Phase 0 may narrow or supersede only with exact evidence.
