# Plan 006 — Situm Map Workspace

Status: planned
Branch: `plan/006-situm-map-workspace`
Depends on: Plan 005

## Goal

Turn the approved Map Viewer prototype into the primary production workspace around the already-working real Situm SDK viewer.

## Existing real foundation to preserve

- `@situm/sdk-js` already installed;
- `SitumViewer.vue` already initializes the viewer;
- public read-only viewer API key already configured;
- building configuration already exists;
- readiness changes to `ready` only after `ViewerEventType.MAP_IS_READY`;
- `APP_ERROR` and initialization errors are already surfaced.

Do not rewrite this working lifecycle just to match the prototype.

## Phase 1 — Workspace composition

Target: `/app/map`.

- [ ] Move/compose the existing real `SitumViewer` into the approved map workspace layout.
- [ ] Real viewer occupies the large right/main map canvas.
- [ ] Left panel matches approved `Explore / Route / Layers` hierarchy.
- [ ] Header/building/floor controls visually match the reference.
- [ ] Preserve stable loading map dimensions.
- [ ] Preserve error state in the map canvas.
- [ ] Viewer shell must not display `Ready` before actual `MAP_IS_READY`.

## Phase 2 — Explore UI

- [ ] Implement search input and POI list using typed dummy POI fixtures initially.
- [ ] POI selection changes local selected state and detail/popover treatment.
- [ ] Favorite toggle is local-only.
- [ ] Filters work locally.
- [ ] Do not create a POI backend/API proxy in this plan.
- [ ] If current Viewer API exposes a low-risk, documented POI selection call that can be used without changing data architecture, AI may wire selected dummy-known POI only after verifying SDK docs and IDs; otherwise keep it local.

## Phase 3 — Route UI

- [ ] Implement Start / Destination controls and accessible-route option.
- [ ] Route result UI matches approved prototype.
- [ ] Default implementation is dummy/local route steps.
- [ ] Do not claim a real route was calculated unless SDK directions are actually wired.
- [ ] If directions are wired, preserve a clear adapter boundary and verify official SDK method/event behavior first.
- [ ] Do not add server routes solely for navigation.

## Phase 4 — Layers / viewer tools

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

1. If already supported cleanly by the current viewer SDK and can be wired without backend expansion, implement real interaction after inspecting official API.
2. Otherwise implement explicit local dummy behavior/toast/state.
3. Never fake a successful remote write.

## Phase 5 — Building/floor/view controls

- [ ] Keep configured building real.
- [ ] Do not invent real extra building IDs.
- [ ] Additional building entries shown in the visual reference may remain dummy/disabled until Plan 010.
- [ ] Floor selector may use known viewer state if obtainable safely; otherwise keep only actual configured/default floor UI and local demo alternatives clearly synthetic.
- [ ] Zoom/center controls may call real viewer camera APIs only after verifying current SDK signatures.

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
- [ ] map layout matches `design/ui-reference.html` desktop/mobile hierarchy;
- [ ] dummy controls never imply remote writes;
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
