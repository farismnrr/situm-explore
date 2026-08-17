# Plan 031 final implementation review — implementation approved

Reviewed 2026-08-17 on `plan/031-native-realtime-operations`, implementation commits through `c02a8f3`.

## Outcome

The three prior implementation/runtime-integrity blockers are resolved in `79b6cfb`: caller cancellation now reaches the underlying fetch without being converted into a timeout, unsupported local freshness thresholds/labels are removed, and malformed Realtime payloads fail closed. Independent reviewer checks pass 21/21 tests plus root/mobile lint/typecheck and `git diff --check`.

Plan 031 implementation is **approved and integrated via PR #26** at merge commit `655fde0153cd206eedae975bd25693bc48753a0b`. The final visual-truthfulness blocker is resolved in `c02a8f3`: Realtime rows no longer render an unsupported green status indicator, and focused regression coverage prevents status-colored row semantics from returning.

The frozen v1 scope does not include person identity, online/idle/offline presence, trajectories, generic remote MapView markers/focus, Share Live Location, background positioning, or own-device publishing beyond the existing Plan 030 foreground positioning boundary.

## Prior blocking findings — resolved in `79b6cfb`

1. **Realtime cancellation does not reach the HTTP request.** `RealtimeScreen` passes an `AbortSignal` to `MobileApiClient.get()`, but `mobile/src/api/client.ts` creates its own `AbortController` and overwrites `options.signal` in `fetch()`. Workspace switch, background, unmount, and logout therefore stop state application but do not actually cancel the in-flight network request as required by Plan 031. Compose/forward the caller signal into the request timeout controller (or an equivalent proven cancellation path), clean listeners, and add focused regression coverage that proves caller cancellation aborts the underlying fetch without being misreported to UI as a timeout/error.

2. **Freshness labels are fabricated from local thresholds.** `realtimeFreshness()` defines `fresh <= 60s`, `older <= 5m`, and `stale > 5m` without upstream evidence. Plan 031 explicitly says not to fabricate freshness semantics. Source time may be shown and a neutral age/duration may be derived, but do not label records fresh/older/stale unless an authoritative contract supplies those semantics or the product authority explicitly freezes a threshold with evidence. Remove/update tests that currently canonize the unsupported 60s/5m classification.

3. **Malformed payloads can masquerade as an empty/partial Realtime result.** `normalizeRealtimeResponse()` returns `[]` for a malformed response and silently filters invalid records. That can turn schema/upstream corruption into the product state “No positions reported,” which is not truthful failure handling. Fail closed on an invalid response shape (and preferably on invalid records unless partial acceptance is explicitly justified), surface a safe Realtime error, preserve last successful data only under the existing refresh-failure policy, and add regression coverage for malformed payload behavior.

The three findings above are resolved in `79b6cfb` and are no longer blocking.

## Final visual finding — resolved in `c02a8f3`

4. **Green row dot implied unsupported positive/fresh/online state.** The unsupported success-green per-row status indicator was removed from `RealtimeScreen`, along with its status style. The regression suite now asserts that the row source does not render `styles.dot` or reintroduce green/amber/stale status semantics. Realtime rows are limited to device/position identity, building/floor, accuracy, and source time.

## Evidence and validation

- Phase 0 authority and SDK findings: `.agents/evidence/plan-031-realtime.md`.
- Focused and full root tests pass: 22/22, including caller abort propagation, fail-closed payload validation, unsupported freshness absence, and Realtime-row status-indicator regression coverage.
- Root lint, Nuxt typecheck, production build, and `git diff --check` pass.
- Mobile typecheck and lint pass.
- Expo prebuild passes without tracked generated-file drift.
- Android `assembleDebug` passes with `/home/farismnrr/Android/Sdk`, min/compile/target 24/36/36, and the frozen Expo 57 toolchain.
- Expo Doctor has two recorded baseline findings: advisory patch-version drift for Expo packages and `@situm/react-native` not marked New Architecture-tested. The frozen versions were not changed during this plan.
- Secret review found no new Realtime credential/config exposure. Existing Plan 030 Positioning credential plumbing remains separate and is not used by Realtime.

## Plan 033 carry-over — explicitly unpassed

- Supported physical-device Realtime lifecycle with real authorized workspace data.
- Own-device physical positioning/publishing behavior as it relates to Realtime.
- Any physical sensor/BLE/Wi-Fi behavior and background/resume behavior.
- Physical-device confirmation of navigation away/back, workspace switching, logout, and restart across the accumulated Plan 030 + Plan 031 lifecycle.

These are not claimed as passed. After the 2026-08-17 acceptance split, Plan 033 is the mandatory terminal full-E2E gate.

## Handoff

Independent reviewer validation passed at `c02a8f3`: 22/22 tests, root/mobile lint and typecheck, and `git diff --check`. Plan 031 was subsequently integrated via PR #26. Physical-device-only Realtime/native lifecycle items remain explicitly unpassed Plan 033 carry-over. Plan 032 may proceed from the updated Plan 031 merge baseline, but must not claim those device checks passed.
