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

## Full-stack Nuxt architecture

- Situm Explore remains one full-stack Nuxt 4 application with Nitro server routes.
- Use Nuxt UI, `nuxt-auth-utils`, PostgreSQL/Drizzle in the application-owned `situm_explore` schema, and the existing ClickHouse analytics integration.
- Keep `app/`, `server/`, and genuinely shared `shared/` boundaries Nuxt-native.
- KISS is the default tie-breaker. Do not add generic repositories/services, DI, global stores, event buses, caches, workers, or a second backend without concrete need.

Status: active.

## Web vs native Situm boundary

- The web product is an operations/admin/exploration console.
- Web may own verified Viewer interaction, cartography, static directions, realtime monitoring, reports, and admin/read surfaces.
- Device indoor positioning, sensor/permission handling, handset blue-dot positioning, movement-aware rerouting, and native turn-by-turn behavior remain outside this Nuxt roadmap.
- Situm-domain UI without a truthful owner is removed or left unresolved rather than faked.

Status: active.

## Plans 021–025 identity/workspace model

- Real application users are persisted in PostgreSQL.
- Email/password registration/login is acceptance-critical.
- Google OAuth is prepared through schema/provider/config plumbing; real OAuth runtime acceptance is deferred to the user.
- One application user may own many private workspaces.
- A workspace has exactly one application owner in this roadmap; no invite/member/team hierarchy is introduced.
- Different application users may independently configure workspaces that refer to the same external Situm account/organization.
- Situm organization identity is external metadata, not application tenancy.

Status: active roadmap decision.

## Plans 021–025 Situm credential transition

The previous two-global-env-key model is **pre-refactor runtime only** and is no longer the final target.

Approved target:

- Situm configuration is owned by an authenticated workspace and persisted server-side;
- stored long-lived workspace credentials use authenticated encryption at rest;
- browser code must not receive the stored long-lived workspace API key;
- product access modes are `VIEW_ONLY` and `VIEW_WRITE`;
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

## Current roadmap transition

Plans 017–020 are complete/integrated historical execution. Plans 021–025 are the active backend-refactor roadmap.

While this roadmap is active, also read:

- `.agents/memory/roadmap-021-025.md`;
- `plans/021-025-prerequisites.md`;
- `design/ROADMAP-021-025-OVERRIDES.md`;
- the active plan.

Status: active.
