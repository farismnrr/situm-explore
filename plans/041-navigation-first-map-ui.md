# Plan 041 — Navigation-First Native Map UI

Status: **active / PHASE-01 complete / PHASE-02–03 implementation complete / PHASE-04 next**
Branch: `plan/041-navigation-first-map-ui`
Depends on: current `main` through PR #38 (`845b437`), including workspace Situm isolation and the explicit Explore fullscreen mode.

## Goal

Rework the React Native Explore experience into a navigation-first indoor map UI inspired by the supplied reference: Situm remains the map, positioning, route, and navigation engine while Situm Explore owns the visible search, destination, guidance, floor, location, and route-status controls.

## Success criteria

- Normal Explore remains usable as the existing authenticated Situm Explore product shell.
- The map is visually dominant and app-owned controls feel like one navigation product rather than a thin wrapper around Situm MapView.
- Users can search real current-building POIs, select a destination, start positioning, start real Situm navigation, follow/recenter, change floor, and stop guidance without fabricated data.
- Active navigation presents a compact turn/guidance HUD using only fields proven by the installed `@situm/react-native@3.19.2` contract.
- Remaining distance and ETA are shown only when supplied by real `NavigationProgress`; no synthetic route metrics are created.
- Fullscreen keeps the Plan 040 contract: app shell and ordinary Explore overlays disappear. Android Back exits fullscreen.
- Connected Android POS acceptance passes with the supplied test account, including login, map load, POI selection/search, location lifecycle, fullscreen regression, and navigation interaction where the live Situm environment provides a routable destination/current fix.

## Scope

### In scope

- `mobile/src/map/NativeMapScreen.tsx` Explore/map presentation and interaction hierarchy.
- Narrow map-domain helpers/types when needed to keep UI state deterministic and testable.
- Local `@situm/react-native` TypeScript declarations only when the exact installed/public 3.19.2 runtime surface is verified.
- Existing React Native token/layout primitives and `react-native-svg`; no new UI framework.
- Automated mobile validation plus physical Android ADB trial/error and E2E.
- Product/agent documentation only where behavior or durable execution state actually changes.

### Out of scope

- Forking or modifying Situm's native SDK internals.
- Replacing Situm MapView with a custom map renderer.
- AR navigation.
- Background positioning.
- Realtime map markers or people-presence semantics.
- Synthetic turn instructions, route geometry, distance, ETA, floor transitions, or other capability not proven by the installed/current Situm contract.
- Web UI changes, backend redesign, production deployment, OTA publication, PR creation, or merge.

## Current state

- The native client already uses `@situm/react-native` MapView plus a shared shell-scoped `ForegroundPositioningSession`.
- Current Explore can load authenticated workspace cartography, select a real POI, start/stop positioning, start/cancel Situm navigation, follow the user, receive navigation progress/destination/out-of-route callbacks, and enter the shell-free fullscreen mode.
- Current visible map UI is minimal: a fullscreen trigger, Locate me, a selected-POI sheet, and Stop guidance. Several already-tracked navigation values are not currently rendered.
- Official Situm React Native documentation exposes richer `NavigationProgress` fields including `distanceToGoal`, `distanceToEndStep`, `timeToGoal`, `timeToEndStep`, `currentStepIndex`, `nextIndication`, and `routeStep`; exact installed-package compatibility must be verified before consuming any field beyond the current local declaration.
- The connected Android target is available through ADB as `100.113.52.76:37371` and has `com.situm.explore` installed.

## Constraints & decisions

- Keep Situm as engine and route/map renderer; build the experience as React Native overlays around the official MapView.
- Preserve the two-key credential/security model. Mobile must receive only the already-approved owner-authorized Only Read/positioning material; no Read & Write secret may enter the client.
- Search/filter only the already-authorized real cartography POIs for the current building.
- Prefer explicit state derived from real Situm callbacks over visual imitation. If an instruction field cannot be proven in 3.19.2, omit it instead of inventing copy such as “turn right.”
- Preserve accessibility labels for ADB/UIAutomator-driven acceptance and at least 44px touch targets where practical.
- Preserve responsive phone/tablet/POS behavior. The connected POS is the primary physical acceptance target, not the only layout target.

## Phase overview

| Phase | Goal | Depends on | Exit criteria |
| --- | --- | --- | --- |
| PHASE-01 | Freeze the real Situm navigation data contract and navigation-first UI state model | none | 3.19.2 package/runtime surface verified; plan/state active; no speculative fields |
| PHASE-02 | Build browse/search/destination/floor/location map controls | PHASE-01 | real POI search/selection and map controls work without breaking fullscreen |
| PHASE-03 | Build active guidance HUD and route progress presentation | PHASE-01, PHASE-02 | guidance uses real Situm navigation data and supports follow/recenter/stop |
| PHASE-04 | Automated validation and Android build/install | PHASE-02, PHASE-03 | lint/typecheck/tests/build pass and candidate is installed on connected device |
| PHASE-05 | Physical ADB trial/error and E2E closeout | PHASE-04 | connected-device flows pass or any external/runtime limitation is recorded truthfully |

## PHASE-01 — Situm contract and UI-state foundation

**Goal:** Prove exactly which navigation fields/actions are usable in the installed 3.19.2 wrapper and establish small deterministic display helpers before presentation changes depend on them.

### TASK-001 — Install and inspect the frozen mobile dependencies

**Outcome:** Exact package source/types for `@situm/react-native@3.19.2` are locally inspectable.

**Files:**
- Inspect: `mobile/package.json`
- Inspect: `mobile/package-lock.json`
- Inspect: installed `mobile/node_modules/@situm/react-native/**`

**Steps:**
- [x] Run clean dependency installation from the existing lockfile.
- [x] Verify package version is exactly 3.19.2.
- [x] Inspect `NavigationProgress`, `Indication`, `RouteStep`, MapView ref actions, and navigation callbacks.
- [x] Confirm fields are forwarded/typed by this installed package before adding them to the local declaration.

**Validation:**
- Package version/source matches 3.19.2 and required fields are present.

### TASK-002 — Narrow local type/state helpers

**Outcome:** Local TypeScript declarations and pure helpers expose only proven fields needed by UI formatting/state.

**Files:**
- Modify if required: `mobile/src/types/situm-react-native.d.ts`
- Modify: `mobile/src/map/state.ts`
- Add/modify focused existing-script tests only if useful under the repository's current lightweight test convention.

**Steps:**
- [x] Add proven navigation-progress/indication fields only.
- [x] Add pure format/selection helpers for distance, ETA, floor, and search state as needed.
- [x] Keep unknown/optional fields nullable and fail-safe in presentation.

**Validation:**
- `cd mobile && npm run typecheck`
- `cd mobile && npm run lint`

**Commit boundary:** `feat(mobile): establish navigation-first map state`

**Phase exit criteria:**
- [x] No speculative Situm field is consumed.
- [x] Mobile lint/typecheck pass.
- [x] Plan/state/session persistence reflects the verified contract.

## PHASE-02 — Browse, search, destination, floor, and location UI

**Goal:** Make normal Explore map-first and destination-oriented while keeping current real capability intact.

### TASK-003 — Build navigation-first browse overlay

**Outcome:** Explore presents app-owned navigation controls over the existing Situm MapView.

**Files:**
- Modify: `mobile/src/map/NativeMapScreen.tsx`

**Steps:**
- [x] Add a compact top destination/search surface using real current-building POIs.
- [x] Filter locally by POI name/category and provide accessible selectable results.
- [x] Selecting a result calls the existing MapView `selectPoi` path and updates the destination sheet.
- [x] Keep tap-on-map POI selection synchronized with the same destination UI.
- [x] Add a compact app-owned floor control from authorized cartography, wired to `selectFloor`.
- [x] Move Locate me/recenter/fullscreen into a coherent control stack that avoids the previous Situm-control collision zones by design; physical confirmation remains in PHASE-05.
- [x] Keep positioning permission/error semantics unchanged and truthful.
- [x] Keep selected destination actions clear: Directions, Clear, and location prerequisite state.

**Validation:**
- `cd mobile && npm run lint`
- `cd mobile && npm run typecheck`
- UIAutomator hierarchy exposes stable accessibility labels for search, destination results, floor controls, Locate me, Directions, and fullscreen.

**Commit boundary:** `feat(mobile): redesign Explore destination controls`

**Phase exit criteria:**
- [x] Search uses real POIs only.
- [x] Floor switching uses real floors only.
- [x] Normal Explore remains shell-integrated in source/layout ownership.
- [ ] Existing fullscreen semantics remain intact on the physical device.

## PHASE-03 — Active navigation guidance UI

**Goal:** Turn existing real Situm navigation callbacks into the supplied reference's navigation-first experience without fabricating guidance.

### TASK-004 — Render active guidance HUD

**Outcome:** During real navigation, the UI clearly presents destination, remaining route progress, instruction/progress information when proven, and stop/recenter controls.

**Files:**
- Modify: `mobile/src/map/NativeMapScreen.tsx`
- Modify if needed: `mobile/src/map/state.ts`

**Steps:**
- [x] Store the latest real `NavigationProgress` rather than only `distanceToGoal`.
- [x] Show remaining distance from Situm.
- [x] Show ETA from Situm `timeToGoal` after installed-contract verification.
- [x] Show documented Situm indication action/orientation strings through a bounded human-readable mapping with a safe generic fallback.
- [x] Display destination name and active floor context only when known.
- [x] Support follow/recenter and explicit Stop guidance without changing the shared foreground positioning lifecycle.
- [x] Handle out-of-route, arrival, cancellation, and navigation-error states visibly and cleanly.
- [x] Hide browse search/results while active/outcome guidance HUD is shown.

**Validation:**
- `cd mobile && npm run lint`
- `cd mobile && npm run typecheck`
- Source/runtime inspection confirms every displayed metric originates from Situm navigation callbacks.

**Commit boundary:** `feat(mobile): add real-time navigation guidance HUD`

**Phase exit criteria:**
- [x] No invented turn/ETA/distance semantics in source; every metric is callback-derived.
- [ ] Guidance controls are reachable and non-overlapping on the connected POS layout.
- [ ] Fullscreen remains shell-free under the existing Plan 040 rule on device.

## PHASE-04 — Automated validation, Android build, and install

**Goal:** Produce a clean Android candidate on the connected device.

### TASK-005 — Run regression gates

**Outcome:** Code is statically and behaviorally clean before physical interaction testing.

**Steps:**
- [ ] Run `git diff --check`.
- [ ] Run relevant root tests that cover native positioning/navigation contracts where present.
- [ ] Run root lint/typecheck only if shared/root files were changed; otherwise keep validation scoped to mobile plus repository-required diff checks.
- [ ] Run `cd mobile && npm run lint`.
- [ ] Run `cd mobile && npm run typecheck`.
- [ ] Run existing focused mobile tests affected by map/navigation behavior.
- [ ] Build Android debug APK with the repository's native build path.

### TASK-006 — Install candidate through ADB

**Outcome:** Connected Android POS is running the candidate branch build.

**Steps:**
- [ ] Verify target package/device before install.
- [ ] Install/update the built APK without clearing app data unless a test explicitly requires a clean-login state.
- [ ] Launch `com.situm.explore/.MainActivity` and verify no startup crash.

**Validation:**
- Build exits 0.
- `adb shell dumpsys package com.situm.explore` confirms installed candidate package.
- Relevant logcat slice has no fatal React Native/native crash.

**Commit boundary:** `test(mobile): validate navigation-first Android candidate`

**Phase exit criteria:**
- [ ] Required automated checks pass.
- [ ] Candidate is installed and launches on the connected device.

## PHASE-05 — Physical Android trial/error and E2E closeout

**Goal:** Exercise the actual UX on the connected POS and fix interaction/layout defects until the bounded acceptance is stable.

### TASK-007 — Authenticated ADB E2E

**Outcome:** The navigation-first Explore flow works on the real connected device.

**Transient test account:** use the credentials supplied in chat only; never write the password to repository files, logs, plans, or evidence.

**Steps:**
- [ ] Launch app and authenticate if the existing secure session is not already valid.
- [ ] Wait for authenticated cartography/map load before judging layout.
- [ ] Capture hierarchy/screenshot evidence outside the repository or under ignored temporary paths only.
- [ ] Verify normal Explore shell + redesigned map UI fit the 1366x720 POS without overlap.
- [ ] Search for a real visible POI and select it.
- [ ] Clear and reselect destination from both search and map when practical.
- [ ] Exercise floor selector against real available floors.
- [ ] Start Locate me and wait for a real Situm positioning result; do not count permission UI alone as a fix.
- [ ] Start Directions to a real destination when the current position and venue permit routing.
- [ ] Verify guidance HUD values update from real callbacks; test recenter/follow and Stop guidance.
- [ ] Verify fullscreen entry still removes all app shell/overlays and Android Back restores normal Explore.
- [ ] Re-run after any UI fix until hierarchy, screenshot, logcat, and interaction evidence agree.

**Validation:**
- No fatal/crash logcat signal.
- No control collision/obscured primary action in the tested POS layout.
- POI/search/floor/location/navigation actions are bound to real Situm data/runtime.
- Any inability to physically route due venue/sensor/environment state is recorded as an external acceptance limitation rather than fabricated PASS.

### TASK-008 — Closeout and persistence

**Outcome:** Repository accurately records what changed and what was actually verified.

**Files:**
- Update: `plans/041-navigation-first-map-ui.md`
- Update: `.agents/state.md`
- Update: relevant `.agents/knowledge/` only for reusable device/UI interaction discoveries.
- Append: `.agents/sessions/2026-09-02.md`
- Update product docs only if the product contract materially changed.

**Steps:**
- [ ] Record exact automated and physical acceptance results.
- [ ] Keep screenshots/log payloads free of credentials/secrets.
- [ ] Review final branch diff and staged content.
- [ ] Commit and push the task branch according to repository policy.
- [ ] Do not open a PR, merge, publish OTA, or deploy without a separate explicit user instruction.

**Commit boundary:** `docs: close Plan 041 navigation-first map UI`

**Phase exit criteria:**
- [ ] Working tree is clean.
- [ ] Branch is pushed and synchronized.
- [ ] Plan claims only verified results.

## Risks & rollback

- **Situm hosted MapView control collisions** → keep app-owned overlays in bounded safe zones; test on the connected POS after map load rather than relying only on source layout.
- **Published package type gaps** → inspect installed 3.19.2 source and keep the local declaration narrow; revert any field whose runtime contract is not confirmed.
- **Navigation cannot start without a fresh venue position** → retain browse/search/floor testing and record route E2E as environment-blocked rather than faking progress.
- **Search overlay becomes too dense on small/landscape screens** → cap result height, collapse after selection/navigation start, and preserve map interaction area.
- **Fullscreen regression** → keep Plan 040 as a hard regression gate and use Android Back for deterministic exit.

## Final acceptance criteria

- [ ] Navigation-first React Native UI is implemented around Situm MapView without forking Situm SDK.
- [ ] Real POI search/destination/floor/location controls work.
- [ ] Real navigation progress drives the guidance HUD; synthetic route facts are absent.
- [ ] Existing foreground-only positioning/security boundaries are preserved.
- [ ] Existing fullscreen contract is preserved.
- [ ] Mobile lint/typecheck/build and relevant focused tests pass.
- [ ] Candidate is installed and exercised on the connected Android POS with ADB.
- [ ] Physical results and any external limitations are recorded truthfully.
- [ ] No production deployment, OTA publication, PR, or merge occurs in this plan without separate authorization.

## Execution handoff

Execute phases sequentially because later UI depends on the verified 3.19.2 data contract. Browse/floor visual work and pure helper work may be implemented in parallel only after PHASE-01 establishes the exact Situm fields. Physical E2E is the final gate and should drive bounded trial/error fixes before closeout.
