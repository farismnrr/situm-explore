# Plan 036 — Realtime Reliability Evidence

Date: 2026-08-19
Branch: `plan/036-realtime-reliability`
Target: physical POS `100.113.52.76:35911` (ADB)

## Failure boundary

The original intermittent empty-state symptom did not reproduce during the healthy final-candidate POS runs. The native producer generated repeated sensor-backed Situm fixes, the authenticated server-mediated Realtime route returned the own device, normalization accepted the observed feature, and the mobile UI rendered it across repeated polls.

Source tracing isolated an app-controlled reliability boundary in the mobile polling loop: one `AbortController` was reused by a 10-second interval, allowing overlapping requests and stale response ownership. A deterministic regression test was written first and failed because the coordinator was absent; it passed after introducing `RealtimePollCoordinator`. The fix gives every poll a fresh controller, suppresses overlap, invalidates stale generations on refresh/dispose, and preserves the existing truthful error/empty semantics.

No upstream omission or server-normalization drop was reproduced. The installed SDK contract was independently verified before changing behavior: `@situm/react-native@3.19.2`, Android SDK `3.38.0`, bridge field `realtimeUpdateInterval`, explicit value `REALTIME`. The installed AAR reports a 1-second REALTIME interval. The native request remains scoped to the selected `buildingIdentifier`.

## Changes

- Added explicit `REALTIME` upload cadence to the shared foreground positioning request.
- Added generation-safe, non-overlapping Realtime polling.
- Added sanitized native producer, native-fix, mobile poll, server fetch, and normalization count diagnostics.
- Bounded native-fix diagnostics to at most one heartbeat every 10 seconds per active positioning session, with the throttle reset for each new start and on stop so a restarted session reports its first fix promptly.
- Added bounded normalization statistics while retaining fail-closed malformed-feature handling.
- Added regression coverage for polling ownership, explicit cadence/building scope, and normalization counts.

## Physical POS acceptance

| Check | Result | Evidence |
|---|---|---|
| Explore start produces repeated real fixes | PASS | Native bridge logged `REALTIME`; repeated `SITUM_PROVIDER` fixes and `positioning.native_fix_received`. |
| Explore → Realtime continuity | PASS | Realtime showed `Live location active`, one reported position, building/floor, source and accuracy. |
| Multiple consecutive polls | PASS | Four consecutive `realtime.poll_success` events returned `count: 1`, with `empty: false`. |
| Direct Realtime start | PASS | Stop/start sequence produced fresh native fixes and one reported position. |
| Explicit stop | PASS | Native bridge reported `STOPPED`; UI did not fabricate immediate disappearance. |
| Active Explore ↔ Realtime transitions | PASS | Realtime retained one reported position and active producer across the transition. |
| Background / foreground | PASS | Background stopped the producer; foreground returned with positioning off and did not silently restart it. |
| Network interruption / recovery | PASS | Removing only the API reverse route showed a truthful unavailable/try-again state; restoring it and refreshing returned a truthful current empty response without app restart. |
| Credentials/secrets in UI/logs/evidence | PASS | Diagnostics contain only counts, states, IDs needed for building scope, and timestamps; no credentials, headers, or raw payloads. High-frequency native fixes are throttled to a bounded 10-second heartbeat. |

The initial debug install showed the expected Expo “Unable to load script” redbox before Metro was started. After Metro was started and the bundle reloaded, the candidate app authenticated and completed all acceptance runs without an app crash. A later UiAutomator duplicate-registration fatal was tooling-side, not an app process failure.

## Automated validation

- `npm test` — 68/68 passed.
- `npm run lint` — passed.
- `npm run typecheck` — passed.
- `npm run build` — passed.
- `mobile: npm run lint` — passed.
- `mobile: npm run typecheck` — passed.
- `mobile: npm run build:android` — passed (`BUILD SUCCESSFUL`).
- `git diff --check` — passed.
- Debug APK installed on the physical POS and revalidated after the final candidate build.

No production deployment, Android release publication, PR, or merge was performed.
