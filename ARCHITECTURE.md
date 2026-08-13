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
        ├── browser-safe Situm Viewer behavior
        │
        └── authenticated HTTP
                ↓
             Nitro API
                │
                ├── relational app data -> Drizzle/PostgreSQL
                ├── analytics data -> ClickHouse (Plan 017+ only)
                └── external integration -> Situm REST
```

Do not introduce a second backend application, microservice, or client-side direct database access.

ClickHouse is a concrete additional analytics-store requirement beginning in Plan 017. It does not replace PostgreSQL and does not justify a generic multi-database abstraction.

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
├── db/                 # Drizzle/PostgreSQL relational app persistence
├── integrations/       # Situm, ClickHouse, other concrete external/data integrations
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
- browser-safe Viewer coordination;
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
- ClickHouse clients/drivers;
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

Plans may add a small route such as `/app/groups` only when the product scope requires it.

## Components and Nuxt UI

Nuxt UI is the primitive component foundation.

Use:

- `app/app.config.ts` for project-wide Nuxt UI theme/config;
- `app/assets/css/main.css` for semantic tokens/global styling;
- Nuxt UI primitives for standard controls/surfaces;
- product components only when they own a real semantic/composition responsibility.

Do not build a parallel design system over Nuxt UI.

## Client composables

A composable exists because logic is reactive/lifecycle-aware or reused meaningfully.

Good examples:

- shared keyboard/feedback lifecycle behavior;
- feature state reused by multiple components;
- a small API-backed view model reused across surfaces.

Avoid:

- mega `useApp()` objects;
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

A simple handler may call an integration helper directly. Do not create service/repository ceremony for every endpoint.

Protected product endpoints that expose Situm or ClickHouse-backed product data must enforce the existing Situm Explore session server-side. Client middleware is UX, not API security.

GET/read requests should not hide external ingestion side effects. Plan 017 uses an explicit user-triggered analytics sync operation rather than silently syncing on analytics reads.

## Application services — `server/services/`

Create a service only when real orchestration/business logic exists, such as:

- coordinating a Situm report fetch and a ClickHouse write;
- combining multiple verified reads into one product response;
- coordinating DB + external API behavior;
- applying real application rules before a mutation.

Prefer named functions over broad noun classes such as `SitumService` or `AnalyticsService`.

## Relational database — `server/db/`

Owns Drizzle/PostgreSQL infrastructure and application-owned relational persistence.

- DB access is server-only.
- The existing PostgreSQL `situm_explore` schema remains application-owned.
- Do not cache arbitrary Situm resources in PostgreSQL merely because integration work exists.
- New tables/migrations require a concrete relational application-persistence requirement.
- Plan 017 analytics/report rows belong in ClickHouse, not PostgreSQL.

## ClickHouse analytics integration — Plan 017+

ClickHouse is a server-side analytics store with a concrete Plan 017 requirement.

The user already has a local ClickHouse instance. Reuse it.

Rules:

- do not install/provision another ClickHouse server;
- do not add Docker/Compose just for ClickHouse;
- discover the actual local connection/config safely without printing or persisting secrets;
- inspect existing databases/tables before creating app-owned objects;
- never alter/drop unrelated ClickHouse objects;
- prefer an isolated app-owned namespace (`situm_explore` database when appropriate, otherwise clearly prefixed app-owned tables);
- ClickHouse credentials/config are private Nitro runtime configuration;
- browser code never imports a ClickHouse client and never connects directly to ClickHouse;
- use the official current Node.js ClickHouse client when a client library is needed, after verifying its current API;
- keep schema/query code purpose-built for the analytics feature rather than introducing an ORM/repository framework;
- explicit sync + idempotent writes are sufficient for the PoC; do not add queues/workers/cron without a new concrete requirement.

Intended Plan 017 flow:

```text
Situm Reports REST
-> authenticated Nitro ingestion
-> local ClickHouse app-owned tables
-> authenticated analytics query/export API
-> browser analytics UI
```

## Situm REST integration — `server/integrations/situm/`

Keep this boundary small and domain-specific only when reuse/complexity is real.

Example shape only:

```text
server/integrations/situm/
├── client.ts
├── cartography.ts    # only if actual grouped reuse exists
└── reports.ts        # justified by Plan 017 if multiple report operations share real logic
```

Rules:

- `NUXT_SITUM_API_KEY` is private Nitro configuration;
- never pass it to browser code;
- no generic unauthenticated Situm proxy;
- no generic repository layer around external REST resources;
- direct verified REST is allowed when the installed SDK lacks an appropriate wrapper;
- one capability gets one primary access path unless a concrete reason requires otherwise.

## Browser Situm Viewer

The real Viewer remains a client integration under `app/components/situm/SitumViewer.vue`.

`SitumViewer.vue` is the single owner of the Viewer instance/lifecycle.

Keep truthful lifecycle behavior:

- configuration/init state;
- `MAP_IS_READY`;
- `APP_ERROR`;
- explicit missing-config/error behavior.

When retained UI needs Viewer actions, expose only a **small typed command surface** containing exact verified commands needed by the product.

Plans 019 and 020 may expand that typed surface for verified realtime/trajectory/static-directions methods.

Do not:

- instantiate independent Viewer clients across pages;
- expose a generic `invoke(method, payload)` API;
- expose the raw Viewer object to arbitrary pages;
- infer SDK methods from UI labels or model memory.

## Situm credential boundary

The final credential model intentionally uses exactly two Situm keys:

- `NUXT_PUBLIC_SITUM_API_KEY` — browser Viewer credential only; public by design because Nuxt exposes `NUXT_PUBLIC_*` to the browser.
- `NUXT_SITUM_API_KEY` — private Nitro credential for all Situm server operations.

Rules:

- REST/domain Situm calls use `NUXT_SITUM_API_KEY`, never the Viewer key;
- every product Situm API route requires app session auth;
- private credentials never enter public runtime config, browser bundles, logs, docs, or error payloads;
- browser Viewer authentication/permissions are verified separately against the installed/current SDK;
- `NUXT_PUBLIC_SITUM_BUILDING_ID` may remain public;
- do not reintroduce separate private read/write keys without a concrete future requirement;
- do not add a mutation merely because the private key permits it;
- do not invent credential names, token flows, or permissions without exact evidence.

## Web/native boundary

The Nuxt product may monitor data produced by positioned devices, but the web app does not pretend to be the native positioning engine.

Current web roadmap may include verified:

- cartography/map exploration;
- static directions between known points (Plan 020);
- realtime monitoring and Viewer visualization (Plan 019);
- analytics/reports (Plan 017);
- organization/groups/alarms read views (Plan 018);
- browser-safe Viewer settings/actions.

Native-only scope includes:

- sensor-generated indoor blue dot;
- handset positioning permissions/runtime;
- movement-aware turn-by-turn navigation;
- rerouting based on the handset's actual position.

Native implementation remains outside Plans 017–020.

## External capability evidence gate

For Situm integration, **memory is not a contract**.

Before implementation, verify from current official Situm documentation/source and installed SDK version where relevant:

- exact endpoint/method;
- auth/permission requirements;
- request/response/event fields;
- browser vs server ownership;
- web vs native availability;
- relevant failure/empty/stale semantics.

If evidence is incomplete, record the exact capability as unresolved in the active plan and do not implement it.

Never create a believable fake fallback to hide an unresolved integration.

## Data fetching

Use Nuxt-native fetching:

- `useFetch` / `useAsyncData` for render-time data;
- `$fetch` for explicit user-triggered actions such as Plan 017 analytics sync.

Create a custom fetch composable only when actual repeated cross-cutting behavior exists.

## Validation and schemas

Use Zod when external/user input validation provides value.

Typical server flow:

```text
request
-> auth
-> validation
-> direct integration/DB call or real use-case orchestration
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
- generic DB cache for Situm resources;
- microservices/second backend;
- Nuxt layers for feature folders;
- another component library/design system.

The Plan 017 ClickHouse store is **not** a generic Situm cache; it is the concrete analytics persistence/query layer authorized for verified report data.

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
- [ ] PostgreSQL and ClickHouse have distinct concrete ownership;
- [ ] all database access and private credentials remain server-only;
- [ ] Viewer has one lifecycle owner and only a small verified typed command surface;
- [ ] no native-only behavior is implemented as browser positioning/navigation;
- [ ] no Situm capability is implemented without exact evidence;
- [ ] no real failure silently falls back to fake fixture success;
- [ ] lint/typecheck/build plus active-plan runtime gates pass.
