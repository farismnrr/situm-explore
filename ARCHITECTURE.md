# ARCHITECTURE.md

This file is the current architecture contract for Situm Explore.

It describes the current runtime contract and preserves the **historical pre-refactor baseline** plus the completed Plans 021–025 transition. Historical migrations belong in completed plans/session evidence.

## Core principles

Apply these in order:

1. correctness and security;
2. Nuxt framework convention;
3. KISS;
4. clear responsibility/dependency direction;
5. DRY after meaningful repetition is proven;
6. abstraction only for concrete requirements.

A little explicit duplication is better than speculative infrastructure.

## Runtime model

The integrated web/backend runtime remains one full-stack Nuxt 4 application. Plans 028–032 add a React Native companion client while keeping Nitro as the single application backend.

```text
browser / Vue / Nuxt UI
        │
        │ authenticated HTTP + correlation/trace context
        ▼
      Nitro API
        │
        ├── PostgreSQL / Drizzle
        │     app users, provider identities, workspaces,
        │     encrypted workspace configuration
        │
        ├── ClickHouse
        │     workspace-isolated analytics
        │
        ├── Situm REST
        │     resolved per authenticated workspace
        │
        └── existing observability stack
              logs / traces / metrics as supported

browser Situm Viewer
        ▲
        └── only evidence-backed browser authentication;
            never the stored long-lived workspace API key
```

Do not introduce a second backend application, microservice, client-side database access, or duplicate observability stack.

## Transition status

The historical pre-refactor baseline contained:

- env-defined single-user authentication;
- process-global Situm server/Viewer configuration;
- a process-global public building identifier;
- analytics created before workspace ownership existed.

These were migration inputs, **not the approved final architecture**.

Plans 021–025 replaced them incrementally. Preserve this section as migration history; the current source and runtime contract are defined above and in the completed plan outcomes.

## Directory ownership

```text
app/                 browser/presentation/runtime UI
server/api/          HTTP transport and request boundary
server/db/           PostgreSQL/Drizzle application persistence
server/integrations/ concrete Situm/ClickHouse/telemetry integrations
server/services/     only real orchestration/use cases
server/utils/        narrow server-only helpers
shared/              genuinely cross-runtime contracts/helpers only
```

Do not create folders or abstraction layers solely to satisfy a diagram.

## Presentation layer — `app/`

Owns:

- pages/layouts/navigation;
- Nuxt UI components;
- client middleware;
- reactive composables;
- browser-safe Viewer lifecycle/commands;
- workspace selection UX;
- safe product error/toast presentation.

Presentation must not import server source, database clients, private runtime configuration, stored workspace credentials, or observability backend credentials.

## Nitro transport — `server/api/`

Handlers own the HTTP boundary:

1. authenticate the application user when required;
2. resolve/authorize workspace context when required;
3. validate request input;
4. call the smallest DB/integration/service function;
5. normalize known failures into safe product semantics;
6. attach/preserve correlation context;
7. return a minimal response.

Client-provided workspace identity is context, never authorization proof. Ownership is verified server-side.

## Identity and sessions — Plan 021 target

- Application users are PostgreSQL-backed and have stable app-owned IDs.
- Email/password registration/login is real product behavior.
- Passwords are stored only as secure hashes using the project auth utility.
- Nuxt sealed sessions remain the app session mechanism unless concrete evidence requires otherwise.
- Session identity references the stable app user, not an env-defined email and not an OAuth provider ID.
- Google OAuth provider wiring is prepared; real Google runtime acceptance remains user-owned/manual for now.
- Provider account identifiers are unique per provider.
- Account linking must not guess. Auto-link only when the verified provider identity gives sufficient safe evidence according to Plan 021.

Do not add auth bypass/dev-login endpoints.

## Workspace ownership — Plan 022 target

- One app user may own many workspaces.
- A workspace has exactly one app owner in Plans 021–025.
- No invite/member/team/org tenancy is introduced.
- Different app users may independently point their workspaces at the same external Situm account/organization.
- Situm organization identity is external metadata, not app tenancy.
- Every workspace-backed API verifies ownership server-side.

## Workspace Situm configuration — Plan 022 target

Situm configuration moves from global environment variables to authenticated workspace-managed server persistence.

Rules:

- long-lived workspace credentials are encrypted at rest using authenticated encryption;
- encryption uses one server-only master key configured outside the database;
- stored envelopes are versioned so future rotation/migration is possible;
- raw stored credentials are never returned by read APIs;
- raw credentials are never logged, traced, persisted in docs/tests, or exposed through public runtime config;
- missing/invalid encryption configuration fails closed;
- workspace configuration requires a primary Situm credential verified as Read & Write and a separate Viewer credential verified as Read-only;
- the Situm organization/account ID is derived from the authenticated primary credential and persisted as server-side metadata;
- upstream Situm authorization remains authoritative;
- do not run a mutation merely to discover whether a key can write.

Exact crypto encoding/library details are frozen by Plan 022 after inspecting the runtime. Avoid inventing a home-grown crypto protocol.

## Browser Situm Viewer

`app/components/situm/SitumViewer.vue` remains the single Viewer instance/lifecycle owner.

Keep a small typed command surface only for verified product behavior. Never expose the raw Viewer or a generic method-invocation escape hatch.

The historical browser-visible API-key path is legacy pre-refactor behavior. The target is an evidence-backed short-lived/least-privilege browser authentication path derived server-side without exposing the stored long-lived workspace credential.

Plan 022 must verify the installed `@situm/sdk-js` contract and current official Situm behavior before changing Viewer auth.

If a write-capable workspace cannot produce a browser token whose authority is safely understood/acceptable, leave that exact path unresolved and ask the user rather than silently exposing broad write authority.

## Situm REST integration

Situm server operations resolve their credential/account context **per authenticated workspace request** after Plan 024.

Rules:

- no global account singleton remains authoritative after migration;
- no generic unauthenticated Situm proxy;
- one verified capability should have one primary access path;
- direct official REST from Nitro is allowed where verified and simpler than an SDK wrapper;
- existing capabilities are migrated, not expanded speculatively;
- write capability is derived from verified primary-credential permission metadata; upstream authorization remains the final truth;
- upstream forbidden/internal details are normalized before reaching the client.

Account-specific building context must also become workspace/product state; one global public building ID cannot remain authoritative for multiple workspaces.

## PostgreSQL / Drizzle

PostgreSQL owns application relational state, including the concrete Plans 021–022 requirements:

- users;
- password/provider identity records as needed;
- private workspace ownership;
- encrypted workspace Situm configuration metadata/envelope.

Use the dedicated `situm_explore` schema. Do not touch unrelated schemas/databases.

Do not persist arbitrary Situm resources merely as a cache.

## ClickHouse analytics

ClickHouse remains a concrete server-side analytics store and does not replace PostgreSQL.

Rules:

- reuse the existing local instance;
- do not install/provision a second server or Compose stack;
- browser code never connects directly or receives ClickHouse credentials;
- analytics reads/writes must become workspace-isolated before multi-workspace behavior is complete;
- workspace identity must participate in the storage/query identity needed to prevent cross-workspace reads;
- legacy pre-workspace rows have no proven owner and must not be assigned arbitrarily;
- preserve legacy rows non-destructively unless the user explicitly chooses a retention/attribution policy;
- explicit product sync remains sufficient unless a later requirement authorizes background processing.

## Observability / correlation — Plan 023 target

Before adding telemetry dependencies or endpoints, inspect local `docker ps` plus relevant runtime/repository configuration.

Reuse the user's existing observability stack and supported protocols. Do not provision a duplicate stack by assumption.

Desired request path:

```text
browser request
-> correlation/trace context
-> Nitro request span/log
-> authenticated user/workspace context
-> PostgreSQL / ClickHouse / Situm downstream context
-> normalized response
```

Rules:

- prefer standard W3C Trace Context/OpenTelemetry where supported by the existing stack;
- a small support/reference request ID may coexist;
- never put API keys, tokens, cookies, passwords, raw sensitive request bodies, or encrypted credential material into headers/baggage/logs/spans;
- instrument meaningful boundaries, not every helper;
- critical/internal diagnostics remain server-side.

## Safe error boundary

Expected product error classes include validation, unauthenticated, forbidden, not found, conflict, upstream failure, and internal failure.

Client responses may expose:

- safe product-facing message/code;
- appropriate HTTP status;
- correlation/reference ID when useful.

Client responses must not expose stack traces, SQL/DB details, crypto details, raw upstream bodies, SDK internals, secret material, or critical diagnostics.

Detailed diagnostics belong in server observability with redaction.

## Situm capability evidence gate

For external Situm behavior, **no evidence = no implementation**.

Before adding or changing a capability, verify as applicable:

- exact official endpoint/SDK method;
- installed SDK compatibility;
- browser/server ownership;
- web/native ownership;
- auth and permission behavior;
- request inputs actually used;
- response/event fields actually consumed;
- error/empty/stale/runtime semantics.

Missing material evidence stays unresolved/absent. Historical plans and prototype labels are not contracts.

## Web/native boundary

Current web runtime may retain verified:

- cartography/map exploration;
- static directions between known points;
- analytics/reports;
- organization/users/groups/alarms read views;
- browser-safe Viewer settings/actions;
- workspace-scoped realtime backend reads where needed by server/client contracts.

Plans 028–032 add a **separate native companion client** while keeping Nitro as the single application backend. They do not turn the Nuxt runtime into a native wrapper or introduce a second backend.

Plan 031 implements native Realtime as a foreground-only, server-mediated list/detail read from the owner-scoped workspace route. The mobile client receives only sanitized position/device fields and never receives Situm credentials for remote monitoring. The installed SDK's generic realtime and Share Live Location surfaces remain capability evidence only; no remote MapView markers, focus behavior, or background positioning is claimed.

Approved target ownership:

- desktop/tablet web Map remains the existing Viewer experience where explicit layout acceptance passes;
- phone web Map hands off to the native app only after native Map acceptance;
- web Realtime entry points hand off to native on desktop/tablet/phone only after native Realtime acceptance;
- sensor-generated handset indoor blue dot, positioning permissions/runtime, mobile navigation/rerouting and the native Realtime experience belong to the React Native companion;
- both clients reuse the same application users/workspaces and server-side ownership boundary.

The workspace Read & Write Situm credential remains server-only. Plan 028 froze a dedicated least-privilege workspace Positioning credential for native issuance after owner authorization; the browser Viewer credential is not reused, and Realtime remains server-mediated.

Plan 029 now provides the standalone `mobile/` Expo foundation, the same PostgreSQL identity through a sealed h3 session over `x-nuxt-session`, seven-day expiry plus server-side session-version revocation, SecureStore-only native session persistence, owner-scoped workspace context, and encrypted dedicated Positioning-key issuance. Native Map, positioning, navigation, Realtime UI, and Share Live Location remain deferred to Plans 030–031.

## Data fetching / validation

Use Nuxt-native `useFetch` / `useAsyncData` for render-time reads and `$fetch` for explicit actions.

Use Zod where request/external-input validation provides value.

Do not create a broad API client abstraction until repeated cross-cutting behavior proves it is needed. Plan 023 may justify a small correlation/error wrapper if it is genuinely reused.

## Deferred by default

Do not add without a concrete requirement:

- Pinia/global store;
- DI container;
- event bus;
- generic repository base classes;
- CQRS/command bus/domain-event frameworks;
- worker/queue/background sync infrastructure;
- microservices/second backend;
- new observability containers;
- generic Situm cache;
- workspace invite/member hierarchy;
- password reset/email verification flows.

Native positioning/navigation is no longer deferred generically; it is owned explicitly by Plans 028–032 and must stay within those plan boundaries/evidence gates.

## Active roadmap execution order

Completed/integrated baseline:

```text
Plan 021 -> 022 -> 023 -> 024 -> 025
Plan 026 -> 027
```

Plans 028–030 are complete and integrated. The React Native foundation and native spatial implementation now exist under `mobile/`; Plan 031 Native Realtime Operations is active. The unpassed supported-device Map/positioning/navigation E2E remains explicitly carried forward to Plan 032's non-deferrable terminal gate:

```text
Plan 028 — Native Capability, Auth & Distribution Spike [complete/integrated]
-> Plan 029 — Native App Foundation & Workspace Session [complete/integrated]
-> Plan 030 — Native Map, Positioning & Navigation [complete/integrated; physical E2E carried to Plan 032]
-> Plan 031 — Native Realtime Operations [active]
-> Plan 032 — Web/Native Handoff, Distribution & Full Regression [terminal physical-E2E gate]
```

Normal Git workflow requires each dependency to be integrated into updated `main` before the next dependent plan starts, unless the user explicitly authorizes stacking. Plan 031 was created from updated `main` after Plan 030 integration.

## Review checklist

- [ ] current user/session identity is server-authoritative;
- [ ] workspace ownership is verified server-side;
- [ ] stored long-lived Situm credentials never enter browser/public config/logs/errors;
- [ ] Viewer remains single-owner with a typed verified surface;
- [ ] Situm/analytics context is workspace-isolated after migration;
- [ ] ClickHouse cannot cross workspace boundaries;
- [ ] observability reuses existing infrastructure;
- [ ] correlation does not carry sensitive values;
- [ ] client 5xx/internal failures are sanitized;
- [ ] no Situm capability is invented without evidence;
- [ ] web/native boundary remains truthful;
- [ ] lint/typecheck/build plus active-plan runtime gates pass.
