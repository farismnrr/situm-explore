# Situm Explore Implementation Contract

This document defines the current production implementation boundaries for Situm Explore.

## Stack

Web/backend:

- Nuxt 4 + Vue + Nuxt UI;
- Nitro server routes;
- `nuxt-auth-utils` session infrastructure;
- PostgreSQL + Drizzle for application relational state;
- ClickHouse for workspace-isolated analytics;
- `@situm/sdk-js` for verified browser Viewer behavior;
- authenticated Nitro integrations for server-side Situm capabilities.

Native:

- React Native 0.86.2 + React 19.2.3;
- Expo 57.0.13;
- `@situm/react-native` 3.19.2;
- `expo-secure-store` for bearer-equivalent mobile session material;
- standalone package under `mobile/`.

Nitro remains the single application backend. Do not add a second auth database/backend, parallel UI framework, duplicate observability stack, or speculative infrastructure.

## Authentication and sessions

Application users are PostgreSQL-backed. Email/password registration, login, logout, session expiry, and protected-route enforcement are real product behavior.

Web uses the existing sealed session mechanism. Native uses the same application identity through the sealed session transported in `x-nuxt-session`; mobile persists session material only through SecureStore.

Client-provided user/workspace identity is never authorization proof. Do not add dev-login or auth-bypass paths.

Google OAuth wiring exists, but runtime provider acceptance must be treated separately from the verified email/password path.

## Workspaces

- one user may own multiple private workspaces;
- each workspace has one application owner in the current model;
- every workspace API verifies ownership server-side;
- workspace ID is context, not proof of authority;
- no invite/member/team tenancy is implemented.

## Workspace Situm credentials

Workspace Situm configuration is secret write input plus safe metadata/status output.

- primary Read & Write credential: encrypted server-side, server-only;
- Viewer Read-only credential: encrypted server-side and returned only through the authenticated owner-scoped Viewer-auth boundary after permission/org validation;
- Positioning credential: encrypted server-side and returned only through the authenticated owner-scoped mobile positioning boundary;
- account/organization ID: derived and stored as metadata.

Stored secret values are never returned by normal configuration reads and must not enter logs, traces, docs, public runtime config, or client errors.

## Browser Viewer

`app/components/situm/SitumViewer.vue` is the single browser Viewer lifecycle owner.

The current flow uses the separate verified Read-only Viewer API key with Situm's direct API-key Viewer initialization. The primary Read & Write key must never be exposed to the browser.

Keep a small typed Viewer command surface. Do not expose raw Viewer access or a generic invoke escape hatch.

## Native positioning and Map

The native app receives only the dedicated Positioning credential after application-session and workspace-owner authorization.

`ForegroundPositioningSession` owns the process-global Situm positioning callbacks/running state. Explore and Realtime consume that shared foreground session instead of independently starting/stopping global callbacks.

Positioning starts only after explicit user action and runtime permission success. Stop/workspace switch/logout/background/native failure/teardown must clear protected location state according to the established lifecycle.

Map/cartography/POI/floor/navigation UI must consume real Situm state. Do not invent route metrics or product data.

## Native Realtime

Remote Realtime remains server-mediated through the authenticated workspace route. The mobile Positioning credential is not widened for remote monitoring.

The client model is intentionally minimal: device/position identity, source time, building/floor, accuracy, coordinates, and supported IDs. Do not add presence, unsupported freshness classification, or fabricated remote-map semantics.

Realtime reliability diagnostics are intentionally bounded: poll outcomes and producer start are logged as sanitized state/count metadata, while native-fix diagnostics are throttled rather than emitted for every high-frequency location callback. Location coordinates, credentials, headers, and raw upstream payloads stay out of normal diagnostics.

## Workspace-scoped backend

Protected Situm behavior resolves:

```text
session user -> owned workspace -> workspace configuration/capability -> Situm integration
```

Do not use a process-global Situm account/client/building as authority.

## ClickHouse

ClickHouse is analytics-only and server-side. Reads/writes are workspace-isolated. Legacy pre-workspace rows remain unscoped historical data unless attribution is proven; never assign them arbitrarily.

Do not provision another ClickHouse server for this application.

## Observability and safe errors

Reuse the existing observability stack. Correlation/trace context may cross meaningful request boundaries, but credentials, cookies, passwords, tokens, sensitive bodies, and location streams must not be dumped into normal telemetry.

Normalize validation, unauthenticated, forbidden, not-found, conflict, upstream, and internal failures into safe product responses. Detailed diagnostics remain server-side.

## Web/native product boundary

Web owns administration, analytics, capable-layout Viewer exploration, and static web operations. Native owns sensor-backed indoor positioning, native Map/navigation, and the native Realtime experience.

Web Map on phone and web Realtime use the integrated native handoff policy. This is a product decision, not a claim that the web SDK is technically incapable of all related APIs.

## Android release

Current standalone Android release is arm64-only and uses the build/publish contract in `docs/mobile-distribution.md`. Release builds must embed an intended HTTPS API base URL and must not depend on Metro or localhost.

## Situm evidence gate

Before changing Situm behavior, verify exact installed/current capability, auth/permission, runtime owner, consumed inputs/fields/events, and failure semantics.

No evidence means unresolved/absent, never fake success.

## Validation

Web/backend baseline:

```text
git diff --check
npm test
npm run lint
npm run typecheck
npm run build
```

Mobile baseline:

```text
npm run lint
npm run typecheck
```

Use production preview/runtime checks for behavior claims and physical Android evidence for sensor-backed positioning claims.
