# Current State

_Last reviewed: 2026-08-13_

## Current focus

The accepted UI baseline is integrated into `main`. The next active roadmap stage is **Plan 010: Web Capability Pruning & Situm Integration Contract**.

Plan 010 is no longer mapping-only. Before backend/domain integration, it must make the web product truthful by removing native-only, fake, unsupported, or ownerless Situm-domain UI and freezing the credential/data ownership contract for the retained surfaces.

Active branch:

`plan/010-progressive-situm-data-integration`

Branch base:

`main` at `170110c1d60c32600e1641a0f89cc53823bba9cc`

## Historical UI state

- Plans 001–009B are historical/integrated UI roadmap evidence.
- Plan 009B was closed after manual UI correction and user acceptance.
- Do not reopen 009B/009C from old visual audit findings unless the user explicitly requests new UI design work.
- The accepted visual baseline remains useful, but it no longer overrides capability truthfulness.

## Current web-capability decision

For Situm-domain UI, every field/control must be one of:

1. real web Situm capability with an owner in Plans 011–016;
2. product-owned web behavior independent of Situm;
3. native-only and removed from web;
4. unsupported/low-value/fake and removed.

Do not keep Situm-domain dummy interactions permanently merely to preserve prototype fidelity.

Canonical matrix:

`design/data-source-matrix.md`

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
- fake route/path visual outputs without a real source;
- generic Images inventory;
- invented style/settings data without a real read/use contract;
- organization credential/key detail UI;
- unsourced Recent Activity/capacity metrics.

## Native boundary

No native app is being implemented now.

Future native roadmap may own device positioning/bluedot, sensor/permission handling, motion-aware navigation/rerouting, and other handset-specific positioning behavior.

The Nuxt web app may monitor realtime positions produced by devices; it must not pretend to produce indoor positions from browser sensors.

## Credential/security boundary

Current `main` still contains the historical public Viewer key path. Treat it as legacy implementation to be constrained/migrated during Plan 010, not as the future backend contract.

For later backend work:

- REST/domain Situm calls use private Nitro runtime credentials;
- every product `/api/situm/*` route requires the existing app session;
- never expose the server REST credential to browser code;
- never build a generic unauthenticated Situm proxy;
- browser Viewer auth is separately verified and uses the smallest supported safe mechanism;
- `NUXT_PUBLIC_SITUM_BUILDING_ID` may remain public.

## Existing real runtime that must remain working

- `/api/auth/login`;
- `useUserSession()` / logout / auth middleware;
- `/api/me` and PostgreSQL/Drizzle behavior;
- `/api/situm/status` configuration semantics until deliberately revised;
- real `SitumViewer` initialization and lifecycle;
- `MAP_IS_READY`, `APP_ERROR`, missing-config/error behavior.

## Backend roadmap

- Plan 010 — prune/freeze capability and security contract.
- Plan 011 — Buildings/Floors/POIs/Categories.
- Plan 012 — Geofences/Paths/static routing.
- Plan 013 — Realtime monitoring.
- Plan 014 — Reports/Analytics.
- Plan 015 — Organization/Users/Groups/Alarms read-only.
- Plan 016 — conditional remaining web-safe Viewer/Settings integration only.

Native positioning is not part of Plans 010–016.

## Execution rule

- One plan = one plan branch.
- Do not implement directly on `main`.
- Finish/validate/push the active plan, then wait for explicit PR/integration authorization.
- The next dependent plan starts from updated `main` only after the previous plan is integrated.

## Next action

Execute Plan 010 Phase 0/1: finish inventory and prune web-invalid/fake UI before replacing any retained domain fixtures with real Situm data.
