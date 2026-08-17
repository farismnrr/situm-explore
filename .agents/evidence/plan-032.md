# Plan 032 Evidence — Web/Native Handoff & Distribution

Date: 2026-08-17
Branch: `plan/032-web-native-handoff-distribution`
Base prerequisite: `2913e3c` contains integrated `ee23bdc`.

## Implementation evidence

- Phase 0: Map Viewer capability is frozen at width ≥768px and height ≥600px; public mobile distribution values are runtime-configured and non-secret.
- Phase 1: native cold-start/foreground Map and Realtime links are parsed once per app lifecycle, pending links survive login, and workspace hints are applied only through the authorized Nitro-backed workspace list.
- Phase 2: `NativeAppGate.vue` is the shared accessible web gate with app link, configured install/download actions, QR, copy link, and truthful unconfigured state.
- Phase 3: phone/short Map layouts render the gate and do not refresh cartography; capable layouts retain the existing Viewer path.
- Phase 4: all web Realtime entry points use the native gate; web Realtime overlays were not reintroduced.
- Phase 5: app schemes, optional iOS/Android HTTPS association, direct-link/QR/store/download fallback are deterministic and contain no timer-based detection.
- Phase 6: mobile version/build policy and external signing/store/artifact boundaries are documented in `docs/mobile-distribution.md`.

## Validation evidence

- Root `npm run build`: passed.
- Root `npm run lint`: passed.
- Root `npm run typecheck`: passed.
- Root `npm test`: passed, 28 tests.
- Mobile `expo prebuild --no-install`: passed.
- Mobile lint/typecheck: passed.
- Android `assembleDebug`: passed with SDK `/home/farismnrr/Android/Sdk`; generated APK remains ignored under `mobile/android/`.
- Expo config rendering: passed.
- Built production preview: `/` returned HTTP 200; existing security headers were present; emitted public mobile config contained only non-secret app-link configuration. No authenticated/physical-device behavior was claimed.
- `git diff --check`: passed before the Phase 7 commit.

## Plan 033 inherited unpassed inventory

The following remain explicitly **UNPASSED** and are handed to Plan 033; this file is an inventory, not acceptance evidence:

1. Plan 030 physical Map/positioning/navigation: real calibrated building load, no demo/foreign flash, permission helper, real start/stop/status/location, blue dot/current floor, real floor transition, known POI, navigation progress/cancel/finish/error, background/resume, workspace switch, logout/restart cleanup.
2. Plan 031 physical Realtime/lifecycle: real authorized workspace positions, workspace isolation, truthful source fields, own-device behavior if required by frozen scope, sensor/Bluetooth/Wi-Fi/background behavior where required, foreground/background/workspace/logout/restart cleanup.
3. Plan 032 cross-client E2E: real phone Map handoff, preserved tablet/desktop Viewer behavior, all web Realtime handoffs, supported Android app-link/open/install behavior, QR/link decoding, logged-out login restoration, workspace authorization, invalid/deleted/unowned context, logout/restart, duplicate-listener checks, and final secret audit.

Plan 033 remains the terminal hard gate. No physical-device, store/install, OS association, or cross-client item was converted to PASS here.
