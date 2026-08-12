# Plan 006 — Situm Map Workspace

Status: planned
Branch: `plan/006-situm-map-workspace`
Depends on: Plan 005 complete, reviewed, and integrated into `main`

## Goal

Turn the approved Map Viewer prototype into the primary production map workspace around the already-working real Situm Viewer, while keeping **all new product controls dummy/local during the UI roadmap**.

This plan preserves one real integration only: the viewer initialization/readiness/error lifecycle that already exists before the plan. New POI, routing, realtime, geofence, settings, camera, and other Situm capability wiring belongs in later backend/integration plans after UI acceptance.

Do not use the broader Read & Write POC key as a reason to expand this UI plan.

## Mandatory HTML-first implementation protocol

Canonical visual/interaction reference:

`design/reference/situm-explore-interactive-prototype.html`

Read the Map Viewer section in the **current** HTML before touching the Nuxt map composition.

For every phase:

1. Open the canonical HTML.
2. Locate the current Map Viewer composition semantically; old IDs such as `#app-map`, `#mapTab-search`, `#mapTab-route`, and `#mapTab-layers` are locator hints only if they still exist.
3. Separate visual/interaction intent from fake prototype data and fake DOM/CSS map drawing.
4. Keep the real `SitumViewer` as the production map canvas.
5. Translate surrounding UI into Nuxt UI/Vue state.
6. Keep all newly introduced product controls local/dummy in Plans 004–009.
7. Compare against the same HTML section before completing the phase.

The prototype's CSS floorplan/map shapes, pins, route line, geofence shapes, and simulated live dots are illustrative only. Never replace the real Situm viewer with them.

## Existing real foundation to preserve

- `@situm/sdk-js` is installed;
- `SitumViewer.vue` already initializes the real viewer;
- runtime uses the single `NUXT_PUBLIC_SITUM_API_KEY` POC credential;
- a configured/discovered `NUXT_PUBLIC_SITUM_BUILDING_ID` loads the real building;
- readiness changes to `ready` only after `ViewerEventType.MAP_IS_READY`;
- `APP_ERROR` and initialization errors are surfaced.

The POC key may have Read & Write permission, but **this plan does not add new remote Situm feature calls**.

## Required reading

- `AGENTS.md`
- `ARCHITECTURE.md`
- `DESIGN.md`
- `design/IMPLEMENTATION.md`
- `design/data-source-matrix.md`
- `design/reference/situm-explore-interactive-prototype.html`
- completed Plan 005 implementation/state
- current `app/components/situm/SitumViewer.vue` and runtime configuration
- this plan

## Phase 1 — Workspace composition

Target: `/app/map`.

Before implementation, inspect the complete Map Viewer reference composition and responsive sizing.

- [x] Replace the temporary Plan 005 map-page composition with the approved workspace composition.
- [x] Keep the existing real `SitumViewer` lifecycle intact.
- [x] Viewer occupies the approved dominant map area.
- [x] Left/secondary panel matches the approved Explore / Route / Layers hierarchy when present in the current HTML.
- [x] Header/building/floor/mode controls match reference placement/density.
- [x] Preserve stable loading dimensions and truthful map error state.
- [x] Never display `Ready` before actual `MAP_IS_READY`.
- [x] Match desktop/mobile proportions from the current HTML.

## Phase 2 — Explore UI, dummy/local

Before implementation, inspect current POI search/list/selection/popover/favorite states in the HTML.

- [x] Reuse or extend the canonical typed POI/building fixtures under `app/data/prototype/`; do not create duplicate records if Plan 005 already introduced them.
- [x] Implement local POI search/filter.
- [x] POI selection changes local Vue state and detail/popover presentation.
- [x] Favorite state is local-only.
- [x] No POI REST/Nitro endpoint.
- [x] No new Viewer POI-selection SDK call in this UI plan.
- [x] Do not claim dummy POIs are loaded from Situm.

## Phase 3 — Route UI, dummy/local

Before implementation, inspect the route form/result/steps and accessible-route state in the current HTML.

- [x] Implement Start/Destination controls using typed local fixture options.
- [x] Implement accessible-route option as local UI state.
- [x] Route calculation/result/steps are dummy/local only.
- [x] Do not wire directions/navigation SDK calls in this plan.
- [x] Do not add a server routing endpoint.
- [x] Never claim a real route was calculated.

## Phase 4 — Layers and viewer tools, dummy/local

Inspect every approved layers/tools state in the current HTML before implementation.

Examples may include:

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

Rules:

1. Match placement/state from the HTML.
2. Implement the visible interaction with Vue local state, dummy overlays where appropriate, disabled state, or truthful local toast/result.
3. Do **not** add new Situm SDK/REST feature wiring during Plan 006.
4. Never imply a remote mutation occurred.

Implementation: completed with local layer toggles, local picker/settings overlays, and local-only tool status feedback.

## Phase 5 — Building/floor/view controls, dummy around the real configured viewer

Before implementation, inspect building/floor/mode/zoom/center controls in the current HTML.

- [x] The actual mounted viewer continues to use the real configured `NUXT_PUBLIC_SITUM_BUILDING_ID`.
- [x] Do not invent extra real building IDs.
- [x] Visual building/floor alternatives required by the reference remain synthetic/local until later integration.
- [x] Do not add building/floor discovery APIs to the application in this plan.
- [x] Zoom/center/mode buttons outside the viewer remain local UI behavior unless they are already part of the untouched existing viewer itself; no new SDK camera wiring in this plan.
- [x] Keep synthetic records obvious in source code.

## Phase 6 — Component/data ownership

Preferred responsibility grouping under the architecture contract:

```text
app/components/situm/SitumViewer.vue      # existing real SDK lifecycle
app/components/situm/SitumWorkspace.vue   # product composition if extraction is useful
app/data/prototype/...                     # typed dummy POIs/routes/layers
```

Nuxt nested component auto-import naming follows Nuxt conventions; explicit imports are also acceptable when clearer.

Do not create services/repositories/global stores for dummy map state. Prefer local component state or one focused composable only when multiple map components genuinely share reactive state.

## Validation

- [ ] real viewer reaches `MAP_IS_READY` manually;
- [ ] viewer errors/missing configuration remain truthful;
- [ ] no API key value committed/logged;
- [ ] map layout matches the current canonical HTML desktop/mobile hierarchy;
- [ ] Explore/Route/Layers controls behave locally and visibly;
- [ ] no new product-domain Situm network/API/SDK capability calls were introduced beyond the pre-existing viewer initialization/lifecycle;
- [ ] dummy actions never imply remote writes;
- [ ] fixture records are reused rather than duplicated across Plans 005–007;
- [ ] update `README.md` if it still describes the legacy dashboard as the viewer location;
- [ ] document deliberate deviations;
- [ ] `git diff --check`;
- [ ] `npm run lint`;
- [ ] `npm run typecheck`;
- [ ] `npm run build`;
- [ ] update plan + `.agents/`, commit, and push each phase;
- [ ] no PR until explicit authorization.

## Non-goals

- new Situm REST/Nitro feature integration;
- new Situm Viewer feature-method wiring beyond the existing create/readiness/error lifecycle;
- additional credential/key architecture;
- persisted favorites;
- real routing/realtime/geofences/reports;
- app DB schema changes.
