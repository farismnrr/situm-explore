# Plan 005 — Authenticated App Shell & Dashboard

Status: planned
Branch: `plan/005-authenticated-shell-dashboard`
Depends on: Plan 004 complete, reviewed, and integrated into `main`

## Goal

Atomically migrate the authenticated entry flow from the legacy `/dashboard` surface into the approved `/app/**` route tree, implement the authenticated application chrome/Home/Dashboard, preserve the already-working auth/database/Situm Viewer, and keep missing product data dummy.

This plan must start from `main` **after Plan 004 is integrated**. Do not run it from a stale main branch or silently stack it on an unmerged Plan 004 branch.

## Mandatory HTML-first implementation protocol

Canonical visual/interaction reference:

`design/reference/situm-explore-interactive-prototype.html`

Read the canonical HTML before editing the authenticated shell or dashboard.

For every visual phase:

1. Open the canonical HTML reference.
2. Locate the relevant authenticated shell/Home/Dashboard section in the **current** HTML. Selector names listed below are locator hints, not permission to reconstruct a missing section from memory.
3. Inspect structure, proportions/density, responsive behavior, and interaction intent.
4. Translate the result into real Nuxt routes/layouts/components; never copy prototype screen-switching JavaScript.
5. Reuse existing real session/database/viewer behavior.
6. Use typed dummy data where the backend does not exist.
7. Compare implementation with the same HTML section before phase completion.

Reference areas from the approved prototype include:

- authenticated shell (`#screen-app`, sidebar, topbar, nav groups/items, account block);
- mobile shell/drawer behavior;
- Home (`#app-home`);
- Dashboard (`#app-dashboard`);
- global search/command modal (`#globalSearch`, `#searchModal`) when those IDs still exist.

## Required reading

- `AGENTS.md`
- `ARCHITECTURE.md`
- `DESIGN.md`
- `design/IMPLEMENTATION.md`
- `design/data-source-matrix.md`
- `design/reference/situm-explore-interactive-prototype.html`
- completed Plan 004 implementation/state
- this plan

## Phase 1 — Authenticated layout and auth navigation contract

Target layout: `app/layouts/app.vue`.

Before implementation, inspect the authenticated shell and its mobile state in the current HTML.

Tasks:

- [ ] Replace the interim Plan 003/Plan 004 `AppShell` direction with one authenticated Nuxt layout using the approved sidebar + topbar composition.
- [ ] Use shallow product components under `app/components/app/` only when they improve readability/reuse.
- [ ] Use real Nuxt routes and active-route state.
- [ ] Account identity comes from `useUserSession()`.
- [ ] Logout uses existing `clear()` and returns to `/` or `/login` consistently.
- [ ] Keep the navigation-arrow brand mark from the approved reference.
- [ ] Update `app/middleware/auth.ts` so unauthenticated `/app/**` navigation goes to `/login`, not to the public landing page.
- [ ] Keep API authorization server-side as it already exists; client middleware remains navigation UX only.
- [ ] Do not add Pinia/global-store architecture for shell state; local layout state/composables are enough.
- [ ] Match desktop and mobile shell behavior against the HTML.

Acceptance: the authenticated chrome has one owner (`app/layouts/app.vue`) and the interim old shell is no longer a competing architecture.

## Phase 2 — `/app/**` route migration and compatibility

Create the route tree using Nuxt 4 paths:

```text
app/pages/app/index.vue
app/pages/app/dashboard.vue
app/pages/app/map.vue
app/pages/app/buildings.vue
app/pages/app/pois.vue
app/pages/app/geofences.vue
app/pages/app/paths.vue
app/pages/app/realtime.vue
app/pages/app/analytics.vue
app/pages/app/alarms.vue
app/pages/app/users.vue
app/pages/app/organization.vue
app/pages/app/settings.vue
```

Rules:

- [ ] Every `/app/**` page uses the authenticated app layout and auth middleware, e.g. `definePageMeta({ layout: 'app', middleware: 'auth' })` or an equally explicit Nuxt-native equivalent.
- [ ] `/app` and `/app/dashboard` receive full content in this plan.
- [ ] Other routes receive only intentional lightweight placeholders for their later plan; do not implement future feature phases early.
- [ ] `/app/map` is the one exception to a blank placeholder: mount the **existing real `SitumViewer` unchanged** in a minimal temporary composition so the working viewer remains reachable between Plans 005 and 006.
- [ ] Update the real login continuation created by Plan 004 from `/dashboard` to `/app` only after `/app` exists in this phase.
- [ ] Logged-in `/login` continuation should also move to `/app` at the same time.
- [ ] Keep legacy `/dashboard` as a small compatibility redirect to `/app/map` during this migration, or remove it only if all internal references are proven migrated and the real viewer remains reachable. Do not leave the old Plan 003 dashboard UI as a second product surface.
- [ ] Update internal links/CTAs that still point at the legacy dashboard.

Acceptance: there is no moment at phase completion where login points at a missing route, and the real Situm Viewer remains reachable.

## Phase 3 — Authenticated Home `/app`

Before implementation, inspect the Home composition in the current HTML.

Implementation rules:

- [ ] welcome identity uses the real session;
- [ ] map CTA routes to `/app/map`;
- [ ] metric cards use typed local dummy values;
- [ ] main-building preview is a restrained local visual, not a second Situm Viewer instance;
- [ ] recent activity uses typed dummy data;
- [ ] Quick Explore routes to actual `/app/**` destinations;
- [ ] keep dummy fixtures under `app/data/prototype/` according to `ARCHITECTURE.md`.

### Fixture ownership rule

Do not create multiple copies of the same synthetic building/POI records across search, map, and later cartography pages.

If Home/global search needs building or POI records before Plan 007, create the minimal typed records in a canonical prototype fixture file under `app/data/prototype/` and have Plans 006–007 extend/reuse those records rather than recreating them.

Compare desktop/mobile Home against the HTML before completion.

## Phase 4 — Dashboard `/app/dashboard`

Before implementation, inspect the Dashboard composition in the current HTML.

Real existing sources:

- [ ] session identity where needed;
- [ ] database/application state from `/api/me`;
- [ ] Situm configuration state only when it can be represented truthfully from existing integration state.

Do not claim the viewer is `Ready` on Dashboard merely because `/api/situm/status` says configuration exists. Real viewer readiness remains `MAP_IS_READY` on the map route.

Dummy product values may include:

- visitors;
- device count;
- average stay;
- viewer sessions;
- chart series;
- occupancy;
- alarm summary.

Rules:

- [ ] Match the reference hierarchy/density with Nuxt UI.
- [ ] Keep dummy data obvious in source but production-like in the rendered UI.
- [ ] Do not add backend endpoints or database tables for metrics.
- [ ] Avoid a chart dependency solely for these prototype charts; simple CSS/SVG is enough.
- [ ] Compare the Dashboard with the current HTML before completion.

## Phase 5 — Global search shell

Before implementation, inspect the current reference search trigger/modal/keyboard behavior.

- [ ] Add the approved search/command trigger.
- [ ] Search only local known app destinations and canonical typed prototype fixture records.
- [ ] Implement `Cmd/Ctrl + K` and Escape when straightforward.
- [ ] Navigation uses Nuxt routing.
- [ ] No backend/global indexing.
- [ ] Do not duplicate building/POI fixture objects created for other screens.

## Phase 6 — Validation and documentation

- [ ] existing login success/failure works;
- [ ] login now enters `/app`;
- [ ] all `/app/**` routes are protected;
- [ ] unauthenticated `/app/**` routes go to `/login`;
- [ ] logout works;
- [ ] `/api/me` still reaches the existing database behavior;
- [ ] the real Situm Viewer remains reachable at `/app/map` and preserves `MAP_IS_READY` / error behavior;
- [ ] legacy `/dashboard` does not render a competing old UI;
- [ ] shell/Home/Dashboard/search compare against their HTML reference areas;
- [ ] update `README.md` if route/setup wording still describes the old dashboard as the primary map surface;
- [ ] document deliberate deviations;
- [ ] `git diff --check`;
- [ ] `npm run lint`;
- [ ] `npm run typecheck`;
- [ ] `npm run build`;
- [ ] update plan + `.agents/`, commit, and push each completed phase;
- [ ] no PR until explicit authorization.

## Non-goals

- real Situm cartography discovery/product API integration;
- new Situm SDK feature wiring beyond preserving the existing viewer;
- realtime API integration;
- reports API integration;
- registration backend;
- new DB tables.
