# Plan 031 final implementation review — final visual-truthfulness remediation required

Reviewed 2026-08-17 on `plan/031-native-realtime-operations`, implementation commits through `79b6cfb`.

## Outcome

The three prior implementation/runtime-integrity blockers are resolved in `79b6cfb`: caller cancellation now reaches the underlying fetch without being converted into a timeout, unsupported local freshness thresholds/labels are removed, and malformed Realtime payloads fail closed. Independent reviewer checks pass 21/21 tests plus root/mobile lint/typecheck and `git diff --check`.

Plan 031 is **not PR-ready yet** because one final visual-truthfulness blocker remains in the Realtime row presentation.

The frozen v1 scope does not include person identity, online/idle/offline presence, trajectories, generic remote MapView markers/focus, Share Live Location, background positioning, or own-device publishing beyond the existing Plan 030 foreground positioning boundary.

## Prior blocking findings — resolved in `79b6cfb`

1. **Realtime cancellation does not reach the HTTP request.** `RealtimeScreen` passes an `AbortSignal` to `MobileApiClient.get()`, but `mobile/src/api/client.ts` creates its own `AbortController` and overwrites `options.signal` in `fetch()`. Workspace switch, background, unmount, and logout therefore stop state application but do not actually cancel the in-flight network request as required by Plan 031. Compose/forward the caller signal into the request timeout controller (or an equivalent proven cancellation path), clean listeners, and add focused regression coverage that proves caller cancellation aborts the underlying fetch without being misreported to UI as a timeout/error.

2. **Freshness labels are fabricated from local thresholds.** `realtimeFreshness()` defines `fresh <= 60s`, `older <= 5m`, and `stale > 5m` without upstream evidence. Plan 031 explicitly says not to fabricate freshness semantics. Source time may be shown and a neutral age/duration may be derived, but do not label records fresh/older/stale unless an authoritative contract supplies those semantics or the product authority explicitly freezes a threshold with evidence. Remove/update tests that currently canonize the unsupported 60s/5m classification.

3. **Malformed payloads can masquerade as an empty/partial Realtime result.** `normalizeRealtimeResponse()` returns `[]` for a malformed response and silently filters invalid records. That can turn schema/upstream corruption into the product state “No positions reported,” which is not truthful failure handling. Fail closed on an invalid response shape (and preferably on invalid records unless partial acceptance is explicitly justified), surface a safe Realtime error, preserve last successful data only under the existing refresh-failure policy, and add regression coverage for malformed payload behavior.

The three findings above are resolved in `79b6cfb` and are no longer blocking.

## Remaining blocking finding

4. **Green row dot still implies unsupported positive/fresh/online state.** After removing the local freshness classifier, every Realtime position row still renders `styles.dot` with success green `#168754`. The Realtime contract has no authoritative per-record online/fresh/healthy boolean, and Plan 031 explicitly forbids implying every device is online. A success-colored status indicator without a proven meaning is still semantic overclaim even when nearby copy says presence is not inferred. Remove the status dot or make it visually neutral/non-status in a way that cannot reasonably encode freshness/presence. Add a focused presentation/source assertion if practical so unsupported green/amber/red status semantics do not regress.

This is a non-device visual-truthfulness finding, not Plan 032 physical-device carry-over.

## Evidence and validation

- Phase 0 authority and SDK findings: `.agents/evidence/plan-031-realtime.md`.
- Focused and full root tests pass: 20/20.
- Root lint, Nuxt typecheck, production build, and `git diff --check` pass.
- Mobile typecheck and lint pass.
- Expo prebuild passes without tracked generated-file drift.
- Android `assembleDebug` passes with `/home/farismnrr/Android/Sdk`, min/compile/target 24/36/36, and the frozen Expo 57 toolchain.
- Expo Doctor has two recorded baseline findings: advisory patch-version drift for Expo packages and `@situm/react-native` not marked New Architecture-tested. The frozen versions were not changed during this plan.
- Secret review found no new Realtime credential/config exposure. Existing Plan 030 Positioning credential plumbing remains separate and is not used by Realtime.

## Plan 032 carry-over — explicitly unpassed

- Supported physical-device Realtime lifecycle with real authorized workspace data.
- Own-device physical positioning/publishing behavior as it relates to Realtime.
- Any physical sensor/BLE/Wi-Fi behavior and background/resume behavior.
- Physical-device confirmation of navigation away/back, workspace switching, logout, and restart across the accumulated Plan 030 + Plan 031 lifecycle.

These are not claimed as passed. Plan 032 remains the mandatory terminal physical-E2E gate.

## Handoff

Branch was clean/synchronized at reviewed HEAD before this reviewer-doc update. Remediate all three findings, rerun focused/root/mobile validation plus diff/secret checks, commit/push, and return for reviewer approval. Keep physical-device-only Realtime/native lifecycle items explicitly unpassed for Plan 032. Do not create a PR/merge or start Plan 032.
