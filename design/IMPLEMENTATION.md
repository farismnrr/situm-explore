# Situm Explore UI Implementation Contract

This document defines how current product UI is maintained while the post-UI Situm integration roadmap executes.

Historical Plans 004–009 used the canonical prototype to build the accepted UI. Starting in Plan 010, visual fidelity remains important but **capability truthfulness is mandatory**.

## Visual reference

The single HTML visual/interaction reference remains:

`design/reference/situm-explore-interactive-prototype.html`

Use it for:

- hierarchy and composition;
- density and spacing;
- typography and surface treatment;
- responsive behavior;
- interaction presentation.

Do not copy its HTML/CSS/JS implementation into Nuxt.

The prototype is not authority for whether a Situm capability is technically valid on web. `DESIGN.md`, the active plan, and `design/data-source-matrix.md` define that boundary.

## Production stack

Production remains:

- Nuxt 4;
- Vue;
- Nuxt UI;
- Nuxt routing/layout/middleware conventions;
- existing `nuxt-auth-utils` auth/session flow;
- PostgreSQL/Drizzle for app-owned persistence;
- `@situm/sdk-js` for verified browser Viewer behavior;
- Nitro routes for authenticated server-side Situm REST integration.

## Current routes

Current authenticated product routes are under `/app/**`.

Expected retained web product after Plan 010 pruning:

```text
/
/login
/app
/app/dashboard
/app/map
/app/buildings
/app/pois
/app/geofences
/app/paths
/app/realtime
/app/analytics
/app/alarms
/app/users
/app/organization
/app/settings
```

`/register` is a historical dummy flow and is a Plan 010 removal candidate because no real self-service registration backend exists in the current POC.

Do not add a new registration backend merely to preserve that old screen.

## Existing real foundation

Keep working unless an active plan explicitly changes the contract:

### Authentication

- `/api/auth/login`;
- `useUserSession()`;
- authenticated `/app/**` navigation;
- logout/session clearing;
- server-side session guards for protected APIs.

### PostgreSQL

- `/api/me`;
- Drizzle/PostgreSQL under the current `situm_explore` schema.

### Viewer lifecycle

- `SitumViewer.vue` owns the real Viewer lifecycle;
- `ViewerEventType.MAP_IS_READY` is the real ready transition;
- `ViewerEventType.APP_ERROR` and initialization/config errors remain truthful;
- `/api/situm/status` is configuration/status context, not Viewer readiness.

## Situm credential boundary

The current baseline still contains `NUXT_PUBLIC_SITUM_API_KEY` for the historical browser Viewer POC.

Treat this as **legacy Viewer-only implementation**, not the future REST/backend architecture.

Starting with Plan 010:

- new Situm REST/domain integrations use private Nitro runtime credentials;
- browser code must never receive the server REST credential;
- every product `/api/situm/*` route requires the existing Situm Explore session;
- browser Viewer authentication is verified separately against the installed/current SDK and uses the smallest safe supported mechanism;
- `NUXT_PUBLIC_SITUM_BUILDING_ID` may remain public because it is an identifier;
- never log/render/commit credentials or token-bearing payloads.

Do not invent the final private env-variable name or Viewer token flow from memory. Plan 010 must verify and freeze it first.

## Web vs native boundary

The Nuxt application is a web operations/exploration product.

Web may own verified Situm capabilities such as:

- map viewing and selection;
- buildings/floors/POIs;
- geofences/path metadata;
- static directions between known points;
- realtime monitoring of positions produced by devices;
- reports/analytics;
- organization/users/groups/alarms read views;
- verified Viewer configuration/settings.

The current web roadmap does **not** own handset indoor positioning or motion-aware navigation.

Native-only examples:

- sensor-produced indoor blue dot;
- positioning permission/runtime management;
- live navigation based on the handset's actual indoor position;
- motion-aware rerouting.

Do not simulate native positioning and present it as a real web capability.

## Capability evidence gate

For any Situm-domain field/action, **no evidence = no implementation**.

Before coding a real integration, record/verify:

1. exact official REST endpoint or SDK method;
2. installed SDK version compatibility where relevant;
3. browser Viewer vs authenticated Nitro ownership;
4. read/write behavior;
5. required permission/auth contract;
6. exact response/event fields actually needed by UI;
7. loading/empty/error behavior;
8. later plan owner.

Do not infer any of these from:

- prototype labels;
- historical plans;
- dummy fixture shape;
- model memory;
- similar APIs.

If exact evidence cannot be verified, mark the item `UNRESOLVED` in Plan 010 and do not implement it. The correct fallback is removal/blocking, not believable fake data.

## UI implementation rule

For retained UI:

1. reuse existing Nuxt UI primitives;
2. reuse current product semantic components/composables when responsibility matches;
3. adapt real data into the current presentation contract;
4. remove only UI that Plan 010 explicitly classifies native-only/remove;
5. add truthful loading/empty/error states without redesigning unrelated areas.

Do not create `BaseButton`, `BaseCard`, `BaseInput`, generic component factories, global stores, or broad SDK wrappers unless a real repeated responsibility proves the need.

## Viewer command ownership

Keep one real Viewer instance owner in `SitumViewer.vue`.

When retained UI needs Viewer actions, prefer a small typed exposed surface such as the exact verified commands required by Plans 011–016.

Do not create multiple independent Viewer SDK instances in pages and do not expose a generic `invokeViewer(method, payload)` escape hatch.

## Fixture policy after Plan 010

Fixtures under `app/data/prototype/` are transitional only.

- Plan 010 removes fixtures/types used only by removed UI.
- Plans 011–015 remove a fixture after its real data path works.
- Plan 016 removes local dummy success behavior for retained Viewer/settings actions after real wiring works.
- Real errors/empty responses must not silently fall back to plausible fake values.

Do not create fake Nitro APIs or DB persistence for prototype fixtures.

## UI/data ownership sequence

```text
Plan 010  prune + exact capability/security contract
Plan 011  Buildings/Floors/POIs/Categories
Plan 012  Geofences/Paths/static routing
Plan 013  Realtime monitoring
Plan 014  Reports/Analytics
Plan 015  Organization/Users/Groups/Alarms read-only
Plan 016  remaining verified web-safe Viewer/Settings capabilities
```

A later plan must not restore a control removed by Plan 010 unless the user explicitly changes scope.

## Validation

For code-changing phases:

- `git diff --check`;
- `npm run lint`;
- `npm run typecheck`;
- `npm run build`;
- no credential leakage;
- existing auth/DB/Viewer lifecycle remains working;
- no native-only behavior is represented as real web behavior;
- no retained Situm-domain action lacks verified evidence/ownership;
- update active plan and `.agents/state.md` before phase commit/push.

Keep architecture boring: no speculative services, repositories, caches, workers, event buses, stores, or second backend application.