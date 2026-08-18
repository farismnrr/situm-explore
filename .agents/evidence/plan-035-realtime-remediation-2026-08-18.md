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
- `npm test` — 55 tests passed
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
- No sensor-backed location or upstream own-device position was observed. The app opened the vendor User Helper/Location settings flow. The corrected lifecycle therefore cannot be physically exercised through a successful positioning start on this device.

## Acceptance classification

| Item | Result | Evidence |
|---|---|---|
| Realtime symptom classified | PASS | POS UI + route probe + source trace |
| Screen unmount no longer owns native stop | PASS | `ForegroundPositioningSession`, source-contract test |
| Explore → Realtime → Explore session ownership | PASS | controller architecture + deterministic tests |
| Explicit stop/workspace switch/logout | PASS | controller paths + deterministic tests |
| Background/restart semantics | PASS | background test; new process starts stopped |
| Native error/stopped fail-closed | PASS | deterministic callback tests |
| Guidance/navigation ownership retained | PASS | existing Plan 030/034 tests remain green; navigation remains Explore-owned |
| Realtime server mediation/security | PASS | source-contract test and unchanged server route boundary |
| Features/devicesInfo handling | PASS | installed typings/runtime probe; features-only mapping retained |
| Root/mobile tests, lint, typecheck, diff check | PASS | commands above |
| Android build/install and POS UI route | PASS | Gradle, ADB, UI hierarchy |
| Sensor-backed own-device Realtime publishing/navigation | BLOCKED | external vendor/device blocker: `LOCATION 8002`, network provider disabled, no last location |

No secrets, raw credentials, fabricated positions, invented freshness/presence, or unsupported physical PASS claims are included here.
