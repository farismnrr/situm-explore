# Plan 031 Realtime evidence

Reviewed 2026-08-17 on `plan/031-native-realtime-operations`.

## Frozen v1 scope

Native Realtime is an operational device-position list/detail experience for the selected owned workspace. A record contains only the current backend contract: position identity, optional device ID, Situm source time, building ID, floor ID, accuracy, latitude, and longitude. The UI displays the source timestamp and does not infer freshness, `online`, `idle`, or `offline` presence from local thresholds.

The own handset remains a separate Plan 030 native positioning concern. Plan 031 does not add background positioning or own-device publishing because no product requirement or runtime evidence requires it beyond foreground positioning already owned by Plan 030.

## Authority and SDK evidence

- `server/api/workspaces/[workspaceId]/situm/realtime.get.ts` calls the authenticated owner-scoped `getWorkspaceSitumClient()` and sanitizes `realtime.getPositions()` to the fields listed above.
- The route derives Situm authority from the encrypted workspace credential on the server. It does not return a raw primary, Viewer, or Positioning credential.
- The installed `@situm/react-native` 3.19.2 source exposes `requestRealTimeUpdates()` / `removeRealTimeUpdates()` and a `RealTimeRequest` with building plus poll time. The same package exposes Share Live Location session hooks on `MapView`.
- The installed source does not prove that the native generic realtime API is equivalent to the application workspace boundary, nor does it prove the dedicated Positioning credential's permission for remote monitoring or provide the product's sanitized application identity semantics. Share Live Location is session-based and is not Realtime Positions.
- Consequently, remote monitoring uses `/api/workspaces/:workspaceId/situm/realtime`; the native Positioning credential is not widened and no native remote marker/focus integration is shipped.

## Runtime policy

- Mobile fetches immediately when the Realtime destination is mounted and polls at a bounded 10-second cadence while the destination is foreground-active.
- Polling and in-flight requests stop when the destination unmounts, the app backgrounds, the workspace changes, or the user logs out through the existing authenticated shell lifecycle.
- Source timestamps, empty, loading, timeout/auth, and upstream-error states remain explicit and retryable; no unsupported freshness threshold is applied.
- Realtime response normalization fails closed when the response shape or any record is invalid, so upstream corruption cannot masquerade as an empty or partial result. Refresh failures preserve the last successful positions under the existing screen policy.
- An unauthenticated/forbidden refresh clears the previously displayed records before showing the auth error, so expired sessions do not leave location data visible in the native shell.

## Validation notes

- Root tests, lint, typecheck, and production build pass.
- Mobile typecheck and lint pass; Expo prebuild is clean and Android `assembleDebug` passes with the frozen Expo 57.0.13 / SDK 36 toolchain.
- Focused Plan 031 regressions prove caller cancellation reaches the underlying fetch without becoming a timeout, invalid Realtime payloads fail closed, and unsupported local freshness classifications are absent.
- `npx expo-doctor` reports the repository's already-frozen Expo patch versions (`expo` 57.0.13 vs advisory 57.0.14 and `expo-build-properties` 57.0.11 vs advisory 57.0.12) and that `@situm/react-native` is not marked New Architecture-tested. These are recorded baseline/tooling findings, not silently upgraded during Plan 031.

## Unsupported / carried forward

Generic remote Situm MapView markers/focus remain unproven and absent. Physical-device Realtime lifecycle and own-device positioning/publishing behavior remain unpassed Plan 032 carry-over under the consolidated physical-E2E policy.
