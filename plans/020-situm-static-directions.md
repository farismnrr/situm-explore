# Plan 020 — Situm Static Directions

Status: **queued**
Branch: `plan/020-situm-static-directions`
Base: final HEAD of Plan 019
Depends on: Plan 019 complete in the explicit stacked 017→020 execution

## Goal

Add a truthful desktop web static-directions feature between known Situm points/POIs using the Situm Viewer SDK's verified directions APIs.

This is **static directions**, not live handset navigation. The Viewer owns route calculation/rendering. Situm Explore owns endpoint selection, product controls, validation, and truthful app status around that Viewer behavior.

## Required reading

- `AGENTS.md`
- `.agents/state.md`
- `.agents/memory/decisions.md`
- `ARCHITECTURE.md`
- `plans/README.md`
- `design/data-source-matrix.md`
- current `/app/map`, `/app/paths`, POI/cartography composables/data, and `SitumViewer`
- latest official Situm SDK JS Viewer docs/source for directions
- installed `@situm/sdk-js` types/source
- this plan

## Verified direction

Current official Viewer JS documents static-direction operations including:

- `startDirections(...)`;
- `startDirectionsByExternalId(...)`;
- `cancelDirections()`;
- `directionsSetOptions(...)`;
- route types including shortest/accessibility variants.

Plan 020 must verify the installed SDK/runtime and exact payloads before coding. Do not use live `startNavigation` as a substitute.

## Fixed boundaries

- Static routes only between known product-selectable Situm endpoints/POIs.
- No browser `My location`, sensor positioning, blue dot, movement-aware turn-by-turn navigation, rerouting, or `startNavigation`.
- Do not manufacture route distance, duration, steps, instructions, or geometry outside what an exact Viewer event/API exposes.
- If the Viewer can render a route but does not expose a reliable product route-summary payload, keep summary/details absent instead of synthesizing them.
- Directions controls must live outside/alongside the Viewer canvas and must not cover Situm's native controls.
- Keep one Viewer instance owner and expose only the required typed commands.

## Phase 0 — Directions evidence + runtime probe

- [ ] verify installed SDK signatures/runtime behavior for `startDirections`, `startDirectionsByExternalId`, `cancelDirections`, and `directionsSetOptions`;
- [ ] verify exact accepted endpoint identifiers and whether current POI IDs/external IDs are valid route endpoints;
- [ ] verify documented route-type values and accessibility semantics;
- [ ] verify included/excluded tag options only if the current account/cartography exposes meaningful tags;
- [ ] inspect Viewer events for route requested/started/failed/completed/detail payloads and record only fields actually usable by the app;
- [ ] live-smoke at least one real static route between known endpoints with the configured Viewer credential;
- [ ] confirm cancel/replace-route behavior and truthful invalid/no-route behavior;
- [ ] if a core route cannot be computed in the actual configured environment, stop and report the exact blocker rather than building fake routing UI.

## Phase 1 — Typed Viewer directions surface

- [ ] expose the smallest typed `SitumViewer` commands required to start and cancel static directions;
- [ ] expose route options only for exact verified route types/tags;
- [ ] expose only the exact Viewer direction events needed for product status/detail state;
- [ ] do not expose `startNavigation`, generic invoke, raw Viewer access, or user-location controls;
- [ ] ensure active directions are cancelled/cleaned on relevant unmount/session transitions.

## Phase 2 — Route builder UX

- [ ] add a compact static-route builder to the current desktop map workspace outside the Viewer canvas;
- [ ] source From/To choices from real current POIs/cartography, not fixtures;
- [ ] support search and building/floor context without pretending cross-building routes are valid when the Viewer contract does not support them;
- [ ] prevent invalid same-endpoint/empty selections before invoking the Viewer;
- [ ] provide verified route-type/accessibility selector when supported;
- [ ] add a clear/cancel action tied to `cancelDirections`;
- [ ] keep controls visually subordinate to the map and preserve the refined collision-free Viewer layout.

## Phase 3 — Viewer route state + product feedback

- [ ] start directions only after Viewer readiness and valid endpoint selection;
- [ ] render the actual route exclusively through the Situm Viewer;
- [ ] show concise product status for calculating/active/no-route/error/cancelled based on exact SDK/event behavior;
- [ ] if exact route detail payload exists, show only verified useful details such as steps/distance/duration; otherwise leave those details absent;
- [ ] never show fabricated ETA, walking time, route length, instruction text, or route polyline;
- [ ] support replacing an active route with a new valid request without stale state.

## Phase 4 — Paths page alignment

- [ ] keep `/app/paths` as truthful path/cartography metadata unless a verified route-detail relationship exists;
- [ ] remove/reword any stale copy suggesting static directions are still unavailable once the feature is live;
- [ ] optionally link from Paths to the map route builder when that improves discoverability;
- [ ] do not conflate path resources with a computed directions result.

## Phase 5 — Validation and closeout

- [ ] `git diff --check`;
- [ ] `npm run lint`;
- [ ] `npm run typecheck`;
- [ ] `npm run build`;
- [ ] hydrated desktop Viewer smoke for valid route start, route replacement, cancel, and invalid/no-route handling;
- [ ] verify POI search/selection works with real cartography data;
- [ ] verify no live-navigation/user-location behavior was introduced;
- [ ] verify no private Nitro credential reaches the browser;
- [ ] verify mobile still does not mount the desktop Viewer feature;
- [ ] update plan/state/evidence/session to exact truth;
- [ ] commit and push the completed branch;
- [ ] do not create a PR or merge.

## Non-goals

- `startNavigation` or live turn-by-turn navigation;
- handset indoor positioning;
- navigation from current browser location;
- rerouting/follow-user behavior;
- save-car/navigation-to-car;
- flights;
- custom route engine/pathfinding;
- synthetic route summary/geometry/instructions;
- route persistence/history unless a future product requirement explicitly asks for it.
