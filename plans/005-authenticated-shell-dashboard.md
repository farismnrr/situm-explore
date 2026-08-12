# Plan 005 — Authenticated App Shell & Dashboard

Status: planned
Branch: `plan/005-authenticated-shell-dashboard`
Depends on: Plan 004

## Goal

Implement the approved authenticated application chrome and dashboard while reusing real session/database state and keeping non-existent product metrics dummy.

## Mandatory HTML-first implementation protocol

Canonical visual/interaction reference:

`design/reference/situm-explore-interactive-prototype.html`

**Read the canonical HTML before editing the authenticated Nuxt shell or dashboard.**

For every phase:

1. Open the canonical HTML reference.
2. Locate the exact prototype sections listed below.
3. Inspect structure, CSS dimensions/density, responsive behavior and JS interaction.
4. Translate the visual behavior into real Nuxt routes/components rather than copying prototype screen-switching JavaScript.
5. Reuse real session/database behavior where it already exists.
6. Use typed dummy data only where the backend does not exist.
7. Compare implementation to the same HTML section before phase completion.

### Prototype sections required for this plan

- Authenticated shell: `#screen-app`, `.sidebar`, `.sidebar-head`, `.sidebar-scroll`, `.nav-group`, `.nav-item`, `.sidebar-foot`, `.app-topbar`, `.app-main`.
- Mobile shell: `.mobile-menu-btn`, `.mobile-backdrop`, sidebar mobile media-query behavior.
- Home: `#app-home`, `.welcome`, `.stat-grid`, main-building preview, recent activity, `.quick-grid`.
- Dashboard: `#app-dashboard`, stat cards, visitor chart, system status, occupancy and alarm summary.
- Global search: `#globalSearch`, `#searchModal`, `#globalSearchInput`, search result interactions and `Cmd/Ctrl + K` behavior.

The prototype's client-side `navigateApp()` is not production architecture. Nuxt must use real routes while matching the visual/interaction result.

## Required reading

- `AGENTS.md`
- `DESIGN.md`
- `design/reference/situm-explore-interactive-prototype.html`
- `design/IMPLEMENTATION.md`
- Plan 004 implementation/state.

## Phase 1 — Authenticated layout

Target layout: `layouts/app.vue` or equivalent concrete Nuxt layout.

**Before implementation, inspect the full authenticated shell in `#screen-app` from `<aside id="sidebar">` through `.app-topbar`.**

Match these reference qualities intentionally:

- sidebar width/density and section grouping;
- navigation-arrow brand treatment;
- quiet neutral active state;
- compact account block at the bottom;
- topbar height and breadcrumb hierarchy;
- search trigger placement;
- restrained status pill;
- mobile sidebar/drawer behavior.

Tasks:

- [ ] Replace Plan 003 topbar-only `AppShell` direction with approved desktop sidebar + topbar.
- [ ] Keep sidebar about 220–230px as shown by the reference unless framework rounding requires a small documented difference.
- [ ] Use grouped navigation and neutral active-state styling matching the HTML.
- [ ] Mobile sidebar becomes drawer/sheet; topbar gets menu action.
- [ ] Use real Nuxt routes, not client-only tab switching.
- [ ] Preserve auth middleware for every `/app/**` route.
- [ ] Account email comes from `useUserSession()`.
- [ ] Logout uses existing `clear()` and returns to `/` or `/login`.
- [ ] Add approved navigation-arrow brand mark.
- [ ] Compare desktop and mobile shell against the HTML before phase completion.

## Phase 2 — Route skeleton

Create route destinations represented by the reference sidebar.

Before adding routes, re-read the `.nav-group` and `.nav-item` ordering in the canonical HTML so route labels/grouping remain identical unless a real Nuxt constraint requires otherwise.

- [ ] `/app`
- [ ] `/app/dashboard`
- [ ] `/app/map`
- [ ] `/app/buildings`
- [ ] `/app/pois`
- [ ] `/app/geofences`
- [ ] `/app/paths`
- [ ] `/app/realtime`
- [ ] `/app/analytics`
- [ ] `/app/alarms`
- [ ] `/app/users`
- [ ] `/app/organization`
- [ ] `/app/settings`

Only Home and Dashboard need full content in this plan. Other routes may contain a small intentional placeholder pointing to their dedicated later plan. Do not build their feature UI early.

## Phase 3 — Authenticated Home

**Before implementation, inspect `#app-home` in the canonical HTML in full.**

Match:

- welcome card proportions and CTA placement;
- four-card metrics density;
- main-building preview size;
- recent-activity hierarchy;
- Quick Explore card grid, icon treatment and routing behavior.

Implementation rules:

- [ ] welcome block uses real session identity;
- [ ] real `Open map` route;
- [ ] four compact metric cards using typed dummy fixture values;
- [ ] main-building preview may be a restrained visual placeholder matching HTML, not duplicated Situm SDK instance;
- [ ] recent activity uses dummy fixture data;
- [ ] quick-explore cards route to actual app pages;
- [ ] keep dummy fixtures centralized and typed;
- [ ] compare completed Home against `#app-home` desktop/mobile output.

## Phase 4 — Dashboard

**Before implementation, inspect `#app-dashboard`, including `.stat-grid`, visitor chart, system-status panel, occupancy panels and alarm summary.**

Real data:

- [ ] session identity from `useUserSession()` where needed;
- [ ] database/application state from existing `/api/me`;
- [ ] Situm configuration/readiness truth remains represented accurately; if real viewer readiness is unavailable outside map route, label it accordingly instead of faking `Ready`.

Dummy data matching the prototype:

- [ ] visitors today;
- [ ] active-device count unless real source already exists;
- [ ] average stay;
- [ ] viewer sessions;
- [ ] chart series;
- [ ] occupancy breakdown;
- [ ] alarm summary.

- [ ] Match card density, simple chart style, status-pill sizing and panel hierarchy from HTML.
- [ ] Make dummy metrics visually production-like but keep source clearly prototype-local in code.
- [ ] Do not add backend endpoints for these metrics.
- [ ] Avoid chart dependency; simple CSS/SVG is enough and should resemble the HTML chart.
- [ ] Compare completed Dashboard against `#app-dashboard` before phase completion.

## Phase 5 — Search shell

**Before implementation, inspect `#globalSearch`, `#searchModal`, `#searchResults` and the canonical JavaScript handling keyboard search/open/close/navigation.**

- [ ] Add visual command/search trigger matching the reference.
- [ ] Implement client-side navigation search only.
- [ ] Search known app destinations and local dummy POIs/buildings.
- [ ] Implement `Cmd/Ctrl + K` when straightforward, matching reference behavior.
- [ ] Escape closes the modal when practical.
- [ ] No backend/global indexing.

## Validation

- [ ] existing auth still protects all `/app/**` pages;
- [ ] login -> `/app` works;
- [ ] logout works;
- [ ] `/api/me` still reaches current DB behavior;
- [ ] mobile sidebar works;
- [ ] shell/Home/Dashboard/search visually compare against their exact HTML sections;
- [ ] deliberate deviations are documented;
- [ ] `git diff --check`;
- [ ] lint/typecheck/build;
- [ ] phase commits + pushes;
- [ ] no PR until explicit authorization.

## Non-goals

- real Situm cartography discovery;
- realtime API integration;
- reports API integration;
- registration backend;
- new DB tables.
