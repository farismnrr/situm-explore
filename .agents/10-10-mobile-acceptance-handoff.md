# Mobile 10/10 Acceptance Handoff

## Mission
Tuntaskan hardening + physical acceptance mobile sampai benar-benar 10/10. Trial/error, fix, rebuild, retest sampai semua acceptance criteria hijau. Berhenti hanya jika selesai atau ada blocker eksternal nyata dengan evidence jelas.

## Execution rules
- Gunakan workspace tools/terminal/ADB/Docker bila perlu.
- Boleh logout/login device.
- Smoke credential diberikan user di conversation; gunakan dari prompt/context, jangan persist credential ke repo/docs/log permanen/test fixture/ai-self.
- Jangan reset/revert working tree sebelum audit.
- Jangan publish permanen ke production/MinIO kecuali memang diperlukan dan aman. Prefer temporary HTTPS staging feed untuk OTA acceptance.
- Jangan claim physical pass hanya karena accessibility tree punya node; control harus benar-benar usable.
- Commit source/docs valid setelah final gates hijau dan pastikan git status clean.
- Hapus temporary acceptance junk/cache dari repo.

## Current branch/state
Branch: `feature/mobile-update-password-keyboard-ux`

Known working tree around handoff:
- M docs/mobile-distribution.md
- M mobile/.env.example
- M mobile/App.tsx
- M mobile/package-lock.json
- M mobile/package.json
- M mobile/scripts/android-update.test.ts
- M mobile/scripts/build-android-release.cjs
- D mobile/scripts/login-keyboard-geometry.test.ts
- D mobile/src/loginKeyboardGeometry.ts
- M mobile/src/update/androidUpdate.ts
- ?? mobile/.acceptance-gradle.pid
- ?? mobile/.gradle-acceptance/
- ?? mobile/scripts/login-keyboard-strategy.test.ts
- ?? mobile/src/loginKeyboardStrategy.ts

Audit current state again; it may have advanced.

## What is already proven
- Expo Doctor reached 21/21 after dependency/config cleanup.
- Password eye toggle physical test passed: masked -> visible -> masked.
- Real smoke login passed and reached `Test Situm / Explore`, `Workspace ready`, `Signed in`.
- A real keyboard bug was discovered: Android `ADJUST_RESIZE` + RN `KeyboardAvoidingView behavior="height"` caused double-resize and collapsed Sign in to ~2 px in landscape.
- Source was fixed to remove double-resize.
- Patched physical retest passed with IME actually shown and Sign in ~46 px tall, plus Email/Password/eye toggle usable.
- Do not regress this.
- Old keyboard geometry test was identified as a false-positive/disconnected helper. Replacement strategy test/files exist; audit that they are meaningful and tied to production behavior. Do not keep fake tests.
- Updater hardening started: HTTPS URL validation, malformed/credential URL rejection, schema/platform/versionCode/SHA validation, fail-open behavior.
- Release script hardening started: explicit version/versionCode, public HTTPS API/release URLs, no localhost fallback.

## Device
Previously connected ADB device:
`100.113.52.76:35911`

Package:
`com.situm.explore`

Known baseline at handoff:
- versionName 1.0.0
- versionCode 1

## Existing artifacts
At one point these existed:
- mobile/dist/situm-explore-v1.0.0-android-arm64.apk
- mobile/dist/situm-explore-v1.0.1-android-arm64.apk
- mobile/dist/situm-explore-v1.0.1-android-arm64-final-e2e.apk

Known candidate SHA at one point:
`5bc42540d1ea8966d765881e7ff7f34220344d579ae1511de76ee3bb20f074b4`

Do not blindly trust them. Revalidate source freshness, version metadata, ABI, signing, embedded endpoints, manifest and checksum.

## Temporary OTA lab
Cloudflare quick tunnels were used and are ephemeral. Old hostnames included:
- refrigerator-ladies-panel-bingo.trycloudflare.com
- citizens-vaccine-gui-necessary.trycloudflare.com

Assume dead unless verified. Recreate a temporary HTTPS feed if needed.

A temporary Docker image may exist:
`si­tum-android-builder:acceptance` / `situm-android-builder:acceptance`

It was intended only to work around MCP Node/JDK environment issues. Do not add it as project infrastructure. Root inside an ephemeral Docker builder is okay; do not use host sudo. Normalize workspace ownership afterward. Prefer normal host build if available.

## Required OTA positive acceptance
Prove the actual app-driven flow, not `adb install` as a substitute:
1. Device starts on baseline versionCode 1.
2. Baseline build points to a temporary HTTPS staging manifest reachable from device.
3. Feed at versionCode 1 => no false update modal.
4. Flip feed to version 1.0.1 / versionCode 2.
5. Trigger app lifecycle update check.
6. Confirm update modal appears.
7. Tap Download update from app UI.
8. Confirm Android OS installer opens.
9. Complete upgrade through OS installer UI.
10. Confirm installed package versionName=1.0.1 and versionCode=2.
11. Launch app and verify session/data behavior is sane/preserved.
12. Smoke Explore, Realtime, Recent, Settings.
13. Scan logcat for fatal RN/Android crashes.
14. Confirm no repeated update prompt when installed version equals feed.

## OTA negative/fail-open acceptance
Cover unreachable manifest, HTTP error/malformed JSON, invalid schema/platform/versionCode/URL/SHA. App must remain usable and must not lock login/app shell. Automated tests required; physical runtime fail-open smoke where practical.

## Physical acceptance checklist
- [ ] clean/cold launch
- [ ] login screen usable in landscape
- [ ] keyboard does not collapse Sign in
- [ ] password masked -> visible -> masked
- [ ] empty/wrong auth sane if practical
- [ ] real smoke login succeeds
- [ ] authenticated tabs navigate
- [ ] Realtime renders sane server state
- [ ] Settings account/workspace sane
- [ ] logout works
- [ ] login again works
- [ ] no-update state works
- [ ] positive update modal works
- [ ] Download update opens OS installer
- [ ] OS installer upgrades code 1 -> 2
- [ ] post-upgrade app/session sane
- [ ] versionCode 2 confirmed
- [ ] no repeated update prompt on current version
- [ ] unreachable/bad manifest fail-open physical smoke
- [ ] no fatal crash/logcat

## Required automated gates
Root:
- tests
- lint
- typecheck
- production Nuxt build where relevant

Mobile:
- typecheck
- lint
- updater tests
- meaningful keyboard/login regression tests
- security regression tests
- `npx expo-doctor` full green
- Android release arm64-only build
- release script syntax/contract checks
- `git diff --check`

## Final artifact checks
- clean versioned APK filename
- app name Situm Explore
- package id com.situm.explore
- correct versionName/versionCode
- arm64-v8a only
- checksum matches APK
- manifest SHA matches APK
- latest manifest points to immutable versioned APK
- publish-order contract documented (stable latest manifest last)
- no localhost/dev backend embedded
- FINAL release candidate has canonical production distribution URL, not temporary tunnel URL
- acceptance-only APK/feed must be clearly temporary and not treated as final release

## Docs hygiene
`docs/` and README explain product/project. `.agents/` is execution/process material. Keep that separation. Update `docs/mobile-distribution.md` with accurate release/version/update/install/smoke flow.

## Second-pass review
Before final commit, do a reviewer/Codex pass focused on:
- false-positive tests
- updater URL/security validation
- lifecycle duplication/races
- repeated modal behavior after Later
- versionCode comparison
- Android Linking/install behavior
- landscape keyboard usability
- release script stale version/dev endpoint risks

Fix valid findings and rerun gates.

## Definition of 10/10
Do not stop merely because tests are green. 10/10 means source correctness + automated gates + Expo health + physical keyboard/auth + real app-driven OTA installer path + negative updater behavior + final production-style artifact validation + current docs + temporary junk removed + committed clean working tree.

## Final report
Report:
- bugs found during trial/error
- exact fixes
- automated results/counts
- physical acceptance evidence
- final APK version/versionCode/SHA256
- branch + commit hash
- anything intentionally not published externally
- explicit 10/10 judgment and why
