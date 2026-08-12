# Situm Explore UI Implementation Contract

This document explains how to translate the single canonical UI/UX reference into the existing Nuxt application.

## Canonical reference

There is exactly one HTML visual/interaction reference:

`design/reference/situm-explore-interactive-prototype.html`

The user owns the contents of that file and may replace it manually.

### Placeholder guard

If the file still contains only placeholder content such as `Hello World`, do **not** start UI implementation.

Do not reconstruct the intended design from:

- prior Plan 003 output;
- conversation memory;
- generic SaaS patterns;
- Linear/Vercel/Notion/Stripe inspiration;
- old deleted design documents;
- agent preference.

Wait until the canonical HTML has real reference content.

## What the HTML means

The HTML/CSS/JS prototype is a **visual and interaction specification only**.

Use it to understand:

- page hierarchy;
- layout proportions;
- spacing rhythm;
- typography hierarchy;
- color/surface hierarchy;
- component density;
- navigation structure;
- responsive behavior;
- intended interaction states;
- map prominence and surrounding workspace composition.

It is **not** production architecture.

Do not copy its HTML, CSS architecture, or JavaScript state model into the Nuxt app.

## Production stack is authoritative

Production remains:

- Nuxt 4;
- Vue;
- Nuxt UI;
- existing Nuxt UI theme/semantic tokens;
- existing Nuxt routing/layout conventions;
- existing auth, PostgreSQL/Drizzle, and Situm SDK integrations.

### Nuxt UI-first translation order

For every reference element, implement in this order:

1. Use an existing Nuxt UI primitive if one matches the semantic job.
2. Configure it with props, variants, slots, semantic tokens, app config, and existing utility classes.
3. Compose a small number of Nuxt UI primitives for a complex pattern.
4. Create a small Vue component when it improves real reuse/readability.
5. Add small centralized custom CSS only when Nuxt UI/Tailwind cannot express a required visual detail cleanly.

Examples:

| Prototype intent | Production direction |
| --- | --- |
| primary/secondary buttons | `UButton` variants |
| labelled inputs | `UForm`, `UFormField`, `UInput`, relevant Nuxt UI controls |
| status pills | `UBadge` or a very small wrapper around Nuxt UI semantics |
| errors/status callouts | `UAlert` |
| modal behavior | Nuxt UI modal/dialog primitive |
| drawer/mobile navigation | Nuxt UI slideover/drawer primitive when suitable |
| loading placeholders | Nuxt UI skeleton/loading primitives |
| navigation | `NuxtLink` / Nuxt routing |
| prototype JS state | Vue `ref`, `computed`, props/events/composables as needed |

### Forbidden translation shortcuts

Do not:

- paste the prototype stylesheet into production;
- recreate `.btn`, `.card`, `.pill`, `.input`, etc. as a parallel component system;
- copy prototype JavaScript screen switching instead of using Vue/Nuxt routing;
- use raw HTML controls when an appropriate Nuxt UI primitive already exists;
- scatter prototype hex/pixel values throughout page components;
- install another UI/component library;
- accept a visibly unrelated result merely because it uses default Nuxt UI styling.

The target is: **Nuxt UI implementation that visually and behaviorally matches the populated reference**.

## Existing real production behavior that must remain real

### Authentication

Already exists:

- `nuxt-auth-utils` session handling;
- `/api/auth/login`;
- `useUserSession()`;
- auth middleware;
- logout through `clear()`.

Rules:

- `/login` uses the existing real login flow;
- never copy a prototype's dummy `anything works` login behavior;
- registration remains visual/dummy until a real registration model is explicitly approved;
- do not add auth tables/endpoints during UI implementation.

### Application / PostgreSQL status

Already exists:

- `/api/me`;
- PostgreSQL through Drizzle;
- fixed `situm_explore` schema.

Use the existing behavior. Do not invent a second health endpoint for presentation convenience.

### Situm configuration and Viewer

Already exists:

- `/api/situm/status` for configuration presence/status;
- `@situm/sdk-js`;
- `SitumViewer.vue`;
- `ViewerEventType.MAP_IS_READY` readiness handling;
- viewer runtime/init error handling;
- public read-only POC viewer credential boundary.

Rules:

- production map area uses the real Situm Viewer, never the prototype's CSS/mock floor plan;
- `MAP_IS_READY` remains the truthful viewer-ready transition;
- `/api/situm/status` must not be relabelled as viewer readiness;
- missing product-domain data can stay dummy around the real viewer.

## First-pass route mapping

When the populated reference contains these product surfaces, preferred production routes are:

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

Use a real authenticated Nuxt layout for shared app chrome instead of prototype-style JavaScript screen switching.

Do not mechanically create a component for every prototype DOM block. Split components only where Vue reuse/readability warrants it.

## Data mode during Plans 004–009

Detailed source rules live in `design/data-source-matrix.md`.

Summary:

| Surface | First implementation mode |
| --- | --- |
| Landing | static |
| Login/logout/session | real existing auth |
| Register | dummy/local only |
| Authenticated Home | mixed real session + dummy product metrics |
| Dashboard | mixed real system state + dummy product metrics |
| Situm Map Viewer | real viewer + dummy surrounding product controls where needed |
| Buildings/Floors | dummy first |
| POIs | dummy first |
| Geofences | dummy first |
| Paths/Routing | dummy first unless an existing viewer call is safely wired |
| Realtime | dummy first |
| Analytics/Reports | dummy first |
| Alarms | dummy first |
| Users/Groups | dummy first |
| Organization | dummy/read-only context |
| Viewer Settings | local UI state first |

Missing backend domains must not trigger backend expansion merely to make the UI complete.

## Dummy data policy

1. Keep fixtures typed and centralized.
2. Use synthetic IDs/names/values.
3. Never persist real credentials, private floor resources, or sensitive organization metadata as fixtures.
4. Keep fixture shapes straightforward to replace with real reads later, without building speculative service/repository layers.
5. Local interactions such as search, filters, drawers, tabs, toggles, toasts and route previews are fine.
6. Never claim a remote Situm write occurred when the action is local/dummy.
7. Keep the current POC permission boundary read-only.

## Styling rules

- Light mode only.
- Prefer Nuxt UI semantic tokens over raw colors.
- Border-first surfaces; shadows restrained.
- Use typography and spacing for hierarchy before decoration.
- Keep navigation and controls compact where the populated HTML does.
- The real map/viewer should receive the visual space indicated by the reference.
- Custom CSS must be narrow, centralized where practical, and justify a real fidelity gap.

## Required implementation workflow

For every UI phase:

1. Verify the canonical HTML is populated and not the placeholder.
2. Open/read the exact relevant reference section.
3. Identify visual/interaction intent, not code to copy.
4. Inspect the current Nuxt implementation and existing real integration boundaries.
5. Map reference intent to Nuxt UI primitives and Vue composition.
6. Implement using Nuxt conventions.
7. Compare the result against the same HTML reference section.
8. Document any deliberate deviation caused by SDK, accessibility, or framework constraints.
9. Run the plan's validation gates.

## Quality gates

For code-changing UI phases:

- `git diff --check`;
- `npm run lint`;
- `npm run typecheck`;
- `npm run build`;
- no secrets committed;
- real auth/database/Situm behavior touched by the phase remains intact;
- desktop/mobile visual comparison against the populated canonical reference when browser validation is available.

## Keep architecture boring

Do not add:

- another UI framework;
- Pinia/global state without a concrete need;
- generic service/repository layers for future possibilities;
- backend endpoints just to serve dummy UI;
- registration/account infrastructure during UI plans;
- Situm write operations during the read-only POC roadmap.
