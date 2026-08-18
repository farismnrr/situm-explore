# Execution Prompt — Plan 034 Login Keyboard UX Remediation

You are executing a bounded remediation inside the existing Situm Explore repository.

## Workspace and branch

Repository root:

`/home/farismnrr/Projects/situm-explore`

Active branch expected:

`plan/034-full-e2e-acceptance`

Do not create a new roadmap plan or branch unless the user explicitly asks. This remediation belongs under Plan 034.

## Primary authority

Read and follow this file first:

`/home/farismnrr/Projects/situm-explore/.agents/execution/plan-034-login-keyboard-ux-remediation.md`

Parent acceptance authority:

`/home/farismnrr/Projects/situm-explore/plans/034-full-e2e-acceptance.md`

Current durable project state:

`/home/farismnrr/Projects/situm-explore/.agents/state.md`

Relevant previous UI/UX authority:

`/home/farismnrr/Projects/situm-explore/plans/033-native-ui-ux-reference-reconciliation.md`

Canonical native reference:

`/home/farismnrr/Projects/situm-explore/design/reference/situm-explore-native-responsive-prototype.html`

Relevant current implementation files:

- `/home/farismnrr/Projects/situm-explore/mobile/App.tsx`
- `/home/farismnrr/Projects/situm-explore/mobile/app.config.ts`
- `/home/farismnrr/Projects/situm-explore/Makefile`

Relevant evidence location:

`/home/farismnrr/Projects/situm-explore/.agents/evidence/`

## Existing local state — preserve it

There are already uncommitted changes related to this remediation and staging build behavior. Do not reset, discard, or overwrite them blindly.

Expected modified files at start may include:

- `/home/farismnrr/Projects/situm-explore/mobile/App.tsx`
- `/home/farismnrr/Projects/situm-explore/mobile/app.config.ts`
- `/home/farismnrr/Projects/situm-explore/Makefile`
- `/home/farismnrr/Projects/situm-explore/plans/034-full-e2e-acceptance.md`
- `/home/farismnrr/Projects/situm-explore/.agents/execution/plan-034-login-keyboard-ux-remediation.md`

Inspect `git status` and the actual diff before editing.

## Known physical-device facts

Target device:

- ADB target: `100.113.52.76:35911`
- model: `Pos_System`
- physical display: landscape `1366×720`

Known failing geometry:

- vendor IME begins around `Y=388`
- Email field remains around `Y=400–448`
- therefore the focused field is truly covered by the keyboard

Already attempted:

- Expo Android `softwareKeyboardLayoutMode: 'resize'`
- native manifest confirmed `android:windowSoftInputMode="adjustResize"`
- `KeyboardAvoidingView`
- login `ScrollView`
- focus-driven switch from centered to top-aligned layout
- large fixed bottom padding workaround
- clean Android prebuild
- rebuild/reinstall APK

Those attempts did not produce a physical PASS.

## Goal

Fix the native login UX so Email and Password remain visibly editable and the Sign in action remains reachable when the software keyboard is open, including the abnormal vendor POS IME.

The fix must be responsive and geometry-driven, not a hardcoded `1366×720` or model-specific workaround.

Do not change authentication semantics, credential handling, session storage, backend contracts, or the Plan 034 security architecture.

## Execution mode

Operate in an agent loop until one of these states is reached:

1. physical PASS with objective evidence; or
2. a real external/runtime blocker is proven and documented truthfully.

Do not stop merely because lint/typecheck/build pass.

You may delegate narrow subproblems to workers when useful. Good delegation targets include:

- inspecting frozen React Native 0.86.2 keyboard APIs/event behavior;
- inspecting Android window/inset behavior available in the current Expo/RN stack;
- reviewing login layout code for race/jitter risks;
- designing pure geometry helper tests;
- independently reviewing the final diff against Plan 033/034 UX and security constraints.

Keep one primary agent responsible for integration, physical acceptance, evidence, and final state reconciliation. Workers must not independently broaden scope or make production/irreversible changes.

## Required execution sequence

### 1. Baseline first

Before further implementation:

- read the remediation plan in full;
- inspect `git status` and current diffs;
- inspect current login implementation in `/home/farismnrr/Projects/situm-explore/mobile/App.tsx`;
- confirm the physical device is reachable with ADB;
- capture current screen/window/IME/focused-control geometry if the app is already installed;
- determine whether React Native window dimensions actually change when the keyboard opens;
- determine whether Android keyboard frame events report geometry matching the observed vendor IME.

Do not assume `adjustResize` is trustworthy on this target.

### 2. Implement the smallest robust fix

Preferred solution order:

- track focused field identity/ref;
- track keyboard visible/frame state;
- measure the focused field in window coordinates after keyboard/layout settles;
- compute actual overlap between focused control and keyboard top, with a small safety margin;
- scroll the single login `ScrollView` by only the required amount;
- clamp offsets and prevent cumulative drift;
- re-measure safely when focus changes or the vendor keyboard frame settles late;
- compact non-essential login spacing while editing if needed;
- remove the fixed large `paddingBottom` hack once the measured mechanism is proven.

Retain `softwareKeyboardLayoutMode: 'resize'` / `adjustResize` as defense in depth unless evidence shows they create a regression.

If built-in RN primitives are insufficient because the vendor IME exposes false/missing frame data, prove that first. Then use the next-most-general available Android visible-window/inset signal. Avoid model name checks and fixed keyboard coordinates.

Do not add a dependency unless clearly justified. If adding one, verify compatibility with the frozen stack before relying on it:

- Expo `57.0.13`
- React Native `0.86.2`
- React `19.2.3`
- New Architecture enabled
- Android target/compile SDK `36`

### 3. Validate interaction behavior

At minimum exercise:

- Email focus with software keyboard open;
- Password focus with software keyboard open;
- Email -> Password transition;
- Password -> Email transition;
- keyboard dismiss -> reopen;
- invalid login/error state while retrying;
- Sign in reachability while keyboard is still open;
- repeated open/focus/dismiss cycles;
- orientation/window resize if supported;
- supplemental normal emulator/device behavior if available;
- hardware keyboard/no-IME behavior if available.

The login screen should return to a natural non-editing layout after keyboard dismissal and must not leave a giant blank spacer or stuck scroll offset.

### 4. Add focused regression coverage

Extract/test pure geometry math if practical.

Cover at least:

- no shift when the field is already visible;
- minimum exact shift when overlap exists;
- safety-margin behavior;
- non-negative/clamped behavior for edge cases;
- no additive drift when the same geometry is processed repeatedly.

Do not add a broad testing framework solely for this remediation.

### 5. Build and install

Run the relevant mobile validation from:

`/home/farismnrr/Projects/situm-explore/mobile`

At minimum:

- lint;
- typecheck;
- focused tests if added;
- Expo config/prebuild verification;
- Android debug build.

Also run from repo root:

- `git diff --check`

Install the new debug APK onto:

`100.113.52.76:35911`

Preserve current backend direction used for Plan 034 staging acceptance unless you have evidence it changed. Known prior setup was:

- staging web/backend on host port `3005`
- `adb reverse tcp:3000 tcp:3005`
- Metro: `adb reverse tcp:8081 tcp:8081`

Do not alter secrets or provisioning architecture.

### 6. Physical PASS criteria

Do not declare PASS until physical measurements show:

- focused Email bottom is above keyboard top with a real safety margin;
- focused Password bottom is above keyboard top with a real safety margin;
- typed text/caret are visible;
- Sign in is reachable without requiring keyboard dismissal;
- no bounce loop, focus loop, stuck scroll, giant spacer, or clipped validation state;
- keyboard dismissal restores a sensible layout;
- repeated cycles remain stable.

Capture objective bounds, not only subjective screenshots.

Write physical evidence under:

`/home/farismnrr/Projects/situm-explore/.agents/evidence/`

Use a clear Plan 034 filename, for example:

`/home/farismnrr/Projects/situm-explore/.agents/evidence/plan-034-login-keyboard-ux.md`

Do not persist passwords, API keys, session tokens, Positioning credentials, or other secrets in evidence/logs/screenshots.

### 7. Independent review

Before closing the remediation, delegate or perform an adversarial review of the final diff.

Review specifically for:

- fixed pixel/device-specific hacks;
- keyboard listener leaks;
- stale delayed measurements after blur/unmount;
- scroll jitter/additive drift;
- large-font/small-height regressions;
- auth/session behavior changes;
- password/credential logging or accidental persistence;
- regressions against Plan 033 reference hierarchy;
- unnecessary new dependencies;
- accidental changes outside remediation scope.

Fix deterministic findings before declaring completion.

### 8. Reconcile project state only after PASS

After physical PASS, update truthfully:

- `/home/farismnrr/Projects/situm-explore/.agents/execution/plan-034-login-keyboard-ux-remediation.md`
- `/home/farismnrr/Projects/situm-explore/plans/034-full-e2e-acceptance.md`
- `/home/farismnrr/Projects/situm-explore/.agents/state.md`
- the Plan 034 evidence file created for this remediation

Mark only the keyboard/login acceptance items that were actually proven. Do not mark unrelated Plan 034 Map/positioning/navigation/Realtime/deep-link acceptance as passed.

Then resume Plan 034 native auth/session/deep-link acceptance from the parent plan.

## Security and scope constraints

Preserve all of these:

- Read & Write Situm key remains server-only;
- Viewer credential remains separate read-only web authority;
- mobile Positioning credential remains dedicated `POSITIONING`, encrypted server-side;
- native retrieves Positioning authority through authenticated backend endpoint `/api/workspaces/:workspaceId/mobile-positioning`;
- no Positioning key in mobile env;
- Realtime remains server-mediated;
- no secrets in repository evidence or logs;
- no PR or merge without explicit user authorization;
- no destructive operations;
- no production changes.

## Definition of done

This remediation is done only when:

- physical POS Email and Password editing is visibly usable above the vendor IME;
- Sign in remains reachable while editing;
- the solution is responsive/geometry-driven rather than device-coordinate hardcoding;
- fixed large keyboard padding is no longer the primary correctness mechanism;
- relevant lint/typecheck/tests/build pass;
- objective physical evidence is recorded;
- adversarial review has no unresolved deterministic defect;
- Plan 034/state/evidence are reconciled truthfully.

If physical PASS cannot be achieved, do not weaken the acceptance rule. Record the exact blocker and leave Plan 034 incomplete.
