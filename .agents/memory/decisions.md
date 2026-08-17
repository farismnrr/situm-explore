# Decisions

This file contains **currently active durable decisions**. Completed execution history belongs in plans/session evidence, not as competing active instructions.

## Repository-native agent context

- Root `AGENTS.md` stays concise and routes persistent context into `.agents/`.
- `.agents/state.md` owns current focus, blockers, branch, and next action.
- Session logs and completed plans are historical evidence and may become stale.
- Never persist credentials, API keys, passwords, tokens, session cookies, encryption-key values, or unnecessary sensitive payloads.

Status: active.

## Viewer authentication smoke decision (2026-08-14)

- The installed `@situm/sdk-js` v0.25.0 exchanges an API key through `/api/v1/auth/access_tokens`; `Viewer.setAuth(jwt)` sends the JWT to the embedded Viewer via `postMessage`.
- Temporary server-side smoke testing confirmed that a read-only key produces a JWT whose sanitized `api_permission` claim is `read-only`, while a read-write key produces a JWT whose claim is `read-write`. Both tokens had an approximately 24-hour lifetime and passed harmless organization/building reads, including bearer-JWT reads.
- The read-write-derived JWT is therefore broad authority, not a least-privilege Viewer token. It must never be sent to browser code as the final Viewer model.
- Keep read-write workspace credentials server-only. A separate encrypted read-only Viewer credential is the approved browser model: the owner-scoped server route exchanges it for a temporary JWT, verifies the JWT permission is `read-only`, and returns only that JWT to the Viewer. Production-preview cartography acceptance has now proven this path.
- No temporary credential or generated JWT may be persisted in repository files, logs, traces, session evidence, or browser storage. By the user's superseding 2026-08-14 instruction, the two temporary smoke-test keys may remain active for bounded local Plan 025 acceptance and must be revoked/deleted only after final acceptance passes.

Status: active security boundary; Plan 025 Viewer blocker resolved by the proven dual-credential model.

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

Status: active; implementation of the native companion has not started.

## Native companion technology and credential direction (Plans 028–032)

- Target stack: React Native + Expo development builds + `@situm/react-native`, subject to Plan 028 freezing the exact supported dependency/platform matrix from current evidence.
- Expo Go is not the runtime target for Situm native code; native development builds are required by the current official integration model.
- Mobile reuses the same application users/workspaces and Nitro authorization boundary; no second backend or mobile-only identity database.
- The workspace Read & Write Situm credential remains server-only and must never be embedded, returned, or persisted in the mobile app.
- Plan 028 must choose the least-privilege mobile Situm auth contract from evidence: prefer a proven short-lived token if the current React Native wrapper exposes it; otherwise use a dedicated Positioning-permission workspace credential, encrypted server-side and handled with approved OS secure storage when persistence is required.
- Read-only Realtime authority should remain server-mediated unless the native product requirement and current SDK contract prove a narrower safe direct path.
- Deep links may carry only non-secret navigation context. Application sessions, Situm credentials and tokens must never be placed in URLs/QR codes.

Status: approved roadmap direction; exact auth/session/distribution contracts remain Plan 028 gates.

## Plans 021–025 identity/workspace model

- Real application users are persisted in PostgreSQL.
- Email/password registration/login is acceptance-critical.
- Google OAuth is prepared through schema/provider/config plumbing; real OAuth runtime acceptance is deferred to the user.
- One application user may own many private workspaces.
- A workspace has exactly one application owner in this roadmap; no invite/member/team hierarchy is introduced.
- Different application users may independently configure workspaces that refer to the same external Situm account/organization.
- Situm organization identity is external metadata, not application tenancy.

Status: active roadmap decision.

## Plan 026 production containerization

- The Makefile is canonical for routine Docker, Buildx, release, and staging operations; raw Docker/Buildx/Compose commands are diagnosis-only.
- Local laptop builds/pushes publish GHCR multi-platform images for `linux/amd64` and `linux/arm64`; a 64-bit Orange Pi consumes `linux/arm64`; no CI is used.
- Builds use the approved filtered local context helper; routine root-dot context is prohibited. Compose is pull-only and contains neither `build:` nor `context:`.
- Runtime secrets are external only and `.env` is never baked into images. PostgreSQL, ClickHouse, and observability remain external/reused.
- Staging updates run `pull -> recreate -> health -> smoke`; immutable SHA tags/digests provide rollback. `staging-migrate` is explicit and never runs at startup.

Status: active Plan 026 decision.

## Plans 021–025 Situm credential transition

The previous two-global-env-key model is **pre-refactor runtime only** and is no longer the final target.

Approved target:

- Situm configuration is owned by an authenticated workspace and persisted server-side;
- stored long-lived workspace credentials use authenticated encryption at rest;
- browser code must not receive the stored long-lived workspace API key;
- workspace configuration requires a primary credential verified as Situm Read & Write and a separate Viewer credential verified as Situm Read-only; account/organization ID is derived server-side from the primary auth session;
- verified upstream permission remains authoritative;
- unsupported/intermediate permission states are handled conservatively;
- workspace/account/building context must not remain process-global after migration.

Viewer authentication must be verified against current official Situm contracts and the installed SDK. Prefer a proven short-lived/least-privilege browser auth mechanism. If a write-capable workspace cannot produce a safely scoped Viewer credential, stop that exact path and ask the user instead of exposing broad authority silently.

Status: active roadmap decision; migration not yet implemented.

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
- Plans 021–025 must make analytics workspace-isolated before multi-workspace product reads are considered complete.
- Legacy unscoped analytics rows must not be assigned arbitrarily to a user/workspace. Preserve them non-destructively unless attribution is proven or the user supplies a retention/migration policy.

Status: active.

## Observability and safe errors

- Plan 023 must inspect `docker ps` and existing runtime/repository configuration before selecting telemetry integration.
- Reuse the user's existing observability stack and supported protocols; do not provision duplicate observability infrastructure by assumption.
- Propagate request correlation/trace context from browser through Nitro and meaningful downstream boundaries.
- Do not put secrets or sensitive payloads into headers, baggage, logs, spans, or client errors.
- Client responses expose sanitized product errors; detailed critical/internal diagnostics remain server-side in observability.

Status: active roadmap decision.

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

Plans 017–020 and Plans 021–025 are complete/integrated historical execution. Plan 026 is the active production-containerization plan.

While this roadmap is active, also read:

- `.agents/memory/roadmap-021-025.md`;
- `plans/021-025-prerequisites.md`;
- `design/ROADMAP-021-025-OVERRIDES.md`;
- the active plan.

Status: active.

## Auth abuse protection (Plan 027)

- Rate limiting for `/api/auth/login` and `/api/auth/register` uses a KISS in-memory, per-process, fixed-window limiter (`server/utils/rate-limit.ts`), not Redis/a shared store. This is deliberate: the repository runs as a single Nitro process (see Plan 026 production containerization target); a distributed store would be infrastructure the current architecture does not justify. Revisit only if the runtime becomes genuinely multi-instance.
- Registration checks for an existing account before running the expensive scrypt password hash, to avoid unauthenticated CPU/memory amplification. Login already avoided hashing for unknown emails and was left as-is; only rate limiting was added there. Generic invalid-credentials responses are unchanged.
- **Trusted-proxy stance (Plan 027 review remediation):** the limiter derives client identity from the server-observed socket address only (`getRequestIP(event, { xForwardedFor: false })`), never from client-supplied `X-Forwarded-For`. Evidence: `deploy/staging.compose.yml` publishes the Nitro container directly on the host port (`"${STAGING_PORT:-3005}:3000"`) with no reverse proxy in the deployment, so nothing sanitizes that header before it reaches the app — trusting it would let any caller rotate the header to bypass throttling entirely (live-verified: 12 rotated-header login attempts still hit 429 after 10). Revisit only if a trusted reverse proxy is introduced in front of Nitro with a proven, documented forwarding contract; do not flip this back to trusting `X-Forwarded-For` without that evidence.
- The limiter map self-prunes expired buckets on every `rateLimit()` call (no background timers) so memory stays bounded as more unique client identities are seen.

Status: active.

## Browser security headers (Plan 027)

- Safe, universal response headers (X-Content-Type-Options, Referrer-Policy, X-Frame-Options: DENY, conservative Permissions-Policy) are applied via `server/middleware/security-headers.ts` and are live-verified.
- A Content-Security-Policy was deliberately NOT added. The Situm Map Viewer's exact script/frame/connect origins are not proven by any live network trace in this repo, and this repo has already hit one real Viewer-behavior surprise (the wait_for_auth/postMessage building-mismatch investigation). A guessed CSP risks silently breaking the map for every user. Revisit only with a live browser network trace against the real hosted Viewer to derive a proven allowlist.

Status: active; CSP is an open, intentionally documented limitation, not solved.
