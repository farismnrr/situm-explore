# Plan 034 Explore Navigation Refactor Evidence — 2026-08-18

## Implementation

- `mobile/src/map/NativeMapScreen.tsx` now renders the authenticated Situm `MapView` as the dominant surface. The permanent dashboard welcome panel, custom place list, floor list, verbose location card, custom Explore/building chrome, and custom search fallback were removed. Situm owns search, venue/building, floor, and POI controls; selected POI details and guidance remain compact product overlays.
- Guidance owns explicit browse/positioning/following/free-pan/outside-route/arrived/cancelled/error states in `mobile/src/map/state.ts`. Real Situm callbacks drive navigation state and the HUD. Progress uses `NavigationProgress.distanceToGoal` and `closestLocationInRoute`; no turn instructions or fake route metrics are created.
- The ambient declaration in `mobile/src/types/situm-react-native.d.ts` was aligned with the installed frozen package for `followUser`, `unfollowUser`, and `closestLocationInRoute`.
- Added `test/mobile-plan-034-explore.test.ts` for guidance transitions, recenter, ownership, freshness, and workspace/building guards.

## Frozen SDK findings

Verified in `mobile/node_modules/@situm/react-native` version 3.19.2:

- `MapViewRef.followUser()` and `unfollowUser()` send the supported camera follow commands.
- `MapViewRef.navigateToPoi({ identifier })` and `cancelNavigation()` are available.
- `SitumPlugin` exposes navigation start/progress/destination/out-of-route/cancellation/error callbacks.
- `NavigationProgress.distanceToGoal` and `closestLocationInRoute` are available.
- `MapViewProps` has no public pan/zoom/gesture callback. The internal message callback is not a stable gesture contract, so no gesture heuristic was invented. Automatic free-pan detection remains an SDK limitation; recenter is implemented for supported non-following guidance states.

## Static validation

- Root `npm test`: PASS, 47/47.
- Root `npm run lint`: PASS.
- Root `npm run typecheck`: PASS.
- Mobile `npm run lint`: PASS.
- Mobile `npm run typecheck`: PASS.
- Focused Plan 030/031/032/033/034 tests: PASS, 25/25.
- `git diff --check`: PASS.

## Physical POS inspection

Device: `100.113.52.76:35911`, observed content target `1366×720`.

- Authenticated real cartography loaded for the real workspace/building. A screenshot and UIAutomator inspection showed the native map occupying `[222,66]–[1352,720]`, with the app rail/topbar as the only persistent product chrome. Situm's own map search/floor/POI controls remained native SDK UI.
- No custom `Select a place`, `PLACES`, `LEVELS`, Explore label, instance-name pill, or search button was present. Situm's native search/venue/floor/POI controls remained visible without a redbox or crash; only the product location action remained as a small overlay.
- Initial UIAutomator bounds exposed the location action at the system navigation inset; the overlay was moved upward. Retest showed `Find my location` / `Locate me` at `[1257,677]–[1340,716]`, fully visible.
- Tapping the normal `Locate me` flow opened the real Situm User Helper. The device then reproduced `LOCATION` code `8002`, with `network provider enabled=false` in `dumpsys location`. The helper dialog remained factual (`Location is turned off` / `OPEN SETTINGS`); no fake position, blue dot, route, or guidance state was shown. Dismissing the helper returned to the live map.
- Navigation/progress/follow/recenter could not be physically exercised beyond this real positioning blocker. This is a positioning-dependent BLOCKED result, not a PASS.

## Remaining gate

Plan 034 remains incomplete until a supported runtime provides the required enabled provider/sensor path and real Positioning credential flow can proceed through current location, navigation, and lifecycle acceptance. The refactor itself is statically validated and physically verified up to the genuine blocker.
