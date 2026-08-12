# Situm Explore UI Implementation Contract

This document explains how to translate the single canonical UI/UX reference into the Nuxt application.

## Canonical reference

There is exactly one HTML visual/interaction reference:

`design/reference/situm-explore-interactive-prototype.html`

The user owns that file and may replace it manually.

### Placeholder guard

If the file still contains only placeholder content such as `Hello World`, do **not** start visual UI implementation.

Do not reconstruct the intended design from:

- Plan 003 output;
- conversation memory;
- generic SaaS patterns;
- old deleted design docs;
- agent taste.

Plan 004 Phase 0 architecture/setup work is the only UI-roadmap phase allowed before the canonical HTML is populated.

## What the HTML means

The HTML/CSS/JS prototype is a **visual and interaction specification only**.

Use it to understand:

- hierarchy and composition;
- proportions and spacing;
- typography/surface hierarchy;
- component density;
- navigation structure;
- responsive behavior;
- interaction states;
- map prominence.

It is **not production architecture**.

Do not copy its HTML structure, stylesheet architecture, or JavaScript state/screen-switching model into production.

Selector/ID names mentioned by plans are locator hints from the approved prototype. If the user-populated HTML changes those selectors, locate the corresponding current screen by meaning/function; do not reconstruct missing markup from plan text.

## Production stack is authoritative

Production remains:

- Nuxt 4;
- Vue;
- Nuxt UI;
- existing Nuxt UI semantic/theme configuration;
- Nuxt routing/layout/middleware conventions;
- existing auth, PostgreSQL/Drizzle, and Situm Viewer integration;
- architecture boundaries from root `ARCHITECTURE.md`.

### Nuxt UI-first translation order

For every reference element:

1. Use an existing Nuxt UI primitive when it matches the semantic job.
2. Configure it with props, variants, slots, semantic tokens, app config, and normal utility classes.
3. Compose a small number of Nuxt UI primitives for a complex pattern.
4. Create a small Vue component when it improves real reuse/readability.
5. Add narrow centralized custom CSS only when Nuxt UI/Tailwind cannot express an approved visual detail cleanly.

Examples:

| Prototype intent | Production direction |
| --- | --- |
| primary/secondary buttons | `UButton` variants |
| labelled inputs | `UForm`, `UFormField`, `UInput`, relevant Nuxt UI controls |
| status pills | `UBadge` or a tiny semantic product wrapper only when useful |
| errors/status callouts | `UAlert` |
| modal behavior | Nuxt UI modal/dialog primitive |
| drawer/mobile navigation | Nuxt UI drawer/slideover primitive when suitable |
| loading placeholders | Nuxt UI skeleton/loading primitives |
| navigation | `NuxtLink` / Nuxt routing |
| prototype JS state | Vue `ref`, `computed`, props/events/composables as needed |

### Forbidden translation shortcuts

Do not:

- paste the prototype stylesheet into production;
- recreate `.btn`, `.card`, `.pill`, `.input`, etc. as a parallel design system;
- copy prototype JavaScript screen switching instead of Nuxt routing/Vue state;
- use raw controls when an appropriate Nuxt UI primitive exists;
- scatter prototype hex/pixel values throughout page files;
- install another component framework;
- accept an unrelated visual result merely because it uses default Nuxt UI styling.

Target: **a Nuxt UI implementation that visually and behaviorally matches the populated reference without copying its implementation technique**.

## Existing real foundation that must remain real

### Authentication

Already exists:

- `nuxt-auth-utils` session handling;
- `/api/auth/login`;
- `useUserSession()`;
- auth middleware;
- logout through `clear()`.

Rules:

- login uses the existing real login flow;
- never copy the prototype's dummy `anything works` login behavior;
- registration remains local/dummy until separately approved;
- do not add auth tables/endpoints during UI implementation.

### PostgreSQL/application status

Already exists:

- `/api/me`;
- PostgreSQL through Drizzle;
- fixed `situm_explore` schema.

Reuse this behavior. Do not invent a second health endpoint for presentation convenience.

### Situm Viewer

Already exists:

- `/api/situm/status` for configuration presence/status;
- `@situm/sdk-js`;
- real `SitumViewer` component;
- `ViewerEventType.MAP_IS_READY` readiness handling;
- viewer runtime/init error handling;
- one `NUXT_PUBLIC_SITUM_API_KEY` POC credential plus building ID configuration.

The POC key may temporarily have Read & Write permission for speed. That **does not broaden Plans 004–009**.

Rules during UI plans:

- production map area uses the existing real Situm Viewer, never the prototype CSS/mock floorplan as a replacement;
- `MAP_IS_READY` remains the truthful viewer-ready transition;
- `/api/situm/status` is configuration status, not viewer readiness;
- **do not add new POI/routing/realtime/geofence/settings/camera/other Situm feature calls during Plans 004–009**;
- all new surrounding product controls remain typed dummy/local UI until later integration plans.

## Route mapping

Preferred production routes once Plan 005 is integrated:

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

Important transition:

- Plan 004 still uses legacy `/dashboard` after login because `/app` does not exist yet.
- Plan 005 atomically creates `/app/**`, updates login continuation to `/app`, keeps the real viewer reachable at `/app/map`, and removes/redirects the legacy dashboard UI.

Use a real authenticated Nuxt layout, not prototype-style JavaScript screen switching.

## Data mode during Plans 004–009

Detailed source rules live in `design/data-source-matrix.md`.

| Surface | UI-roadmap mode |
| --- | --- |
| Landing | static |
| Login/logout/session | real existing auth |
| Register | dummy/local |
| Home | real session + dummy product data |
| Dashboard | real foundation status + dummy product metrics |
| Situm Map Viewer | real existing viewer lifecycle |
| New map Explore/Route/Layers tools | dummy/local around real viewer |
| Buildings/Floors | dummy/local |
| POIs | dummy/local |
| Geofences | dummy/local |
| Paths/Routing | dummy/local |
| Realtime | dummy/local |
| Analytics/Reports | dummy/local |
| Alarms | dummy/local |
| Users/Groups | dummy/local |
| Organization | dummy/static context |
| Viewer Settings | dummy/local |

Missing domains must not trigger backend/API expansion merely to complete the approved UI.

## Dummy data policy

1. Keep fixtures typed and centralized under `app/data/prototype/` after the Nuxt 4 migration.
2. Use synthetic IDs/names/values.
3. Never persist real credentials, private floor resources, or sensitive organization metadata as fixtures.
4. One logical dummy resource should have one canonical fixture record. Global search, Map UI, and Cartography UI should reuse it rather than copy it.
5. Keep fixture shapes straightforward to replace later; do not build speculative repositories/services around them.
6. Local filters/search/tabs/drawers/toggles/toasts/route previews/report states/simulated movement are fine.
7. Dummy actions must never claim a remote Situm mutation succeeded.
8. Broader Read & Write key permission is irrelevant to UI scope: Plans 004–009 stay dummy-first for missing domains.

## POC credential wording

Current environment contract:

```text
NUXT_PUBLIC_SITUM_API_KEY
NUXT_PUBLIC_SITUM_BUILDING_ID
```

The single key may temporarily have Read & Write permission for the time-boxed POC and should be revoked/replaced later.

If a reference screen contains stale `Only Read` copy, preserve the approved composition but use truthful current wording such as `Read & Write (POC)` or neutral `POC key configured` when that status is shown.

Never render/log the key value.

## Styling rules

- Light mode only.
- Prefer Nuxt UI semantic tokens over raw colors.
- Border-first/restrained surfaces.
- Use typography/spacing for hierarchy before decoration.
- Keep density and navigation treatment aligned to the populated reference.
- Give the real viewer the space indicated by the reference.
- Custom CSS must be narrow and justified by a real fidelity gap.

## Required UI implementation workflow

For every visual phase:

1. Verify canonical HTML is populated.
2. Open the exact current reference area.
3. Identify visual/interaction intent, not code to copy.
4. Inspect existing Nuxt/foundation behavior.
5. Map reference intent to Nuxt UI + Vue composition.
6. Implement with `ARCHITECTURE.md` boundaries.
7. Keep missing domains dummy/local.
8. Compare against the same HTML area.
9. Document deliberate accessibility/framework/SDK deviations.
10. Run plan validation gates.

## Quality gates

For code-changing UI phases:

- `git diff --check`;
- `npm run lint`;
- `npm run typecheck`;
- `npm run build`;
- no secrets committed;
- existing real auth/database/viewer behavior remains intact;
- no new Situm product-domain feature integration during Plans 004–009;
- desktop/mobile comparison against the populated HTML when browser validation is available.

## Keep architecture boring

Do not add during UI plans:

- another UI framework;
- Pinia/global state without concrete need;
- generic service/repository layers;
- backend endpoints just to serve dummy UI;
- registration/account infrastructure;
- new Situm feature/API integrations just because the POC key has broad permission.

Later integration plans own backend/Situm capability work after the UI is complete and accepted.
