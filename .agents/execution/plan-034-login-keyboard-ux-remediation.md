# Plan 034 Remediation — Native Login Keyboard & Small-Viewport UX

Branch: `plan/034-full-e2e-acceptance`
Parent authority: `plans/034-full-e2e-acceptance.md`
Discovered by: Plan 034 physical Android acceptance
Status: physical POS keyboard acceptance passed; final APK reinstall was blocked by an ADB install hang documented in `.agents/evidence/plan-034-login-keyboard-2026-08-18.md`

## Objective

Make the native login flow reliably usable when the Android software keyboard is open, including the physical landscape POS target (`1366×720`) whose vendor IME does not provide normal React Native/`adjustResize` visible-window behavior.

The acceptance target is behavioral, not API-specific: when Email or Password is focused, the focused field and the primary sign-in action must remain reachable and usable above or through the IME without requiring blind typing, keyboard dismissal, orientation changes, or device-specific manual workarounds.

This is a bounded Plan 034 correctness remediation. It must not redesign authentication, change session/security behavior, broaden native scope, or weaken Plan 034 acceptance criteria.

## Current evidence / known failure

Physical POS evidence already establishes:

- landscape display: `1366×720`;
- vendor IME begins at approximately `Y=388`;
- Email field remains approximately `Y=400–448` after focus;
- therefore the focused field is physically obscured by the keyboard;
- Android native manifest has `android:windowSoftInputMode="adjustResize"`;
- Expo config has `softwareKeyboardLayoutMode: 'resize'`;
- a `KeyboardAvoidingView` + scroll/focused-layout attempt is already present locally;
- the rebuilt/reinstalled APK still fails the physical visibility requirement.

Conclusion: `adjustResize` and generic `KeyboardAvoidingView` behavior are insufficient authority for this device. The remediation must measure actual keyboard/focus geometry and move/scroll content deterministically when needed.

## Non-negotiables

- Preserve the existing email/password authentication API and secure-session behavior.
- Do not add credential persistence, autofill secrets, logging, screenshots containing credentials, or alternate auth shortcuts.
- Keep the login UI recognizably aligned with the approved Plan 033 reference hierarchy.
- Do not special-case the POS model by hardcoded device name, pixel coordinate, or `1366×720` check unless a platform-level limitation leaves no general solution and the exception is explicitly documented.
- Prefer geometry-/inset-driven behavior that also improves phones, tablets, large text, landscape, and alternate keyboards.
- Avoid brittle fixed padding such as “keyboard is ~N px high” as the primary solution.
- No PR/merge from this remediation. Plan 034 remains the active terminal branch.
- Do not claim PASS from emulator, manifest inspection, lint/typecheck, or screenshots alone; final acceptance requires the physical POS.

## Desired interaction contract

When the login screen is not editing:

- preserve the reference-oriented centered/comfortable login composition where space allows;
- keep all fields/actions reachable on smaller windows through normal page scrolling.

When a text input is focused and the IME appears:

- detect the effective keyboard occlusion using runtime keyboard/window measurements rather than assuming Android resized the root view;
- ensure the focused input has a visible safety margin above the IME;
- scroll only as much as necessary and avoid repeated/jittering jumps;
- Password focus must work independently of Email focus;
- the Sign in action must remain reachable while editing, either visibly above the IME or by a short deterministic scroll;
- keyboard dismissal must restore a natural layout/scroll position without leaving a giant blank spacer;
- switching Email -> Password must not bounce to the wrong offset;
- validation errors must not push the focused field/action permanently behind the IME;
- hardware keyboard / no-IME behavior must remain unchanged.

## Implementation direction

Use the smallest robust mechanism proven by the physical device. Preferred order:

1. **Measure actual geometry.**
   - subscribe to React Native keyboard show/hide/frame events available on the frozen RN version;
   - obtain window dimensions and keyboard end coordinates;
   - measure the focused input relative to the window (`measureInWindow` or an equivalent stable RN primitive);
   - calculate overlap + a small safety margin.

2. **Deterministically scroll the login owner.**
   - keep one vertical `ScrollView` as the login scroll owner;
   - scroll by the calculated overlap when the focused field would be occluded;
   - re-evaluate after layout/keyboard frame changes because vendor IMEs may report events before final geometry settles;
   - constrain/clamp offsets so repeated focus events do not accumulate drift.

3. **Make the composition compact while editing.**
   - it is acceptable to reduce non-essential top spacing / brand prominence while an IME is visible or an input is focused;
   - do not hide field labels, validation state, or the primary action merely to create space;
   - prefer content-driven min-height/padding over a fixed `paddingBottom: 420` style.

4. **Keep native resize config as defense in depth.**
   - retain `softwareKeyboardLayoutMode: 'resize'` / `adjustResize` if they do not regress other targets;
   - the JS layout must remain correct even when the vendor window manager does not honor resize normally.

5. **Only add a keyboard-aware dependency if justified.**
   - first prove whether built-in RN geometry + scroll primitives are sufficient;
   - if a dependency is required, verify compatibility with Expo 57 / RN 0.86.2 / New Architecture and document why the built-in approach failed;
   - do not add a broad UI framework for this fix.

## Phase checklist

- [x] Phase 0 — Capture baseline geometry and freeze acceptance cases.
- [x] Phase 1 — Replace fixed-padding avoidance with measured keyboard/focus geometry.
- [x] Phase 2 — Stabilize focus transitions, error state, dismissal, and compact editing layout.
- [x] Phase 3 — Automated/static regression validation.
- [x] Phase 4 — Physical POS acceptance and evidence.
- [ ] Phase 5 — Reconcile Plan 034 evidence/state and resume full E2E.

## Phase 0 — Baseline and acceptance matrix

Before further edits:

- preserve the current failing physical measurement as evidence;
- inspect exact RN 0.86.2 keyboard event semantics available on Android;
- record Email, Password, Sign in and keyboard bounds under the physical vendor IME;
- record whether the root/window dimensions actually change when IME opens;
- confirm whether keyboard event `endCoordinates` reflects the observed IME top on this POS;
- confirm current scroll offset before/after focus to identify whether failure is missing geometry, missing scroll, or both.

Acceptance matrix at minimum:

- physical POS landscape + vendor software keyboard: Email;
- physical POS landscape + vendor software keyboard: Password;
- Email -> Password focus transition;
- Password -> Email focus transition;
- keyboard dismiss -> reopen;
- invalid-login/error text visible while retrying;
- orientation/window-size change if supported by target runtime;
- supplemental normal Android emulator/device behavior;
- hardware keyboard / no software keyboard supplemental behavior where available.

## Phase 1 — Geometry-driven keyboard avoidance

Refactor the current login workaround so layout correctness is driven by measured occlusion:

- track focused field identity/ref;
- track keyboard visible/frame state;
- after keyboard frame/layout settles, measure the focused field in window coordinates;
- compute `requiredShift = focusedBottom + safetyMargin - keyboardTop`;
- if `requiredShift > 0`, scroll the existing login `ScrollView` by the minimum required amount;
- clamp against valid content bounds and avoid additive drift across repeated events;
- if the window truly resizes, the same calculation should naturally produce little/no extra shift;
- remove the current large fixed `paddingBottom` workaround once measured behavior replaces it.

Use a stable safety margin suitable for touch/focus legibility, not a device-specific keyboard-height constant.

## Phase 2 — Interaction stability and responsive polish

Ensure the measured fix behaves like a polished responsive form rather than a one-off scroll hack:

- compact brand/title/body vertical spacing while editing if needed for short landscape height;
- keep labels paired with their fields;
- preserve `keyboardShouldPersistTaps` and sensible drag dismissal behavior;
- use `returnKeyType` / submit-to-next-field behavior only if consistent with current auth UX and accessibility;
- ensure Sign in is reachable without dismissing the keyboard;
- handle validation error insertion without obscuring Password or the primary action;
- cancel stale delayed measurements when focus changes, keyboard closes, screen unmounts, or submit changes state;
- avoid layout loops caused by measuring and scrolling in response to each other.

## Phase 3 — Automated/static regression validation

Add the narrowest useful regression coverage available in the current mobile test/tooling setup.

At minimum validate:

- keyboard-occlusion math as a pure/testable helper if extracted;
- no positive scroll shift when the focused control is already above the keyboard;
- exact minimum shift when overlap exists;
- clamping/non-negative behavior for malformed/edge geometry;
- Email/Password focus state does not mutate authentication/session semantics.

Run:

- mobile lint;
- mobile typecheck;
- relevant mobile tests if present/added;
- Expo config/prebuild verification that `adjustResize` remains present;
- Android debug build;
- `git diff --check`.

Static gates are necessary but not sufficient for PASS.

## Phase 4 — Physical POS acceptance

Install the current debug build on the real POS and capture objective geometry for each acceptance case.

PASS requires:

- focused Email bottom is above keyboard top by the chosen safety margin after settling;
- focused Password bottom is above keyboard top by the chosen safety margin after settling;
- both fields' entered text/caret are visible while typing;
- Sign in is reachable while the keyboard remains open;
- no focus-loop, jump-loop, stuck scroll, giant blank spacer, or clipped validation state;
- keyboard dismissal restores a sensible layout;
- repeated open/focus/dismiss cycles remain stable;
- no auth/session/security regression is observed.

Record actual measured bounds in `.agents/evidence/` and do not rely only on subjective visual inspection.

If the vendor IME does not expose truthful keyboard frame events, document that exact runtime limitation and use the next-most-general observable signal (for example visible-window/inset geometry from the native window) rather than hardcoding this single device's keyboard coordinates.

## Phase 5 — Parent-plan reconciliation

After physical PASS:

- update Plan 034 Phase 2 / Plan 033 carry-over evidence to mark login keyboard reachability passed for the physical POS;
- update `.agents/state.md` with the exact runtime behavior and evidence location;
- retain any broadly useful keyboard-layout lesson only if it is reusable and does not encode this one device's transient state;
- resume Plan 034 at native auth/session/deep-link acceptance, then Map/positioning/navigation/Realtime lifecycle gates.

If physical PASS cannot be achieved, keep this remediation and Plan 034 explicitly blocked with the observed geometry/runtime limitation. Do not downgrade the requirement.

## Exit criteria

This remediation is complete only when all are true:

- no fixed keyboard-height workaround is the primary correctness mechanism;
- Email and Password remain visible/reachable on the physical landscape POS with its vendor IME;
- Sign in remains reachable during editing;
- normal Android responsive behavior is not regressed;
- mobile validation/build gates pass;
- objective physical evidence is recorded;
- Plan 034 state/evidence is reconciled truthfully.
