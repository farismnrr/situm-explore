# Plan 032 final implementation review — one final deep-link lifecycle remediation required

Reviewed 2026-08-17 on `plan/032-web-native-handoff-distribution`, remediation implementation through `f72697b`.

## Outcome

The two prior Plan 032 review blockers are resolved in `ab35054`: deep-link building hints are cleared after Map consumption and on workspace selection, and install targets are now chosen by OS independently of viewport width with all configured Android/iOS choices exposed on desktop/unknown platforms.

Remediation validation passes 31/31 root tests plus root/mobile lint/typecheck and `git diff --check`; production build, Expo config rendering, and Android debug compilation also pass with the configured SDK path.

Plan 032 is **not PR-ready yet** because this remediation still requires final reviewer confirmation; the implementation blocker described below has been resolved on the working branch.

## Prior blocking findings — resolved in `ab35054`

1. **Stale building hint could leak across later workspace/navigation changes.** Resolved: `WorkspaceContext.select()` clears `requestedBuildingId`, `NativeMapScreen` snapshots the requested building as a one-shot initial value and calls `clearRequestedBuilding()` after consumption, and focused regression coverage asserts cleanup.

2. **Native App Gate defaulted wider/unknown clients to iOS.** Resolved: platform detection is now independent of viewport geometry, Android/iOS clients receive matching configured options, and desktop/unknown clients receive all configured platform options through `getNativeInstallOptions()` with focused regression coverage.

## Remediated finding — validation pending final reviewer confirmation

3. **Resolved on the remediation branch:** `WorkspaceContext` now emits monotonic `mapRequest` values, `NativeMapScreen` consumes each request exactly once, and only the local native Map runtime key includes the applied request ID. A second foreground link to another building in the already-selected workspace therefore produces a distinct runtime application without changing the parent Explore key or remounting when the context request is cleared.

Focused regression coverage now proves two sequential Map deep links to different buildings produce distinct one-shot requests, repeated consumption is idempotent, and source wiring clears requests on workspace changes without a parent remount-loop key.

This is a Plan 032 implementation lifecycle issue, not a physical-device/full-cross-client Plan 033 acceptance item.

## Reviewer validation

Independent checks at `ab35054`:

- root tests: 31/31 pass;
- root lint and Nuxt typecheck pass;
- mobile lint and typecheck pass;
- `git diff --check origin/main...HEAD` passes;
- branch is clean and synchronized with `origin/plan/032-web-native-handoff-distribution` before this reviewer-doc update.

Agent-reported root build, Expo config validation and other Plan 032 non-device evidence remain recorded in `.agents/evidence/plan-032.md`.

## Plan 033 carry-over

All Plan 030/031 physical-device acceptance and Plan 032 real cross-client/open/install/auth/workspace/secret-audit E2E remain explicitly **UNPASSED** for Plan 033. Do not consume or relabel those items during this remediation.

## Handoff

Final reviewer should confirm the request-id lifecycle remediation and its 31-test validation. Stop before PR/merge and do not start Plan 033.
