# Nuxt Implementation Guide — Approved Situm Explore UI

This document explains how to translate the user-approved interactive HTML reference into the existing Nuxt application without turning UI work into a backend rewrite.

## Authority

The exact visual/interaction source of truth is:

`design/reference/situm-explore-interactive-prototype.html`

`design/ui-reference.html` is only a lightweight repository convenience/summary if it remains present. When the two differ, the exact approved interactive prototype wins.

Read root `DESIGN.md` first.

## Current production baseline

The production app already has working foundations that must be reused:

- Nuxt 4 + Vue + Nuxt UI;
- `nuxt-auth-utils` session flow;
- real owner login through `server/api/auth/login.post.ts`;
- route protection through `middleware/auth.ts`;
- real session identity/logout through `useUserSession()` / `clear()`;
- `/api/me` for authenticated application/PostgreSQL status;
- Drizzle and the fixed `situm_explore` PostgreSQL schema;
- `/api/situm/status` for Situm configuration presence;
- `@situm/sdk-js` through the existing `SitumViewer.vue`;
- truthful viewer readiness through `ViewerEventType.MAP_IS_READY`;
- viewer runtime/init error handling.

Do not replace these with dummy logic simply because the HTML prototype uses dummy JavaScript.

## Production route direction

The approved product reference maps naturally to:

```text
/
/login
/register
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

Authenticated `/app/**` routes use the existing real auth middleware/session boundary.

## Public landing

Translate the reference into a real Nuxt page:

- sticky light public navigation;
- navigation-arrow brand mark;
- Product / Operations / Analytics / About anchors;
- hero with restrained product-preview window;
- compact capability and feature sections;
- map-first operations section;
- analytics summary;
- dark final CTA;
- minimal footer.

Landing data is static. No backend endpoint is needed.

## Login

Login is **real**.

Keep:

```ts
await $fetch('/api/auth/login', {
  method: 'POST',
  body: { email, password }
})
```

and the existing `useUserSession()` model.

The reference only changes composition/presentation:

- dark contextual left panel on desktop;
- focused form panel on the right;
- form-only/simplified composition on mobile;
- visible labels/autocomplete;
- real error and loading states;
- successful login enters the authenticated app.

Do not create a second auth flow.

## Register

Registration is **dummy POC UI** because no application registration backend exists.

It may:

1. validate required fields locally;
2. display a local demo-complete message;
3. direct the user to the real login page.

It must not:

- create a database user;
- add a Drizzle model/migration;
- create a Nitro registration endpoint;
- call `setUserSession` to fake a durable account;
- imply that a real account was created.

## Authenticated application shell

The approved reference now contains enough planned destinations to justify the sidebar that Plan 003 intentionally did not have.

Recommended production composition:

```text
layouts/app.vue               # or evolved concrete AppShell
components/brand/AppBrand.vue
components/app/AppSidebar.vue
components/app/AppTopbar.vue
components/app/AppPageHeader.vue
components/app/StatusPill.vue
```

Do not follow this tree mechanically; create a component only when it improves reuse/readability.

### Desktop

- roughly 220–230px compact light sidebar;
- grouped navigation;
- restrained neutral active state;
- compact top bar;
- account/session block at sidebar bottom;
- main content canvas with per-page width rules.

### Mobile

- sidebar becomes a drawer/sheet;
- top bar exposes a labelled menu action;
- Escape/backdrop close when practical;
- no horizontal document overflow.

Identity and logout remain real session behavior.

## Brand mark

Use the approved local navigation-arrow SVG in a dark rounded square.

Do not restore the old `S` lettermark.

Do not install a logo/icon package solely for the mark.

## Styling translation

The approved reference is centered roughly on:

- cool near-white page background (`#f6f7f9` target);
- white surfaces;
- primary text near `#16181c`;
- secondary text near `#515862`;
- muted metadata near `#8b939e`;
- subtle borders near `#e6e8ec`;
- near-black primary/active UI near `#111827`;
- small blue/green/amber/red semantic accents;
- approximately 8–16px radii;
- border-first surfaces and very restrained shadows.

Use Nuxt UI semantic tokens where possible, plus a small centralized set of project CSS custom properties/utilities when necessary for fidelity.

Do not scatter raw hex values through every Vue file. Do not accept a visibly different result merely because it is a Nuxt UI default.

## Existing data that must remain real

### Session/authentication

Source:

- `/api/auth/login`;
- `useUserSession()`;
- `middleware/auth.ts`;
- `clear()`.

### Application/PostgreSQL status

Source:

- `/api/me`.

Use this for real DB/application connectivity where the reference shows system status. Do not create another health endpoint for UI convenience.

### Situm configuration status

Source:

- `/api/situm/status`.

This means configuration presence/status only. It must not be relabelled as actual map viewer readiness.

### Situm map

Source:

- existing `SitumViewer.vue` / `@situm/sdk-js`.

Rules:

- keep the real Viewer mounted in the approved workspace;
- preserve `MAP_IS_READY` as the ready transition;
- preserve `APP_ERROR`/init error handling;
- do not replace the real map with the HTML prototype's CSS floor geometry;
- surrounding route/POI/layer controls may remain dummy until a later integration is explicitly approved.

## Dummy product data

For domains that do not have app backend support yet, prefer typed client-side fixtures.

Suggested shape:

```text
app/data/prototype/
  dashboard.ts
  buildings.ts
  pois.ts
  geofences.ts
  realtime.ts
  reports.ts
  alarms.ts
  organization.ts
```

An equivalent simple Nuxt-local location is fine.

Rules:

- keep fixtures typed;
- use synthetic/generic values;
- do not restore removed private floorplans/building metadata;
- no PostgreSQL persistence;
- no Nitro route solely to serve dummy JSON;
- no service/repository architecture just for fixtures;
- local search/filter/sort/tabs/drawers/toasts are fine;
- write-looking actions remain disabled/local-only/demo unless a later plan explicitly wires them;
- never silently mix dummy numbers into a section presented as real Situm/API data.

## Dashboard translation

Use the approved dashboard hierarchy:

- page heading/actions;
- four compact metric cards;
- visitor trend visual;
- system-status panel;
- occupancy summary;
- alarm summary.

Source mapping:

- session identity: real;
- `/api/me`: real system status;
- Situm configuration: real if used, but configuration-only;
- business metrics/chart/occupancy/alarms: dummy in the UI roadmap.

No analytics/realtime/alarms backend should be invented in order to populate this page.

## Map workspace translation

The exact reference defines composition, not fake production map content.

Production should have:

- left `Explore / Route / Layers` workspace panel;
- large real Situm Viewer canvas;
- compact top controls;
- contextual POI/detail treatment;
- stable loading/error/ready layout;
- responsive stack/reflow on smaller screens.

Default data mode around the real iframe:

- POI list/search: dummy;
- route form/result: dummy;
- geofence/trajectory/realtime toggles: local presentation state;
- favorites: local;
- viewer tools/settings: local unless a current documented Viewer method is deliberately wired in the owning plan.

Do not expand SDK/REST integration opportunistically just because the reference contains a control.

## Cartography / operations / organization pages

During UI-first plans:

- Buildings/Floors: dummy typed fixtures;
- POIs/categories: dummy typed fixtures;
- Geofences: dummy;
- Paths/routing: dummy;
- Realtime: dummy local simulation;
- Reports/analytics: dummy charts/tables;
- Alarms: dummy read-only rows;
- Users/groups: dummy directory; real app session identity remains separate;
- Organization: generic POC context;
- Viewer settings/styles/images: local UI state.

These concepts correspond to real Situm domains, but they are intentionally not integrated into the Nuxt backend until a later explicitly approved integration plan.

## Interaction rules

- Use Nuxt routes, not one giant client-side show/hide page.
- Prefer local component/composable state before a global store.
- Do not add Pinia unless actual cross-route state justifies it.
- Search/filters on dummy datasets stay client-side.
- Lightweight CSS/SVG charts are preferred to adding a chart dependency for dummy metrics.
- Clean up intervals/timeouts in dummy realtime views.
- Respect reduced-motion preferences.

## Accessibility

Production translation should improve semantics relative to prototype HTML:

- real links are `NuxtLink`/Nuxt-aware UI links;
- real buttons are buttons;
- icon-only actions have accessible names/tooltips;
- forms have visible labels;
- focus remains visible;
- mobile sidebar is dismissible;
- status is not communicated by color alone;
- tables handle small-screen overflow;
- loading/error/status announcements remain truthful.

## Definition of visual fidelity

A screen is not complete just because it uses similar colors.

Compare against the exact approved prototype for:

- overall composition;
- sidebar/topbar geometry and density;
- page width and whitespace rhythm;
- typography scale/weight;
- card/table/panel structure;
- input/button heights;
- borders/radii/shadows;
- status pills;
- map prominence;
- drawers/modals/tabs;
- desktop/mobile behavior;
- interaction feedback.

Any material deviation should have a concrete framework/accessibility/product reason. "Nuxt UI default" is not sufficient justification.
