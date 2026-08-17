# Plan 029 Final Review — Remediation Required

Status: NOT PR-ready yet.

Reviewer verified the implementation branch at `696bb32` and reran Android build evidence on 2026-08-17.

## Blocking findings

1. Mobile login seals the wrong h3 session bucket.
   - `server/utils/mobile-session.ts` omits `session.name` from `mobileSessionConfig()`.
   - `setUserSession(...)` uses the nuxt-auth-utils runtime session name (`nuxt-session`), but direct `h3.sealSession(event, config)` falls back to h3 default name `h3` when `config.name` is absent.
   - Result: the returned mobile session can seal an empty `h3` session instead of the authenticated `nuxt-session` session.
   - Fix the config/session sealing path and add regression proof that the returned mobile session authenticates through `x-nuxt-session`.

2. Session revocation accepts legacy/unversioned sessions.
   - `assertCurrentSessionVersion()` rejects only when `version` is a number and mismatched.
   - A session with missing/undefined `sessionVersion` therefore passes when the user exists.
   - Production revocation requires missing/invalid versions to fail closed. Add regression coverage for legacy/unversioned, matching, mismatched, and revoked sessions.

3. Plan 029-specific auth/security regression coverage is missing.
   - Current root test suite remains the existing 9 tests and does not exercise mobile login/session/revocation/Positioning ownership.
   - Add focused tests for the new security-critical contracts without introducing a new test framework.

4. Workspace switching/restoration is not reliably reactive or persistent.
   - `WorkspaceContext.select()` mutates class fields without a React state update/subscription.
   - The selected workspace is not restored across an ordinary app restart; load falls back to the first workspace.
   - Fix reactivity and satisfy the plan's workspace restoration requirement using the smallest appropriate persistence boundary. Do not persist credentials.

5. Native shell does not yet satisfy the approved responsive/design authority.
   - Phone bottom navigation is rendered through a default column `View`, not a horizontal bottom-nav layout.
   - There is no distinct compact tablet/POS rail; only bottom nav below 900px and a full ~220px rail above it.
   - Canonical brand mark/Lucide-style icon language is not used; a text `S` mark substitutes for the approved product mark.
   - `AppState === active` is labeled `Online`, which falsely equates foreground lifecycle with network availability.
   - Reconcile the shell with `DESIGN.md` and `design/reference/situm-explore-native-responsive-prototype.html` without implementing Plan 030/031 features.

6. Android closeout evidence is incorrect.
   - Android SDK exists at `/home/farismnrr/Android/Sdk`.
   - Reviewer reran `expo prebuild --clean --no-install`, then `ANDROID_HOME=/home/farismnrr/Android/Sdk ANDROID_SDK_ROOT=/home/farismnrr/Android/Sdk ./gradlew assembleDebug -PreactNativeArchitectures=arm64-v8a --max-workers=2 --console=plain`.
   - Result: `BUILD SUCCESSFUL in 1m 23s`; debug APK generated at `mobile/android/app/build/outputs/apk/debug/app-debug.apk`.
   - Update plan/state/session evidence and remove the false Android-SDK external gate.

## Additional review note

The narrow TypeScript path for `@situm/react-native` exists, but tracked Plan 029 code currently has no direct import from the package. Do not overclaim runtime/type integration from that alias alone; keep the claim bounded to the evidence actually exercised.

## Required closeout

After fixes:
- run root baseline validation and focused new regression tests;
- run mobile lint/typecheck/prebuild and Android `assembleDebug` with the known SDK path;
- run bounded secret checks;
- review the full branch diff against `origin/main`;
- update Plan 029/state/durable evidence truthfully;
- commit and push remediation;
- stop before PR/merge and report PR readiness.

Do not start Plan 030.
