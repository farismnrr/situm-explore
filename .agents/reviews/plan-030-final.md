# Plan 030 Final Review — Remediation Required

Status: NOT PR-ready. Physical-device acceptance remains externally blocked, but reviewer found implementation blockers that must be fixed first.

Reviewed commit: `df7d22b71001e94a4a27a7784a458a2b3fd245be`.

## Blocking findings

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
