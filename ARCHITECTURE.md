# ARCHITECTURE.md

This file is the current architecture contract for Situm Explore.

It describes the repository **as it exists now and how new code should fit it**. Historical migrations belong in completed plans/session history, not here.

## Core principles

Use these in order:

1. correctness and security;
2. Nuxt framework convention;
3. KISS;
4. clear responsibility/dependency direction;
5. DRY after meaningful repetition is proven;
6. abstraction only when a concrete requirement exists.

A little explicit duplication is better than a speculative framework.

## Current runtime model

Situm Explore is one full-stack Nuxt 4 application.

```text
browser / Vue / Nuxt UI
        │
        ├── browser-safe Viewer SDK behavior
        │
        └── authenticated HTTP
                ↓
             Nitro API
                │
                ├── application DB (Drizzle/PostgreSQL)
                └── external integrations (Situm REST)
```

Do not introduce a second backend application, microservice, or client-side direct DB access.

## Current directory ownership

```text
app/
├── app.vue
├── app.config.ts
├── assets/
├── components/
├── composables/
├── data/
│   └── prototype/      # transitional fixtures only
├── layouts/
├── middleware/
├── pages/
├── types/
└── utils/              # only when needed

server/
├── api/                # HTTP transport
├── db/                 # Drizzle/PostgreSQL
├── integrations/       # external systems when introduced
├── services/           # only real orchestration/use cases
└── utils/              # server-only helpers when justified

shared/                 # only genuinely cross-runtime contracts/helpers
```

Do not create empty folders merely to satisfy this diagram.

## Presentation layer — `app/`

Owns:

- routes/pages;
- layouts/navigation;
- Vue/Nuxt UI components;
- client middleware;
- reactive composables;
- browser-safe SDK coordination;
- transitional prototype fixtures;
- client-only pure helpers.

Presentation may depend on:

- Nuxt/Vue/Nuxt UI;
- `shared/` contracts/helpers;
- app HTTP contracts through `useFetch`, `useAsyncData`, `$fetch`;
- the browser Situm Viewer only for verified Viewer-owned behavior.

Presentation must not import:

- `server/` source files;
- Drizzle/PostgreSQL libraries;
- server credentials/private runtime configuration.

## Pages

Pages are route composition, not feature monoliths.

A page normally owns:

- route metadata;
- route-level data loading;
- composition of existing feature/product components;
- small route-specific state/glue.

Move meaningful repeated reactive behavior into composables and meaningful repeated product composition into components.

Do not create generic wrappers merely because two pages look similar.

Current web route family is centered on:

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

`/register` currently exists only as historical dummy UI and is subject to Plan 010 pruning; it is not an architectural requirement.

## Components and Nuxt UI

Nuxt UI is the primitive component foundation.

Use:

- `app/app.config.ts` for project-wide Nuxt UI theme/config;
- `app/assets/css/main.css` for semantic tokens/global styling;
- Nuxt UI primitives for standard controls/surfaces;
- product components only when they own a real semantic/composition responsibility.

Do not build a parallel design system (`BaseButton`, `BaseCard`, generic factories) over Nuxt UI.

## Client composables

A composable exists because logic is reactive/lifecycle-aware or reused meaningfully.

Good examples:

- shared tab keyboard behavior;
- shared feedback/toast lifecycle;
- feature state reused by multiple components;
- a small API-backed view model reused across surfaces.

Avoid:

- mega `useApp()` / `useExploreUi()` objects;
- generic state buses;
- Pinia/global store without a concrete multi-surface need;
- wrapping every `$fetch` call merely for symmetry.

## Transitional fixtures — `app/data/prototype/`

Fixtures are temporary source data, not a fake backend.

Rules:

- typed and centralized;
- no Nitro endpoint just to return fixture JSON;
- no DB persistence;
- no repository/service abstraction around fixtures;
- remove fixture data after its real owner replaces it;
- Plan 010 removes fixture data used only by pruned UI;
- real failures must never silently fall back to plausible fixture success.

## Shared contracts — `shared/`

Use sparingly for contracts genuinely needed by both browser and server, for example an API response DTO/schema consumed on both sides.

`shared/` must not depend on Vue/Nuxt client runtime or Nitro/server runtime APIs.

Do not move a five-line local type into shared merely to avoid duplication.

## Nitro transport — `server/api/`

API handlers own the HTTP boundary:

1. authenticate/authorize when required;
2. validate request input;
3. call the smallest appropriate DB/integration/service function;
4. translate known failures into HTTP errors;
5. return a small product-facing response.

A simple handler may call a DB/integration helper directly. Do not create a service/repository ceremony for every endpoint.

Protected product endpoints, including future `/api/situm/*`, must enforce the existing Situm Explore session server-side. Client middleware is UX, not API security.

## Application services — `server/services/`

Create a service only when real orchestration/business logic exists, such as:

- combining multiple Situm reads into one product response;
- coordinating DB + external API behavior;
- applying real application rules before a mutation;
- normalizing a complex multi-step workflow.

Prefer named functions over broad noun classes such as `SitumService` or `UserService`.

## Database — `server/db/`

Owns Drizzle/PostgreSQL infrastructure and application-owned persistence.

- DB access is server-only.
- The existing `situm_explore` schema remains application-owned.
- Do not cache Situm data in PostgreSQL merely because integration work begins.
- New tables/migrations require a concrete application persistence requirement.

## Situm REST integration — `server/integrations/situm/`

Introduce this boundary only as Plans 011+ add real server-side Situm REST reads/actions.

Start small. Example only:

```text
server/integrations/situm/
├── client.ts
├── cartography.ts    # only if actual grouped reuse appears
└── reports.ts        # only if actual grouped reuse appears
```

Do not pre-create all domain files.

Rules:

- server REST credentials are private runtime configuration;
- never pass them to browser code;
- no generic unauthenticated Situm proxy;
- no generic repository layer around external REST resources;
- one capability gets one primary access path unless a concrete reason requires otherwise.

## Browser Situm Viewer

The real Viewer remains a client integration under `app/components/situm/SitumViewer.vue`.

`SitumViewer.vue` should remain the single owner of the Viewer instance/lifecycle.

Keep truthful lifecycle behavior:

- configuration/init state;
- `MAP_IS_READY`;
- `APP_ERROR`;
- explicit missing-config/error behavior.

When retained UI needs Viewer actions, expose only a **small typed command surface** containing exact verified commands needed by the product.

Do not:

- instantiate independent Viewer clients across pages;
- expose a generic `invoke(method, payload)` API;
- infer SDK methods from UI labels or model memory.

## Situm credential boundary

Plan 016A implemented the final credential split. Situm credentials are separated by responsibility:

- `NUXT_PUBLIC_SITUM_API_KEY` — browser Viewer credential only; minimum Viewer permission that works for the POC; public by design because Nuxt exposes `NUXT_PUBLIC_*` to the browser.
- `NUXT_SITUM_READ_API_KEY` — private Nitro credential for Situm read operations; intended role: Only Read.
- `NUXT_SITUM_WRITE_API_KEY` — private Nitro credential reserved for explicitly approved Situm mutations; intended role: Read and Write; stays unused until a real mutation is implemented.
- `NUXT_PUBLIC_SITUM_BUILDING_ID` — public identifier, not a secret.

The temporary `NUXT_SITUM_API_KEY` compatibility variable has been fully removed; no current Nitro read depends on it.

Rules:

- REST/domain Situm calls use private Nitro runtime credentials (read or write, never the Viewer key);
- every product Situm API route requires app session auth;
- server credentials never enter public runtime config;
- browser Viewer authentication is verified separately against the installed/current SDK;
- `NUXT_PUBLIC_SITUM_BUILDING_ID` may remain public;
- never use the write key for reads when the read key is sufficient;
- do not add a mutation merely because the write key exists;
- do not invent credential names, token flows, or permissions without exact verified evidence.

## Web/native boundary

The Nuxt product may monitor data produced by positioned devices, but the web app does not pretend to be the native positioning engine.

Current web roadmap may include verified:

- cartography/map exploration;
- static directions between known points;
- realtime monitoring;
- analytics/reports;
- organization/operations read views;
- browser-safe Viewer settings/actions.

Native-only scope includes:

- sensor-generated indoor blue dot;
- handset positioning permissions/runtime;
- movement-aware turn-by-turn navigation;
- rerouting based on the handset's actual position.

Native implementation is outside Plans 010–016.

## External capability evidence gate

For Situm integration, **memory is not a contract**.

Before implementation, verify from current official Situm documentation/source and installed SDK version where relevant:

- exact endpoint/method;
- auth/permission requirements;
- request/response/event fields;
- browser vs server ownership;
- web vs native availability.

If evidence is incomplete, record the capability as `UNRESOLVED` in Plan 010 and do not implement it.

Never create a believable fake fallback to hide an unresolved integration.

## Data fetching

Use Nuxt-native fetching:

- `useFetch` / `useAsyncData` for render-time data;
- `$fetch` for explicit user-triggered actions.

Create a custom fetch composable only when actual repeated cross-cutting behavior exists.

## Validation and schemas

Use Zod when external/user input validation provides value.

Typical server flow:

```text
request
-> auth
-> validation
-> direct integration/DB call or real use-case service
-> product response
```

Shared schemas belong in `shared/` only when both runtimes genuinely consume them.

## KISS / deferred by default

Do not add without a concrete requirement:

- Pinia/global store;
- DI container;
- event bus;
- generic API client abstraction;
- generic repository base class;
- CQRS/command bus/domain-event framework;
- workers/queues/background sync;
- DB cache for Situm data;
- microservices/second backend;
- Nuxt layers for feature folders;
- another component library/design system.

## Architecture gate for every new file

Before adding a file, answer:

1. browser, server, or genuinely shared?
2. which Nuxt-native directory owns it?
3. what single responsibility does it own?
4. does an existing component/composable/API/integration already own it?
5. is the abstraction required by current behavior, or only imagined future use?

If #5 is only “maybe later”, keep it simpler.

## Review checklist

- [ ] app/server/shared runtime boundaries are respected;
- [ ] pages remain route composition;
- [ ] Nuxt UI primitives/shared product components are reused appropriately;
- [ ] server API handlers remain transport-oriented;
- [ ] services/repositories exist only for real complexity;
- [ ] DB access and server credentials remain server-only;
- [ ] Viewer has one lifecycle owner;
- [ ] no native-only behavior is implemented as browser positioning;
- [ ] no Situm capability is implemented without exact evidence;
- [ ] no real failure silently falls back to fake fixture success;
- [ ] lint/typecheck/build plus active-plan gates pass.