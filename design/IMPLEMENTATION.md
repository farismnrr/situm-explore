# Situm Explore UI Implementation Map

This document translates the approved visual prototype in `design/ui-reference.html` into the current Nuxt application.

The HTML prototype is the visual source of truth. It is not production code to copy verbatim.

## Core rule

Match the prototype's:

- page hierarchy;
- spacing rhythm;
- typography scale;
- light neutral palette;
- navigation-arrow product mark;
- border/radius treatment;
- compact status pills;
- sidebar density;
- map-first workspace layout;
- responsive behavior;
- information hierarchy.

Translate those decisions into Vue/Nuxt UI components and semantic tokens. Do not paste the prototype's CSS wholesale into Vue files.

## Existing production behavior that must be reused

### Authentication

Already exists:

- `nuxt-auth-utils` session handling;
- `/api/auth/login`;
- `useUserSession()`;
- auth middleware;
- logout through `clear()`.

Implementation:

- landing page may link to `/login`;
- `/login` must use the existing login endpoint;
- do not replace the existing auth backend;
- registration is visual-only/dummy until a real account model exists;
- `/register` may render the approved registration UI but its submit action should clearly enter a prototype/dummy path or show a non-destructive POC acknowledgement; do not create users or database tables in the UI plans.

### Application / database status

Already exists:

- `/api/me`;
- PostgreSQL through Drizzle;
- fixed `situm_explore` schema.

Implementation:

- real authenticated identity comes from `useUserSession()`;
- real database/application health on dashboard comes from `/api/me`;
- do not invent a second health endpoint for UI convenience.

### Situm Viewer

Already exists:

- `@situm/sdk-js`;
- `SitumViewer.vue`;
- `ViewerEventType.MAP_IS_READY` readiness handling;
- viewer runtime error handling;
- public read-only viewer API key boundary;
- building configuration.

Implementation:

- preserve the current SDK initialization and truthful readiness behavior;
- production map area must use the real Situm viewer, not the HTML mock floorplan;
- the approved prototype defines the surrounding shell, side tools, spacing, loading treatment, and navigation hierarchy;
- do not regress `MAP_IS_READY` semantics.

## Surfaces and data mode

| Surface | First implementation data mode | Notes |
| --- | --- | --- |
| Landing | static | Production page, no backend needed. |
| Login | real | Existing `/api/auth/login`. |
| Register | dummy | No user-registration backend yet. |
| Authenticated Home | mixed | Real session/status; counters/activity may be dummy. |
| Dashboard | mixed | Real DB/viewer status; metrics/charts dummy. |
| Map Viewer | real + dummy shell | Real Situm SDK viewer; surrounding POI/route/layer controls may be dummy unless directly supported by existing viewer code. |
| Buildings & Floors | dummy first | Do not add server Situm discovery scope yet. |
| POIs | dummy first | UI should be shaped for later API replacement. |
| Geofences | dummy first | Same. |
| Paths & Routing | dummy first | Viewer-native directions may be wired later in the map plan if low-risk; otherwise dummy. |
| Realtime | dummy first | Do not add polling/backend proxy yet. |
| Analytics & Reports | dummy first | No report backend in current Nuxt foundation. |
| Alarms | dummy first | Read-only UI only. |
| Users & Groups | dummy first | Do not confuse Situm organization users with app authentication accounts. |
| Organization | dummy/read-only context | Show permission boundary; never expose real key value. |
| Viewer Settings | local UI state | No persistence required in first pass. |

## Production route target

Preferred routes:

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

Use a Nuxt layout for authenticated application chrome rather than duplicating sidebar/topbar on each page.

Recommended shape:

```text
layouts/
  app.vue
components/
  brand/AppBrand.vue
  app/AppSidebar.vue
  app/AppTopbar.vue
  app/AppPageHeader.vue
  app/StatusPill.vue
  map/SitumWorkspace.vue
  map/SitumViewer.vue
  prototype/...
pages/
  index.vue
  login.vue
  register.vue
  app/index.vue
  app/dashboard.vue
  app/map.vue
  app/buildings.vue
  app/pois.vue
  app/geofences.vue
  app/paths.vue
  app/realtime.vue
  app/analytics.vue
  app/alarms.vue
  app/users.vue
  app/organization.vue
  app/settings.vue
```

Do not create abstractions merely to match this tree. Keep components concrete and split them only when reuse/readability is real.

## Dummy data policy

Dummy data is allowed and preferred for surfaces whose backend does not already exist.

Rules:

1. Store dummy records in typed local fixtures/composables, not inline across many templates.
2. Use realistic but clearly synthetic values.
3. Never persist real Situm IDs, private floorplan data, credentials, or sensitive organization metadata as dummy content.
4. Give fixtures shapes that can later map cleanly to real API responses, but do not prematurely build repository/service layers.
5. UI must not imply a destructive action succeeded against Situm. Write-like actions should say/demo that they are local prototype actions.
6. Keep current POC credential boundary `Only Read`.

Suggested location:

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

If Nuxt auto-import conventions make another local location simpler, use it consistently.

## Visual translation rules

### Brand

Use the approved navigation-arrow mark, not the letter `S`.

Do not add a logo package for one icon. Use a small local SVG/component or an existing icon from the current icon stack if it visually matches the reference.

### Color

Light mode only.

Use Nuxt UI semantic tokens for normal UI. Reference values are visual targets, not a requirement to hardcode every hex:

- page background: cool near-white;
- surfaces: white;
- borders: subtle neutral gray;
- primary actions / active navigation: near-black;
- blue only for spatial/action emphasis;
- green/amber/red only for status meaning.

### Typography

Keep system/Inter-like sans stack already available. Do not add a font dependency unless explicitly requested.

Hierarchy:

- marketing hero: large and tight;
- authenticated page title: roughly 30px desktop;
- panel title: compact 13–14px;
- body/control text: 12–14px;
- metadata: 10–12px.

### Surfaces

- border first;
- shadows subtle;
- radius around 10–16px;
- avoid floating-everything card design;
- map/viewer gets the most visual area.

### Sidebar

The approved prototype supersedes the Plan 003 "no sidebar" decision.

Sidebar is now justified because the approved product reference includes multiple real/dummy product destinations.

Desktop:

- narrow fixed sidebar around 220–230px;
- grouped navigation;
- active item uses restrained neutral fill;
- account information at bottom.

Mobile:

- sidebar becomes drawer/sheet;
- topbar exposes menu control;
- no horizontal page overflow.

## Interaction rules

- landing CTA -> login/register;
- login success -> authenticated app;
- register remains dummy/non-persistent;
- sidebar navigation must use real Nuxt routes, not JS show/hide;
- global search may remain local/dummy at first;
- dummy filters should work client-side;
- drawer/detail interactions may remain local;
- charts may be lightweight CSS/SVG or an existing dependency; do not add a chart framework solely for dummy charts;
- map controls should only call the real SDK when the current SDK API and lifecycle are understood; otherwise visually match the reference with explicitly dummy behavior.

## Quality gates for every UI plan

- `git diff --check`
- `npm run lint`
- `npm run typecheck`
- `npm run build`
- no secrets committed;
- visual comparison against `design/ui-reference.html`;
- mobile and desktop manual check when browser runtime is available;
- preserve real auth/database/Situm behavior touched by the plan.

## Avoid

- redesigning the approved reference while implementing it;
- copying prototype CSS wholesale into one giant stylesheet;
- replacing Nuxt UI with another component library;
- adding Pinia/global state unless a concrete plan needs it;
- adding backend endpoints just so dummy pages feel more real;
- introducing account registration/database models in UI work;
- turning read-only POC actions into Situm write requests;
- hiding real loading/error states behind fake success UI.
