# Plan 032 final implementation review — remediation required

Reviewed 2026-08-17 on `plan/032-web-native-handoff-distribution`, implementation through `faad63e`.

## Outcome

Plan 032 is **not PR-ready yet**. The overall handoff/distribution direction is correct, the Plan 033 acceptance inventory remains explicitly unpassed, and independent reviewer validation passes 28/28 tests plus root/mobile lint/typecheck and `git diff --check`. Two non-device implementation blockers remain and must be remediated before Plan 032 approval.

## Blocking findings

1. **Deep-link building context is not one-shot and can leak across later workspace/navigation changes.** `WorkspaceContext.applyDeepLink()` stores `requestedBuildingId`, and `NativeMapScreen` consumes it as `initialBuildingId`, but `clearRequestedBuilding()` is never called and normal `select()` does not clear it. After a Map deep link, a later manual workspace switch or a later return to Explore can therefore reuse the old building hint; if another workspace happens to contain the same numeric building ID, the stale hint can silently select that building. Deep-link routing context is an untrusted navigation hint and must not survive beyond its intended application. Make the building hint one-shot or otherwise clear it on manual workspace change/after safe consumption without causing a remount that loses the intended initial selection. Add focused regression coverage for cross-workspace stale-hint cleanup.

2. **The shared Native App Gate selects install destinations from viewport width and defaults non-phone layouts to iOS.** `NativeAppGate.vue` sets `isMobileBrowser` from `(max-width: 767px)` and then chooses Android vs iOS store/download URLs only when that geometry flag is true; otherwise it selects the iOS URLs. An Android tablet wider than 767px can therefore receive iOS install/download actions, and desktop/tablet gates expose only one platform instead of the configured platform choices required by the Plan 032 fallback contract. Platform selection may use OS/user-agent detection, but Map capability must remain geometry-based. Separate those concerns: on recognized mobile OS choose the matching platform regardless of viewport width; on desktop/unknown platforms expose the applicable configured Android/iOS install choices rather than silently defaulting to iOS. Add focused regression coverage for Android tablet and desktop/unknown-platform behavior.

These are Plan 032 implementation/fallback-integrity findings. They are not physical-device or full cross-client E2E items and therefore must not be deferred to Plan 033.

## Reviewer validation

Independent reviewer checks at `faad63e`:

- root tests: 28/28 pass;
- root lint and Nuxt typecheck pass;
- mobile lint and typecheck pass;
- `git diff --check origin/main...HEAD` passes;
- branch is clean and synchronized with `origin/plan/032-web-native-handoff-distribution`.

Agent-reported build/runtime evidence remains recorded in `.agents/evidence/plan-032.md`: root production build, Expo prebuild/config, Android `assembleDebug`, production-preview HTTP/security-header smoke, diff and secret checks. The full Plan 030/031 physical-device acceptance and Plan 032 cross-client/open/install/auth E2E remain explicitly unpassed for Plan 033.

## Plan 033 carry-over

Do not consume Plan 033 during remediation. The existing `.agents/evidence/plan-032.md` inventory remains the terminal acceptance inventory and must stay unpassed until real Plan 033 evidence exists.

## Handoff

Remediate both findings, add focused regressions, rerun root/mobile validation plus build/diff/secret checks as appropriate, update evidence/state truthfully, commit and push, then return for final reviewer approval. Stop before PR/merge and do not start Plan 033.
