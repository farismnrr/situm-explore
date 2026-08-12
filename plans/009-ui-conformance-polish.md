# Plan 009 — UI Conformance, Responsive & Polish

Status: planned
Branch: `plan/009-ui-conformance-polish`
Depends on: Plans 004–008

## Goal

Do a dedicated visual-conformance and interaction-quality pass after all approved reference surfaces exist. This plan must not redesign the product.

## Mandatory HTML-first conformance protocol

Canonical visual/interaction reference:

`design/reference/situm-explore-interactive-prototype.html`

This plan is a **screen-by-screen comparison against the canonical HTML**, not a generic polish pass.

Before changing any screen:

1. Open the canonical HTML reference.
2. Navigate/read the exact prototype screen/section under review.
3. Inspect its desktop state, mobile media-query behavior and relevant JavaScript interaction states.
4. Open the corresponding Nuxt route.
5. Compare hierarchy, spacing, density, interactions and responsive behavior.
6. Change Nuxt to match the approved reference unless a real accessibility/framework/SDK constraint requires a documented deviation.
7. Re-check the same HTML section after the change.

Do not rely on screenshots from memory. Do not introduce a new visual direction.

## Source of truth

1. `design/reference/situm-explore-interactive-prototype.html`
2. `DESIGN.md`
3. `design/IMPLEMENTATION.md`
4. active Plan 009 notes

If implemented Nuxt UI differs materially from the reference, prefer changing Nuxt implementation to match the reference unless a real framework/accessibility constraint requires a documented deviation.

## Required screen mapping

Use this exact checklist during the audit:

- `/` -> `#screen-landing`
- `/login` -> `#screen-auth` + `#loginPane`
- `/register` -> `#screen-auth` + `#registerPane`
- `/app` -> `#app-home`
- `/app/dashboard` -> `#app-dashboard`
- `/app/map` -> `#app-map`
- `/app/buildings` -> `#app-buildings`
- `/app/pois` -> `#app-pois`
- `/app/geofences` -> `#app-geofences`
- `/app/paths` -> `#app-paths`
- `/app/realtime` -> `#app-realtime`
- `/app/analytics` -> `#app-analytics`
- `/app/alarms` -> `#app-alarms`
- `/app/users` -> `#app-users`
- `/app/organization` -> `#app-organization`
- `/app/settings` -> `#app-settings`
- shared details drawer -> `#detailDrawer`
- global search modal -> `#searchModal`
- viewer settings modal -> `#viewerModal`

## Phase 1 — Visual audit

Read each HTML section immediately before auditing its Nuxt route.

For every surface above, compare:

- [ ] page width and horizontal padding;
- [ ] sidebar width/density where applicable;
- [ ] navigation-arrow mark size/placement;
- [ ] heading scale/letter spacing;
- [ ] paragraph and metadata hierarchy;
- [ ] vertical spacing rhythm;
- [ ] border/radius values;
- [ ] shadow restraint;
- [ ] status-pill sizing/colors;
- [ ] neutral surface hierarchy;
- [ ] button density and action hierarchy;
- [ ] map prominence;
- [ ] tables/toolbars/filter controls;
- [ ] drawers/modals;
- [ ] dummy charts/heatmaps;
- [ ] empty/loading/error states where production behavior adds them.

Do not introduce a new visual direction during this audit.

### Required page-by-page signoff

Do not mark Phase 1 complete with a single generic “looks close” statement. Record each page as checked:

- [ ] Landing checked against `#screen-landing`.
- [ ] Login checked against `#loginPane`.
- [ ] Register checked against `#registerPane`.
- [ ] Home checked against `#app-home`.
- [ ] Dashboard checked against `#app-dashboard`.
- [ ] Map checked against `#app-map`.
- [ ] Buildings checked against `#app-buildings`.
- [ ] POIs checked against `#app-pois`.
- [ ] Geofences checked against `#app-geofences`.
- [ ] Paths checked against `#app-paths`.
- [ ] Realtime checked against `#app-realtime`.
- [ ] Analytics checked against `#app-analytics` including every report tab.
- [ ] Alarms checked against `#app-alarms`.
- [ ] Users checked against `#app-users`.
- [ ] Organization checked against `#app-organization`.
- [ ] Settings checked against `#app-settings` including every settings tab.
- [ ] Shared drawer/search/viewer modal states checked against HTML equivalents.

## Phase 2 — Responsive behavior

**Before this phase, re-read all canonical `@media` rules instead of inferring mobile design from desktop.**

Validate at minimum:

- [ ] desktop >= 1200px;
- [ ] normal laptop around 1024px;
- [ ] tablet around 768px;
- [ ] mobile around 390px;
- [ ] public nav/hero follows prototype collapse behavior;
- [ ] auth split panel becomes the approved single-panel mobile composition;
- [ ] app sidebar becomes mobile drawer;
- [ ] wide tables scroll safely;
- [ ] map workspace stacks/reflows without unusable height;
- [ ] settings navigation follows mobile reference behavior;
- [ ] forms remain comfortable;
- [ ] no horizontal document overflow.

Small responsive deviations are acceptable only when they improve usability/accessibility and are recorded in the plan notes.

## Phase 3 — Interaction consistency

**Before reviewing an interaction, inspect its corresponding JavaScript behavior in the canonical HTML.**

Check:

- [ ] buttons use consistent hierarchy;
- [ ] route links use Nuxt navigation instead of prototype screen switching;
- [ ] auth tabs/pages preserve intended visual state while real login remains real;
- [ ] global search open/filter/navigate/close behavior mirrors prototype intent;
- [ ] drawers/modals close via obvious action + Escape when practical;
- [ ] local dummy filters/search work like reference;
- [ ] map Explore/Route/Layers state transitions preserve reference intent;
- [ ] analytics tab switching preserves reference intent;
- [ ] settings tab/switch/reset behavior preserves reference intent;
- [ ] loading/empty/error states use common patterns;
- [ ] real actions are distinguishable in source code from dummy actions;
- [ ] no dead controls unless the reference intentionally shows a disabled state.

The implementation does not need to copy prototype JavaScript literally; it must reproduce the approved interaction result using Vue/Nuxt state and routing.

## Phase 4 — Accessibility

The HTML reference establishes visual intent, but accessibility may override exact implementation mechanics.

- [ ] keyboard navigation;
- [ ] focus visibility;
- [ ] form labels;
- [ ] icon-button accessible labels/tooltips;
- [ ] status not color-only;
- [ ] adequate light-mode contrast;
- [ ] sensible landmarks/headings;
- [ ] modal/drawer focus handling where practical;
- [ ] reduced-motion-friendly behavior.

Document accessibility-driven differences from HTML instead of silently diverging.

## Phase 5 — Real integration regression check

The reference uses dummy interactions in several places. Production behavior that already exists must stay real.

- [ ] real login success/failure still works;
- [ ] auth middleware still protects `/app/**`;
- [ ] logout works;
- [ ] `/api/me` real behavior remains intact;
- [ ] real Situm viewer still reaches `MAP_IS_READY`;
- [ ] viewer error/missing-config states remain truthful;
- [ ] no production API behavior was replaced with prototype-only fake behavior;
- [ ] no secrets committed.

## Phase 6 — Code cleanup

- [ ] remove obsolete Plan 003-only components/styles if no longer used;
- [ ] remove duplicated one-off visual classes where central semantic styling is clearly better;
- [ ] preserve prototype fidelity while simplifying obviously duplicated code;
- [ ] do not over-abstract simple components;
- [ ] keep dummy fixtures centralized and typed;
- [ ] no new architecture package.

## Final gates

- [ ] `git diff --check`;
- [ ] `npm run lint`;
- [ ] `npm run typecheck`;
- [ ] `npm run build`;
- [ ] manual visual walkthrough against every mapped HTML reference section;
- [ ] list any intentional deviations and reasons in this plan;
- [ ] update `.agents/` and plan;
- [ ] commit/push phases;
- [ ] no PR until user authorization.
