# Plan 033 — Native UI/UX reference evidence

Status: Plan 033 complete on `plan/033-native-ui-ux-reference-reconciliation`; PR/merge intentionally not started.

Canonical visual authority:

`/home/farismnrr/Projects/situm-explore/design/reference/situm-explore-native-responsive-prototype.html`

Current production-native implementation reviewed:

- `/home/farismnrr/Projects/situm-explore/mobile/App.tsx`
- `/home/farismnrr/Projects/situm-explore/mobile/src/map/NativeMapScreen.tsx`
- `/home/farismnrr/Projects/situm-explore/mobile/src/realtime/RealtimeScreen.tsx`
- `/home/farismnrr/Projects/situm-explore/mobile/src/types/situm-react-native.d.ts`
- Plans/reviews 028–032 plus `DESIGN.md`, `ARCHITECTURE.md` and `design/data-source-matrix.md`.

## Initial deep-review conclusion — 2026-08-17

The current React Native client is not a separate visual system: it already uses the approved light/cool-neutral family, Situm Explore brand mark, Lucide-style navigation vocabulary, phone bottom navigation, compact tablet rail and expanded wide rail. Functional/backend/security review for Plans 029–032 also fixed major ownership/truthfulness defects.

However, current native presentation is still materially below the canonical reference in final information hierarchy and responsive feature composition. The gap is implementation debt rather than a new product direction.

### High-priority deterministic gaps

1. **Phone reachability / scroll ownership**
   - `AuthenticatedShell` renders feature content inside a plain `View`; Map itself renders a 360 dp fixed map plus multiple control/list sections, and the bottom nav floats over the bottom of the screen.
   - There is no clear destination-level vertical scroll contract proving all phone content remains reachable.

2. **Feature responsiveness exists only in the shell**
   - `useWindowDimensions()` is used by `mobile/App.tsx` for rail selection only.
   - `NativeMapScreen` and `RealtimeScreen` do not consume viewport/layout mode and therefore do not implement the reference's tablet/POS/wide two-column compositions.

3. **Wide-screen content is artificially narrow**
   - shell content is capped around 900 dp while the reference grows toward ~1480 px/dp intent and removes the cap on very-wide layouts.
   - POS/TV/wide devices therefore cannot use available spatial area as intended.

4. **Workspace hierarchy is too dominant**
   - a large workspace picker card is always shown above every authenticated destination.
   - the reference keeps workspace as topbar context and exposes switching as account/settings behavior rather than making it the first card on every feature screen.

5. **Explore welcome/search hierarchy is incomplete**
   - current Explore has the heading and building chips but no reference-style search input or real quick-place chips.
   - real building POIs are already fetched and selectable, so a cartography-backed search/quick-place UI does not require fake data.

6. **Location UX is SDK-centric**
   - primary UI exposes `Position`, `stopped`, `fresh`, and `Start positioning` rather than leading with the reference's user intent: `Your location is off`, browsing remains available, `Find my location`.
   - Situm User Helper remains the correct permission/sensor owner, but product-level surrounding copy/state should be reference-oriented and non-coercive.

7. **Map composition is too small and non-adaptive**
   - current Map height is fixed at 360 dp.
   - the reference intends roughly 555 dp phone, ~650 dp tablet and larger/adaptive wide Map stages.
   - floor controls are a separate strip with no explicit active-floor styling from real floor callback state.

8. **Selected-place hierarchy is non-responsive**
   - current selected POI card always follows the map in the same flow.
   - reference tablet/wide composition uses a secondary selected-place/details column.
   - current copy includes implementation jargon such as `real Situm POI` that should not be primary user language.

9. **Realtime composition remains stacked at every width**
   - `styles.columns` has no row/adaptive mode.
   - reference uses list + secondary panel at >=700 and a toolbar with building filter, device/floor search and Refresh.
   - building/search filtering can be performed against already-authorized data without widening Situm authority.

10. **Realtime prototype map cannot be copied literally**
    - exact installed/package evidence still does not prove a generic remote MapView marker/focus API under the current least-privilege product boundary.
    - the correct parity target is the reference's list + secondary-pane hierarchy using truthful selected-position detail rather than fake custom markers.

11. **Recent is not a final surface**
    - current destination is a `FOUNDATION PLACEHOLDER`.
    - repository authority already says not to create an event/audit backend solely to preserve Recent Activity.
    - Plan 033 must verify a real existing source; absent one, final UI is a polished reference-shaped empty/unavailable state with no fabricated Reception/Cafe/etc. history.

12. **Settings is not a final surface**
    - current Settings is a generic card plus Sign out.
    - real selected workspace, authenticated email, contextual location behavior, `Background location: Not requested`, and sign-out state are available or can be represented truthfully without widening capability.

13. **Shell polish remains incomplete**
    - tablet/wide topbar can duplicate the brand already present in the rail;
    - topbar foreground/background AppState is technical lifecycle information rather than the reference's primary product status;
    - wide rail footer lacks truthful account identity even though authenticated email exists.

14. **Accessibility remains incomplete**
    - login TextInputs use placeholders without visible field labels;
    - active selection state/large-font/keyboard-D-pad behavior is not comprehensively owned across the native product.

## Initial reference-to-capability classification

| Reference area | Initial classification | Reason |
| --- | --- | --- |
| light cool-neutral tokens / border-first surfaces | IMPLEMENT EXACTLY | pure presentation |
| Explore / Realtime / Recent / Settings nav | IMPLEMENT EXACTLY | already approved product vocabulary |
| phone bottom nav / compact tablet rail / expanded wide rail | IMPLEMENT EXACTLY | already partly implemented; needs final composition/reachability |
| topbar workspace + destination breadcrumb | IMPLEMENT EXACTLY | real workspace/destination state exists |
| workspace-ready pill | ADAPT TO REAL DATA | only show when derived from actual workspace/config readiness |
| large global workspace picker above every screen | REMOVE/ADAPT | not part of reference hierarchy; switching moves to compact/settings affordance |
| Explore welcome card | IMPLEMENT EXACTLY | pure hierarchy/copy adapted to real context |
| POI search | ADAPT TO REAL DATA | real cartography POIs already exist; optional SDK search helper must be installed-version proven |
| quick-place chips | ADAPT TO REAL DATA | derive from real POIs, never hardcoded samples |
| Find my location / location note | ADAPT TO REAL SDK STATE | User Helper/positioning already proven; camera follow must be separately installed-version proven |
| custom fake permission modal | ABSENT BY PRODUCT DECISION | use OS/Situm User Helper; surrounding product explanation is app-owned |
| Map stage sizing/layout | IMPLEMENT EXACTLY/ADAPT | presentation only around real MapView |
| active floor controls | ADAPT TO REAL SDK STATE | use real floor IDs/callbacks |
| selected-place side panel | ADAPT TO REAL DATA | real POI details only |
| Directions / Stop guidance | ADAPT TO REAL SDK STATE | existing Plan 030 lifecycle; no invented metrics/instructions |
| Realtime intro/toolbar | IMPLEMENT EXACTLY/ADAPT | factual copy plus in-memory authorized filters |
| Realtime list/detail | IMPLEMENT EXACTLY/ADAPT | current real server fields fit reference hierarchy |
| Realtime remote map markers/focus | TRUTHFUL FALLBACK | still unproven; keep selected-position detail pane instead |
| Realtime online/stale/old status colors | ABSENT BY PRODUCT DECISION | Plan 031 explicitly removed unsupported semantics |
| Settings workspace/session rows | ADAPT TO REAL DATA | existing selected workspace/user session |
| Settings location state | TRUTHFUL FALLBACK/ADAPT | show only knowable state; User Helper/system settings for recovery |
| Background location `Not requested` | IMPLEMENT EXACTLY WHILE TRUE | current product intentionally does not request it |
| Recent populated activity | TRUTHFUL FALLBACK unless source proven | no fake history; no new audit backend solely for parity |
| authentication surface | ADAPT TO PRODUCT | not shown in reference but must share tokens/hierarchy/accessibility |

## External current-doc revalidation available to executor

Revalidated on 2026-08-18 against current official documentation only:

- Situm's mobile initialization documentation describes MapView as an out-of-the-box cartography/blue-dot/wayfinding surface with POI search/filtering.
- Situm's React Native changelog describes the current MapView generation as supporting POI search plus category/subcategory exploration, while the exact production method surface remains version-dependent.
- Situm's permission/error guidance recommends User Helper for SDK-managed permission/sensor assistance.
- Situm's Remote Configuration documentation continues to describe remote positioning configuration as an explicitly supported model.
- React Native's `useWindowDimensions` documentation states that window dimensions and font scale update automatically when they change.
- React Native's accessibility documentation provides the platform accessibility primitives needed for roles, labels, selected/disabled state and assistive-technology support.

These web docs are discovery/revalidation evidence only. Before adding a concrete optional method, executor must prove that the exact installed `@situm/react-native` 3.19.2 package supports it under the current local declaration/runtime boundary. Current docs may be newer than the frozen package and must never be used to smuggle an unsupported newer API into production.

## Physical/runtime evidence remains unpassed

This UI review does not prove or reclassify:

- real Android permission/User Helper behavior;
- real indoor positioning/blue dot/floor transitions;
- real navigation progress/destination/out-of-route behavior;
- real Realtime physical lifecycle/own-device behavior;
- real web-to-native opening/install/deep-link/auth restoration;
- real-device visual interaction under the final reconciled Plan 033 UI.

All of those remain Plan 034 acceptance items.

## Phase 0 execution evidence — 2026-08-18

- Integrated `roadmap/033-034-native-ui-reconciliation` into `main` and created the dedicated Plan 033 branch.
- Rechecked the native baseline in `mobile/App.tsx`, `mobile/src/map/NativeMapScreen.tsx`, and `mobile/src/realtime/RealtimeScreen.tsx`.
- Confirmed the reference/capability matrix above remains authoritative: real cartography and positioning may drive presentation; Realtime remains factual server-mediated device-position list/detail; Recent has no proven history source; remote Realtime map markers, presence, fabricated freshness classes, route metrics and background location remain absent.
- Exact installed `@situm/react-native` version remains 3.19.2. No optional remote-marker or camera-follow helper is being assumed without installed-package proof.
- Baseline visual gaps frozen for implementation: single shared layout mode, phone scroll ownership, removal of the global workspace card, adaptive Map/Realtime compositions, truthful final Recent/Settings surfaces, and auth accessibility labels.

## Phase 1 execution evidence — 2026-08-18

- Added `mobile/src/ui/theme.ts` semantic light/cool-neutral tokens and `mobile/src/ui/layout.ts` deterministic phone/tablet/wide/very-wide contract.
- Reconciled `mobile/App.tsx` with the reference shell: floating phone bottom navigation with bottom inset, 72 dp tablet rail, expanded 208/228 dp wide rail, no duplicated rail brand in the topbar, truthful workspace-ready state, and authenticated account footer.
- Removed the always-on workspace picker from destination content; workspace switching now lives in Settings while the selected workspace remains topbar context.
- Added destination scroll owners and keyboard-safe login behavior, visible auth field labels, selected navigation semantics, and large-font-friendly controls.
- No backend, session, Situm credential, positioning, Realtime, or lifecycle ownership changed.

## Phase 2 execution evidence — 2026-08-18

- Explore now follows the reference welcome/search hierarchy with `Where do you want to go?`, real cartography-backed place search, real quick-place chips, compact real building context, and explicit no-match/empty behavior.
- Map composition is 555 dp on phone and 650 dp on tablet/wide, with a responsive Map/detail split at tablet and above.
- Floor controls use real floor IDs and expose selected state from the installed MapView callback; selected-place details use real POI/building/category context.
- Location copy is intent-led (`Your location is off`, `Find my location`) while Situm User Helper, current-fix freshness, navigation guards, cancellation, deep-link building ownership and listener cleanup remain unchanged.
- Deliberate deviations: no fabricated distance, route metrics, instructions, camera-follow behavior, permission success, or sample POIs.

## Phase 3 execution evidence — 2026-08-18

- Realtime now matches the reference operations hierarchy with factual intro notice, explicit real-building filters, in-memory device/position/floor search, Refresh, and responsive list/detail layout.
- Phone uses a scroll-owned stacked list/detail surface; tablet/POS/wide uses a flexible two-column composition with a bounded list pane.
- Rows and details expose only device/position identity, building/floor, accuracy, coordinates and source time. Selection is neutral/accent-soft and does not imply presence or freshness.
- The reference's remote-marker map remains a truthful list/detail fallback because installed `@situm/react-native` 3.19.2 evidence does not prove generic remote marker/focus support.
- Abortable foreground polling, workspace authorization, malformed-payload rejection and lifecycle cleanup are unchanged.

## Phase 4 execution evidence — 2026-08-18

- Settings is now a final reference-shaped destination with real workspace switching, authenticated account email, knowable location-access guidance, truthful `Background location — Not requested`, and sign out.
- Recent is a polished truthful empty state because no existing user-scoped history source was proven; no audit/event backend or fabricated activity was added.
- Login now uses visible labels, accessible controls, keyboard-safe scrolling, generic safe errors and the existing secure session/auth flow.
- No permission success, background location, Recent history, or unsupported session detail is implied.

## Phase 5 execution evidence — 2026-08-18

- Added deterministic breakpoint coverage in `test/native-plan-033.test.ts`.
- Root test suite passes: 32/32 tests. Mobile lint and typecheck pass.
- Root lint passes with generated `.nuxt`/`.output` and clean-prebuild native directories excluded from the direct ESLint traversal; these are generated artifacts, not source inputs.
- Root Nuxt typecheck and production build complete successfully; `.output/server/index.mjs` is present.
- Expo config resolves `com.situm.explore` and `situm-explore-dev`.
- Clean Expo prebuild completed. Android `assembleDebug` passes with `/home/farismnrr/Android/Sdk`; generated native directories remain ignored.
- `expo-doctor` reports the frozen Expo patch versions (`57.0.13` / `57.0.11`) and the known untested New Architecture Situm package; no dependency changes were made because the roadmap explicitly freezes those versions.
- No physical emulator/device visual capture was obtained in this environment; Plan 034 retains real-device visual and behavior acceptance.

## Phase 6 execution evidence and handoff — 2026-08-18

- Full branch diff reviewed against updated `origin/main`; `git diff --check origin/main...HEAD` passes.
- Bounded source scan found no new credential-bearing UI/logging path, no fabricated Realtime presence/freshness classes, no fake POI/activity fixtures, no background-location request, and no route metric/instruction additions.
- Deliberate reference deviations remain: Realtime remote markers become list/detail, Recent remains truthful empty, location permission/sensor recovery stays with Situm User Helper/OS, and camera follow is not claimed.
- Plan 034 carry-over remains explicitly unpassed: supported-device Map/permission/blue-dot/floor/navigation E2E; supported-device Realtime lifecycle/own-device behavior; web-to-native open/install/deep-link/auth/workspace cross-client E2E; and real-device confirmation of the reconciled Plan 033 UI.

## Post-validation remediation and adversarial closeout — 2026-08-18

The preceding Phase 1–6 notes were stale where they implied the initial implementation was already fully closed. A fresh source review found and resolved these deterministic gaps:

1. Rail/topbar brand ownership: `mobile/App.tsx` now renders the topbar brand only when `layout.isRail` is false; rail layouts retain the single rail-owned brand. `shouldRenderTopbarBrand` and a focused test protect this contract.
2. Stop guidance: `mobile/src/map/NativeMapScreen.tsx` now renders `Stop guidance` only for `active`/`outside-route` owned navigation, calls the existing `cancelNavigation`, and leaves positioning running. The ownership helper and source contract are tested.
3. Location vocabulary: all production-native `Start positioning` copy was replaced with `Find my location` intent language and factual recovery guidance. No internal freshness/stopped wording is used as primary copy.
4. Accessibility: quick-place chips and the main POI list expose selected state for the selected POI; Realtime rows expose selected state; existing role/disabled semantics remain in place.
5. Selected-place floor context: `resolveFloorDisplay` resolves the selected POI's real `floorId` within the active building, uses the real floor name or `Level <real level>`, and omits context when unresolved. Display text is never used as a MapView identifier.
6. Regression coverage: `test/native-plan-033.test.ts` now covers POI filtering (scope/name/category/case/trim/no-match), Realtime filtering (building/device/position/building/floor/combinations), floor context, shell ownership, guidance ownership, approved destinations, and structural selected/accessibility/Recent-vocabulary contracts.

### Final deterministic validation

Final command results are recorded here after the remediation validation pass:

- Root tests: PASS, 39/39 tests.
- Root lint/typecheck/build: PASS.
- Mobile lint/typecheck: PASS.
- Expo config: PASS (`com.situm.explore`, `situm-explore-dev`, SDK 57, New Architecture enabled). Frozen-policy `expo-doctor`: 19/21 checks pass; the two known non-blocking findings are Expo `57.0.13` vs recommended `57.0.14`, `expo-build-properties` `57.0.11` vs recommended `57.0.12`, and the installed Situm package's New Architecture metadata status. Clean prebuild: PASS. Android `assembleDebug`: PASS in 1m33s with `/home/farismnrr/Android/Sdk`.
- Production preview smoke: PASS on isolated port 3199; `/` returned 200, unauthenticated `/api/me` returned 401, and security headers were present. The temporary preview was stopped afterward.
- Secret/truthfulness/source scans and updated `origin/main` full-diff review: PASS.
- Emulator/runtime visual attempt: a bounded Pixel_10_Pro_XL software-rendered launch initialized with Lavapipe and was terminated after 20 seconds before app/UI capture; no emulator screenshots or visual acceptance are claimed. No physical device was used.

Plan 034 remains explicitly UNPASSED for supported-device Map/permission/blue-dot/floor/navigation, supported-device Realtime lifecycle/own-device behavior, web/native open/install/deep-link/auth/workspace cross-client acceptance, and real-device confirmation of the reconciled Plan 033 UI. The attached physical `Pos_System` device was not modified. No PR was opened, no merge was performed, and Plan 034 was not started.
