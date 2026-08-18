# Plan 033 Remediation + Final Closeout — 10/10 Industry-Grade Acceptance

> **Historical execution brief.** This file preserves the instructions used during completed work. It is not current execution authority; consult `.agents/state.md` and create a new explicit plan for future changes.


You are the implementation agent responsible for remediating and **truthfully closing Plan 033** on the existing dedicated branch.

## Absolute workspace and branch

Workspace root:

`/home/farismnrr/Projects/situm-explore`

Required branch:

`plan/033-native-ui-ux-reference-reconciliation`

Do **not** create a new plan branch. Reuse the existing Plan 033 branch. Do not work on `main`.

Canonical plan:

`/home/farismnrr/Projects/situm-explore/plans/033-native-ui-ux-reference-reconciliation.md`

Canonical visual reference:

`/home/farismnrr/Projects/situm-explore/design/reference/situm-explore-native-responsive-prototype.html`

Existing execution brief:

`/home/farismnrr/Projects/situm-explore/.agents/execution/plan-033.md`

Existing evidence document that currently overstates completion and must be corrected/revalidated:

`/home/farismnrr/Projects/situm-explore/.agents/evidence/plan-033-ui-reference.md`

Known relevant production files:

- `/home/farismnrr/Projects/situm-explore/mobile/App.tsx`
- `/home/farismnrr/Projects/situm-explore/mobile/src/map/NativeMapScreen.tsx`
- `/home/farismnrr/Projects/situm-explore/mobile/src/map/state.ts`
- `/home/farismnrr/Projects/situm-explore/mobile/src/realtime/RealtimeScreen.tsx`
- `/home/farismnrr/Projects/situm-explore/mobile/src/realtime/state.ts`
- `/home/farismnrr/Projects/situm-explore/mobile/src/ui/layout.ts`
- `/home/farismnrr/Projects/situm-explore/mobile/src/ui/theme.ts`
- `/home/farismnrr/Projects/situm-explore/mobile/src/types/situm-react-native.d.ts`
- `/home/farismnrr/Projects/situm-explore/test/native-plan-033.test.ts`
- `/home/farismnrr/Projects/situm-explore/test/mobile-plan-030.test.ts`
- `/home/farismnrr/Projects/situm-explore/test/mobile-plan-031.test.ts`
- `/home/farismnrr/Projects/situm-explore/test/mobile-plan-031-client.test.ts`
- `/home/farismnrr/Projects/situm-explore/test/mobile-plan-032.test.ts`

## Mission

Bring Plan 033 from “builds successfully but still has bounded reference/acceptance gaps” to **fully closed within Plan 033 scope, at an industry-grade 10/10 standard**.

“10/10” here means all of the following are simultaneously true:

1. every deterministic Plan 033 requirement that is implementable without new product authority is implemented;
2. no known source-level structural divergence from the canonical reference remains unexplained;
3. no fake capability, fake data, hidden scope expansion, or semantics regression is introduced;
4. critical behavior is protected by focused regression coverage where deterministic testing is practical;
5. all required static/build/security gates pass from a clean state;
6. evidence documents accurately describe what was actually validated and what remains externally gated;
7. Plan 034 physical-device/runtime acceptance remains explicitly **UNPASSED** and is not silently claimed by Plan 033;
8. branch is committed, pushed, synchronized, and clean;
9. no PR/merge is opened;
10. you perform a final adversarial review instead of stopping immediately after the six known fixes below.

Do not optimize for “minimum diff to make tests green.” Optimize for a complete, maintainable Plan 033 closeout with bounded scope.

---

# 0. Required reading and startup safety

Before editing, read in this order:

1. `/home/farismnrr/Projects/situm-explore/AGENTS.md`
2. `/home/farismnrr/Projects/situm-explore/.agents/state.md`
3. `/home/farismnrr/Projects/situm-explore/.agents/protocols/git-workflow.md`
4. `/home/farismnrr/Projects/situm-explore/.agents/execution/plan-033.md`
5. this remediation brief
6. `/home/farismnrr/Projects/situm-explore/.agents/memory/decisions.md`
7. `/home/farismnrr/Projects/situm-explore/ARCHITECTURE.md`
8. `/home/farismnrr/Projects/situm-explore/DESIGN.md`
9. `/home/farismnrr/Projects/situm-explore/design/data-source-matrix.md`
10. `/home/farismnrr/Projects/situm-explore/design/reference/situm-explore-native-responsive-prototype.html`
11. `/home/farismnrr/Projects/situm-explore/plans/033-native-ui-ux-reference-reconciliation.md`
12. `/home/farismnrr/Projects/situm-explore/.agents/evidence/plan-033-ui-reference.md`
13. Plans/reviews 030–032 where needed to preserve existing ownership and lifecycle guarantees.

Then verify before editing:

```bash
cd /home/farismnrr/Projects/situm-explore
git status --short
git branch --show-current
git fetch origin
git status -sb
```

Requirements:

- current branch must be `plan/033-native-ui-ux-reference-reconciliation`;
- the newly created `.agents/execution/plan-033-remediation-closeout.md` may be the only expected uncommitted file at startup; it is intentional, must be kept, and should be included in the remediation/closeout commit;
- any other pre-existing change is not automatically yours: inspect it and do not discard it;
- do not discard unrelated changes;
- do not use `git reset --hard`, `git clean -fd`, force push, or history rewrite;
- inspect updated `origin/main` before final validation and ensure no newly introduced conflict/regression changes the review conclusion.

If the existing evidence file says Plan 033 is already complete while known acceptance gaps still exist, treat that statement as stale evidence and correct it as part of this remediation.

---

# 1. Non-negotiable product/security boundaries

Preserve all established Plans 028–032 ownership and truthfulness guarantees.

Do NOT:

- add a second backend;
- widen auth/session authority;
- expose Situm credentials or session secrets;
- move backend secrets into the mobile client;
- fabricate POIs, floors, activity, route metrics, presence state, freshness classes, permission success, or device state;
- create an event/audit backend just to populate Recent;
- add background-location permission/request scope;
- create fake Realtime markers/focus on a custom canvas;
- assume a newer Situm API merely because current docs mention it;
- upgrade frozen Expo/Situm dependency versions only to silence `expo-doctor`;
- perform destructive or production operations;
- install/change/configure the attached physical `Pos_System` device as part of this task;
- start Plan 034;
- open a PR or merge.

Installed `@situm/react-native` is frozen at the repository-approved version. Any new SDK method must be proven against the **exact installed package** before use. Prefer solving this remediation with already-owned state and methods; no new Situm capability should be necessary for the known gaps.

The physical device currently visible through ADB belongs to Plan 034 acceptance. Leave it untouched unless the user separately authorizes physical-device execution.

---

# 2. Known gap A — eliminate duplicated brand on rail layouts

## Current defect

`/home/farismnrr/Projects/situm-explore/mobile/App.tsx` renders the brand in the rail and also unconditionally renders a topbar brand. On tablet/wide layouts this duplicates the identity mark, contrary to both the canonical HTML and Plan 033 Phase 1.

Canonical reference behavior:

- phone/no rail: topbar mobile brand is visible;
- tablet/wide with sidebar/rail: sidebar owns the brand and topbar mobile brand is hidden.

## Required result

Implement a single clear ownership rule:

- if `layout.isRail` is false, render topbar Brand;
- if `layout.isRail` is true, do not render the duplicate topbar Brand;
- preserve breadcrumb/workspace/destination hierarchy and spacing cleanly at every breakpoint;
- compact/expanded rail behavior remains correct.

Do not solve this with opacity, offscreen positioning, or duplicate hidden accessibility nodes. The duplicate component should not be rendered when the rail owns the brand.

Add deterministic regression protection for this shell ownership rule where practical.

---

# 3. Known gap B — expose a real `Stop guidance` action

## Current defect

`/home/farismnrr/Projects/situm-explore/mobile/src/map/NativeMapScreen.tsx` already owns navigation cancellation through existing `cancelNavigation()` logic and navigation state, but active guidance exposes no direct user-facing `Stop guidance` action.

Plan 033 explicitly requires active guidance to expose factual navigation state and a clear stop action. The canonical reference also provides `Stop guidance`.

## Required result

Use the existing navigation ownership/lifecycle rather than inventing new behavior.

Expected semantics:

- `Directions` starts guidance only when the existing fresh-current-location contract allows it;
- while navigation is actually owned/active (`active` and `outside-route`, or other already-proven owned native state as determined by existing logic), expose a clearly labeled `Stop guidance` action;
- `Stop guidance` calls the existing safe cancellation path;
- cancelling guidance does **not** require stopping positioning;
- after cancellation, UI state/copy is factual and returns to the appropriate `Directions` affordance when it can be started again;
- destination reached/error/cancelled states remain factual;
- workspace/building/lifecycle teardown still cancels owned navigation exactly once as already designed;
- do not introduce duplicate cancellation ownership or listener leaks.

Accessibility:

- button has an appropriate role/label;
- disabled/selected semantics remain truthful;
- touch target remains reasonable (~44 dp intent where practical).

Add focused regression coverage that makes it difficult to accidentally remove the explicit stop-guidance affordance or regress navigation ownership state semantics.

Do not add fake route geometry, ETA, instructions, or metrics beyond already-proven real progress fields.

---

# 4. Known gap C — remove SDK-centric `Start positioning` wording from user-facing UX

## Current defect

Plan 033 deliberately changed primary vocabulary from SDK/internal positioning language to end-user intent (`Find my location`), but `NativeMapScreen.tsx` still contains user-visible wording such as:

- `The last position is no longer current. Start positioning again.`
- `Start positioning and wait for a current fix in this building to get directions.`

There are also internal/stopped messages containing `Start positioning`; some are masked by current rendering, but leaving mixed vocabulary makes future regressions easy.

## Required result

Perform a bounded copy audit of the native client and make product-facing location vocabulary consistent.

Prefer phrases based on intent, e.g.:

- `Find my location`
- `Find my location again`
- `Turn on your location when you want directions`
- similarly concise factual copy that matches the canonical hierarchy.

Requirements:

- do not expose internal state names (`fresh`, `stale`, `stopped`) as primary product language;
- stale/denied/error copy remains truthful and non-coercive;
- browsing remains available when location is off;
- no fake OS permission dialog;
- Situm User Helper remains the actual assistance owner;
- do not imply background location.

After remediation, source-level scan of production mobile UI should not find `Start positioning` in user-facing copy unless there is a proven technical-only string that cannot render to the user; preferably remove the phrase entirely from this feature to prevent vocabulary drift.

Add regression coverage or a bounded source assertion protecting the approved vocabulary where appropriate.

---

# 5. Known gap D — complete accessibility selected-state semantics

## Current defect

Plan 033 requires selected semantics for active navigation/building/floor/place/Realtime controls.

Already present:

- active navigation destination;
- selected building;
- selected floor;
- Settings workspace selection;
- Realtime building filter.

Known missing/insufficient:

- POI/quick-place controls do not consistently expose selected state when they represent the currently selected place;
- Realtime selected position row has visual selection but does not expose `accessibilityState={{ selected: ... }}`.

## Required result

Audit interactive controls on the affected screens and complete accessibility semantics without over-annotating static content.

At minimum:

- selected POI controls expose selected state consistently across quick places and the main POI list where the same selected-place concept is represented;
- Realtime selected row exposes selected state;
- no duplicate inaccessible/accessible representation of the same control;
- primary controls retain roles/labels;
- disabled Directions state remains announced correctly;
- visually hidden text is not used as a hack.

If you find another obvious Plan 033 accessibility omission in the same bounded surfaces (role, label, selected/disabled state, clipping risk), fix it now if deterministic and low-risk.

Protect important semantics with focused tests/source assertions where practical.

---

# 6. Known gap E — selected place must include real floor context

## Current defect

The selected POI model already contains real `floorId`, and cartography already contains real floors, but the selected-place card currently presents category + building only.

Plan 033 requires real POI name/category/building/floor context.

## Required result

Resolve floor display context strictly from already-authorized real cartography.

Requirements:

- use `selectedPoi.floorId` to look up the matching real floor for the active building;
- render real floor name when present;
- if a real floor name is absent, use an existing truthful floor display fallback from real floor metadata (e.g. real level number) rather than inventing a name;
- if cartography genuinely cannot resolve the floor, degrade gracefully without fake data;
- never use display floor level as the MapView selection identifier; existing real floor IDs remain the selection authority;
- keep category/building context intact and readable.

Prefer extracting a small pure display helper if it improves testability and avoids JSX-only logic.

Add deterministic coverage for the floor-context resolution behavior.

---

# 7. Known gap F — Plan 033 regression coverage is not sufficient

## Current defect

`/home/farismnrr/Projects/situm-explore/test/native-plan-033.test.ts` currently protects only the shared responsive breakpoint behavior, while Plan 033 Phase 5 explicitly calls for focused coverage of multiple new behaviors.

Existing Plans 030/031 tests already cover some lower-level authority and payload guarantees; reuse that coverage, do not duplicate it meaninglessly.

## Required coverage after remediation

Add focused deterministic tests for Plan 033-specific behavior where a small pure helper can be tested behaviorally.

At minimum cover:

1. layout breakpoints (existing coverage retained);
2. POI search/filter behavior:
   - scoped to active building real POIs;
   - name match;
   - category match;
   - case-insensitive/trim behavior;
   - no-match returns empty;
3. Realtime building/search filtering:
   - building filter;
   - device/position identifier search;
   - building/floor context search according to actual UI contract;
   - combinations work predictably;
4. selected-place floor display resolution from real floor data;
5. shell ownership rule that prevents duplicated rail + topbar brand;
6. explicit `Stop guidance` affordance exists for owned navigation flow, without inventing a second navigation implementation;
7. Recent does not render prototype fixture/sample activities such as Reception/Cafe/Meeting 2A when no real history source exists;
8. navigation labels remain exactly the approved product destinations: Explore / Realtime / Recent / Settings;
9. unsupported Realtime presence/freshness/marker semantics remain absent (existing Plan 031 coverage can be extended/reused rather than duplicated);
10. selected accessibility semantics for the newly fixed POI and Realtime row controls.

## Testing style

Follow the plan's requirement:

> Do not rely only on regex/source-shape tests when a small pure function/component state helper can be exercised behaviorally.

Therefore:

- extract small pure helpers for POI filtering, Realtime filtering, and floor display resolution where useful;
- test those helpers behaviorally with Node's existing test setup;
- source-shape assertions are acceptable for structural JSX contracts that are expensive to render without introducing a new test framework (e.g. no duplicate topbar Brand on rail, approved nav labels, no prototype Recent fixtures, explicit Stop guidance text/accessibility state);
- do not install Jest/Vitest/React Native Testing Library just for this remediation unless the repository already owns them and they materially improve coverage;
- do not add brittle huge snapshots.

Tests must guard product semantics, not implementation trivia.

---

# 8. Final adversarial Plan 033 review — mandatory after known fixes

After implementing the six known gaps above, do **not** immediately declare completion.

Perform a fresh adversarial review of:

- `/home/farismnrr/Projects/situm-explore/plans/033-native-ui-ux-reference-reconciliation.md`
- `/home/farismnrr/Projects/situm-explore/design/reference/situm-explore-native-responsive-prototype.html`
- `/home/farismnrr/Projects/situm-explore/mobile/App.tsx`
- `/home/farismnrr/Projects/situm-explore/mobile/src/map/NativeMapScreen.tsx`
- `/home/farismnrr/Projects/situm-explore/mobile/src/realtime/RealtimeScreen.tsx`
- relevant theme/layout/state/test files.

Review by screen and breakpoint intent:

### Shell

- phone: mobile brand + bottom nav;
- tablet: 72 dp compact rail, no duplicate topbar brand;
- wide: expanded rail, account footer, no duplicate topbar brand;
- very wide: available width is used sensibly;
- workspace/destination breadcrumb remains clear;
- no giant always-on workspace picker returns.

### Explore

- canonical welcome hierarchy;
- real cartography search and real quick-place chips only;
- compact building context;
- truthful empty/no-match behavior;
- `Your location is off` / `Find my location` intent-led UX;
- map stage sizing remains 555 phone / ~650 tablet+ or better within plan contract;
- real active-floor state;
- real POI name/category/building/floor context;
- Directions guard still requires a fresh current fix in the correct workspace/building;
- Stop guidance is user-accessible while owned navigation is active;
- navigation cancellation/freshness/workspace teardown invariants remain intact.

### Realtime

- Operations / Realtime positions hierarchy;
- factual “reported positions, not online presence” notice;
- real building/search/Refresh controls;
- phone stacked reachability;
- tablet/wide list + detail composition;
- real identity/building/floor/accuracy/source time/coordinates only;
- no presence/status/freshness semantics;
- no fake remote map marker/focus.

### Settings

- real workspace switching;
- factual location access wording;
- Background location remains `Not requested`;
- authenticated session/account identity;
- real sign-out action;
- no secrets/session internals.

### Recent

- final polished truthful empty/unavailable surface if no proven real source exists;
- no prototype fake activity is rendered/persisted.

### Login

- visual language remains aligned;
- visible Email/Password labels;
- keyboard-safe;
- generic safe errors;
- no prominent SecureStore implementation jargon if it does not serve end users.

### Accessibility

- roles/labels/selected/disabled state across primary controls;
- no obvious clipped critical action at large text/layout breakpoints from static inspection;
- control sizing remains reasonable.

If this adversarial review finds **any additional deterministic Plan 033 gap that can be fixed without widening product/security/SDK authority**, fix it in this same remediation before closeout. Record the additional finding and resolution in evidence.

Do not use “not in the six known items” as a reason to leave an in-scope deterministic defect open.

If a gap genuinely requires physical-device behavior, unsupported SDK capability, OS behavior, credentials, or Plan 034 E2E acceptance, do not fake it. Record it explicitly as Plan 034/external evidence instead.

---

# 9. Required validation gates

Run validation from the actual final source after all fixes.

## A. Repository/source quality

```bash
cd /home/farismnrr/Projects/situm-explore
npm test
npm run lint
npm run typecheck
npm run build
git diff --check
```

Use the actual repository scripts if names differ; inspect `package.json` rather than guessing.

All applicable deterministic gates must pass.

## B. Mobile quality

From:

`/home/farismnrr/Projects/situm-explore/mobile`

Run the repository-approved equivalents of:

- mobile lint;
- mobile TypeScript/typecheck;
- Expo config inspection;
- `expo-doctor` under the current frozen-version policy;
- clean Expo prebuild when required by current Plan 033 validation;
- Android debug build using `/home/farismnrr/Android/Sdk`.

Expected known non-blocking `expo-doctor` warnings under the frozen policy may include:

- frozen Expo patch recommendation;
- `@situm/react-native` being untested on New Architecture metadata.

Do not upgrade dependencies solely to make these warnings disappear. Re-evaluate only if a **new** failure appears.

Android `assembleDebug` must complete successfully unless the environment newly breaks for a documented external reason. Generated native directories must remain ignored and must not pollute source commits.

## C. Production web smoke

Run the built production server/preview in a bounded way and verify at minimum:

- root responds successfully;
- unauthenticated protected API remains protected (e.g. `/api/me` stays unauthorized rather than exposing session data);
- expected security headers remain present;
- stop the temporary preview process afterward.

Do not confuse the existing unrelated development listener with the bounded production preview.

## D. Bounded security/source scans

Inspect final branch changes for:

- secrets/API keys/tokens/session values;
- credential-bearing URLs/logs/UI;
- background location scope;
- fake Recent fixtures;
- unsupported Realtime status/presence/freshness/markers;
- leftover `Start positioning` end-user vocabulary;
- duplicate topbar brand ownership;
- missing Stop guidance;
- generated Android/iOS directories accidentally tracked.

No new security/truthfulness regression is acceptable.

## E. Git/base validation

At final state:

```bash
git fetch origin
git diff --check origin/main...HEAD
git diff --stat origin/main...HEAD
git log --oneline --decorate origin/main..HEAD
git status -sb
```

Review the full branch diff against updated `origin/main`, not only the remediation commit.

If `origin/main` changed, assess whether the branch still cleanly satisfies Plan 033. Do not destructively rebase/reset without explicit approval.

---

# 10. Runtime visual acceptance handling

Attempt emulator/runtime visual validation **only where executable without destructive environment changes**.

Known current host limitation from the previous validation:

- available x86_64 AVD failed because `/dev/kvm` / hardware acceleration is unavailable.

If that remains true:

- record the exact bounded attempt and failure reason;
- do not install system packages, enable virtualization, use sudo, or change host security/configuration;
- do not claim emulator screenshots were validated;
- do not use the attached physical POS device to bypass this gate;
- keep physical/runtime UI confirmation as Plan 034 evidence.

Plan 033 can be closed only if all **deterministic implementation/source/build requirements** are complete and the remaining visual/runtime item is truthfully classified as an external Plan 034/device gate already intended by the roadmap.

Do not manufacture screenshots or use production fixture data.

---

# 11. Evidence and documentation closeout

Before commit, update Plan 033 documentation truthfully.

At minimum review/update:

`/home/farismnrr/Projects/situm-explore/plans/033-native-ui-ux-reference-reconciliation.md`

`/home/farismnrr/Projects/situm-explore/.agents/evidence/plan-033-ui-reference.md`

`/home/farismnrr/Projects/situm-explore/.agents/state.md`

`/home/farismnrr/Projects/situm-explore/.agents/sessions/2026-08-18.md`

Update `.agents/memory/decisions.md`, `.agents/knowledge/`, or `.agents/reflections/` only if a genuinely durable new decision/discovery/lesson was produced. Do not create noise.

The evidence file currently contains claims such as “no duplicated rail brand in the topbar” and “Plan 033 complete” that were contradicted by the post-validation source review. Correct those claims before re-closing the plan.

Evidence must explicitly include:

- each remediation finding;
- exact resolution;
- tests added and what semantics they protect;
- final test/lint/typecheck/build results;
- clean prebuild/Android build result;
- final `expo-doctor` status and why known frozen warnings are non-blocking;
- production preview/API/security-header smoke result;
- final source/security scan result;
- emulator attempt result if attempted;
- explicit statement that the physical `Pos_System` device was not modified;
- every remaining Plan 034 item marked UNPASSED;
- any deliberate capability-driven deviation from the canonical HTML reference.

Do not use vague acceptance language such as “looks good” or “mostly matched.”

---

# 12. Commit and push discipline

After implementation + evidence + validation are complete:

1. inspect `git status --short`;
2. inspect `git diff`;
3. run `git diff --check`;
4. stage only intended source/test/docs changes;
5. inspect `git diff --staged`;
6. commit with a clear conventional subject, for example:

```text
fix: close native UI reference gaps
```

Use a more precise subject if appropriate.

7. push to the existing Plan 033 branch;
8. verify local HEAD equals upstream HEAD;
9. verify working tree clean.

Do not amend/rewrite already pushed history unless there is a concrete approved reason.
Do not force push.
Do not open PR.
Do not merge.
Do not start Plan 034.

---

# 13. Definition of done — Plan 033 may be marked CLOSED only if every item below is true

- [ ] Existing Plan 033 branch reused; no accidental work on main.
- [ ] Duplicate rail/topbar brand removed by actual render ownership, not CSS/opacity hiding.
- [ ] Active/owned navigation exposes clear `Stop guidance` using existing cancellation ownership.
- [ ] Cancelling guidance does not require stopping positioning.
- [ ] User-facing `Start positioning` vocabulary is removed/reconciled to `Find my location` product intent.
- [ ] POI selected accessibility semantics are present where selection is represented.
- [ ] Realtime selected row exposes selected accessibility state.
- [ ] Selected POI detail includes real floor context from authorized cartography.
- [ ] POI filtering has behavioral regression coverage.
- [ ] Realtime filtering/search has behavioral regression coverage.
- [ ] Floor-context resolution has deterministic regression coverage.
- [ ] Shell brand ownership has regression protection.
- [ ] Stop guidance presence/ownership has regression protection.
- [ ] Recent fake prototype activity remains absent and protected.
- [ ] Approved navigation labels remain protected.
- [ ] Unsupported Realtime presence/freshness/marker semantics remain absent.
- [ ] Final adversarial source/reference review found no additional unexplained deterministic Plan 033 divergence; any found was fixed or explicitly proven external/capability-gated.
- [ ] Root tests PASS.
- [ ] Root lint PASS.
- [ ] Root typecheck PASS.
- [ ] Root production build PASS.
- [ ] Mobile lint PASS.
- [ ] Mobile typecheck PASS.
- [ ] Expo config correct.
- [ ] `expo-doctor` evaluated under frozen-version policy with no new blocker.
- [ ] Clean Expo prebuild PASS where applicable.
- [ ] Android `assembleDebug` PASS.
- [ ] Production preview/API/security smoke PASS.
- [ ] Bounded secret/truthfulness/source scans PASS.
- [ ] `git diff --check origin/main...HEAD` PASS.
- [ ] Full branch diff reviewed against freshly fetched `origin/main`.
- [ ] Evidence corrected and complete.
- [ ] Plan 034 physical/runtime items remain explicitly UNPASSED.
- [ ] Attached physical POS device was not modified.
- [ ] No PR/merge performed.
- [ ] Commit pushed to `origin/plan/033-native-ui-ux-reference-reconciliation`.
- [ ] Local branch synchronized with upstream and working tree clean.

If any deterministic checkbox above is not true, **do not mark Plan 033 complete**. Continue fixing within scope.

If the only remaining items are the explicitly external Plan 034 physical/runtime acceptance gates, then Plan 033 may be truthfully marked complete while those items remain UNPASSED in the handoff.

---

# 14. Final report format

Return one concise but complete final report with:

## Status

`PLAN 033 CLOSED — 10/10 deterministic scope` only if the Definition of Done is fully satisfied.

Otherwise say `PLAN 033 NOT CLOSED` and enumerate remaining blockers.

## Remediations

List each known finding and any additional adversarial-review finding, with exact file paths and what changed.

## Validation

Report actual results/counts for:

- tests;
- lint;
- typecheck;
- production build/preview smoke;
- mobile lint/typecheck;
- Expo config/doctor;
- clean prebuild;
- Android build;
- security/source scans;
- git diff/base/cleanliness.

## External carry-over

Explicitly list Plan 034 items still UNPASSED. State whether emulator was unavailable because of `/dev/kvm` if still true. State that the physical POS device was not modified.

## Git

Include remediation commit SHA(s), pushed branch, upstream synchronization status, and clean working-tree status.

Stop there. Do not open a PR or begin Plan 034.
