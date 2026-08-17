# Plan 030 Final Review — Implementation Approved / Physical E2E Deferred to Plan 032

Status: implementation-approved and integrated via PR #25 at merge commit `2a751216e752a5da85180925878faf1dddbe5187`. Physical-device E2E remains unpassed and is explicitly transferred to Plan 032's mandatory terminal gate.

Reviewed commits: `df7d22b71001e94a4a27a7784a458a2b3fd245be`, `74b9a99a2a991478d6abad58a358eb5ca58a75e1`, `8afb39b56db6c20c44f469df032d6ab0303a371b`.

The findings/closeout sections below preserve review history. All implementation findings are resolved; the current authority is the status above plus the final implementation approval and consolidated Plan 032 carry-over disposition at the end of this file.

## Historical blocking findings

1. **`SitumProvider` auth deadlock.**
   - `mobile/App.tsx` renders `<SitumProvider>` without `apiKey` or `token`.
   - Installed `@situm/react-native` 3.19.2 keeps `isAuthInitialized=false` and does not render provider children until an API key/token prop initializes auth.
   - The current `setApiKey()` call is inside `NativeMapScreen`, which cannot mount while the provider is waiting. This can blank the authenticated app.
   - The local `mobile/src/types/situm-react-native.d.ts` incorrectly hides the provider auth props, so TypeScript did not catch this.
   - Reconcile the declaration with the proven 3.19.2 provider contract and structure the map runtime so the owner-authorized Positioning key is supplied to the provider before SDK-dependent children render. Do not expose broader credentials.

2. **Workspace switch can render a new workspace with stale building/credential state.**
   - `NativeMapScreen` is not keyed/reset synchronously by workspace.
   - After `WorkspaceContext.select()` triggers a render, `workspaceId` is new while `credential`, `cartography`, and `buildingId` can still be from the prior workspace until the effect runs.
   - The MapView key then changes to `${newWorkspaceId}:${oldBuildingId}`, which can remount with the previous workspace's Positioning key/building for one render.
   - Fix the ownership boundary so workspace change tears down old MapView/positioning/navigation before any new-workspace map render. A workspace-keyed runtime or explicitly workspace-bound loaded state is acceptable if proven safe.

3. **Position freshness/current-location gating is not truthful.**
   - `PositionState` declares `stale` but never reaches it.
   - `location` is retained after stop, background transition, location error, and building switch.
   - Directions are disabled only when `location` is null, so an old location can keep Directions enabled after positioning has stopped or after changing buildings.
   - `USER_NOT_IN_BUILDING` is treated as `starting` and raw SDK status text is surfaced.
   - Implement a truthful fresh/no-fix/stale-or-stopped/error boundary. Directions must require a currently valid location for the active workspace/building, not merely any historical `Location` object. Clear/invalidate current-location state on stop/background/error/building/workspace teardown as appropriate.

4. **Building/navigation teardown is incomplete.**
   - `selectBuilding()` stops positioning but does not cancel active MapView navigation.
   - Installed 3.19.2 exposes `MapViewRef.cancelNavigation()`, but the local declaration omits it.
   - Background/workspace/building transitions must not leave navigation state active against stale map context.
   - Add the proven cancel API to the narrow declaration and explicitly cancel/clean navigation on building/workspace/lifecycle teardown where required by Plan 030.

5. **Map-selected POI details fabricate product data.**
   - `onPoiSelected()` constructs `name: "Place <id>"` and `floorId: 0` instead of resolving the real POI already present in workspace cartography.
   - Plan 030 explicitly forbids fake map data.
   - Resolve the selected identifier against the real workspace/building POI dataset. If a POI cannot be resolved, show a truthful unknown/unavailable state rather than inventing name/floor/category values.

6. **API-load retry can dead-end.**
   - When credential/cartography fetch fails, `error` is set while loaded data remains null.
   - The current “Try again” action only clears `error`; the fetch effect dependencies do not change, leaving the screen on an indefinite loading state.
   - Provide a real bounded retry/refetch path while preserving safe errors and owner scope.

## Verified non-blockers / evidence

- Branch is clean and synchronized with `origin/plan/030-native-map-positioning-navigation`.
- `git diff --check origin/main...HEAD` passes.
- Root test suite passes: 13/13.
- `expo-doctor` is 20/21 with only the known `@situm/react-native` New Architecture metadata warning.
- `adb devices` currently has no connected device.
- `mobile/.env` is absent.
- Installed 3.19.2 source confirms `MapView`, `SitumProvider` auth props, `selectFloor`, `selectPoi`, `navigateToPoi`, `cancelNavigation`, User Helper, Remote Configuration, positioning callbacks, and navigation callbacks used by this plan.

## Required closeout

Fix every implementation blocker above first. Add focused regression coverage for pure/testable ownership/freshness/state-transition logic without inventing device behavior. Then rerun root/mobile validation, Expo prebuild/doctor, Android `assembleDebug` with `/home/farismnrr/Android/Sdk`, secret checks, and full branch diff review.

After code remediation, Plan 030 must still remain BLOCKED at Phase 7 until real supported physical-device acceptance can be performed with a reachable app backend, owner-authorized Positioning credential, and calibrated real building/profile. Do not fabricate device evidence, create a PR, merge, or start Plan 031.

## Second reviewer pass — 2026-08-17

The original findings 1–6 are materially resolved in `74b9a99`: the Positioning key reaches `SitumProvider` before SDK children mount, workspace changes key/remount the runtime, current-location freshness is workspace/building-bounded, MapView navigation cancellation is wired, POI selection resolves real cartography, retry refetches, and focused pure regressions pass (16/16 total root tests).

Two implementation blockers remain:

7. **Out-of-route copy overclaims automatic rerouting.**
   - Current `onNavigationOutOfRoute()` renders `You are outside the route. Situm is recalculating.`
   - Installed `@situm/react-native` 3.19.2 proves only the out-of-route callback. Its wrapper source does not prove automatic recalculation/rerouting from that event.
   - Use truthful copy limited to the evidenced state unless runtime/device evidence later proves automatic rerouting.

8. **Positioning stop/navigation state is not fully owned or truthful.**
   - The explicit `Stop positioning` action removes location updates and invalidates the current fix but does not cancel an active navigation, so navigation can remain logically active after its current-location source is intentionally stopped.
   - `cancelNavigation()` always writes `Directions cancelled.` even when no navigation was active; building/effect cleanup can therefore manufacture a cancellation state/message.
   - Make cancellation state conditional on actual navigation ownership/running state, and ensure explicitly stopping positioning cannot leave active navigation against a stopped location source.

`expo-doctor` currently reports 19/21: the known Situm New Architecture metadata warning plus patch-version drift (`expo` 57.0.13 vs expected ~57.0.14 and `expo-build-properties` 57.0.11 vs expected ~57.0.12). These exact versions are frozen by Plan 028/029 authority, so patch drift is not a blocker unless intentionally superseded with new evidence.

After findings 7–8 are fixed, rerun focused/root/mobile validation and diff checks. Physical-device Phase 7 acceptance remains mandatory and blocked until real supported-device/runtime credentials/building evidence exists.

## Final implementation approval — 2026-08-17

Commit `8afb39b56db6c20c44f469df032d6ab0303a371b` resolves findings 7–8. Out-of-route UI now reports only the evidenced outside-route condition. Navigation cancellation is conditional on app-owned or native-running navigation and is invoked on explicit positioning stop, positioning stop/error callbacks, background transition, building switch, and runtime teardown, so stopped location ownership cannot leave active directions behind or manufacture cancellation from an idle state.

Independent reviewer validation passes: root tests 17/17, root lint/typecheck, mobile lint/typecheck, `git diff --check origin/main...HEAD`, and branch clean/synchronized. The reported Expo prebuild and Android `assembleDebug` evidence remains consistent with the reviewed branch; `expo-doctor` 19/21 is limited to the known Situm New Architecture metadata warning plus frozen Expo patch drift and is not a blocker under current authority.

Plan 030 implementation through Phase 6 is approved and integrated via PR #25. Under the consolidated roadmap acceptance decision recorded on 2026-08-17, the supported-Android physical checks are not waived or accepted; they remain explicit unpassed carry-over to Plan 032's non-deferrable final E2E gate. Plan 031 has started from the updated Plan 030 merge baseline; Plan 032 may not close/merge until it discharges the carried Map/positioning/blue-dot/floor/POI/navigation device acceptance.
