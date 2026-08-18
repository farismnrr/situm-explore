# Plan 035 — Realtime Remediation Evidence

Date: 2026-08-18
Branch: `plan/035-realtime-remediation`

## Reproduced symptom and root cause

The physical POS launched authenticated Realtime and rendered `No positions reported` from the server-mediated route. This was confirmed as truthful backend/UI behavior rather than a rendering failure. Source tracing showed that Explore's `NativeMapRuntime` owned process-global Situm positioning and called `removeLocationUpdates()` in its unmount cleanup. `App.tsx` unmounts Explore when switching to Realtime, so an explicitly started native session could be stopped by the tab change. The installed SDK also uses singleton callback setters, so independent screen listeners could overwrite one another.

## SDK and backend contract evidence

- Installed `@situm/react-native@3.19.2`: `mobile/node_modules/@situm/react-native/src/sdk/index.ts` shows process-global `positioningRunning`, `requestLocationUpdates()` no-ops when already running, `removeLocationUpdates()` stops the native session, and `onLocationUpdate`/status/error/stopped setters replace one callback without unsubscribe handles.
- Installed `@situm/sdk-js@0.25.0`: `node_modules/@situm/sdk-js/dist/situm-sdk.d.ts` defines `RealtimePositions` as coordinate-bearing GeoJSON `features` plus `devicesInfo`; `getPositions()` supports `maxSecThreshold` and calls `/api/v1/realtime/positions`.
- The server route continues to map only `result.features`. This is correct: `devicesInfo` contains device metadata, not a coordinate-bearing position, and must not be fabricated into one when features are empty.
- A one-off runtime probe using the existing server environment credential printed counts only: `{"features":0,"devicesInfo":0}`. No credential value was printed or persisted.
- Realtime mobile code still requests only `/api/workspaces/:workspaceId/situm/realtime`; it does not request or log any Situm credential.

## Architecture before/after

Before: `NativeMapScreen -> NativeMapRuntime -> request/removeLocationUpdates + singleton listeners`.

After: `authenticated shell -> ForegroundPositioningSession -> SitumPlugin`; Explore consumes the session snapshot and owns map/guidance presentation. The session starts only after explicit Locate me, obtains the existing dedicated POSITIONING credential, installs the singleton callbacks once, persists across Explore/Realtime tab changes, and stops on explicit stop, workspace switch, logout, background, native error/stopped, or teardown. Realtime remains a server-polled consumer.

## Files changed

- `mobile/src/positioning/session.ts`
- `mobile/App.tsx`
- `mobile/src/map/NativeMapScreen.tsx`
- `test/mobile-plan-035-positioning.test.ts`
- `plans/035-realtime-remediation.md`
- `.agents/state.md`, `.agents/memory/decisions.md`, `.agents/sessions/2026-08-18.md`

## Validation

PASS:

- `git diff --check`
- `npm test` — 56 tests passed after reviewer remediation
- `npm run lint`
- `npm run typecheck`
- `cd mobile && npm run lint`
- `cd mobile && npm run typecheck`
- focused Plan 035 tests — all passed
- `ANDROID_HOME=/home/farismnrr/Android/Sdk ANDROID_SDK_ROOT=/home/farismnrr/Android/Sdk npm run build:android` — BUILD SUCCESSFUL

The first build attempt without Android SDK environment variables failed with the environment's missing SDK location; rerunning with the existing local SDK path passed. No repository config was changed for that environment fix.

## Physical POS evidence

Device `100.113.52.76:35911`:

- ADB connected; display content is 1366×720 landscape.
- Reverse mappings verified: `tcp:3000 -> tcp:3005`, `tcp:8081 -> tcp:8099`.
- Debug APK installed and app relaunched successfully.
- UI hierarchy verified authenticated Realtime, `Realtime positions`, `No positions reported`, and truthful no-presence notice. Explore navigation was reached and Map showed `Locate me`.
- After tapping Locate me, logcat recorded Situm `LOCATION` code `8002` / “Location must be enabled to scan Bluetooth, Wi-Fi and GPS”; Android location dump still showed `network provider enabled=false` and `last location=null`.
- No sensor-backed location or upstream own-device position was observed. The app opened the vendor User Helper/Location settings flow. Reviewer remediation then rechecked the device after Location/Bluetooth/provider settings were enabled. Android reported Location enabled, Bluetooth on, and `network provider enabled=true`, but `last location` remained null. A fresh Locate-me attempt entered Situm `CALCULATING` and then `STOPPED` without any sensor-backed location update. Explore → Realtime → Explore remained stable and Realtime truthfully stayed empty. The corrected lifecycle therefore still cannot be physically exercised through successful own-device publishing on this device.

## Acceptance classification

| Item | Result | Evidence |
|---|---|---|
| Realtime symptom classified | PASS | POS UI + route probe + source trace |
| Screen unmount no longer owns native stop | PASS | `ForegroundPositioningSession`, source-contract test |
| Explore → Realtime → Explore session ownership | PASS | controller architecture + deterministic tests |
| Explicit stop/workspace switch/logout | PASS | controller paths + deterministic tests |
| Background/restart semantics | PASS | background test; new process starts stopped |
| Native error/stopped fail-closed | PASS | reviewer remediation now tears down the native producer on fatal error/`USER_NOT_IN_BUILDING`; deterministic tests assert native stop |
| Guidance/navigation ownership retained | PASS | existing Plan 030/034 tests remain green; navigation remains Explore-owned |
| Realtime server mediation/security | PASS | source-contract test and unchanged server route boundary |
| Features/devicesInfo handling | PASS | installed typings/runtime probe; features-only mapping retained |
| Root/mobile tests, lint, typecheck, diff check | PASS | commands above |
| Android build/install and POS UI route | PASS | Gradle, ADB, UI hierarchy |
| Sensor-backed own-device Realtime publishing/navigation | BLOCKED | device now reports provider enabled, but no last location; Situm `CALCULATING → STOPPED` produces no location update |

No secrets, raw credentials, fabricated positions, invented freshness/presence, or unsupported physical PASS claims are included here.

## Reviewer remediation — 2026-08-18

- Fatal native positioning errors and `USER_NOT_IN_BUILDING` now invalidate the session generation, best-effort stop the native producer, clear protected location state, and retain an explicit error state.
- Focused Plan 035 tests: 9/9 PASS.
- Full root suite: 56/56 PASS; root/mobile lint and typecheck plus `git diff --check` PASS.
- Physical POS rerun: authenticated Explore and Realtime navigation PASS; no crash/redbox. Location/Bluetooth/network provider are now enabled, but the device still has no last location and Situm immediately transitions `CALCULATING → STOPPED`, so own-device Realtime publishing remains honestly BLOCKED.

## Runtime permission remediation — 2026-08-18

A follow-up source audit found that the app declared Android location/Bluetooth permissions through the merged Situm manifest but did not explicitly request Android runtime permissions before `requestLocationUpdates()`. The installed `@situm/react-native@3.19.2` wrapper delegates directly to `SitumSdk.locationManager().requestLocationUpdates(...)` and does not perform a React Native runtime permission request on this path.

`ForegroundPositioningSession` now runs an explicit permission gate before fetching the dedicated POSITIONING credential or starting native positioning. On Android it requests coarse + fine location, and on API 31+ also Bluetooth scan/connect. Permission denial fails closed and never starts the native producer. Deterministic tests cover granted, denied, and permission-before-credential ordering.

Physical POS verification on Android 11/API 30 used package-level permission revocation followed by the app permission path. Android PermissionController logs recorded a real LOCATION permission grant for `com.situm.explore`, and `dumpsys package` confirmed fine/coarse became granted. Expo's debug warning overlay overlaps the Locate-me hit area, so automated visual-dialog capture was unreliable and no fabricated visual-dialog PASS is claimed.

Validation after the remediation: focused Plan 035 tests 12/12 PASS; full root tests 59/59 PASS; root lint/typecheck PASS; mobile lint/typecheck PASS; `git diff --check` PASS.


## Full physical Realtime remediation — 2026-08-18

After the runtime-permission remediation, the physical POS produced real indoor Situm locations. Logcat recorded `SITUM_PROVIDER` updates for building `19866`, floor `69905`, around `-6.150659, 106.896613`, with HIGH quality and approximately 1.3 m accuracy. This supersedes the earlier physical BLOCKED classification; no synthetic position was injected.

The first successful published position exposed a server mapping defect that could not occur while `features` was empty: the workspace Realtime route assumed `feature.properties.time` was a JavaScript `Date` and called `.toISOString()`. The actual SDK/runtime value was transport-shaped, producing `TypeError: feature.properties.time.toISOString is not a function` and the physical `Realtime unavailable` screen. A shared server normalizer now accepts valid Date/string/number timestamps, validates the minimal coordinate payload, keeps `features` as the sole position source, and drops malformed upstream features instead of throwing an unhandled 500. Regression fixtures cover the actual string timestamp shape plus Date/malformed inputs.

Physical E2E on `100.113.52.76:35911` after rebuilding the local amd64 staging image and force-recreating only the staging container:

- Realtime loaded without the previous 500 and initially showed `Live location is off` plus `Enable live location`.
- Starting live location directly from Realtime entered Situm STARTING/PREPARING/WIFI_SCAN_THROTTLED/STARTING_POSITIONING/CALCULATING and then emitted repeated real location updates.
- The own-device card changed to `Live location active`.
- After the server poll cycle, Realtime rendered `1 position`, Building `19866`, Floor `69905`, and approximately `1.3 m` reported accuracy.
- Switching Realtime → Explore preserved the active positioning producer and continued receiving HIGH-quality `onLocationChanged` callbacks.
- Explore's app-owned location control is now in the lower-left control zone (observed bounds `[234,659][332,698]` on the 1366×720 POS) rather than competing with Situm's right-side controls. The large custom guidance HUD was removed so Situm's built-in navigation UI owns guidance presentation; the app retains only a compact owned `Stop guidance` affordance.
- Explicit Stop location returned the Explore control to `Locate me` and native positioning reached STOPPED.

Validation for this remediation: root tests 61/61 PASS; root lint/typecheck PASS; mobile lint/typecheck PASS; `git diff --check` PASS. The local staging image was rebuilt as linux/amd64 and used only to recreate `deploy-situm-explore-1`; no registry push or production change was performed.

### Updated physical acceptance

| Item | Result | Evidence |
|---|---|---|
| Android runtime permission gate | PASS | PermissionController/package grant evidence + deterministic tests |
| Sensor-backed Situm positioning | PASS | repeated real `SITUM_PROVIDER` location callbacks, HIGH quality |
| Own-device start from Realtime | PASS | `Enable live location` → active shared session |
| Situm Cloud/server-mediated Realtime path | PASS | backend poll returned and UI rendered one real reported position |
| Realtime timestamp normalization | PASS | physical 500 reproduced, defensive normalizer + regression tests, physical rerun |
| Explore ↔ Realtime positioning continuity | PASS | location callbacks continued after tab transition |
| Landscape control containment | PASS for observed location/guidance ownership | app control moved left; duplicate large guidance HUD removed |

The earlier sections documenting LOCATION 8002/provider/no-fix behavior are retained as historical diagnostic evidence, but they are no longer the final acceptance state after the runtime permission remediation and successful physical rerun.
## Standalone Android distribution + UI polish — 2026-08-18

- Settings navigation icon replaced with an explicit gear glyph and Settings sign-out action restyled as a danger control.
- Added 1024×1024 launcher/adaptive icon assets and a 512×512 splash asset, wired through Expo config.
- Added the staging runtime download URL `https://minio.farismunir.my.id/situm-explore/android/latest.apk`; no APK is bundled into the Nuxt/Docker image.
- Generated Android native project from Expo config and built `assembleRelease` with `reactNativeArchitectures=arm64-v8a`, `EXPO_PUBLIC_ENVIRONMENT=staging`, and `EXPO_PUBLIC_API_BASE_URL=https://situm.farismunir.my.id`. Build PASS.
- Release artifact size is approximately 36 MB. SHA256: `3dad7c4d41c42c9a5820567ba50fa97f452a05c5d412f3a38dd9d776fda776e7`.
- APK inspection confirmed only `arm64-v8a`, an embedded `assets/index.android.bundle`, the public Situm API hostname, and no `127.0.0.1:3000` marker.
- Installed release APK on physical POS `100.113.52.76:35911`; launch PASS with `com.situm.explore/.MainActivity` focused and no fatal/Metro/RNCSafeAreaProvider errors. Existing authenticated session loaded Explore. UI hierarchy confirmed the gear-backed Settings destination, Settings screen, Sign out control, and Realtime screen.
- Full validation after distribution polish: root tests 61/61 PASS; root lint PASS; root typecheck PASS; mobile lint PASS; mobile typecheck PASS; release Android build PASS; `git diff --check` PASS.
- MinIO upload and staging container recreate are intentionally not claimed here until authenticated MinIO write access is explicitly approved and the public object download is verified.

