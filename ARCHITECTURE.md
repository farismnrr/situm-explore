# ARCHITECTURE.md

This file is the architecture contract for Situm Explore.

The goal is not to build a ceremonial enterprise architecture. The goal is to keep the codebase predictable as it grows while staying native to Nuxt 4.

## Core principles

Use these together:

- **KISS** — prefer the smallest structure that keeps responsibilities clear.
- **SOLID** — separate responsibilities and dependencies where that creates a real boundary.
- **DRY** — remove meaningful duplication after a pattern is proven; do not abstract speculative duplication.
- **Layered Architecture** — presentation, application coordination, shared contracts, transport, and infrastructure have different jobs and must not leak into each other.
- **Nuxt conventions first** — framework-native directories and runtime boundaries are preferred over custom architecture patterns.

When principles compete, use this decision order:

1. correctness and security;
2. Nuxt framework convention;
3. KISS;
4. clear responsibility/dependency direction;
5. DRY after real repetition exists;
6. abstraction for future possibilities only when a concrete requirement justifies it.

A little duplication is better than a premature abstraction that makes the code harder to follow.

## Nuxt 4 directory model

Situm Explore uses the Nuxt 4 application directory structure.

Target root shape:

```text
.
├── app/
│   ├── app.vue
│   ├── app.config.ts
│   ├── assets/
│   │   └── css/
│   │       └── main.css
│   ├── components/
│   ├── composables/
│   ├── data/
│   │   └── prototype/
│   ├── layouts/
│   ├── middleware/
│   ├── pages/
│   ├── plugins/
│   └── utils/
├── server/
│   ├── api/
│   ├── db/
│   ├── integrations/
│   ├── repositories/
│   ├── services/
│   └── utils/
├── shared/
│   ├── types/
│   ├── schemas/
│   └── utils/
├── public/
├── drizzle/
├── design/
├── plans/
├── .agents/
├── ARCHITECTURE.md
├── DESIGN.md
├── AGENTS.md
├── drizzle.config.ts
├── nuxt.config.ts
├── package.json
└── tsconfig.json
```

Do **not** create empty directories merely to mirror this diagram. A directory appears when the codebase has code that belongs there.

`layers/` and `modules/` are intentionally absent from the active application structure. Add a Nuxt layer only when there is a genuine reusable application/configuration layer or multiple applications need to share it. Add a local Nuxt module only for framework-level extension behavior. Do not use Nuxt layers as feature folders.

## Layer model

### 1. Presentation layer — `app/`

Owns browser/UI behavior.

Includes:

- routes/pages;
- layouts;
- Vue components;
- client middleware;
- reactive UI/application composables;
- UI-only prototype fixtures;
- client-only pure helpers.

Presentation may depend on:

- Nuxt/Vue/Nuxt UI;
- `shared/` contracts and pure helpers;
- public HTTP/API contracts through `useFetch`, `useAsyncData`, or `$fetch`;
- browser SDKs such as the existing Situm Viewer where explicitly required.

Presentation must **not** import:

- `server/` files;
- Drizzle schema/client directly;
- PostgreSQL libraries;
- server credentials or private runtime configuration.

### 2. Client application coordination — `app/composables/`

Composables coordinate reusable reactive behavior.

Good examples:

- authenticated workspace state used by multiple components;
- selected map/floor/POI state shared by a feature;
- reusable filtering/search state;
- a reusable API-backed view model used on multiple screens.

Do not put every function in a composable. A composable should exist because the code is reactive, uses Nuxt/Vue lifecycle/runtime state, or represents reusable client coordination.

Rules:

- files use `useXxx.ts` naming;
- keep the public API small;
- avoid giant "god composables" that own unrelated features;
- prefer local component state when only one component needs it;
- do not create a generic API service wrapper just because HTTP calls exist.

### 3. Client pure utilities — `app/utils/`

For pure browser/application helper functions that do not need Vue reactivity.

Examples:

- formatting;
- small mapping helpers used only in the Vue application;
- deterministic filtering/transformation functions.

If a utility must work identically in both app and server, it belongs in `shared/utils/` instead.

### 4. Shared contracts — `shared/`

Contains code that is valid in both the Vue application and Nitro server.

Use it sparingly for:

- API request/response types;
- shared DTOs;
- validation schemas when both sides genuinely use the same schema;
- pure cross-runtime helpers.

`shared/` must not depend on Vue-specific or Nitro/server-specific code.

Recommended use:

```text
shared/
├── types/
│   ├── auth.ts
│   ├── account.ts
│   └── situm.ts
├── schemas/
│   └── auth.ts
└── utils/
    └── normalizeEmail.ts
```

Do not create shared types just to avoid writing a five-line local type twice when there is no real cross-runtime contract.

### 5. Server transport layer — `server/api/`

API handlers are HTTP transport boundaries.

Their responsibilities are:

1. authenticate/authorize the request when necessary;
2. parse and validate request input;
3. call the smallest appropriate server function;
4. translate known failures into HTTP errors;
5. return the response.

API handlers should not accumulate large queries, multi-step business workflows, or external API orchestration.

A tiny endpoint is allowed to call `server/db/` or one integration helper directly. Do not force every trivial endpoint through a service and repository just to satisfy a diagram.

Introduce a service when the use case has real orchestration/business logic.

### 6. Server application services — `server/services/`

Create a service only when a use case has enough logic to deserve a named application operation.

Examples that may justify a service later:

- combine multiple Situm reads into one application response;
- enforce application rules before a database change;
- orchestrate DB + external API behavior;
- normalize a complicated external payload into an internal contract.

Prefer functions over classes unless stateful lifecycle behavior genuinely requires a class.

Good naming:

```text
server/services/getWorkspaceOverview.ts
server/services/getSitumBuildingDetails.ts
```

Avoid generic names such as `UserService` containing twenty unrelated methods.

### 7. Infrastructure — `server/db/`, `server/integrations/`, optional `server/repositories/`

#### `server/db/`

Owns application database infrastructure.

Target:

```text
server/db/
├── client.ts
├── schema.ts
└── queries/       # only when repeated/complex queries justify it
```

- `client.ts` owns Drizzle/PostgreSQL initialization.
- `schema.ts` owns application schema declarations.
- query files are introduced when query logic is repeated or complex enough to deserve a name.

Do not access PostgreSQL from Vue/app code.

#### `server/integrations/`

External systems other than the application database.

Example future structure:

```text
server/integrations/situm/
├── client.ts
├── buildings.ts
├── pois.ts
└── realtime.ts
```

Only create this when server-side Situm reads are actually introduced. The current browser Situm Viewer remains a client integration and should not be moved here just for symmetry.

#### `server/repositories/`

Optional.

A repository is justified when the application needs a stable persistence abstraction across substantial query behavior or multiple use cases.

Do **not** create `FooRepository` for every table or a generic repository base class. Straightforward Drizzle calls may remain in a named query/helper or service.

## Dependency direction

Allowed direction:

```text
app presentation
      │
      ├──────────────► shared contracts/utils
      │
      └── HTTP ──────► server/api
                           │
                           ├──► server/services (when needed)
                           │       │
                           │       ├──► server/db / repositories
                           │       └──► server/integrations
                           │
                           └──► server/db/integration directly for trivial handlers

shared ──X──► app
shared ──X──► server runtime APIs
server ──X──► app
app ──X──► server source files
```

Never import Vue app code into Nitro server code or server-only code into the Vue application.

## App folder mapping

### `app/pages/` — routing and route composition

Pages should be thin.

A page normally owns:

- route metadata;
- route middleware/layout selection;
- route-level data loading;
- composition of feature components;
- very small route-specific glue.

Move reusable UI to components and reusable reactive logic to composables.

Do not turn a page into a 500-line feature implementation if clear component boundaries exist.

Preferred future route structure:

```text
app/pages/
├── index.vue
├── login.vue
├── register.vue
└── app/
    ├── index.vue
    ├── dashboard.vue
    ├── map.vue
    ├── buildings.vue
    ├── pois.vue
    ├── geofences.vue
    ├── paths.vue
    ├── realtime.vue
    ├── analytics.vue
    ├── alarms.vue
    ├── users.vue
    ├── organization.vue
    └── settings.vue
```

Routes are product URLs, not architecture layers. Do not add route nesting solely to express code layering.

### `app/layouts/` — stable application chrome

Use layouts for page wrappers that persist between route changes.

Expected:

```text
app/layouts/
├── default.vue      # only if a public wrapper is needed
└── app.vue          # authenticated product shell
```

The authenticated sidebar/topbar belongs in `app.vue` layout or components composed by it, not repeated in every page.

### `app/components/` — presentation grouped by product responsibility

Use shallow product/domain grouping inside Nuxt's standard component directory.

Target examples:

```text
app/components/
├── app/
│   ├── AppBrand.vue
│   ├── AppSidebar.vue
│   ├── AppTopbar.vue
│   └── AppPageHeader.vue
├── auth/
│   ├── AuthLoginForm.vue
│   └── AuthRegisterForm.vue
├── dashboard/
│   ├── DashboardMetricCard.vue
│   └── DashboardSystemStatus.vue
├── situm/
│   ├── SitumViewer.vue
│   └── SitumWorkspace.vue
├── cartography/
│   ├── CartographyResourceTable.vue
│   └── CartographyDetailDrawer.vue
└── operations/
    └── ...
```

This is not a mandate to create every listed component. Only extract a component when it has a clear responsibility, improves readability, or is reused.

Do not create wrappers such as `BaseButton`, `BaseInput`, or `BaseCard` when Nuxt UI already owns that primitive. Product wrappers are justified only for real product semantics.

### `app/data/prototype/` — typed dummy UI data

UI-first plans may use local synthetic fixtures.

Recommended:

```text
app/data/prototype/
├── dashboard.ts
├── buildings.ts
├── pois.ts
├── geofences.ts
├── realtime.ts
└── reports.ts
```

Rules:

- fixtures are source data, not a fake backend;
- no Nitro route just to return fixture JSON;
- no PostgreSQL persistence;
- keep types explicit;
- remove a fixture when a later real integration replaces it;
- do not build a repository layer around fixtures.

### `app/middleware/`

Client route middleware only.

Current auth middleware belongs here after the Nuxt 4 directory migration.

Authorization/security must still be enforced server-side for protected APIs; client middleware is navigation UX, not the only security boundary.

### `app/plugins/`

Use only for Vue/Nuxt application initialization that must run as a plugin.

Do not use plugins as generic dependency containers or a place for unrelated global logic.

Client-only integrations should use `.client.ts` when they truly require browser APIs.

## Nuxt UI architecture

Nuxt UI is the production component foundation.

Use:

- `app/app.config.ts` for project-wide Nuxt UI configuration;
- `app/assets/css/main.css` for Tailwind/Nuxt UI imports and small global semantic tokens;
- Nuxt UI primitives for buttons, forms, tables, navigation, overlays, dashboard structure, states, etc.;
- local Vue components for product composition, not reimplementation of Nuxt UI primitives.

Do not create a parallel design-system layer.

`DESIGN.md` and `design/IMPLEMENTATION.md` control visual translation. This architecture file controls code responsibility and dependency direction.

## Data fetching conventions

Use Nuxt's native data model.

- `useFetch` / `useAsyncData` for route/component data required during render/SSR.
- `$fetch` for user-triggered actions such as login/form submissions/refresh operations.
- do not wrap every API call in a custom client just to avoid writing `$fetch` or `useFetch`.
- create a custom fetch composable only when repeated cross-cutting behavior actually exists.

Keep request state close to the screen/use case that owns it.

## Validation and schemas

Use Zod where request/input validation provides value.

Recommended flow for an API accepting user input:

```text
request
  -> schema validation
  -> use case / direct simple operation
  -> typed response
```

A shared Zod schema belongs in `shared/schemas/` only when both browser and server intentionally use the same contract. Otherwise keep server-only validation near the server use case.

Do not create schemas for static internal objects that TypeScript already handles adequately.

## SOLID interpretation for this codebase

### Single Responsibility

Strongly applied.

- page = route composition;
- component = one presentation responsibility;
- composable = one reusable reactive responsibility;
- API handler = HTTP boundary;
- service = one application use case;
- DB/integration helper = infrastructure concern.

### Open/Closed

Prefer stable composition points over condition-heavy giant files, but do not invent plugin systems.

Examples:

- status-card data can be mapped into a component;
- a new report can be another typed report definition rather than another copy of the entire report page when the pattern is actually stable.

### Liskov Substitution

Avoid inheritance-heavy design. Prefer typed functions and composition, making LSP mostly irrelevant in normal feature code.

### Interface Segregation

Keep props, response DTOs, and integration contracts small. Do not pass giant application objects to a component that needs three fields.

### Dependency Inversion

Apply when it buys testability or isolates a meaningful external dependency.

Do not create an interface for every function.

A later complex Situm server integration may justify a small adapter/port boundary. A simple `GET` helper does not automatically require one.

## DRY rules

Use the **rule of meaningful repetition**, not a strict line-count rule.

Extract when:

- the same product behavior appears in multiple places;
- duplicated behavior must change together;
- a shared semantic component exists, not merely similar markup.

Do not extract because two blocks happen to share three Tailwind classes.

Prefer explicit repeated feature code over a generic configurable component with twenty props.

Avoid barrel `index.ts` files unless they clearly improve a public module boundary; direct imports are easier to trace in a small app.

## KISS / things intentionally deferred

Do not add by default:

- Pinia/global store;
- dependency-injection container;
- event bus;
- generic API client;
- generic repository base class;
- CQRS;
- domain-event framework;
- command bus;
- microservices;
- monorepo;
- background workers/queues;
- a second backend app;
- Nuxt layers for feature organization;
- a separate component library over Nuxt UI.

A concrete requirement may justify one later, but the requirement must come first.

## Naming conventions

### Vue

- components: PascalCase, filename matches component name;
- composables: `useXxx.ts`;
- layouts/pages follow Nuxt file routing conventions;
- component event names describe the event, not implementation details.

### TypeScript

- functions/variables: camelCase;
- types/interfaces: PascalCase;
- prefer `type` unless interface extension/merging is genuinely useful;
- Zod schemas: `xxxSchema`;
- avoid `Manager`, `Helper`, `Common`, `Misc`, `Utils` filenames with unrelated contents.

### Nitro API

Use Nuxt/Nitro route method suffixes:

```text
server/api/auth/login.post.ts
server/api/situm/status.get.ts
server/api/me.get.ts
```

Group a route under a resource directory when that matches its HTTP URL/product boundary.

### Server use cases

Prefer action names:

```text
getWorkspaceOverview.ts
listSitumBuildings.ts
getSitumRealtimePositions.ts
```

rather than large noun classes.

## Current repo -> target mapping

The application currently uses Nuxt's backwards-compatible root app structure. It should be aligned once, early, before the new UI surface grows.

| Current | Target | Notes |
| --- | --- | --- |
| `app.vue` | `app/app.vue` | Nuxt 4 app root. |
| `app.config.ts` | `app/app.config.ts` | Nuxt UI/app configuration. |
| `assets/css/main.css` | `app/assets/css/main.css` | Build-processed global CSS. |
| `pages/index.vue` | `app/pages/index.vue` | Existing route preserved initially. |
| `pages/dashboard.vue` | `app/pages/dashboard.vue` | Compatibility redirect to `/app/map`; the authenticated product surface is under `/app/**`. |
| `middleware/auth.ts` | `app/middleware/auth.ts` | Client route middleware; unauthenticated `/app/**` navigation goes to `/login`. |
| `components/AppShell.vue` | `app/layouts/app.vue` | Authenticated shell has one layout owner; no parallel legacy shell. |
| `components/SitumViewer.vue` | `app/components/situm/SitumViewer.vue` | Preserve real SDK lifecycle. |
| `server/utils/db.ts` | `server/db/client.ts` | DB infrastructure belongs with DB schema. |
| `server/db/schema.ts` | unchanged | Correct boundary already. |
| `server/api/auth/login.post.ts` | unchanged route | Keep handler small; improve validation only if useful. |
| `server/api/me.get.ts` | unchanged route | Update DB import after client move; service not required yet. |
| `server/api/situm/status.get.ts` | unchanged route | Simple config/status transport is fine. |
| `drizzle.config.ts` | root unchanged | Tooling config. |
| `drizzle/` | root unchanged | Migration artifacts. |
| `nuxt.config.ts` | root unchanged | Nuxt root config. |

The migration should use file moves/renames and preserve behavior. It must not be combined with unrelated backend feature work.

## Architecture gate for new code

Before adding a new file, answer:

1. Is this browser/UI, server-only, or genuinely shared?
2. Which Nuxt-native directory owns that runtime?
3. Is the logic presentation, reactive coordination, transport, use-case logic, or infrastructure?
4. Does an existing file/component already own this responsibility?
5. Is a new abstraction required now, or am I predicting future needs?

If the answer to #5 is only "maybe later", choose the simpler implementation.

## Review checklist

For architecture-sensitive changes, verify:

- [ ] Nuxt 4 directory convention is followed.
- [ ] app/server/shared runtime boundaries are not crossed by source imports.
- [ ] pages remain route composition rather than business-logic dumps.
- [ ] existing Nuxt UI primitives are reused instead of recreated.
- [ ] composables contain reactive/reusable client concerns, not random functions.
- [ ] API handlers remain transport-oriented.
- [ ] services/repositories exist only when real complexity justifies them.
- [ ] DB access remains server-only.
- [ ] dummy UI data remains local and typed, not exposed through fake APIs.
- [ ] no speculative global store/DI/generic repository architecture was introduced.
- [ ] real auth/database/Situm lifecycle behavior is preserved.
- [ ] lint, typecheck, build, and the active plan's validation pass.
