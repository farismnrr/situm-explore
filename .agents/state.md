# Current State

_Last reviewed: 2026-08-13_

## Current focus

The accepted UI baseline is integrated into `main`.

The active roadmap stage is **Plan 010 — Web Capability Pruning & Situm Integration Contract** on:

`plan/010-progressive-situm-data-integration`

Branch base:

`main` at `170110c1d60c32600e1641a0f89cc53823bba9cc`

Plan 010 planning/governance preflight has been refreshed so current architecture/design/planning docs agree on the web/native/security boundary. Implementation has not started yet.

## Historical UI state

- Plans 001–009B are historical/integrated evidence.
- Plan 009B closed after manual UI correction and explicit user acceptance.
- Do not reopen 009B/009C from old visual findings unless the user explicitly requests new UI design work.
- Prototype/accepted visual fidelity does not override current capability truthfulness.

## Current capability classes

Every Situm-domain field/control must finish Plan 010 as exactly one of:

1. `WEB / SITUM` — retained with exact verified Situm evidence and one later owner;
2. `WEB / PRODUCT` — app-owned web behavior;
3. `NATIVE-ONLY` — absent from the web product;
4. `REMOVE` — unsupported/fake/low-value/misleading and removed;
5. `UNRESOLVED` — evidence incomplete; must not be implemented or presented as working Situm behavior.

Canonical product matrix:

`design/data-source-matrix.md`

## No-hallucination execution rule

For Situm behavior, memory/prototype/history is not enough.

Before implementation, verify exact current official contract plus installed SDK compatibility where relevant:

- endpoint or SDK method;
- web vs native availability;
- browser Viewer vs Nitro owner;
- auth/permission;
- request inputs;
- consumed response/event fields;
- read/write semantics;
- relevant failure/empty/stale state.

If material evidence is missing, classify `UNRESOLVED` and stop that capability. Do not guess or fake a success path.

Plans 011–016 may implement only capabilities that Plan 010 closes with exact evidence + one owner.

## Current prune direction

Plan 010 should remove or verify-before-retaining at minimum:

- dummy registration;
- fake global Sync;
- browser `My location` indoor-position semantics;
- device-position-dependent live navigation/rerouting;
- end-user Set User Location control;
- save-car/navigate-to-car POC controls;
- unverified remote-person Follow semantics;
- flight selection;
- fake route/path outputs without a real source;
- generic Images inventory;
- invented style/settings data without exact real backing;
- organization credential/key detail UI;
- unsourced Recent Activity/capacity metrics.

## Native boundary

No native app is being implemented now.

Future native scope may own device positioning/bluedot, sensor/permission handling, and movement-aware live navigation/rerouting.

Web may monitor positions produced by devices; it must not pretend the browser itself is a Situm positioning engine.

## Credential/security boundary

Current `main` still contains a historical public Viewer POC credential path. It is legacy current behavior, not future REST architecture.

Future retained integrations follow:

- REST/domain Situm calls use private Nitro runtime credentials;
- every product `/api/situm/*` route requires the existing app session;
- server REST credentials never enter browser/public runtime config;
- no generic unauthenticated Situm proxy;
- browser Viewer auth is a separate exact contract verified in Plan 010;
- `NUXT_PUBLIC_SITUM_BUILDING_ID` may remain public.

Do not invent the private env name or Viewer token flow before verification.

## Existing real runtime to protect

- `/api/auth/login`;
- `useUserSession()` / logout / auth middleware;
- `/api/me` and PostgreSQL/Drizzle behavior;
- `/api/situm/status` configuration semantics until deliberately revised;
- real `SitumViewer` lifecycle;
- `MAP_IS_READY`, `APP_ERROR`, missing-config/error behavior.

## Backend roadmap

- Plan 010 — prune + freeze exact capability/security/evidence contract.
- Plan 011 — Buildings/Floors/POIs/Categories.
- Plan 012 — Geofences/Paths/static routing.
- Plan 013 — Realtime monitoring.
- Plan 014 — Reports/Analytics.
- Plan 015 — Organization/Users/Groups/Alarms read-only.
- Plan 016 — `plans/016-situm-viewer-settings-integration.md`, conditional remaining verified web-safe Viewer/Settings behavior.

Native positioning is outside Plans 010–016.

## Execution rule

- One plan = one branch.
- Do not implement on `main`.
- Complete/validate/commit/push each phase.
- No PR/merge without explicit user authorization.
- Dependent plans start only after their dependency is integrated into updated `main`.

## Next action

Plan 010 is ready for execution when requested.

Start with Phase 0 source inventory/consistency confirmation, then Phase 1 pruning. Do not replace retained domain fixtures with real Situm data until their assigned Plans 011+.