# Plan 032 final implementation review — one final deep-link lifecycle remediation required

Reviewed 2026-08-17 on `plan/032-web-native-handoff-distribution`, implementation through `ab35054`.

## Outcome

The two prior Plan 032 review blockers are resolved in `ab35054`: deep-link building hints are cleared after Map consumption and on workspace selection, and install targets are now chosen by OS independently of viewport width with all configured Android/iOS choices exposed on desktop/unknown platforms.

Independent reviewer validation passes 30/30 root tests plus root/mobile lint/typecheck and `git diff --check`.

Plan 032 is **not PR-ready yet** because one non-device foreground deep-link lifecycle blocker remains.

## Prior blocking findings — resolved in `ab35054`

1. **Stale building hint could leak across later workspace/navigation changes.** Resolved: `WorkspaceContext.select()` clears `requestedBuildingId`, `NativeMapScreen` snapshots the requested building as a one-shot initial value and calls `clearRequestedBuilding()` after consumption, and focused regression coverage asserts cleanup.

2. **Native App Gate defaulted wider/unknown clients to iOS.** Resolved: platform detection is now independent of viewport geometry, Android/iOS clients receive matching configured options, and desktop/unknown clients receive all configured platform options through `getNativeInstallOptions()` with focused regression coverage.

## Remaining blocking finding

3. **A foreground Map deep link to another building in the already-selected workspace can be ignored while Explore is already mounted.** `NativeMapScreen` now snapshots `workspaces.requestedBuildingId` only once with `useState(...)`, while `App.tsx` keys `NativeMapScreen` only by `selectedWorkspaceId`. When a new foreground Map link targets the same workspace but a different `buildingId`, `WorkspaceContext.applyDeepLink()` updates `requestedBuildingId`, but the existing `NativeMapScreen` instance does not remount and its `initialBuildingId` snapshot does not change. The new hint is therefore not consumed/applied even though Plan 032 explicitly owns foreground deep-link routing. The previous key containing `requestedBuildingId` forced a remount but also coupled remounting to hint clearing; the remediation needs a one-shot request/remount mechanism that applies each new Map building hint exactly once without retaining stale context or remount-looping when the hint is cleared.

Add focused regression coverage that proves two sequential Map deep links to different buildings in the same authorized workspace can each produce a distinct one-shot Map request/remount/application, while manual workspace changes still clear stale hints.

This is a Plan 032 implementation lifecycle issue, not a physical-device/full-cross-client Plan 033 acceptance item.

## Reviewer validation

Independent checks at `ab35054`:

- root tests: 30/30 pass;
- root lint and Nuxt typecheck pass;
- mobile lint and typecheck pass;
- `git diff --check origin/main...HEAD` passes;
- branch is clean and synchronized with `origin/plan/032-web-native-handoff-distribution` before this reviewer-doc update.

Agent-reported root build, Expo config validation and other Plan 032 non-device evidence remain recorded in `.agents/evidence/plan-032.md`.

## Plan 033 carry-over

All Plan 030/031 physical-device acceptance and Plan 032 real cross-client/open/install/auth/workspace/secret-audit E2E remain explicitly **UNPASSED** for Plan 033. Do not consume or relabel those items during this remediation.

## Handoff

Resolve finding 3, add focused lifecycle regression coverage, rerun root/mobile validation plus build/diff/secret checks as appropriate, update evidence/state truthfully, commit and push, then return for final reviewer approval. Stop before PR/merge and do not start Plan 033.
