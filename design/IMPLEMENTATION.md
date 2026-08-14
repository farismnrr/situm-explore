# Situm Explore Implementation Contract

This document defines current production implementation rules while Plans 021–025 execute. Historical UI plans are evidence only.

## Stack

Production remains Nuxt 4, Vue, Nuxt UI, Nitro, `nuxt-auth-utils`, PostgreSQL/Drizzle, the existing ClickHouse analytics integration, `@situm/sdk-js` for verified browser Viewer behavior, and authenticated Nitro REST for verified server-side Situm capabilities.

Do not add a second backend, parallel UI framework, duplicate observability stack, or speculative infrastructure.

## Roadmap sequence

```text
Plan 021 — Identity & Auth Foundation
-> Plan 022 — Private Workspaces & Situm Configuration
-> Plan 023 — Observability, Correlation & Safe Error Boundary
-> Plan 024 — Workspace-scoped Situm Backend Migration
-> Plan 025 — Workspace UX & Full Regression
```

Dependent plans start after the preceding plan is integrated into updated `main` unless stacking is explicitly authorized.

## Authentication

Plan 021 replaces env-defined owner login with DB-backed users.

Required behavior: real registration, email/password login, logout/session clearing, safe `/api/me`, authenticated `/app/**`, and independent server-side API guards.

Rules:

- normalize/validate email identity;
- store password material only as secure hashes;
- session identity uses stable app user ID;
- no dev-login/auth bypass or env fallback after DB auth is accepted;
- Google OAuth plumbing is prepared, but real provider acceptance remains manual/user-owned;
- provider tokens are not persisted without a concrete need;
- account linking requires verified evidence, not guessed email equivalence.

## Workspaces

Plan 022 introduces private single-owner workspaces.

- one user may own many workspaces;
- every workspace request verifies ownership server-side;
- no invite/member/team hierarchy;
- different app users may independently reference the same external Situm account;
- client-provided workspace ID is context, not authorization proof.

## Workspace Situm configuration

Workspace Situm configuration is write-only secret input plus safe metadata/status output.

The stored long-lived credential is encrypted server-side using authenticated encryption, never returned after storage, never placed in public runtime config, and never logged/traced/rendered. Missing encryption configuration fails closed.

Workspace configuration requires a primary credential verified as Situm Read & Write and a separate Viewer credential verified as Situm Read-only. The account/organization ID is derived from the authenticated primary credential. Write capability is derived from verified primary permission metadata; upstream Situm permission remains authoritative. Do not run a write mutation merely to discover capability.

## Viewer

`SitumViewer.vue` remains the single Viewer owner. Keep truthful initialization/readiness/failure/cleanup state and expose only small typed verified commands.

The historical public API-key setup is migration input only. Plan 022 must verify the installed SDK/current official auth contract before workspace-derived Viewer auth changes.

Prefer a proven short-lived/least-privilege browser credential. If a write-capable workspace cannot produce a safely understood Viewer credential, stop that path and ask the user rather than exposing the stored long-lived workspace credential.

## Workspace-scoped backend

By Plan 024, protected Situm behavior resolves:

```text
session user -> owned workspace -> workspace configuration/capability -> Situm integration
```

Do not keep a process-global Situm account/client/building as authority.

Migrate existing verified capabilities rather than inventing new ones: cartography, geofences/paths, organization/users/groups/alarms reads, realtime, analytics sync/reports, and Viewer/static-directions supporting context.

## Permission-aware actions

For view-only workspaces, supported reads remain available; known mutations are guarded with clear product guidance; server enforcement remains authoritative; upstream forbidden results become safe product feedback.

For write-capable workspaces, retain only mutations already proven by exact contract/runtime evidence.

## ClickHouse

ClickHouse stays analytics-only and server-side. Analytics storage/query identity must become workspace-isolated before multi-workspace reads are accepted.

Legacy unscoped rows remain non-destructive historical data, are excluded from workspace-owned reads unless attribution is proven, and are never silently assigned to a workspace.

Do not provision another ClickHouse server.

## Observability / correlation

Plan 023 starts with `docker ps` plus repository/runtime discovery and reuses the existing observability stack.

Frontend requests carry standard correlation/trace context supported by that stack. Instrument meaningful Nitro/downstream boundaries only.

Never put secrets, cookies, passwords, credential input, tokens, or sensitive bodies into trace headers, baggage, logs, or spans.

## Safe errors

Normalize validation, unauthenticated, forbidden, not-found, conflict, upstream, and internal failures into safe product responses. A correlation/reference ID may be returned when useful.

Do not expose stack traces, DB/crypto internals, raw Situm bodies, SDK internals, or critical diagnostics to the client. Detailed diagnostics remain server-side with redaction.

## UI rules

Use Nuxt UI primitives first, reuse semantic components/composables where responsibility matches, keep pages route-focused, and add narrow CSS only for real gaps.

Real roadmap UI includes `/register`, workspace create/rename/delete/switch/configuration, permission guidance, safe forbidden feedback, and support/reference ID display when appropriate.

No workspace invite/member UI in this roadmap.

## Situm evidence gate

Before any Situm behavior changes, verify exact endpoint/SDK method, installed compatibility, browser/server owner, permission semantics, consumed request/response/event fields, and relevant failure behavior.

No evidence means unresolved/absent, never fake success.

## Web/native boundary

Do not implement handset indoor positioning, sensor-generated blue dot, live current-position navigation, or movement-aware rerouting as web product behavior.

Realtime monitoring of positioned devices and verified static directions remain valid web capabilities.

## Validation

Code-changing phases run at least `git diff --check`, `npm run lint`, `npm run typecheck`, `npm run build`, and production acceptance with `npm run preview`. Nuxt dev mode is not acceptance evidence.
