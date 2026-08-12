# Plan 006 — Situm Map Workspace

Status: planned
Branch: `plan/006-situm-map-workspace`
Depends on: Plan 005

## Goal

Turn the approved Map Viewer prototype into the primary production workspace around the already-working real Situm SDK viewer.

## Mandatory HTML-first implementation protocol

Canonical visual/interaction reference:

`design/reference/situm-explore-interactive-prototype.html`

**Read the HTML Map Viewer section before touching the Nuxt map page or viewer composition.**

For every phase:

1. Open the canonical HTML reference.
2. Inspect `#app-map` and the exact related controls listed below.
3. Separate visual/interaction behavior from fake prototype data/DOM map drawing.
4. Keep the real `SitumViewer.vue` SDK lifecycle as the production map canvas.
5. Translate surrounding UI into Vue/Nuxt UI while preserving the approved composition.
6. Wire only safe existing SDK behavior after verifying the installed/current API; otherwise keep control behavior local/dummy.
7. Compare against `#app-map` before marking the phase complete.

### Prototype sections required for this plan

- Entire Map Viewer page: `#app-map`.
- Workspace composition: `.map-layout`, `.map-side`, `.map-side-head`, `.map-side-tabs`, `.map-side-body`, `.map-main`.
- Explore: `#mapTab-search`, `#poiSearch`, `#poiList`, `.poi-item`, `#poiPopover`.
- Route: `#mapTab-route`, route form/result/steps and route-line state.
- Layers/tools: `#mapTab-layers`, layer toggles, location picker, viewer settings and secondary viewer-tool buttons.
- Building/floor/mode controls: `#mapBuilding`, `[data-floor]`, `.map-mode-bar`, `.floor-switcher`.
- Map controls: center/zoom controls and their placement.
- Responsive behavior: map/sidebar stacking rules in the prototype media queries.

The prototype's `.map-canvas`, `.big-floor`, pins and fake live dots are illustrative only. **Do not replace the real Situm iframe/viewer with these dummy map shapes.**

## Existing real foundation to preserve

- `@situm/sdk-js` already installed;
- `SitumViewer.vue` already initializes the viewer;
- public read-only viewer API key already configured;
- building configuration already exists;
- readiness changes to `ready` only after `ViewerEventType.MAP_IS_READY`;
- `APP_ERROR` and initialization errors are already surfaced.

Do not rewrite this working lifecycle just to match the prototype.

## Required reading

- `AGENTS.md`
- `DESIGN.md`
- `design/reference/situm-explore-interactive-prototype.html`
- `design/IMPLEMENTATION.md`
- current `SitumViewer.vue` and Situm runtime configuration.

## Phase 1 — Workspace composition

Target: `/app/map`.

**Before implementation, inspect the complete `#app-map` structure and CSS sizing.**

- [ ] Move/compose the existing real `SitumViewer` into the approved map workspace layout.
- [ ] Real viewer occupies the large right/main map canvas where the HTML prototype draws its fake floor.
- [ ] Left panel matches approved `Explore / Route / Layers` hierarchy, width and density.
- [ ] Header/building/floor controls visually match the reference.
- [ ] Preserve stable loading map dimensions.
- [ ] Preserve error state in the map canvas.
- [ ] Viewer shell must not display `Ready` before actual `MAP_IS_READY`.
- [ ] Match desktop and mobile map-workspace proportions from the reference.

## Phase 2 — Explore UI

**Before implementation, inspect `#mapTab-search`, POI list items, selected state, favorite control and `#poiPopover`.**

- [ ] Implement search input and POI list using typed dummy POI fixtures initially.
- [ ] Match POI row sizing/icon treatment/text hierarchy from HTML.
- [ ] POI selection changes local selected state and detail/popover treatment matching reference.
- [ ] Favorite toggle is local-only.
- [ ] Filters work locally.
- [ ] Do not create a POI backend/API proxy in this plan.
- [ ] If current Viewer API exposes a low-risk, documented POI selection call that can be used without changing data architecture, AI may wire selected dummy-known POI only after verifying SDK docs and IDs; otherwise keep it local.

## Phase 3 — Route UI

**Before implementation, inspect `#mapTab-route`, `.route-form`, `.route-result`, `.route-steps`, and route-related prototype JavaScript.**

- [ ] Implement Start / Destination controls and accessible-route option.
- [ ] Route result UI matches approved prototype density and hierarchy.
- [ ] Default implementation is dummy/local route steps.
- [ ] Do not claim a real route was calculated unless SDK directions are actually wired.
- [ ] If directions are wired, preserve a clear adapter boundary and verify official SDK method/event behavior first.
- [ ] Do not add server routes solely for navigation.

## Phase 4 — Layers / viewer tools

**Before implementation, inspect `#mapTab-layers` and all viewer-tool buttons in the canonical HTML.**

Represent approved tools:

- realtime positions;
- geofences;
- trajectory;
- follow user;
- location picker;
- accessibility/user settings;
- save car / navigate to car;
- flight selection;
- search filter;
- viewer font size;
- set user location.

Rule per control:

1. Match the visual placement/state from the HTML first.
2. If already supported cleanly by the current viewer SDK and can be wired without backend expansion, implement real interaction after inspecting official API.
3. Otherwise implement explicit local dummy behavior/toast/state.
4. Never fake a successful remote write.

## Phase 5 — Building/floor/view controls

**Before implementation, inspect `#mapBuilding`, `.floor-switcher`, `[data-floor]`, `.map-mode-bar`, zoom and center controls.**

- [ ] Keep configured building real.
- [ ] Do not invent real extra building IDs.
- [ ] Additional building entries shown in the visual reference may remain dummy/disabled until later integration plans.
- [ ] Floor selector may use known viewer state if obtainable safely; otherwise keep only actual configured/default floor UI and local demo alternatives clearly synthetic in source code.
- [ ] Zoom/center controls may call real viewer camera APIs only after verifying current SDK signatures.
- [ ] Match control size, grouping and floating placement from HTML.

## Phase 6 — Real/dummy labeling in code

The user-facing UI should look coherent, not covered in `DEMO` badges. The source code must make the boundary obvious.

Suggested split:

- `components/map/SitumViewer.vue` — real SDK lifecycle;
- `components/map/SitumWorkspace.vue` — composition;
- local typed fixtures/composables for dummy POIs/routes/layers.

No service/repository architecture yet.

## Validation

- [ ] real viewer still reaches `MAP_IS_READY` manually;
- [ ] real viewer errors remain visible;
- [ ] missing configuration remains distinguishable;
- [ ] no API key value committed;
- [ ] map layout matches the canonical HTML `#app-map` desktop/mobile hierarchy;
- [ ] Explore/Route/Layers controls compare to their exact HTML states;
- [ ] dummy controls never imply remote writes;
- [ ] deliberate framework/SDK deviations are documented;
- [ ] `git diff --check`;
- [ ] lint/typecheck/build;
- [ ] commit/push each phase;
- [ ] no PR until explicit authorization.

## Non-goals

- backend Situm proxy;
- Cartography Edition/Read & Write key;
- persisted favorites;
- real realtime data feed;
- real reports;
- app DB schema changes.
