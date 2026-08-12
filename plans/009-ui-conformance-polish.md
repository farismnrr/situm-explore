# Plan 009 — UI Conformance, Responsive & Polish

Status: planned
Branch: `plan/009-ui-conformance-polish`
Depends on: Plan 008 complete, reviewed, and integrated into `main` (therefore Plans 004–007 are already integrated too)

## Goal

Perform a dedicated screen-by-screen visual, responsive, interaction, accessibility, architecture, and existing-integration conformance pass after every UI surface from Plans 004–008 exists. This plan must not redesign the product or add backend/Situm product-domain integrations.

## Mandatory HTML-first conformance protocol

Canonical visual/interaction reference:

`design/reference/situm-explore-interactive-prototype.html`

Before changing a screen:

1. Open the current canonical HTML.
2. Locate the corresponding screen semantically.
3. Inspect desktop/mobile behavior and relevant interaction states.
4. Open the corresponding Nuxt route.
5. Compare hierarchy, spacing, density, interactions, and responsive behavior.
6. Change Nuxt to match unless accessibility/framework/SDK reality requires a documented deviation.
7. Re-check the same reference area.

Old selector names listed below are **locator hints for the approved prototype**, not independent design sources. If the user-populated HTML changed IDs/classes, locate the corresponding screen by content/function. Never reconstruct a missing screen from the plan text alone.

## Authority

For visual decisions:

1. user's latest explicit direction;
2. populated canonical HTML;
3. `DESIGN.md`;
4. this active plan;
5. `design/IMPLEMENTATION.md`.

For code/folder/dependency decisions, `ARCHITECTURE.md` remains authoritative.

## Required reading

- `AGENTS.md`
- `ARCHITECTURE.md`
- `DESIGN.md`
- `design/IMPLEMENTATION.md`
- `design/data-source-matrix.md`
- `design/reference/situm-explore-interactive-prototype.html`
- completed Plans 004–008 implementation/state
- this plan

## Screen mapping checklist

Use the corresponding current HTML surface for:

- `/` — landing (historically `#screen-landing`)
- `/login` — login auth state
- `/register` — register auth state
- `/app` — Home
- `/app/dashboard` — Dashboard
- `/app/map` — Map workspace
- `/app/buildings` — Buildings/Floors
- `/app/pois` — POIs
- `/app/geofences` — Geofences
- `/app/paths` — Paths/Routing
- `/app/realtime` — Realtime
- `/app/analytics` — Analytics/Reports
- `/app/alarms` — Alarms
- `/app/users` — Users/Groups
- `/app/organization` — Organization
- `/app/settings` — Viewer Settings
- shared detail drawer
- global search/command modal
- viewer-settings modal/overlay when represented

## Phase 1 — Page-by-page visual audit

For every surface above compare:

- [ ] width/padding;
- [ ] sidebar/topbar density where applicable;
- [ ] navigation-arrow mark;
- [ ] heading/body/metadata hierarchy;
- [ ] spacing rhythm;
- [ ] borders/radii/shadows;
- [ ] status badges/pills;
- [ ] neutral surface hierarchy;
- [ ] button/action hierarchy;
- [ ] map prominence;
- [ ] tables/toolbars/filters;
- [ ] drawers/modals;
- [ ] dummy charts/heatmaps;
- [ ] truthful loading/empty/error states added by production behavior.

Record explicit signoff for:

- [x] Landing
- [x] Login
- [x] Register
- [x] Home
- [x] Dashboard
- [x] Map
- [x] Buildings
- [x] POIs
- [x] Geofences
- [x] Paths
- [x] Realtime
- [x] Analytics including every represented report state
- [x] Alarms
- [x] Users
- [x] Organization
- [x] Settings including every represented settings state
- [x] shared drawer/search/modal states

Do not complete the phase with one generic `looks close` statement.

## Phase 2 — Responsive behavior

Read the actual current HTML media-query/responsive behavior first.

Validate at minimum:

- [x] desktop >= 1200px;
- [x] laptop around 1024px;
- [x] tablet around 768px;
- [x] mobile around 390px;
- [x] landing/nav/hero reflow;
- [x] auth mobile composition;
- [x] app sidebar -> mobile drawer behavior;
- [x] tables scroll safely;
- [x] map workspace remains usable;
- [x] settings navigation responds appropriately;
- [x] forms remain comfortable;
- [x] no horizontal document overflow.

Small deviations are allowed only for real usability/accessibility reasons and must be documented.

## Phase 3 — Interaction consistency

Inspect the corresponding HTML interaction intent before each review.

- [x] route links use Nuxt routing;
- [x] auth remains real while matching approved visual states;
- [x] global search open/filter/navigate/close works locally;
- [x] drawers/modals close clearly and Escape works when supported by Nuxt UI primitives;
- [x] dummy filters/search work;
- [x] map Explore/Route/Layers states remain local/dummy except the pre-existing real viewer lifecycle;
- [x] analytics tabs work locally;
- [x] settings tabs/switch/reset work locally;
- [x] no dead controls unless intentionally disabled in the reference;
- [x] no dummy action claims a remote Situm mutation.

Do not add new Situm REST/SDK feature integration as part of polishing.

## Phase 4 — Accessibility

Visual fidelity does not override accessibility.

- [ ] keyboard navigation;
- [ ] visible focus;
- [ ] form labels;
- [ ] accessible icon-button names/tooltips;
- [ ] status not color-only;
- [ ] adequate light-mode contrast;
- [ ] sensible landmarks/headings;
- [ ] modal/drawer focus handling via Nuxt UI where appropriate;
- [ ] reduced-motion-friendly behavior.

Document accessibility-driven differences from HTML.

## Phase 5 — Real foundation regression check

Production behavior that existed before the UI roadmap must remain real:

- [ ] login success/failure;
- [ ] `/app/**` auth middleware;
- [ ] unauthenticated app routes go to `/login`;
- [ ] logout;
- [ ] `/api/me` real DB behavior;
- [ ] real Situm Viewer initialization;
- [ ] `MAP_IS_READY` readiness;
- [ ] viewer missing-config/error behavior;
- [ ] no secrets committed.

The broader Read & Write POC key does not authorize adding new remote features in Plan 009.

## Phase 6 — Architecture/DRY cleanup

- [ ] verify Nuxt 4 `app/`, root `server/`, and optional `shared/` runtime boundaries;
- [ ] remove obsolete Plan 003 shell/styles/routes when no longer needed;
- [ ] ensure there is one authenticated layout owner;
- [ ] remove duplicated synthetic building/POI/user records; canonical fixtures stay under `app/data/prototype/`;
- [ ] remove duplicated visual code only where a real semantic component/pattern exists;
- [ ] do not create generic components/services/repositories/stores for polish;
- [ ] pages remain route composition rather than large feature dumps;
- [ ] Nuxt UI primitives remain the production design foundation.

## Phase 7 — Documentation and final gates

- [ ] README setup/routes/Situm viewer location match the resulting application;
- [ ] architecture/design/data-source docs do not describe superseded paths or permission wording;
- [ ] active `.agents/state.md` reflects UI completion and the next post-UI integration boundary;
- [ ] `git diff --check`;
- [ ] `npm run lint`;
- [ ] `npm run typecheck`;
- [ ] `npm run build`;
- [ ] manual visual walkthrough against every current reference surface;
- [ ] list intentional deviations/reasons in this plan;
- [ ] update `.agents/` and this plan;
- [ ] commit/push each completed phase;
- [ ] no PR until user authorization.

## Completion boundary

Plan 009 is complete only when the user can review the **entire UI roadmap as one coherent product**.

Do not start Plan 010 or any later Situm backend/integration work until:

1. Plan 009 is integrated into `main`; and
2. the user explicitly says the UI is accepted enough to proceed.
