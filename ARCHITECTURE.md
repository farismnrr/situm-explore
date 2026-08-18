# ARCHITECTURE.md

This file is the current architecture contract for Situm Explore.

It describes the current runtime contract. Implementation history belongs in `plans/` and `.agents/`; this file describes the product architecture as it exists now.

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

The product consists of a Nuxt 4 web client, a React Native + Expo companion client, and one shared Nitro application backend. Mobile is a second client, not a second backend or separate application authority.

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

## Historical boundary

The historical pre-refactor baseline contained:

- env-defined single-user authentication;
- process-global Situm server/Viewer configuration;
- a process-global public building identifier;
- analytics created before workspace ownership existed.

These were migration inputs, **not the approved final architecture**.

They are retained only to explain why process-global/env-owned patterns must not be reintroduced. The sections below define the current architecture.

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

## Identity and sessions

- Application users are PostgreSQL-backed and have stable app-owned IDs.
- Email/password registration/login is real product behavior.
- Passwords are stored only as secure hashes using the project auth utility.
- Nuxt sealed sessions remain the app session mechanism unless concrete evidence requires otherwise.
- Session identity references the stable app user, not an env-defined email and not an OAuth provider ID.
- Google OAuth provider wiring is prepared; real Google runtime acceptance remains user-owned/manual for now.
- Provider account identifiers are unique per provider.
- Account linking must not guess. Auto-link only when the verified provider identity gives sufficient safe evidence under the current authentication contract.

Do not add auth bypass/dev-login endpoints.

## Workspace ownership

- One app user may own many workspaces.
- A workspace has exactly one app owner in the current product model.
- No invite/member/team/org tenancy is introduced.
- Different app users may independently point their workspaces at the same external Situm account/organization.
- Situm organization identity is external metadata, not app tenancy.
- Every workspace-backed API verifies ownership server-side.

## Workspace Situm configuration

Situm configuration is authenticated, workspace-managed server persistence.

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

Use the existing versioned authenticated-encryption implementation; do not invent a second credential storage protocol.

## Browser Situm Viewer

`app/components/situm/SitumViewer.vue` remains the single Viewer instance/lifecycle owner.

Keep a small typed command surface only for verified product behavior. Never expose the raw Viewer or a generic method-invocation escape hatch.

The current Viewer flow uses a separate workspace-managed **Read-only Viewer API key**. The owner-scoped server endpoint verifies its permission and organization match before returning it to the authenticated browser, where the Situm SDK uses the documented direct-API-key Viewer flow. The primary Read & Write credential is never returned to the browser.

Any future Viewer-auth change must preserve least privilege and be revalidated against the installed `@situm/sdk-js` contract and current Situm behavior.

## Situm REST integration

Situm server operations resolve credential/account context **per authenticated workspace request**.

Rules:

- no global account singleton remains authoritative after migration;
- no generic unauthenticated Situm proxy;
- one verified capability should have one primary access path;
- direct official REST from Nitro is allowed where verified and simpler than an SDK wrapper;
- existing capabilities are migrated, not expanded speculatively;
- write capability is derived from verified primary-credential permission metadata; upstream authorization remains the final truth;
- upstream forbidden/internal details are normalized before reaching the client.

Account-specific building context is workspace/product state; one global public building ID is not authoritative across workspaces.

## PostgreSQL / Drizzle

PostgreSQL owns application relational state, including:

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
- analytics reads/writes are workspace-isolated;
- workspace identity must participate in the storage/query identity needed to prevent cross-workspace reads;
- legacy pre-workspace rows have no proven owner and must not be assigned arbitrarily;
- preserve legacy rows non-destructively unless the user explicitly chooses a retention/attribution policy;
- explicit product sync remains sufficient unless a later requirement authorizes background processing.

## Observability / correlation

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

The native companion is a **separate client** while Nitro remains the single application backend. It is not a Nuxt wrapper and does not own a separate identity or data authority.

Current ownership:

- desktop/tablet web Map uses the browser Viewer where the layout is capable;
- phone web Map hands off to the native app;
- web Realtime entry points hand off to native on desktop/tablet/phone;
- sensor-generated handset blue dot, positioning permissions/runtime, mobile navigation/rerouting, and native Realtime presentation belong to the React Native companion;
- native Realtime remote reads remain foreground-oriented and server-mediated through the owner-scoped workspace route;
- mobile receives only sanitized remote position/device fields and no broad Situm credential for remote monitoring;
- the workspace Read & Write credential remains server-only; native positioning uses the dedicated least-privilege Positioning credential;
- mobile application sessions reuse the same PostgreSQL identity through the sealed `x-nuxt-session` transport and SecureStore persistence;
- Share Live Location is not used as the product Realtime contract; generic remote MapView markers/focus remain unsupported by the current proven native surface.

## Data fetching / validation

Use Nuxt-native `useFetch` / `useAsyncData` for render-time reads and `$fetch` for explicit actions.

Use Zod where request/external-input validation provides value.

Do not create a broad API client abstraction until repeated cross-cutting behavior proves it is needed. Keep correlation/error wrappers small and only where they are genuinely reused.

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

Native positioning/navigation is implemented under the closed Plans 028–035 evidence. Future changes remain subject to the same capability/security evidence gates and require new explicit scope.

## Native client architecture

The standalone `mobile/` application is React Native + Expo and reuses the same Nitro/PostgreSQL identity and workspace authorization boundary as web.

- native application sessions use the sealed application session over `x-nuxt-session` and persist bearer-equivalent material only in SecureStore;
- native Situm positioning receives only the dedicated owner-authorized Positioning credential;
- `ForegroundPositioningSession` owns the process-global Situm positioning callbacks/running state across Explore and Realtime;
- foreground positioning begins only after explicit user action and runtime permission success;
- native Realtime reads remote positions through the authenticated workspace Nitro route, not through a broad mobile Situm credential;
- app backgrounding, workspace change, logout, explicit stop, native stop/error, and teardown invalidate positioning state according to the foreground-only lifecycle contract;
- unsupported remote-map marker, presence, invented freshness, and synthetic route semantics remain absent.

## Distribution boundary

Android standalone release/distribution is documented in `docs/mobile-distribution.md`. App identity is `Situm Explore` / `com.situm.explore`; current direct distribution produces arm64 APKs and publishes a versioned artifact plus a stable anonymous-download alias. Signing and write credentials remain external operator inputs.

There is no requirement for a second backend, mobile-only identity store, or client-side database access.

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
