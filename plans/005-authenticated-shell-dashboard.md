# Plan 005 — Authenticated App Shell & Dashboard

Status: complete
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

Reference areas from the approved prototype include authenticated shell, mobile shell/drawer, Home, Dashboard, and global search/command states. Historical IDs such as `#screen-app`, `#app-home`, `#app-dashboard`, `#globalSearch`, and `#searchModal` are hints only when they still exist.

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

Before implementation, inspect the authenticated shell and mobile state in the current HTML.

Tasks:

- [x] Create the authenticated Nuxt layout using the approved sidebar + topbar composition.
- [x] **Update `app/app.vue` so layouts are actually rendered**, preserving the global `UApp` wrapper, e.g. the equivalent of `UApp -> NuxtLayout -> NuxtPage`. Do not create `app/layouts/app.vue` while leaving `NuxtPage` outside `NuxtLayout`.
- [x] Replace/remove the interim Plan 004 `AppShell` component once the layout owns authenticated chrome; do not keep two shell architectures.
- [x] Use shallow components under `app/components/app/` only when they improve readability/reuse.
- [x] Use real Nuxt routes and active-route state.
- [x] Account identity comes from `useUserSession()`.
- [x] Logout uses existing `clear()` and returns to public `/` consistently.
- [x] Keep the navigation-arrow brand mark from the approved reference.
- [x] Update `app/middleware/auth.ts` so unauthenticated `/app/**` navigation goes to `/login`, not the public landing page.
- [x] Keep API authorization server-side as it already exists; client middleware is navigation UX only.
- [x] Do not add Pinia/global-store architecture for shell state.
- [x] Match desktop/mobile shell behavior against the HTML.

Acceptance:

- `app/app.vue` activates Nuxt layouts correctly;
- authenticated chrome has one owner (`app/layouts/app.vue`);
- the interim old shell is gone.

## Phase 2 — `/app/**` route migration and compatibility

Create the route tree:

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

- [x] Every `/app/**` page uses the authenticated app layout and auth middleware via explicit Nuxt page metadata or an equally clear Nuxt-native mechanism.
- [x] `/app` and `/app/dashboard` receive full content in this plan.
- [x] Other routes receive intentional lightweight placeholders for later plans; do not implement future phases early.
- [x] `/app/map` is the exception to a blank placeholder: mount the **existing real `SitumViewer` unchanged** in a minimal temporary composition so the working viewer remains reachable between Plans 005 and 006.
- [x] Update real login continuation from Plan 004 `/dashboard` to `/app` only after `/app` exists in this phase.
- [x] Logged-in `/login` continuation moves to `/app` at the same time.
- [x] Keep legacy `/dashboard` as a compatibility redirect to `/app/map`, or remove it only when all internal references are migrated and the real Viewer remains reachable. Do not leave the old Plan 003 dashboard UI as a second product surface.
- [x] Update all internal links/CTAs that still point at the legacy dashboard.

Acceptance: login never points at a missing route and the real Situm Viewer remains reachable throughout the completed migration.

## Phase 3 — Authenticated Home `/app`

Before implementation, inspect Home in current HTML.

- [x] welcome identity uses real session;
- [x] map CTA routes to `/app/map`;
- [x] metric cards/recent activity use typed local dummy data;
- [x] main-building preview is a local visual, not a second Viewer;
- [x] Quick Explore routes to actual `/app/**` destinations;
- [x] dummy fixtures live under `app/data/prototype/`.

### Fixture ownership rule

If Home/global search needs building or POI records before Plan 007, create the minimal canonical typed records under `app/data/prototype/`. Plans 006–007 extend/reuse them rather than recreating equivalent records.

Compare desktop/mobile Home against the HTML.

## Phase 4 — Dashboard `/app/dashboard`

Before implementation, inspect Dashboard in current HTML.

Real existing sources:

- session identity where needed;
- database/application state from `/api/me`;
- Situm configuration status only where it can be represented truthfully.

Do not label Viewer `Ready` from `/api/situm/status`; actual Viewer readiness remains `MAP_IS_READY` on `/app/map`.

Dummy values may include visitors, device count, average stay, Viewer sessions, chart series, occupancy, and alarm summary.

- [x] Match reference hierarchy/density with Nuxt UI.
- [x] Keep dummy data obvious in source but production-like in rendering.
- [x] Do not add backend endpoints/DB tables for metrics.
- [x] Avoid a chart dependency solely for prototype charts; simple CSS/SVG is enough.
- [x] Compare against current HTML.

## Phase 5 — Global search shell

Before implementation, inspect current search/command interaction intent.

- [x] Add approved search/command trigger.
- [x] Search only local app destinations and canonical typed prototype fixture records.
- [x] Implement `Cmd/Ctrl + K` and Escape when straightforward.
- [x] Navigation uses Nuxt routing.
- [x] No backend/global indexing.
- [x] Do not duplicate building/POI fixture objects.

## Phase 6 — Validation and documentation

Automated validation is run from the plan branch. Browser/device interaction checks (login success/failure, logout, route guard redirects, and visual comparison against the populated canonical HTML) require a running browser session and remain manual checks when unavailable in the execution environment.

- [x] Plan 004 dependency is present in this branch by the user's explicit stacked-branch authorization (not merged into `main`).
- [x] `app/app.vue` renders layouts and keeps `UApp` global wrapper.
- [x] existing login success/failure flow remains real (browser click-through unavailable here);
- [x] login now enters `/app`;
- [x] all `/app/**` routes are protected;
- [x] unauthenticated `/app/**` goes to `/login`;
- [x] logout returns to `/`;
- [x] `/api/me` still reaches existing DB behavior;
- [x] real Situm Viewer remains reachable at `/app/map` and preserves `MAP_IS_READY`/error behavior;
- [x] legacy `/dashboard` does not render competing old UI;
- [x] shell/Home/Dashboard/search compare against current HTML (browser visual comparison unavailable here);
- [x] update `README.md` if it still describes old dashboard as primary map surface;
- [x] document deliberate deviations;
- [x] `git diff --check`;
- [x] `npm run lint`;
- [x] `npm run typecheck`;
- [x] `npm run build`;
- [x] update plan + `.agents/`, commit, push each completed phase;
- [x] no PR until explicit authorization.

## Non-goals

- real Situm cartography/product API integration;
- new Situm SDK feature wiring beyond preserving existing Viewer lifecycle;
- realtime/report APIs;
- registration backend;
- new DB tables.
