# Plan 009 — UI Conformance, Responsive & Polish

Status: planned
Branch: `plan/009-ui-conformance-polish`
Depends on: Plans 004–008

## Goal

Do a dedicated visual-conformance and interaction-quality pass after all approved reference surfaces exist. This plan must not redesign the product.

## Source of truth

1. `design/ui-reference.html`
2. `design/IMPLEMENTATION.md`
3. `DESIGN.md`

If implemented Nuxt UI differs materially from the reference, prefer changing Nuxt implementation to match the reference unless a real framework/accessibility constraint requires a documented deviation.

## Phase 1 — Visual audit

Compare each surface:

- landing;
- login;
- register;
- Home;
- Dashboard;
- Map Viewer;
- Buildings/Floors;
- POIs;
- Geofences;
- Paths;
- Realtime;
- Analytics;
- Alarms;
- Users/Groups;
- Organization;
- Viewer Settings.

Check:

- [ ] page widths;
- [ ] sidebar width/density;
- [ ] navigation-arrow mark;
- [ ] heading scale;
- [ ] spacing rhythm;
- [ ] border/radius values;
- [ ] shadow restraint;
- [ ] status-pill sizing;
- [ ] neutral hierarchy;
- [ ] map prominence;
- [ ] tables/toolbars;
- [ ] drawers/modals;
- [ ] dummy charts/heatmaps.

Do not introduce a new visual direction during this audit.

## Phase 2 — Responsive behavior

- [ ] desktop >= 1200px;
- [ ] normal laptop around 1024px;
- [ ] tablet around 768px;
- [ ] mobile around 390px;
- [ ] app sidebar becomes mobile drawer;
- [ ] wide tables scroll safely;
- [ ] map workspace stacks/reflows without unusable height;
- [ ] forms remain comfortable;
- [ ] no horizontal document overflow.

## Phase 3 — Interaction consistency

- [ ] buttons use consistent hierarchy;
- [ ] route links use Nuxt navigation;
- [ ] drawers/modals close via obvious action + Escape when practical;
- [ ] local dummy filters/search work;
- [ ] loading/empty/error states use common patterns;
- [ ] real actions are distinguishable in code from dummy actions;
- [ ] no dead controls unless the reference intentionally shows a disabled state.

## Phase 4 — Accessibility

- [ ] keyboard navigation;
- [ ] focus visibility;
- [ ] form labels;
- [ ] icon-button labels/tooltips;
- [ ] status not color-only;
- [ ] adequate light-mode contrast;
- [ ] sensible landmarks/headings;
- [ ] reduced-motion-friendly behavior.

## Phase 5 — Real integration regression check

- [ ] real login success/failure still works;
- [ ] auth middleware still protects `/app/**`;
- [ ] logout works;
- [ ] `/api/me` real behavior remains intact;
- [ ] real Situm viewer still reaches `MAP_IS_READY`;
- [ ] viewer error/missing-config states remain truthful;
- [ ] no secrets committed.

## Phase 6 — Code cleanup

- [ ] remove obsolete Plan 003-only components/styles if no longer used;
- [ ] remove duplicated one-off visual classes where central semantic styling is clearly better;
- [ ] do not over-abstract simple components;
- [ ] keep dummy fixtures centralized and typed;
- [ ] no new architecture package.

## Final gates

- [ ] `git diff --check`;
- [ ] `npm run lint`;
- [ ] `npm run typecheck`;
- [ ] `npm run build`;
- [ ] manual visual walkthrough against reference;
- [ ] update `.agents/` and plan;
- [ ] commit/push phases;
- [ ] no PR until user authorization.
