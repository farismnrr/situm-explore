# Plan 009A — UI Prototype Fidelity Recovery

Status: planned
Branch: `plan/009a-ui-prototype-fidelity-recovery`
Base: completed cumulative HEAD of `plan/009-ui-conformance-polish`
Depends on: Plans 004–009 implementation already present on the stacked branch chain; manual user review has **rejected current visual fidelity**
Blocks: Plan 010 and every later backend/Situm integration plan

## Why this recovery plan exists

The cumulative Plans 004–009 implementation is functionally useful, and the user has manually verified real login works, but manual UI review found that many screens are not close enough to the canonical prototype.

A repository-wide static audit confirmed that this is **not one isolated styling bug**. The drift is cross-cutting:

1. the canonical HTML contains one stale brand-mark detail that conflicts with the current design contract;
2. global Nuxt UI defaults and shared shell geometry do not consistently reproduce the prototype;
3. multiple routes preserve prototype content but redesign the composition, density, or visual language;
4. several routes add prominent `Local fixture` / `Local demo` alerts, badges, filters, explanatory copy, or alternate diagrams that are not in the reference;
5. Plan 009 marked many visual signoffs complete even though the actual conformance pass was small and later phases were blocked by worker capacity;
6. Plan 009 itself still records Phases 4–7 as incomplete.

This plan is therefore a **visual fidelity recovery**, not a redesign and not a backend plan.

## Authority and hard rules

Read before any implementation:

- `AGENTS.md`
- `.agents/README.md`
- `.agents/state.md`
- `.agents/protocols/git-workflow.md`
- `ARCHITECTURE.md`
- `DESIGN.md`
- `design/IMPLEMENTATION.md`
- `design/data-source-matrix.md`
- `design/reference/situm-explore-interactive-prototype.html`
- `plans/009-ui-conformance-polish.md`
- this plan

Visual authority remains:

1. user's latest explicit direction;
2. canonical HTML reference;
3. `DESIGN.md`;
4. this recovery plan;
5. implementation guide.

The HTML/CSS/JS prototype is **visual and interaction reference only**. Do not copy its stylesheet or JavaScript architecture into production.

Production remains Nuxt 4 + Vue + Nuxt UI.

### Fidelity rule

When the canonical HTML shows a composition, implement that composition unless one of these requires a deliberate deviation:

- real authentication semantics;
- real Situm Viewer SDK lifecycle;
- truthful application state;
- accessibility;
- framework/runtime constraints.

A deliberate deviation must preserve approximately the same visual hierarchy and footprint and must be documented in this plan.

Do **not** add extra user-visible explanatory UI merely because source data is dummy. Dummy/local boundaries should primarily be clear in source code and existing product copy. Do not insert large info alerts, `LOCAL FIXTURE` banners, debug-style labels, or extra status rows unless the canonical prototype contains an equivalent product element or truthfulness genuinely requires it.

The target is **high-fidelity product translation**, not default Nuxt UI styling with similar text.

---

# Audit baseline

## A. Global / systemic drift

### A1 — Brand mark conflict

Current canonical HTML still contains an `S` lettermark in several markup locations, while `DESIGN.md` explicitly requires the approved navigation-arrow product mark, not an `S`.

Current `BrandMark.vue` uses a thin right-arrow stroke icon, which is also not the approved navigation-pointer mark.

Required recovery:

- normalize the canonical HTML's stale brand markup to the current approved navigation-arrow mark **without otherwise redesigning the prototype**;
- update production `BrandMark.vue` to the same approved mark geometry;
- preserve the prototype's 30px/9px dark brand container treatment on normal surfaces and inverse treatment on the auth-art surface.

### A2 — Button default semantics

`app/app.config.ts` globally defaults Nuxt UI buttons to neutral + outline. Many routes use plain `<UButton>` for actions that are visually primary in the prototype.

This can turn intended dark/filled primary actions into outline controls throughout the product.

Required recovery:

- define a consistent mapping between prototype primary / secondary / ghost / accent actions and Nuxt UI variants;
- make plain product-primary actions render as the prototype's dark ink button unless an explicit alternate variant is required;
- preserve blue accent actions only where the reference actually uses the accent treatment;
- avoid page-by-page contradictory button overrides.

### A3 — Repeated geometry drift

Prototype baseline includes approximately:

- public max width: 1240px;
- authenticated sidebar: 228px desktop;
- topbar: 64px;
- authenticated content: max 1480px with 30px/28px/50px desktop content rhythm;
- page title: 30px with tight tracking;
- nav items: compact 36px rows / ~12px text;
- card radius: ~16px;
- panel headings/body/table typography notably denser than normal default dashboard components;
- tables: ~10px headers and ~11px row text;
- stat gaps: ~12px;
- map workspace: 320px left panel and dominant remaining viewer area.

The current implementation often uses `max-w-6xl`, 24px page titles, 14px table text, 16–24px gaps, and default Nuxt UI card/control density.

Required recovery: translate these measurements into Nuxt UI configuration, utilities, and small reusable composition patterns rather than scattered prototype CSS copies.

### A4 — Shell drift

Canonical shell has:

- compact sidebar groups/items;
- avatar + display name + email + overflow affordance;
- separate full-width Sign out action;
- breadcrumb;
- visible search-trigger field with `⌘ K` hint;
- Sync ghost action;
- compact POC status pill.

Current shell differs materially: simplified email-only account footer, icon logout, ghost Search button instead of search field, disabled refresh action, different status badge, different nav density/icon treatment.

Required recovery: reproduce shell composition closely while keeping real session/logout and real Nuxt routes.

---

# Phase 0 — Normalize the reference and establish measurable fidelity gates

This phase changes no product behavior.

- [ ] Open the current canonical HTML and `DESIGN.md` together.
- [ ] Replace only the stale `S` brand mark instances in the canonical HTML with the approved navigation-arrow mark required by `DESIGN.md`.
- [ ] Do not otherwise change prototype layout/content to make implementation easier.
- [ ] Update `BrandMark.vue` to the exact same navigation-arrow geometry.
- [ ] Create a route-to-reference audit checklist in this plan for every route below.
- [ ] Establish visual review viewports: desktop around 1440×900, laptop around 1024px wide, tablet around 768px, mobile around 390px.
- [ ] If browser/screenshot tooling is available in the execution environment, rendered comparison is mandatory before any visual signoff.
- [ ] If rendered comparison tooling is unavailable, **do not falsely mark final visual signoff complete**; source-level work may proceed, but final visual acceptance remains blocked for user/manual review.

Acceptance:

- canonical reference and design contract no longer disagree about the brand mark;
- there is one explicit visual target per route/state.

---

# Phase 1 — Global Nuxt UI visual foundation

Goal: fix the systemic primitives before touching every page.

Inspect prototype reusable CSS/visual intent first, especially brand, card, buttons, pills, inputs, page titles, panel heads, tables, toolbars, modals, and responsive breakpoints.

Tasks:

- [ ] Audit `app/app.config.ts` button/input/card defaults against prototype semantics.
- [ ] Fix primary button default behavior so product-primary actions use the dark ink treatment represented by the prototype.
- [ ] Define secondary/ghost/accent usage consistently through Nuxt UI props/variants.
- [ ] Align input/select height, border, radius, text size and focus treatment.
- [ ] Align badge/pill height, radius, font density and semantic tone without creating a parallel component library.
- [ ] Align default card border/radius/shadow hierarchy to prototype card/soft-card intent.
- [ ] Align global background/text/border semantic tokens to the canonical values already recorded under `--explore-*` where appropriate.
- [ ] Establish reusable page-header/panel/table utility composition only where it removes real drift across multiple routes.
- [ ] Do not paste prototype CSS wholesale.
- [ ] Do not make every page maintain its own slightly different `eyebrow`, table, card, or page-title implementation.

Validation focus:

- buttons no longer look like the wrong hierarchy by default;
- common cards/inputs/tables feel like one product;
- later phases require fewer one-off corrections.

---

# Phase 2 — Public landing + authentication fidelity

## Landing `/`

Compare the rendered route directly with `#screen-landing`.

Required fixes include:

- [ ] restore 1240px-style public container proportion instead of the narrower current landing container where needed;
- [ ] match hero typography/line-height/tracking/proportions closely;
- [ ] match hero two-column spacing and window preview geometry;
- [ ] match trust strip height/density;
- [ ] match feature-card padding, radius, icon spacing and typography;
- [ ] match Operations and Analytics section spacing;
- [ ] match dark CTA block dimensions and button hierarchy;
- [ ] preserve responsive behavior from canonical breakpoints;
- [ ] unauthenticated `Start prototype`, `Explore the prototype`, and equivalent prototype CTAs should enter the register flow as represented by the reference, while an already-authenticated user may continue to `/app` without fake auth.

## Login `/login`

Current implementation materially redesigns the auth surface. Recover:

- [ ] desktop 1:1 split rather than the current `.88fr / 1.12fr` bias unless measured rendering proves equivalence;
- [ ] black auth art with the same internal top/copy/bottom rhythm;
- [ ] two auth-art information cards in the reference's two-column composition;
- [ ] segmented gray auth tab control, not underline-tabs;
- [ ] auth box width/density near the canonical 410px treatment;
- [ ] canonical 30px auth heading hierarchy;
- [ ] real auth errors presented in a compact visual slot equivalent to `.form-error`, not a large unrelated callout footprint;
- [ ] keep real `/api/auth/login`, `useUserSession()`, loading state and failure behavior;
- [ ] preserve only truthful semantics for any reference-only checkbox/helper copy.

## Register `/register`

- [ ] use the same auth shell as Login; DRY the genuinely shared auth composition;
- [ ] preserve reference fields/order: first/last split, work email, password, workspace name;
- [ ] keep registration local/dummy and never create a real account/session;
- [ ] keep completion/error feedback visually within the canonical form language rather than introducing a large page-shifting success panel unless necessary.

Responsive:

- [ ] at canonical mobile breakpoint, auth-art disappears as the reference specifies; do not retain the current partial dark art block on mobile.

---

# Phase 3 — Authenticated shell fidelity

Primary file: `app/layouts/app.vue` plus small app components only if they materially improve clarity/reuse.

- [ ] Sidebar width exactly follows the canonical 228px desktop contract and 208px around the reference laptop breakpoint.
- [ ] Match sidebar background, group spacing, group labels, item height, item font size, active/hover surfaces and icon footprint.
- [ ] Keep navigation labels consistent with prototype (`Map Viewer`, `Viewer settings`, etc.) unless a latest explicit user direction supersedes them.
- [ ] Rebuild account footer to match avatar + name + email + overflow affordance and separate Sign out action while using the real session/logout behavior.
- [ ] Topbar fixed/sticky behavior, height, left offset and backdrop treatment match the prototype.
- [ ] Replace current small ghost Search button with the canonical search-trigger field + keyboard hint on desktop.
- [ ] Keep Cmd/Ctrl+K working.
- [ ] Use an active Sync-style local/demo action footprint matching the prototype rather than an unrelated disabled refresh icon.
- [ ] Keep POC status truthfully worded for the current project decision, but match the canonical pill footprint/placement.
- [ ] Match mobile sidebar/backdrop/menu behavior.
- [ ] Remove authenticated-route `max-w-6xl` constraints that unnecessarily narrow pages compared with canonical `app-content`, except where a reference surface is intentionally narrower.

Acceptance: every authenticated route inherits the correct visual frame before page-level tuning.

---

# Phase 4 — Home + Dashboard fidelity

## Home `/app`

- [ ] Match reference welcome card padding, gradient restraint, 23px heading scale, button placement and 14px rhythm to following content.
- [ ] Match four stat cards at 12px gaps and reference typography.
- [ ] Match `grid-2` 1.4fr/.6fr relationship for building preview vs recent activity.
- [ ] Match building-mini geometry and 245px height.
- [ ] Match panel-head/panel-foot treatment.
- [ ] Match compact activity rows.
- [ ] Match Quick Explore 3-column card composition, icon spacing and typography.
- [ ] Do not add extra status/debug UI absent from the reference.

## Dashboard `/app/dashboard`

- [ ] Page header uses canonical 30px title and action alignment.
- [ ] Match 4-stat layout and spacing.
- [ ] Match visitor chart canvas dimensions/density rather than generic dashboard spacing.
- [ ] Match system-status row density and pill hierarchy; retain real DB/Situm configuration truth but keep the same layout footprint.
- [ ] Do not present dummy `Realtime API Healthy` as real backend truth; use a visually equivalent truthful local/dummy state if needed.
- [ ] Match lower 1:1 occupancy/alarm grid, progress-bar thickness/colors and activity density.

---

# Phase 5 — Map workspace fidelity

This is a high-priority surface.

The production map canvas remains the **real existing Situm Viewer**; do not replace it with prototype CSS floor art.

Everything around the viewer must closely reproduce `#app-map`.

- [ ] Match outer `map-layout` radius/border and dominant viewport height.
- [ ] Match 320px desktop side panel and responsive 280px/laptop behavior.
- [ ] Match header density and ready/loading/error pill footprint.
- [ ] Match Explore/Route/Layers segmented tabs.
- [ ] Match POI item height/padding/font/icon geometry.
- [ ] Match route form/result compactness and action hierarchy.
- [ ] Match layers rows/switch density and two-column More Viewer Tools grid.
- [ ] Remove visually large explanatory `UAlert` blocks for local map actions when the prototype uses transient toast feedback; use a toast or compact ephemeral feedback pattern instead.
- [ ] Match top-left building/floor control composition and top-right mode control composition.
- [ ] Match map bottom controls placement/shape.
- [ ] Ensure selected POI produces a popover equivalent to canonical `#poiPopover`, with Directions + Favorite actions; do not rely only on sidebar selection state.
- [ ] Match location picker and viewer accessibility modal visual composition.
- [ ] Keep all newly introduced controls local/dummy; do not add Situm API/SDK product integration here.
- [ ] Preserve real `MAP_IS_READY`, `APP_ERROR`, initialization errors and existing viewer functionality.

Acceptance: the real map occupies the space where prototype floor art was used, while the surrounding chrome is recognizably the same workspace.

---

# Phase 6 — Cartography fidelity

## Buildings `/app/buildings`

- [ ] Remove prominent `LOCAL FIXTURE · NO REMOTE ACTIONS` banner; canonical right-side element is a compact product pill/action footprint.
- [ ] Match canonical header/title size and single search toolbar.
- [ ] Do not keep extra status filtering if it materially changes the canonical toolbar composition.
- [ ] Match compact table typography/padding; current 14px tables are visibly too loose compared with canonical ~10/11px table language.
- [ ] Match lower Floor coverage + Cartography resources panel composition/density.
- [ ] Preserve details interaction using shared drawer.

## POIs `/app/pois`

- [ ] Match canonical search + category filter + single POI count pill toolbar.
- [ ] Remove extra explanatory `Local fixture · read only` copy from the toolbar.
- [ ] Match compact table rows and plain category text where the reference uses plain text; avoid gratuitous badges.
- [ ] Match favorite star treatment and details drawer behavior.

## Geofences `/app/geofences`

- [ ] Restore canonical structure: page head -> three metrics -> table.
- [ ] Remove search/type/count toolbar that is not represented in the prototype unless user explicitly requests it later.
- [ ] Match compact six-column table and active-status pill treatment.
- [ ] Keep Show on map action.

## Paths `/app/paths`

- [ ] Replace the current alternate SVG network visual with a high-fidelity translation of the canonical `building-mini` path-network composition.
- [ ] Match `grid-2` 1.4/.6 proportions rather than generic equal halves if the reference dictates it.
- [ ] Match route card panel-head/body and compact route-result styling.
- [ ] Keep dummy routing semantics.

---

# Phase 7 — Operations / Organization fidelity

## Realtime `/app/realtime`

- [ ] Match reference green `Auto refresh · 5s` pill footprint and Refresh now action while keeping actual behavior local/manual unless a timer is intentionally safe; UI copy must remain truthful.
- [ ] Remove persistent status `UAlert` feedback that shifts the page; use compact/transient feedback equivalent to prototype toast.
- [ ] Match 4-stat density.
- [ ] Replace alternate realtime map drawing with the canonical building-mini visual language and marker treatment.
- [ ] Match People & devices activity-row density and Follow actions.

## Analytics `/app/analytics`

- [ ] Remove extra `Local prototype data` badge from the header.
- [ ] Match date select + Export CSV action only.
- [ ] Match prototype tab font size, spacing and selected treatment; current larger underline-tab implementation must be visually compared and corrected.
- [ ] Match visitor/positioning chart heights, bar language and panel-head structure.
- [ ] Heatmap must use canonical red/amber/yellow density language, not the current blue/yellow/red blurred interpretation.
- [ ] Match table typography/density across stay-time and positions reports.
- [ ] Match Map Viewer usage three soft-card composition.
- [ ] Replace persistent export alert with transient prototype-like feedback.

## Alarms `/app/alarms`

- [ ] Keep canonical two-filter toolbar only; remove extra right-side result count if it changes the reference composition.
- [ ] Match compact table density and pill styling.
- [ ] Remove bottom explanatory fixture paragraph absent from the reference.

## Users `/app/users`

- [ ] Remove prominent Local fixture badge + full-width informational alert.
- [ ] Restore canonical equal two-column Users/Groups composition rather than current 1.35/.65 split.
- [ ] Match compact panel heads, table, and group activity-list treatment.
- [ ] Preserve drawer on user selection.

## Organization `/app/organization`

Current project truth differs from the old prototype permission wording because the POC now allows one Read & Write-capable key. Preserve the **latest project truth**, but match canonical composition:

- [ ] no large synthetic-context alert above the grid;
- [ ] match canonical 1.4/.6 grid relationship;
- [ ] match detail-list density instead of large row cards;
- [ ] match credential-boundary soft-card composition;
- [ ] current permission wording may say Read & Write (POC), but must occupy the same visual role as the prototype permission pill.

## Viewer Settings `/app/settings`

- [ ] Remove persistent Local-only settings alert; source remains local/dummy without debug-style page banners.
- [ ] Match canonical 220px settings nav and 14px gap.
- [ ] Match 11px nav/control density rather than generic 14px settings UI.
- [ ] Match setting-section 18px padding and compact row typography.
- [ ] Match General/Navigation/Map/Styles/Images compositions state-by-state.
- [ ] Reset feedback should be transient and not insert a large callout into the page.

---

# Phase 8 — Shared drawer, modal, search and transient feedback

## Details drawer

Current `USlideover` can remain, but its rendered composition must resemble canonical drawer:

- [ ] ~380px desktop width;
- [ ] top aligned below 64px app bar where feasible;
- [ ] compact 62px header;
- [ ] no unrelated generic description text dominating the header;
- [ ] type pill, detail rows with ~115px label column, divider, full-width View on map action;
- [ ] mobile full width below mobile topbar;
- [ ] Escape/focus behavior remains accessible through Nuxt UI.

## Global search

- [ ] Search trigger matches shell reference.
- [ ] Modal width/radius/header/body closely match canonical 520px modal.
- [ ] Results match canonical POI-list density rather than oversized command-palette styling.
- [ ] Cmd/Ctrl+K and Escape remain functional.

## Viewer accessibility modal

- [ ] Match three compact setting rows and Done footer.
- [ ] Preserve local switches.

## Toast / ephemeral status

- [ ] Implement one small reusable transient feedback mechanism if required by multiple local prototype actions.
- [ ] Match reference bottom-right dark toast footprint rather than inserting full-width page alerts.
- [ ] Reuse it for Sync, map tool actions, route/local actions, realtime refresh, report export and settings reset when appropriate.
- [ ] Do not build a generic notification subsystem beyond what this POC needs.

---

# Phase 9 — Responsive + accessibility + real behavior regression

Compare actual rendering at the reference breakpoints.

- [ ] >=1200 desktop.
- [ ] ~1024 laptop.
- [ ] ~768 tablet.
- [ ] ~390 mobile.
- [ ] Sidebar changes to drawer at the canonical breakpoint.
- [ ] Landing feature grid and hero reflow match reference.
- [ ] Auth art hides on mobile.
- [ ] App content padding matches reference mobile rhythm.
- [ ] Map side panel stacks to ~320px then viewer remains usable.
- [ ] Settings nav becomes horizontally scrollable.
- [ ] Tables scroll safely without changing desktop density.
- [ ] No horizontal document overflow.
- [ ] Keyboard/focus/labels/icon names remain accessible.
- [ ] Reduced motion is respected where animations exist.

Regression:

- [ ] real login success/failure still works;
- [ ] `/app/**` remains protected;
- [ ] logout works;
- [ ] `/api/me` remains real;
- [ ] Situm Viewer still initializes with existing env;
- [ ] `MAP_IS_READY` remains truthful;
- [ ] missing-config/error handling remains truthful;
- [ ] no new backend/Situm product-domain API work;
- [ ] no secrets committed.

---

# Phase 10 — Evidence-based final conformance signoff

This phase exists specifically because prior checkbox signoff was too easy to mark without sufficient rendered evidence.

For every route/state below, open the canonical reference and the rendered Nuxt page side-by-side or compare screenshots when tooling permits:

- [ ] `/`
- [ ] `/login`
- [ ] `/register`
- [ ] `/app`
- [ ] `/app/dashboard`
- [ ] `/app/map` Explore
- [ ] `/app/map` Route before/after calculation
- [ ] `/app/map` Layers
- [ ] `/app/map` POI popover
- [ ] `/app/map` location picker / accessibility modal
- [ ] `/app/buildings`
- [ ] `/app/pois`
- [ ] `/app/geofences`
- [ ] `/app/paths`
- [ ] `/app/realtime`
- [ ] `/app/analytics` every report tab
- [ ] `/app/alarms`
- [ ] `/app/users`
- [ ] `/app/organization`
- [ ] `/app/settings` every settings tab
- [ ] details drawer
- [ ] global search modal
- [ ] desktop/laptop/tablet/mobile states

For each screen explicitly evaluate:

- [ ] overall silhouette/proportions;
- [ ] content width;
- [ ] typography scale;
- [ ] spacing rhythm;
- [ ] borders/radius/shadows;
- [ ] action hierarchy;
- [ ] table/card density;
- [ ] responsive behavior;
- [ ] interactive state.

Rules:

- do **not** mark a screen complete merely because text/content is similar;
- do **not** mark final visual conformance complete without rendered review evidence when browser tooling is available;
- if browser tooling is unavailable, leave this phase pending and report that exact blocker for user/manual review;
- document only genuine intentional deviations caused by truthfulness/accessibility/real SDK behavior.

Final code gates:

- [ ] `git diff --check`
- [ ] `npm run lint`
- [ ] `npm run typecheck`
- [ ] `npm run build`
- [ ] plan/state/session persistence updated
- [ ] branch pushed
- [ ] no PR created

---

# Architecture constraints

Recovery work still follows `ARCHITECTURE.md`.

- pages stay route/composition focused;
- reuse Nuxt UI rather than replacing it;
- do not create a second component library;
- extract only real repeated product composition;
- no Pinia/global store for visual fixes;
- no generic service/repository architecture;
- no new Nitro endpoints;
- no new database tables/migrations;
- no Situm REST/SDK product expansion.

A small amount of scoped CSS is acceptable when Nuxt UI/Tailwind cannot cleanly reproduce a canonical visual detail. Keep it narrow and intentional.

# Completion boundary

Plan 009A is complete only when:

1. implementation is functionally intact;
2. every route/state above has been visually reviewed against the canonical reference;
3. the user-visible composition no longer contains major unreferenced additions/redesigns;
4. any remaining deviations are small, explicit and justified;
5. all code gates pass;
6. the user can perform final manual review before any backend Plan 010 work starts.

**Do not start Plan 010 automatically.** The user must explicitly accept the recovered UI first.
