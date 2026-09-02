# Plan 041 — App-Owned Indoor Map + Navigation UI

Status: **active / custom-renderer + branded launch accepted / physical E2E and final release packaging passed / movement-only follow-ups documented**
Branch: `plan/041-navigation-first-map-ui`
Target repo: `/home/farismnrr/Projects/situm-explore`

## Goal

Make React Native Explore a genuinely app-owned indoor navigation experience. Situm remains the authorized cartography source and the headless indoor-positioning producer, but Situm's MapView/Map Viewer is no longer allowed to render the visible map.

The app now owns every visible map pixel and interaction:

- floorplan image placement;
- POI markers and selection;
- route geometry and style;
- user bluedot, accuracy radius, and heading marker;
- pan/zoom/recenter behavior;
- floor switching;
- destination search/sheet;
- guidance HUD, remaining distance, ETA estimate, arrival, and off-route state;
- fullscreen behavior.

## Why the plan changed

The first Plan 041 physical candidate successfully built and ran on the connected Android target, but product acceptance rejected it because the center of the experience was still Situm MapView. React Native only owned overlays, so the map looked materially like the previous UI.

That candidate is retained as useful evidence that the native SDK/runtime and ADB pipeline were healthy, but it is **not** accepted as the target implementation.

The approved direction is now:

```text
Situm REST cartography + paths
            |
            v
   app-owned map model
            |
            v
React Native Image + SVG renderer
            ^
            |
headless Situm positioning only
(x/y/floor/bearing/accuracy)
```

No Situm MapView, SitumProvider, MapView controller, `navigateToPoi`, or hosted visual SDK UI belongs in `NativeMapScreen`.

## Security and ownership boundaries

- Preserve the existing two-key workspace model.
- Mobile positioning continues to receive only the already-approved owner-authorized positioning/read material.
- Cartography and paths continue to be fetched through authenticated Situm Explore server routes; the client does not receive a Read & Write secret.
- Do not expose credentials in plans, logs, screenshots, fixtures, or commits.
- Do not fork or modify Situm native SDK internals.
- Situm native runtime is retained only for indoor position production and its required configuration.

## Data contracts used

### Cartography

Existing endpoint:

`GET /api/workspaces/:workspaceId/situm/cartography`

Provides authorized real:

- buildings and physical dimensions;
- floors and floorplan `mapUrl`;
- POIs, categories, and Cartesian x/y positions.

### Navigation graph

Existing endpoint:

`GET /api/workspaces/:workspaceId/situm/paths`

Provides Situm path nodes and links. The app builds its own weighted graph and computes an ordered route rather than asking MapView to navigate.

### Positioning

Existing shared `ForegroundPositioningSession` remains the only native map-runtime dependency. It emits Situm `Location` fixes with:

- building identifier;
- floor identifier;
- Cartesian x/y;
- accuracy;
- bearing.

The session remains explicit-user-action, foreground-only, workspace/building scoped, and lifecycle hardened.

## Coordinate model

Situm Cartesian coordinates use a lower-left physical-space origin, while React Native/SVG uses an upper-left screen origin. App-owned rendering therefore maps:

```text
screenX = x / buildingWidth * renderedMapWidth
screenY = (buildingLength - y) / buildingLength * renderedMapHeight
```

The floorplan image and SVG overlay share exactly the same fitted frame and transform, so POIs, route geometry, accuracy, and user position stay registered while panning/zooming.

## Implementation phases

| Phase | State | Exit criteria |
| --- | --- | --- |
| 01 — data/source contract | complete | existing cartography/path endpoints and positioning Cartesian fields verified |
| 02 — custom map renderer | complete in source | floorplan + SVG POIs/bluedot/route render with no Situm visual SDK |
| 03 — custom route/navigation | complete in source | graph route, floor segments, remaining distance, basic turn/floor guidance, arrival/off-route |
| 04 — automated/build validation | complete | lint/typecheck/tests/diff green; final arm64 release package/checksum produced |
| 05 — physical Android E2E | complete | installed debug shell + Metro hot reload exercised real positioning, POI, routing, floor, fullscreen/back, stop, and crash checks |
| 06 — documentation/commit closeout | complete | physical evidence recorded and coherent work committed locally |
| 07 — branded launch experience | complete | supported native splash config + same-logo app-owned animation validated on final release cold launch |

## Phase 01 — source contract

- [x] Keep existing authenticated cartography endpoint.
- [x] Keep existing authenticated paths endpoint.
- [x] Verify path schema uses real nodes/links rather than synthetic route fixtures.
- [x] Verify native `Location.position.cartesianCoordinate`, floor, accuracy, and bearing fields.
- [x] Keep remote Situm positioning configuration in the headless positioning session rather than map presentation.

## Phase 02 — app-owned renderer

New files:

- `mobile/src/map/CustomIndoorMap.tsx`
- `mobile/src/map/customMapGeometry.ts`

Requirements:

- [x] No `MapView`/`SitumProvider` in `NativeMapScreen`.
- [x] Render real floorplan `mapUrl` with React Native `Image`.
- [x] Render all map overlays using `react-native-svg`.
- [x] Project Cartesian POIs onto the floorplan.
- [x] Draw a selected-destination marker independent of Situm visual UI.
- [x] Draw app-owned bluedot, accuracy radius, and heading indicator from live positioning.
- [x] Draw app-owned dashed/high-contrast route geometry.
- [x] Keep floor image and overlays under one shared pan/zoom transform.
- [x] Preserve POI tap interaction while pan/pinch gestures remain available.
- [x] Recenter the custom camera from current Cartesian location.
- [x] Preserve shell-free fullscreen behavior.

## Phase 03 — custom route and guidance

New file:

- `mobile/src/map/customRoute.ts`

Requirements:

- [x] Build a graph from real Situm path nodes and links.
- [x] Find nearest start/destination graph nodes on their respective floors.
- [x] Calculate an ordered route without MapView routing.
- [x] Refuse to invent a route when graph connectivity is missing.
- [x] Split route geometry by floor for rendering.
- [x] Keep current live position as the route origin and real POI Cartesian coordinates as destination.
- [x] Calculate remaining route distance from live position.
- [x] Produce bounded geometry-derived straight/left/right/floor-change guidance.
- [x] Surface arrival near the real destination.
- [x] Surface off-route state when the live fix moves materially away from the calculated path.
- [x] Use a clearly internal walking-speed estimate for ETA rather than claiming it is Situm navigation progress.
- [x] Stop guidance by clearing app-owned route state; do not stop foreground positioning unless the user explicitly turns location off.

### Current path-direction decision

The current Situm path response contains link connectivity plus metadata, but this venue contract does not yet expose a separately normalized direction field in the shared model. Plan 041 therefore traverses links symmetrically. If a future venue depends on one-way indoor links, normalize that upstream metadata first rather than guessing from arbitrary tags in the client.

## Phase 04 — automated validation and Android build

Required gates:

- [x] `npm --prefix mobile run typecheck`
- [x] `npm --prefix mobile run lint`
- [x] focused Plan 041 tests
- [x] full `npm test` — **92/92 pass**
- [x] `git diff --check`
- [x] arm64 debug shell build/install completes for physical E2E
- [x] hot/incremental device rebuild proves cache reuse (`52s`, `6 executed / 241 up-to-date`)
- [x] final release Android package rebuilt from the post-E2E source through `npm --prefix mobile run build:android:release` — **BUILD SUCCESSFUL in 1m 53s**, `411/422` tasks up-to-date
- [x] final release artifact `mobile/dist/situm-explore-v1.0.2-android-arm64.apk` recorded at SHA-256 `60ed6a8b5a589364dc61497bf2c0c7c05926fa417586885aba9467d853d9b165`; checksum verification passes and APK native libraries contain only `arm64-v8a`

Root ESLint note: a direct root `npm run lint` currently cannot start when `.nuxt/eslint.config.mjs` has not been generated in the checkout. This is an environment/preparation issue, not a lint finding. Mobile lint is the required lint gate for this mobile-only implementation; root test coverage still runs.

### Automated regression coverage added

- Cartesian lower-left → screen upper-left projection.
- Building aspect-fit behavior.
- Same/cross-floor real graph routing.
- Disconnected graph fails closed.
- Source regression that `NativeMapScreen` contains `CustomIndoorMap` and contains no `MapView`, `SitumProvider`, or `navigateToPoi`.

## Phase 05 — physical Android E2E

Target device: connected Android POS through the existing ADB transport.
Package: `com.situm.explore`.

Acceptance sequence:

- [x] install an arm64 debug shell with app data preserved and use Metro for JS/TS iteration;
- [x] launch without fatal native/React crash;
- [x] wait for authenticated cartography to load;
- [x] confirm the Explore hierarchy exposes the app-owned custom floorplan controls rather than Situm MapView chrome;
- [x] search real POIs from the authenticated venue (`Pintu Masuk`, `Ruang Kerja 3`, `Kitchen`, `Toilet`, etc.);
- [x] select a real POI and verify the app-owned destination sheet;
- [x] switch the real floor from `lt 2` to `lt 1` and verify the rendered floorplan accessibility identity changes with it;
- [x] enter fullscreen and use Android Back to restore Explore;
- [x] verify fullscreen/back preserves the active route after the remount bug found during E2E was fixed;
- [x] start Locate me and receive real Situm indoor fixes for building `19866`, floor `69905` (`lt 2`), including Cartesian x/y, bearing, and ~1.4–1.8 m reported accuracy;
- [x] calculate app-owned Directions from the live fix to real `Ruang Kerja 3` and `Pintu Masuk` destinations;
- [x] verify real route HUD output (`Turn sharply left`, `<1 min`, `20 m` for the same-floor sample and `51 m` for the cross-floor destination sample);
- [x] verify Stop guidance → `Directions stopped.` → Done returns to browse mode;
- [x] verify Recenter returns the map to the live-position floor;
- [x] inspect a bounded logcat slice after the final flow with no `FATAL EXCEPTION` or `E/ReactNativeJS` entries;
- [ ] visually judge pixel-level POI/bluedot/floorplan alignment from a captured screenshot; hierarchy/runtime evidence is complete, but screenshot review remains useful for presentation polish;
- [ ] physically reproduce off-route and arrival transitions by moving the device through the venue; source behavior is covered, but those movement-dependent states were not forced artificially.

The current environment did obtain a real indoor fix and real graph routes, so the bounded Locate/route path is a physical PASS. Movement-dependent arrival/off-route behavior remains unclaimed because it was not physically reproduced.

Post-E2E bug hardening also moved `SitumPlugin.init()` out of session construction and into the explicit fail-closed start path, removed redundant map-screen listener registration, and updated stale Settings copy. The POS was relaunched through the existing debug shell/Metro loop after this change: Locate me received fresh real fixes again, Realtime still rendered the shared active device position, and no fatal/React JS exception appeared.

## Phase 07 — branded launch experience

The final mobile polish keeps the existing Situm Explore logo and dark brand background while moving off the deprecated legacy `splash` config. Expo's supported `expo-splash-screen` config plugin owns the native launch surface; the React layer immediately continues with the same centered image and a dependency-light `Animated` pulse/halo plus wordmark reveal. This avoids a Lottie/native animation dependency and works on the Android 11 POS as well as platforms where Android 12 AnimatedVectorDrawable-only behavior is unavailable.

- [x] Configure native splash through `expo-splash-screen` with `assets/splash-icon.png`, `#111827`, and an Android-safe centered icon size.
- [x] Call `preventAutoHideAsync()` at module scope so the native launch surface stays up until the matching React animation layer mounts.
- [x] Release the native surface from the mounted app-owned launch component on the next animation frame, then start the same-logo animation without waiting on an asynchronous hide promise.
- [x] Animate the same logo with React Native `Animated` only: subtle scale pulse, halo expansion, and Situm Explore wordmark fade-up.
- [x] Gate the final fade-out on both bootstrap readiness and animation completion; do not artificially delay a slow bootstrap with a second loading screen.
- [x] Keep the native splash background opaque and aligned to the app/adaptive-icon brand color.
- [x] Preserve arm64-only/non-clean cached build behavior when native config changes require regeneration.
- [x] Cold-launch the final release artifact on the Android 11 POS and record the launch. `am start -W` reports `LaunchState: COLD` with `TotalTime: 1519 ms`; the app resumes normally with no bounded `FATAL EXCEPTION`/`E/ReactNativeJS` evidence. Logo-only frame analysis (wordmark excluded) measures the white logo bounds expanding from **88×88 px** to **95×94 px** at pulse peak and settling near **90×89 px**, proving the logo itself animates rather than only the wordmark.

Android 12+ can animate `windowSplashScreenAnimatedIcon` through an AnimatedVectorDrawable, but Android's compat implementation cannot animate that icon below API 31. The current POS is Android 11, so Plan 041 deliberately uses a static system-native logo followed by the same-logo React animation for consistent behavior rather than maintaining two divergent launch animations.

## Trial/error rules

Physical screenshots are authoritative for visual acceptance. If the first custom candidate reveals inverted coordinates, wrong physical aspect, inaccessible floor images, POI touch capture, or overlay collision, fix source and repeat build/install/E2E until the tested flow is stable.

Temporary screenshots/hierarchy/log files stay outside the repository or in ignored temporary paths.

## Commit policy

The user explicitly requested automatic local commits.

- Auto-commit coherent source/test changes after validation.
- Auto-commit physical-E2E/documentation evidence after the final device pass.
- Do **not** push, open a PR, merge, deploy, or publish OTA without separate explicit instruction.

Suggested boundaries:

1. `feat(mobile): render indoor map without Situm MapView`
2. `docs(plan): record custom renderer Android E2E`

## Final acceptance criteria

- [x] React Native owns the indoor map renderer.
- [x] Situm visual MapView is absent from native Explore.
- [x] Real building/floor/floorplan/POI/path data come from authenticated server-mediated Situm REST integration.
- [x] Situm native SDK is retained only for headless positioning in this map flow.
- [x] POI markers, destination, route, bluedot, heading, and accuracy are app-owned SVG rendering.
- [x] Route calculation is app-owned and fails closed on disconnected graph data.
- [x] Existing foreground positioning/security boundaries remain intact.
- [x] Existing fullscreen contract remains implemented in source.
- [x] Mobile lint/typecheck and full automated tests pass.
- [x] Arm64 debug shell builds/installs on the connected target and supports Metro hot-reload E2E.
- [x] Physical custom-renderer functional E2E passes for cartography, real positioning, POI selection, same/cross-floor routing, floor switching, fullscreen/back state preservation, recenter, stop, and crash checks.
- [x] Final post-E2E arm64 release package/checksum is produced and verified through the repository release script.
- [ ] Pixel-level screenshot polish plus movement-dependent arrival/off-route remain separate visual/physical follow-ups.
- [x] Worktree changes are auto-committed locally.
- [x] No unrequested push/PR/merge/deploy/OTA occurs.
