# Plan 009B — Nuxt UI Foundation Fidelity & Reusability

Status: **planned-ready**
Branch: `plan/009b-ui-final-fidelity-punch-list`
Depends on: Plan 009A closed cumulative UI baseline
Blocks: Plan 010 and every later backend/Situm integration plan until this plan is complete and the final rendered UI baseline is explicitly accepted by the user

## Goal

Make the **Nuxt UI foundation itself** match the canonical Situm Explore prototype as closely as practical before doing more page-by-page visual fixes.

The main problem to solve is systemic: buttons, colors, cards, controls, pills, typography, spacing and repeated UI patterns currently drift from the prototype, so every page inherits the wrong visual language.

This plan therefore fixes the UI system first.

Primary outcomes:

1. canonical prototype tokens are translated into one coherent Nuxt UI theme;
2. repeated UI composition is implemented through reusable product components instead of page-local copies;
3. repeated reactive/client behavior is implemented through small reusable composables/utilities instead of copy-pasted logic;
4. all current pages migrate to the same shared UI foundation;
5. future UI work must reuse the shared foundation before adding one-off styling or duplicated logic;
6. real auth, DB and Situm Viewer behavior remain unchanged.

This is **not** a backend/Situm integration plan and is **not** a generic redesign.

---

# Authority

Read before implementation:

1. `AGENTS.md`
2. `.agents/README.md`
3. `.agents/state.md`
4. `.agents/protocols/git-workflow.md`
5. `ARCHITECTURE.md`
6. `DESIGN.md`
7. `design/IMPLEMENTATION.md`
8. `design/data-source-matrix.md`
9. `design/reference/situm-explore-interactive-prototype.html`
10. this plan

Visual authority:

1. user's latest explicit direction;
2. canonical interactive prototype;
3. `DESIGN.md`;
4. this plan;
5. `design/IMPLEMENTATION.md`.

Production remains Nuxt 4 + Vue + Nuxt UI.

The prototype HTML/CSS/JS is a visual and interaction specification only. Do not paste its stylesheet or screen-switching JavaScript into production.

---

# Core implementation rule — reuse first

For every UI or client-logic change:

1. search the existing Nuxt UI theme, components, composables and utilities first;
2. reuse an existing shared implementation when the semantic responsibility is the same;
3. if the same product pattern/behavior is repeated across multiple surfaces and no shared implementation exists, extract the smallest reusable component/composable/utility;
4. migrate existing duplicate usages to that shared implementation when they should change together;
5. keep route-only behavior local when it is genuinely unique.

Do **not** solve reusability by building a generic framework.

### Primitive rule

Prefer Nuxt UI theming/configuration for low-level primitives:

- `UButton`
- `UCard`
- `UInput`
- `USelect`
- `UTextarea`
- `UBadge`
- `USwitch`
- `UTabs`
- `UModal`
- `USlideover`
- `UPopover`
- toast/overlay primitives

Do not automatically create cosmetic `BaseButton`, `BaseCard`, `BaseInput`, etc.

A Vue wrapper is justified only when it represents a **real Situm Explore product semantic** or shared behavior that Nuxt UI configuration alone cannot express cleanly.

### Product-component rule

Repeated product patterns should have one owner when useful, for example:

- page header/title/actions;
- stat/metric card;
- status pill with product semantics;
- panel header/body framing;
- toolbar/filter composition;
- compact detail list;
- details drawer composition;
- search trigger/results composition;
- transient feedback/toast presentation;
- repeated activity/list rows when they truly share behavior and geometry.

Names and exact component boundaries must follow existing code and `ARCHITECTURE.md`; do not create components only to wrap three CSS classes.

### Shared-logic rule

Repeated client behavior should have one small implementation when appropriate, for example:

- transient feedback timing/ownership;
- true tablist keyboard navigation;
- repeated filtering/search behavior when semantics are actually the same;
- shared selection/open-close coordination when more than one component needs it.

Prefer composables for reactive/lifecycle coordination and utilities for pure logic.

No god composable, global event bus, Pinia, generic component factory or speculative abstraction.

---

# Canonical foundation baseline

The canonical prototype currently defines the following visual language. Use the HTML itself as final authority when exact values differ.

## Color semantics

Canonical intent:

```text
background        #f6f7f9
surface           #ffffff
surface-subtle    #fafbfc
surface-hover     #f4f5f7
text              #16181c
text-muted        #515862
border            #e6e8ec
border-strong     #d8dce2
ink               #111827
ink-hover         #202939
accent            #2563eb
accent-soft       #eff6ff
success           canonical muted green family
warning           canonical muted amber family
danger            canonical muted red family
```

Important semantic distinction:

- **ink/dark is the normal primary product action**;
- **blue is an accent**, selected state, link/highlight, or explicitly accented action;
- do not make the whole application look blue merely because Nuxt UI calls a theme color `primary`.

Accessibility may require a slightly darker subtle-text value than the prototype for small normal text. Such a deviation is allowed only when necessary and should preserve approximately the same visual hierarchy.

## Geometry

Canonical reusable geometry includes approximately:

```text
radius-xs         7px
radius-sm         9px
radius-md         12px
radius-lg         16px
radius-xl         22px

button            40px high / 13px text / 10px radius
button-sm         34px high / 12px text / 9px radius
icon-button       36x36 / 9px radius
input/select      42px high / 10px radius
pill              28px high / 11px text
switch            36x20
main card         16px radius / 1px border / very subtle shadow
soft card         12px radius / subtle surface / border
page title        ~30px / line-height 1.08 / tight tracking
```

The goal is not approximate default-Nuxt styling. Rendered primitive geometry should be visibly equivalent to the prototype.

---

# Known systemic mismatch entering 009B

At plan creation, the current Nuxt configuration maps:

```text
Nuxt UI primary color -> blue
plain UButton -> primary + solid + small
```

while the prototype distinguishes:

```text
primary product action -> dark ink
accent action/state     -> blue
normal button           -> ~40px
small button            -> ~34px
```

This mismatch alone causes visual drift across many routes.

Other systemic areas that require exact audit include:

- card radius/shadow hierarchy;
- control heights/radius;
- pills/status colors;
- switch geometry;
- icon-button geometry;
- typography weights/tracking;
- panel/table density;
- modal/popover/slideover surfaces;
- toast geometry;
- inconsistent route-local Tailwind classes overriding shared intent.

---

# Phase 0 — Inventory every reusable primitive and duplicate pattern

No broad restyling before this inventory is complete.

## Phase 0 inventory and ownership matrix

Observed branch/worktree: `plan/009b-ui-final-fidelity-punch-list`; the working tree already contained unrelated changes in `.agents/sessions/2026-08-12.md`, `.env.example`, `nuxt.config.ts`, `package-lock.json`, and `package.json`. Those files are preserved. The canonical prototype reusable CSS section is the block beginning at `/* ---- reusable ---- */` in `design/reference/situm-explore-interactive-prototype.html`; it defines the shared brand/container/type helpers, card and soft-card surfaces, button sizes and variants, icon buttons, pills/status colors, form controls, switch, keyboard hint, divider, and toast geometry.

### Primitive usage inventory

| Current primitive/feedback surface | Observed usage | Current owners/routes | Phase 0 classification and intended owner |
| --- | ---: | --- | --- |
| `UButton` | 51 | `app/layouts/app.vue`, public/auth pages, every `/app/**` route, map and cartography drawer | Nuxt UI global theme/variant; preserve explicit product semantics for dark ink primary, neutral secondary/ghost/soft, blue accent, and compact icon actions. |
| `UCard` | 37 | landing, dashboard/home, settings, organization, map, cartography tables, alarms, realtime, analytics, Situm viewer | Nuxt UI global theme/variant; repeated panel framing is a separate product composition. |
| `UInput` | 12 | login/register, shell search, POI/building filters, map search, settings | Nuxt UI global theme/variant; filter/search composition is a reusable product component only where geometry and behavior match. |
| `USelect` | 14 | map, paths, POIs, analytics, settings | Nuxt UI global theme/variant; route-specific option state remains local. |
| `UTextarea` | 0 | none | Nuxt UI global theme/variant, available for future form use; no wrapper candidate observed. |
| `UBadge` | 38 | shell status, landing, dashboard, cartography tables/drawers, map, paths, realtime, settings/users | Nuxt UI global theme/variant. The separate repeated status-semantics candidate is classified as a reusable product component below. |
| `USwitch` | 6 | map layers/settings and viewer settings | Nuxt UI global theme/variant; setting-row composition remains a product component candidate only if migrated across settings surfaces. |
| `UTabs` | 0 | none; settings, analytics, and map currently use native buttons with `role=tab` | Nuxt UI global theme/variant; reusable composable candidate for equivalent keyboard behavior, with route-specific tab labels local. |
| `UModal` | 2 | shell global search and map viewer settings | Nuxt UI global theme/variant; modal contents remain local to their distinct responsibilities. |
| `USlideover` | 1 | `CartographyDetailsDrawer.vue` | Nuxt UI global theme/variant. `CartographyDetailsDrawer` is separately classified as a reusable product component below. |
| `UPopover` | 0 | none; map POI detail is an inline `UCard` and shell search is `UModal` | Nuxt UI global theme/variant; intentionally no product wrapper or migration candidate in Phase 0. |
| Toast/feedback timing | 48 feedback/status references; no Nuxt toast composable | `useExploreFeedback.ts`, route-local status refs and timers | Reusable composable: `useExploreFeedback` owns shared transient timing/ownership; map viewer-tool status remains intentionally local. |
| Toast/feedback presentation | Existing `TransientFeedback.vue`, route-local success/error/status markup | `TransientFeedback.vue`, register/settings/analytics/realtime and map feedback markup | Reusable product component for shared transient presentation; map inline viewer status remains intentionally local because it is viewer-tool context. |

### Repeated product markup inventory

| Repeated pattern | Current occurrences | Classification and owner |
| --- | --- | --- |
| Authenticated page header/title/description/actions | Nearly every `/app/**` route, with route-specific actions | Reusable product component: shared page header/title/action framing; route content and actions stay slot/prop data. |
| Metric/stat cards | landing analytics, home, dashboard, realtime, geofences | Reusable product component: stat/metric card; numeric values and notes remain fixture/page data. |
| Status pills and status dots | shell, dashboard, map, cartography tables, realtime, users, settings, landing | Reusable product component for product status semantics; Nuxt UI badge theme owns primitive geometry/colors. |
| Panel heads and panel body/foot framing | dashboard, home, map-side panels, analytics and table surfaces | Reusable product component: panel framing/header; unique chart/table bodies remain local. |
| Search/filter toolbars | buildings, POIs, geofences, analytics, map-side controls | Reusable product component where search/filter alignment and controls match; route-specific filters remain local. |
| Compact detail lists | cartography drawer, map POI card, building floor inventory, organization/settings rows | Intentionally local where field semantics/layout differ; `CartographyDetailsDrawer` owns its repeated detail-list responsibility. |
| Details drawers | buildings, POIs, geofences via `CartographyDetailsDrawer` | Reusable product component: existing `CartographyDetailsDrawer`; reconcile only its shared geometry/content slots later. |
| Activity/alarm/list rows | dashboard alarm summary, realtime positions, alarms, users/mobile/table rows | Intentionally local until behavior and geometry are proven identical; no speculative universal row. |
| Table shells and mobile list fallbacks | buildings, POIs, geofences, alarms, users, paths | Reusable product component only for shared table framing/tooling; row schemas remain route-local. |
| Search trigger/results | shell top bar plus modal | Reusable product component: shell search trigger/results composition; global search data remains local fixture/API coordination. |
| Settings rows/sections | settings page and map viewer settings modal | Intentionally local in Phase 0 because the modal and settings page have different disclosure/ownership behavior. |

### Repeated client logic/composables/utilities inventory

| Logic pattern | Current owner(s) | Classification and intended owner |
| --- | --- | --- |
| Transient message state and timeout behavior | `useExploreFeedback.ts`, `TransientFeedback.vue`, map-local `showViewerToolStatus` | Reusable composable for shared transient timing; reusable product component for shared rendering; map inline viewer status intentionally local. |
| Search/filter computed lists | buildings, POIs, geofences, map and shell search | Reusable pure utility only for deterministic predicate/filter helpers when data shape matches; route query state remains local. |
| Drawer selected-item/open-close coordination | buildings, POIs, geofences | Reusable product component coordination through existing `CartographyDetailsDrawer`; page selection state remains local. |
| Settings/analytics/map tab keyboard navigation | settings and analytics custom tab handlers; map native tab buttons | Reusable composable for equivalent tablist keyboard behavior, after semantics are reconciled; no global state. |
| Favorite toggles | POIs and map | Intentionally local because fixture shapes and viewer context differ; extract only a pure set-toggle utility if exact duplication remains after migration. |
| Repeated refresh/interval lifecycle | realtime `setInterval`; other routes expose manual refresh/status actions | Intentionally local until a second equivalent lifecycle exists; do not create a generic polling composable in Phase 0. |
| Building/floor/POI lookup and display mapping | map, buildings, POIs, geofences, dashboard | Reusable pure utility for deterministic lookup/label mapping where shared fixture contracts match; current route-specific computed values remain local. |

### Page-local theme conflicts observed

The audit identified route-local classes/variants that should be reconciled during later phases, not changed here: `color="primary"` is used for map directions, selected floor/mode, occupancy bars and POI/map selection even though the canonical primary action is dark ink and blue is accent; `shadow-lg`, `rounded-lg`, `rounded-xl`, and per-card `:ui` body padding overrides vary across cards/drawers; custom `.landing-*`, `.welcome-card`, `.map-feedback`, `.trend-*`, `.analytics-tab`, `.map-side-tab`, `.map-mode`, `.floor-btn`, `.setting-row`, and related page CSS duplicate canonical button/card/pill/control geometry; raw `bg-primary/10 text-primary`, `bg-success`, and route-local hex/semantic color combinations bypass shared status ownership. These are migration targets, not Phase 0 restyling work.

No candidate is classified as a generic base primitive, Pinia store, event bus, component factory, or speculative abstraction.

- [x] Confirm execution branch is `plan/009b-ui-final-fidelity-punch-list` created from the latest cumulative 009A branch HEAD; do not start from stale `main`.
- [x] Confirm working tree is safe and do not discard unrelated local changes.
- [x] Read the reusable CSS section of the canonical prototype in full.
- [x] Inventory every current usage of `UButton`, `UCard`, `UInput`, `USelect`, `UTextarea`, `UBadge`, `USwitch`, `UTabs`, `UModal`, `USlideover`, `UPopover` and current toast/feedback UI.
- [x] Inventory repeated product markup across routes: headers, stats, status pills, toolbars, panel heads, detail lists, drawers, activity rows and similar patterns.
- [x] Inventory repeated client logic/composables/utilities.
- [x] Identify page-local classes/variants that fight the intended global theme.
- [x] Produce a component ownership matrix inside this plan before implementation.
- [x] For every candidate abstraction classify it as exactly one of:
  - Nuxt UI global theme/variant;
  - reusable product component;
  - reusable composable;
  - reusable pure utility;
  - intentionally local because it is unique.
- [x] Do not create abstractions whose only justification is hypothetical future reuse.
- [x] `git diff --check` for plan/state changes.
- [ ] commit and push Phase 0.

Acceptance: every repeated primitive/pattern has a clear owner before visual migration begins.

---

# Phase 1 — Lock canonical tokens and Nuxt UI primitive theme

Primary ownership:

- `app/app.config.ts`
- `app/assets/css/main.css`

Small additional theme/config files are allowed only if Nuxt conventions make them clearly better.

## Tokens

- [ ] Define/normalize canonical background, surface, text, border, ink, accent, semantic status, radius and shadow tokens.
- [ ] Explicitly distinguish dark `ink` primary actions from blue `accent` actions.
- [ ] Remove conflicting or unused token aliases when safe.
- [ ] Preserve accessible text contrast and visible focus.
- [ ] Avoid arbitrary one-off hex colors in route files when an existing product token owns the meaning.

## Buttons

- [ ] Normal product-primary action renders as canonical dark ink, not default blue.
- [ ] Primary hover matches canonical ink-hover.
- [ ] Secondary action matches white surface + canonical border.
- [ ] Ghost action matches transparent/muted canonical behavior.
- [ ] Accent action remains explicit blue and is not the default for every important action.
- [ ] Normal size matches ~40px/13px/radius-10 geometry.
- [ ] Small size matches ~34px/12px/radius-9 geometry.
- [ ] Icon-only buttons match canonical ~36x36/radius-9 geometry.
- [ ] Loading/disabled/focus/active states remain accessible and visually coherent.
- [ ] Prefer Nuxt UI theme variants; introduce a product-semantic wrapper only if configuration cannot express the recurring semantic roles cleanly.

## Cards

- [ ] Main card matches canonical white surface, 1px border, 16px radius and restrained shadow.
- [ ] Soft-card treatment has one shared implementation equivalent to subtle surface + border + 12px radius.
- [ ] Avoid large/default library shadows not represented by the prototype.
- [ ] Card header/body/footer spacing is normalized where the prototype has a repeated pattern.

## Form controls

- [ ] Input/select height ~42px, radius ~10px, canonical border/text/placeholder.
- [ ] Textarea uses the same control family.
- [ ] Focus state matches canonical dark-neutral focus treatment while remaining clearly accessible.
- [ ] Label/helper/error typography is consistent.
- [ ] No route should independently reinvent the same control dimensions.

## Pills/badges/status

- [ ] Base pill matches ~28px height, 11px type and full radius.
- [ ] Neutral/dark/blue/green/amber/red semantic treatments match prototype color language.
- [ ] Repeated product status semantics use one shared mapping.

## Switches, tabs and other controls

- [ ] Switch geometry matches ~36x20 and canonical ink-on state.
- [ ] Segmented/pill tabs use shared canonical styling where the same visual pattern is repeated.
- [ ] True tab semantics and keyboard behavior remain correct.
- [ ] Search trigger, keyboard hint and icon controls use canonical compact geometry where repeated.

## Overlays

- [ ] Modal, popover, slideover/drawer and toast base surfaces use canonical radius/border/shadow/density.
- [ ] Preserve Nuxt UI focus trapping, Escape handling and accessibility.

Validation:

- [ ] inspect actual rendered primitives, not just source values, when browser tooling is available;
- [ ] `git diff --check`;
- [ ] `npm run lint`;
- [ ] `npm run typecheck`;
- [ ] commit and push Phase 1.

---

# Phase 2 — Create/reconcile reusable product UI components

Goal: repeated Situm Explore composition has one semantic owner.

Do not blindly create every example below. Use the Phase 0 ownership matrix and extract only patterns that are genuinely repeated or materially improve route readability.

Candidate responsibilities include:

```text
AppPageHeader
AppStatCard
AppStatusPill
AppPanelHeader / panel framing
AppToolbar
AppDetailList
AppActivityRow/List
AppSearchTrigger
shared details drawer composition
shared transient feedback/toast composition
```

Rules:

- [ ] Reuse Nuxt UI primitives internally instead of reimplementing buttons/cards/inputs from scratch.
- [ ] Components expose small semantic props, not dozens of generic style switches.
- [ ] A repeated product component owns its internal canonical spacing/type hierarchy so pages cannot subtly diverge.
- [ ] Do not create generic `Base*` wrappers with no product meaning.
- [ ] Do not hide significant business/application state inside presentational components.
- [ ] Preserve accessibility labels/roles/focus behavior.
- [ ] Remove superseded duplicate components only after all callers are migrated.
- [ ] Keep product grouping shallow and consistent with `ARCHITECTURE.md`.
- [ ] `git diff --check`.
- [ ] `npm run lint`.
- [ ] `npm run typecheck`.
- [ ] commit and push Phase 2.

Acceptance: repeated product UI no longer depends on route authors remembering the same long Tailwind/class recipe.

---

# Phase 3 — Consolidate reusable UI/client logic

Goal: repeated behavior has one small implementation, without creating a global framework.

## Required review

- [ ] Re-audit `useExploreFeedback()` and keep one timer/owner model so an older caller cannot clear a newer toast.
- [ ] Re-audit tablist keyboard behavior across Analytics, Settings, Map and any other true tab interfaces.
- [ ] Extract one reusable tab keyboard helper/composable only if the same behavior is currently duplicated.
- [ ] Audit repeated text filtering/search logic; share only where behavior and lifecycle are genuinely equivalent.
- [ ] Audit repeated selection/open-close state shared between multiple components; use a focused composable only where component coordination requires it.
- [ ] Keep unique page behavior local.
- [ ] Prefer pure utilities for deterministic transformation/filtering that does not require Vue reactivity.
- [ ] Do not create `useUiStore`, god composables, Pinia, event bus or generic state machine.
- [ ] Ensure extracted logic has a small public API and one responsibility.
- [ ] `git diff --check`.
- [ ] `npm run lint`.
- [ ] `npm run typecheck`.
- [ ] commit and push Phase 3.

---

# Phase 4 — Migrate the entire current UI to the shared foundation

This phase is mandatory. A shared component/theme that only some pages use does not solve the fidelity problem.

For every current public/authenticated route:

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

- [ ] Replace route-local button styling that duplicates or contradicts the canonical shared button system.
- [ ] Replace route-local card/surface styling with the shared card/soft-card foundation when semantics match.
- [ ] Replace duplicated page headers/stats/status/toolbars/detail lists with the reusable product components identified in Phase 0/2.
- [ ] Replace repeated logic with Phase 3 shared logic where semantics match.
- [ ] Remove stale one-off classes/variants after migration.
- [ ] Do not flatten genuinely unique components into a giant configurable abstraction.
- [ ] Preserve page data, interactions and real runtime behavior.
- [ ] Do not add backend/Situm product-domain integration.
- [ ] Search the codebase again after migration and document intentional remaining exceptions.
- [ ] `git diff --check`.
- [ ] `npm run lint`.
- [ ] `npm run typecheck`.
- [ ] `npm run build`.
- [ ] commit and push Phase 4.

Acceptance: the same semantic UI role renders from the same component/theme/logic owner throughout the product.

---

# Phase 5 — Primitive-by-primitive 1:1 rendered conformance

Do this **before** another broad page-layout recovery plan.

Compare rendered Nuxt primitives/patterns directly with representative instances in the canonical prototype.

Required comparison matrix:

- [ ] normal primary button;
- [ ] secondary button;
- [ ] ghost button;
- [ ] blue accent button;
- [ ] small button;
- [ ] icon button;
- [ ] main card;
- [ ] soft card;
- [ ] input;
- [ ] select;
- [ ] textarea if currently used;
- [ ] checkbox/radio if currently used;
- [ ] switch;
- [ ] neutral/status pills in all used semantic colors;
- [ ] page title + eyebrow + descriptive text hierarchy;
- [ ] panel heading/body;
- [ ] compact table header/body;
- [ ] toolbar/filter controls;
- [ ] segmented/pill tabs;
- [ ] search trigger + `kbd` hint;
- [ ] modal;
- [ ] popover;
- [ ] details drawer/slideover base surface;
- [ ] toast/transient feedback.

For each item explicitly assess:

```text
color
height/width
padding/gap
font size/weight/line-height
border
radius
shadow
hover
focus
active/selected
loading/disabled where applicable
mobile behavior where applicable
```

Rules:

- [ ] do not mark a primitive conformant because the CSS numbers look similar;
- [ ] use browser/rendered comparison when tooling is available;
- [ ] if browser tooling is unavailable, leave rendered signoff pending for user manual review;
- [ ] accessibility-required deviations must be documented and visually restrained.

Validation:

- [ ] `git diff --check`;
- [ ] `npm run lint`;
- [ ] `npm run typecheck`;
- [ ] `npm run build`;
- [ ] commit and push Phase 5.

---

# Phase 6 — Reuse enforcement audit

Perform a final source audit specifically for future maintainability.

- [ ] Search all route/components for repeated semantic button/card/pill/header/stat/toolbar/detail-list recipes that should use the shared foundation.
- [ ] Search for repeated interactive logic that should use an existing composable/utility.
- [ ] Search for arbitrary local hex colors/radii/shadows that duplicate canonical tokens.
- [ ] Search for direct route-local overrides that fight `app.config.ts` or global semantic tokens.
- [ ] Remove dead styles/components/composables left by migration.
- [ ] Keep intentional exceptions documented in this plan.
- [ ] Pages remain route composition focused; do not move everything into abstract configuration objects merely to reduce line count.
- [ ] No app code imports server source.
- [ ] No new backend endpoints/database/Situm integration.
- [ ] `git diff --check`.
- [ ] `npm run lint`.
- [ ] `npm run typecheck`.
- [ ] `npm run build`.
- [ ] update `.agents/state.md` and session trace.
- [ ] commit and push Phase 6.

---

# Phase 7 — User acceptance of the component foundation

This plan is foundation-focused. It does not claim every page layout is pixel-perfect simply because primitives are fixed.

Before closing:

- [ ] user reviews representative rendered surfaces containing all major primitives;
- [ ] user confirms button/color/card/control foundation now matches the intended prototype language;
- [ ] user confirms reusable UI/component strategy is acceptable;
- [ ] any foundation-level issue found during review is fixed in 009B, not deferred to a page-specific plan;
- [ ] remaining issues that are genuinely page/layout-specific are recorded separately for the next UI fidelity scope rather than weakening the shared foundation;
- [ ] branch pushed;
- [ ] no PR created unless explicitly authorized.

Plan 009B may be marked complete when the shared UI foundation itself is accepted, even if a later page-specific punch list is still needed.

**Plan 010 remains blocked until the user explicitly accepts the final rendered UI baseline overall.**

---

# Runtime preservation

009B must not replace or weaken existing real behavior.

Keep real:

- `/api/auth/login`;
- `useUserSession()` / auth middleware / logout;
- `/api/me` and PostgreSQL/Drizzle;
- `/api/situm/status` configuration semantics;
- real Situm Viewer initialization;
- `MAP_IS_READY` / `APP_ERROR` / missing-config behavior.

Keep local/dummy until later plans:

- registration;
- product metrics/activity;
- cartography domain data;
- route previews and new viewer tools;
- realtime product data;
- analytics/reports;
- alarms/users/groups/organization;
- viewer settings beyond the existing real Viewer lifecycle.

No new backend endpoints, migrations, Situm product-domain reads/writes or credential changes in this plan.

---

# Completion boundary

Plan 009B is complete only when:

1. Nuxt UI primitive semantics and geometry are aligned with the canonical prototype;
2. dark ink primary vs blue accent semantics are correctly represented throughout the app;
3. repeated product UI patterns have shared owners where justified;
4. repeated client logic has shared owners where justified;
5. all current routes have migrated away from conflicting duplicate foundation styling/logic;
6. primitive-level rendered comparison has been completed or explicitly left for user manual review when tooling is unavailable;
7. lint/typecheck/build and diff checks pass;
8. real auth/DB/Situm foundation behavior is not intentionally changed;
9. the user accepts the shared UI foundation;
10. no PR is created without explicit authorization.

Page-specific fidelity work discovered after this foundation is accepted may be handled in a later UI punch-list scope. Plan 010 still waits for explicit final rendered UI acceptance.
