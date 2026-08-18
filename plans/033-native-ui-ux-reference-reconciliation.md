# Plan 033 — Native UI/UX Reference Reconciliation

Branch: `plan/033-native-ui-ux-reference-reconciliation`
Base: updated `origin/main` after Plan 032 is integrated
Depends on: Plan 032 complete/integrated
Status: planned

## Objective

Reconcile the production React Native client with the canonical native reference at `design/reference/situm-explore-native-responsive-prototype.html` so the shipped native product is recognizably the same approved Situm Explore experience across phone, tablet/POS and wide/TV layouts before terminal full E2E begins.

This plan is an implementation/UI reconciliation plan, not a redesign and not a capability expansion plan. It must preserve the real backend, application session, workspace ownership, least-privilege Situm credential model, Map/positioning/navigation lifecycle, server-mediated Realtime contract, deep-link behavior and distribution work already integrated in Plans 028–032.

The target is **as close to the canonical reference as the real backend and proven installed SDK allow**. When reference presentation conflicts with current capability/data/security truth, preserve the hierarchy and visual intent but use the truthful supported fallback. Never fake product data or SDK behavior merely to match the HTML.

Plan 034 remains the terminal physical-device/full-cross-client E2E and roadmap-closeout gate.

## Why this plan exists

A post-Plan-032 deep review found that the current native implementation matches the reference's broad visual family and shell vocabulary, but still diverges materially in end-user hierarchy and responsive composition:

- responsive mode is owned only by `mobile/App.tsx`; Map and Realtime do not adapt their inner composition for tablet/POS/wide layouts;
- authenticated content is not structured around a reliable page scroll owner on phone while Map/controls/lists can exceed the viewport and the floating bottom navigation occupies space;
- `styles.content` is capped at roughly 900 dp, preventing the reference's wider operational layouts from using POS/TV space;
- the full workspace picker is always rendered above every authenticated destination, while the reference treats workspace as shell context and exposes switching in Settings;
- Explore lacks the reference welcome/search/quick-place hierarchy and exposes technical positioning controls/copy more prominently than end-user location intent;
- Map height, floor presentation and selected-place details do not adapt to phone/tablet/wide reference composition;
- Realtime remains stacked at every width and lacks the reference building filter/search toolbar, even though filtering can be performed against already-authorized data;
- Recent and Settings remain foundation-level placeholders/minimal cards rather than final reference-shaped destinations;
- accessibility/polish is incomplete, including login field labels and adaptive large-font/hardware-keyboard behavior.

These are UI/UX implementation gaps, not new evidence that physical positioning/navigation or remote Realtime markers have passed. Plan 034 still owns those real-device claims.

## Authority and evidence order

For this plan:

### Visual/interaction authority

1. the user's latest explicit direction;
2. `DESIGN.md`;
3. `design/reference/situm-explore-native-responsive-prototype.html`;
4. this plan;
5. `design/IMPLEMENTATION.md` where applicable;
6. narrow implementation judgment only for uncovered native-platform details.

### Capability/data/security authority

1. `.agents/state.md` and active durable decisions;
2. Plans 028–032 and their reviewer/evidence records;
3. `ARCHITECTURE.md`;
4. `design/data-source-matrix.md`;
5. exact installed `@situm/react-native` 3.19.2 source/runtime contract;
6. current official Situm documentation only as revalidation evidence, never as a substitute for installed-version compatibility proof;
7. current backend/native source behavior.

Current official Situm documentation confirms that the modern React Native MapView supports interactive POI exploration/search-related UX, that User Helper is the recommended permission/sensor assistance path, and that Remote Configuration remains the preferred positioning configuration approach. Current React Native documentation confirms `useWindowDimensions` as the adaptive window/font-scale source and provides the accessibility APIs required by this plan. Exact methods used in production must still be verified against the installed 3.19.2 package before implementation.

## Non-negotiable product truth

- Keep Nitro as the single application backend.
- Keep the current PostgreSQL user/workspace/session identity model.
- Keep the Read & Write Situm credential server-only.
- Mobile Map/positioning/navigation continues to use only the dedicated owner-authorized Positioning credential.
- Realtime remains server-mediated through the owner-scoped workspace API.
- Realtime means device/position records. Do not invent person identity, presence, online/idle/offline state or local freshness classes.
- Do not create generic remote MapView markers/focus unless exact installed-SDK evidence now proves a supported implementation path and authority is updated first.
- Do not turn Share Live Location into Realtime Positions.
- Do not request background location merely to match reference Settings copy.
- Do not invent route instructions, ETA, distance, place metadata, building names or floor names.
- Do not create a new event/audit backend solely to populate Recent. The historical product decision against an artificial Recent Activity backend remains in force.
- Do not reintroduce demo/sample/fixture data into production-native surfaces.
- Do not weaken the lifecycle/ownership fixes from Plans 030–032 while rearranging UI.

## Responsive contract

Use one shared native layout-mode contract rather than independent screen guesses. The canonical reference intent is:

```text
phone                    -> bottom navigation; stacked content; full-page scrolling
>= ~700 dp tablet/POS    -> compact 72 dp rail; multi-column feature layouts where useful
>= ~1050 dp wide         -> expanded ~208 dp rail; richer shell/account context
>= ~1280 dp wide         -> expanded ~228 dp rail; Map/detail and Realtime list/detail fully use available width
very wide / TV           -> avoid artificial 900 dp content cap; scale density/layout without giant empty margins
```

The exact React Native thresholds may reuse the reference values when they remain practical in device-independent pixels. Keep the mode calculation centralized and deterministic. Orientation/window-size changes must update layout without duplicating Map/positioning/navigation/Realtime owners or resetting authorized feature state unnecessarily.

## Phase checklist

- [ ] Phase 0 — Freeze reference-to-capability matrix and current UI baseline.
- [ ] Phase 1 — Shared native visual tokens, responsive shell, scroll/safe-area and accessibility foundation.
- [ ] Phase 2 — Explore/Map reference reconciliation with real cartography, positioning and navigation state.
- [ ] Phase 3 — Realtime reference reconciliation with truthful list/detail fallback.
- [ ] Phase 4 — Settings, Recent and authentication final-product surfaces.
- [ ] Phase 5 — Responsive/accessibility/interaction regression and emulator visual acceptance.
- [ ] Phase 6 — Final validation, documentation reconciliation and Plan 034 handoff.

## Phase 0 — Reference/capability matrix

Before production edits, inventory each canonical native reference element and classify it as one of:

- `IMPLEMENT EXACTLY` — presentation can be translated directly using existing real data/capability;
- `ADAPT TO REAL DATA` — reference hierarchy stays, but values/options come from current backend/cartography/runtime;
- `TRUTHFUL FALLBACK` — visual slot/hierarchy stays useful, but unsupported behavior must be omitted/replaced with factual UI;
- `ABSENT BY PRODUCT DECISION` — capability remains intentionally unavailable and must not be simulated.

At minimum classify:

### Shell

- topbar breadcrumb;
- phone brand mark;
- workspace-ready/status pill;
- phone bottom navigation;
- tablet compact rail;
- wide expanded rail and account footer;
- active workspace switch access;
- foreground/background lifecycle state presentation.

### Explore

- welcome card and wording;
- place search;
- quick place chips;
- building selection required by real multi-building workspaces;
- contextual location note;
- Find my location / center-on-me behavior;
- MapView size/composition;
- current position/blue-dot ownership;
- floor controls and active-floor state;
- selected-place details;
- Directions/guidance/cancel states.

### Realtime

- page header/building context;
- factual intro notice;
- building filter;
- device/floor search;
- refresh;
- device-position list;
- selected row/detail;
- map/marker slot from the prototype, which remains a truthful list/detail fallback unless generic remote MapView markers/focus become exactly proven.

### Recent

- verify whether an already-existing trustworthy user-scoped recent-history source exists;
- if not, do **not** add event/audit persistence for parity; implement a polished reference-shaped empty/unavailable state and record the deliberate deviation.

### Settings

- workspace context/switch;
- contextual location-access explanation/state only to the extent actually knowable;
- background-location `Not requested` truth when still not requested;
- authenticated session email;
- sign out.

Recheck exact installed `@situm/react-native` 3.19.2 source before using optional MapView helpers such as POI search/nearby or `followUser`. Current official documentation/changelog may guide discovery but does not supersede installed-version proof.

Record the matrix in `.agents/evidence/plan-033-ui-reference.md` before implementation.

## Phase 1 — Shared visual and responsive foundation

Implement the smallest shared UI foundation required to prevent three screens from drifting independently.

### Tokens

Translate the canonical reference tokens into a narrow React Native theme/token module where repeated use is real:

- background `#f6f7f9`;
- surface `#ffffff`;
- subtle/hover-equivalent surfaces;
- primary text near `#16181c` and action ink `#111827` as distinct roles;
- secondary/tertiary text;
- border and strong-border roles;
- accent/success/warning/danger roles only for semantically supported states;
- radii approximately 7 / 9 / 12 / 16 / 22;
- restrained shadow/elevation equivalents where supported.

Do not build a broad generic design-system framework. Small shared semantic primitives are allowed when used across multiple screens and they reduce real duplication (for example Card, Pill, SectionHeader or adaptive screen container).

### Shared layout mode

Create one testable layout-mode utility consumed by shell, Map, Realtime, Recent and Settings. Use `useWindowDimensions()` at the component boundary so rotation, window resizing and font-scale changes react naturally.

### Shell

Reconcile `mobile/App.tsx` with the reference:

- phone: fixed/floating reference-style bottom navigation with enough content bottom inset so no content is unreachable or obscured;
- tablet/POS: 72 dp compact rail, icons centered, no duplicate topbar brand;
- wide: expanded rail with Situm Explore brand, Explore/Realtime/Recent/Settings labels and truthful account/session footer;
- topbar: selected workspace + destination breadcrumb; do not display technical AppState as the dominant permanent user-facing status;
- if a readiness pill is shown, derive it from actual workspace/mobile configuration state and hide/soften it on narrow phone layouts like the reference;
- remove the always-on large workspace-picker card from every destination; retain workspace switching through a compact truthful affordance and the Settings destination;
- allow wide content to grow toward the reference's ~1480 dp composition and beyond on very-wide displays instead of hard-capping at 900 dp;
- preserve selected workspace/session/deep-link ownership while changing presentation.

### Scroll, safe areas and keyboard

- every phone destination must have one clear vertical scroll owner where its content can exceed the viewport;
- account for bottom navigation and safe-area insets;
- do not nest vertical scroll owners unnecessarily around MapView;
- login must remain usable with the software keyboard and large text;
- tablet/POS/TV layouts must not depend on touch-only reachability.

### Accessibility baseline

Follow current React Native accessibility semantics:

- visible labels for login fields, with `accessibilityLabel`/label association as appropriate;
- button roles/labels/hints when visual text is insufficient;
- selected state for active navigation, building, floor, place and Realtime record controls;
- reasonable touch/focus targets approximating the reference's 44 dp controls;
- dynamic error/status announcements where appropriate without excessive chatter;
- large-font behavior must not clip critical actions;
- hardware-keyboard/D-pad focus order must remain sensible on POS/TV-capable layouts.

## Phase 2 — Explore/Map reference reconciliation

Keep the current credential/cartography/positioning/navigation ownership intact while translating presentation.

### Welcome/search hierarchy

Recreate the reference hierarchy closely:

- workspace/building eyebrow/context;
- `Where do you want to go?` heading;
- end-user description equivalent to `Find a place, see where you are, or get indoor directions.`;
- real place search input using only real workspace/building POIs;
- real quick-place chips derived from cartography, never hardcoded sample Reception/Cafe/etc.;
- clear empty/no-match behavior.

If installed MapView search/category helpers are proven and improve behavior without duplicating state, they may be used. Otherwise filtering the already-fetched real POI dataset and calling proven `selectPoi` is acceptable.

### Building context

The real app supports multiple buildings although the reference sample shows one. Preserve the reference hierarchy by keeping building selection compact:

- use a small selector/chip/pill near Explore/map context rather than a large card that dominates every screen;
- selected building must always be real cartography from the active workspace;
- switching building retains all existing Plan 030 teardown guarantees.

### Contextual location UX

Replace SDK-centric primary wording such as `Position / stopped / Start positioning` with reference-oriented product intent:

- initial state: `Your location is off` with copy explaining browsing remains available;
- primary action: `Find my location`;
- starting: factual permission/sensor/position acquisition state;
- fresh: `Your location is on` / `Center on me` style action only if center/follow is exactly supported;
- stopped/denied/error: keep browsing/POI selection available and provide non-coercive recovery copy;
- stale current-fix state remains truthful under the Plan 030 freshness contract but need not expose internal state names as the main UI.

Continue using Situm User Helper as the recommended permission/sensor assistance owner where proven. Do not implement a fake custom OS permission modal. The app-owned surrounding explanation must make denial/sensor failure understandable and must never request background location simply because the reference shows a Settings row.

If exact installed 3.19.2 evidence proves `MapViewRef.followUser()`/`unfollowUser()`, `Center on me` may use it. Otherwise do not fabricate camera following; keep the action limited to starting/maintaining positioning and document the visual deviation.

### Map stage and floors

- phone Map stage should approximate the reference's tall ~555 dp experience where viewport permits;
- tablet/POS should grow toward ~650 dp;
- wide layouts should use remaining viewport height/width rather than remain fixed at 360 dp;
- overlay/reference-style controls may be composed around MapView where React Native layering is safe;
- floor controls must show the actual active floor from real MapView/floor callbacks;
- selecting a floor must use the proven real floor ID, not display level numbers as identifiers;
- blue-dot/current-floor truth remains owned by actual Situm runtime and Plan 034 physical acceptance.

### Selected place and directions

- phone: selected-place detail follows the Map in a compact card;
- tablet/wide: selected-place detail becomes the reference-style secondary column beside the Map;
- use real POI name/category/building/floor context only;
- remove implementation jargon such as `real Situm POI` from primary user copy;
- `Directions` remains disabled/guarded until the existing fresh current-location contract is satisfied;
- active guidance should expose factual navigation state and a clear `Stop guidance` action;
- distance/progress may appear only from fields already proven by installed SDK/runtime contracts; no sample ETA/instructions/route geometry.

Do not regress navigation cancellation, workspace/building ownership, freshness invalidation, deep-link one-shot building application or listener cleanup.

## Phase 3 — Realtime reference reconciliation

Preserve the frozen device-position semantics and server-mediated authorization while matching the reference hierarchy.

### Header and intro

- `Operations` eyebrow;
- `Realtime positions` heading;
- concise factual subcopy;
- selected building/context pill only when value is real;
- reference-style informational notice clearly stating reported positions are not guaranteed online presence.

### Toolbar

Restore useful reference controls using authorized data already available:

- building filter based on real `buildingId` values; enrich display names only through already-authorized real cartography if available;
- search by device/position ID and floor/building display context;
- explicit Refresh action;
- no unsupported presence/freshness filters.

Do not add a new backend route just to filter data that is already safely available in memory unless evidence proves a real scalability need.

### Responsive list/detail

- phone: usable stacked list and selected detail, with scrolling that never hides content behind bottom navigation;
- tablet/POS/wide: reference-like two-column composition, approximately 300–320 dp list plus a flexible detail surface;
- selected row may use neutral/accent-soft selection styling but no green/amber/red semantic status dot;
- list rows expose only device/position ID, real building/floor context, accuracy and source time;
- detail exposes source time, building/floor, accuracy and coordinates with truthful explanatory copy.

### Unsupported prototype map slot

The canonical HTML shows remote markers on a map. Under current authority generic remote MapView marker/focus remains unproven. Therefore:

- do not recreate fake markers in a custom canvas;
- do not imply source coordinates can be focused inside Situm MapView unless exact installed-SDK support is proven and authority is reopened;
- use the visual space as a polished selected-position detail/empty panel while preserving the reference's list + secondary-pane hierarchy;
- record this as a deliberate capability-driven deviation.

Polling/cancellation/auth/workspace isolation from Plan 031 must remain unchanged.

## Phase 4 — Settings, Recent and authentication

### Settings

Build a reference-shaped real Settings destination from existing authority:

- page header and copy aligned with the reference;
- Workspace row showing the real selected workspace and a real switch action;
- Location access row that reports only state the app can actually know; otherwise explain that access is requested contextually through Find my location/User Helper and offer a supported system-settings/retry action when appropriate;
- Background location row remains truthfully `Not requested` while the product does not request it;
- Session row shows the authenticated account email from the real app session;
- Sign out uses the existing server/local logout contract.

Do not expose Situm credentials, session internals or technical lifecycle debug state.

### Recent

First verify whether a trustworthy existing user-scoped recent-history source already exists. Historical authority explicitly forbids creating an event/audit backend solely to preserve Recent Activity.

If no suitable source exists:

- keep the approved `Recent` navigation destination;
- implement the final reference visual hierarchy/header/card treatment;
- show a polished truthful empty/unavailable state instead of `FOUNDATION PLACEHOLDER` copy;
- do not fabricate Reception/Cafe/Meeting activity;
- do not add silent local tracking/persistence merely to make the screen look populated.

If an existing source is proven, map only its real fields/actions and document exact ownership/retention semantics before rendering history.

### Authentication

The reference begins post-authentication, but the native login is production-owned and must use the same visual language:

- canonical brand/tokens/radii/typography;
- visible Email and Password labels;
- keyboard-safe layout;
- truthful disabled/loading/error states;
- no session-storage implementation detail in prominent end-user copy unless it serves a real security/product need;
- preserve generic safe login errors and SecureStore/session behavior.

## Phase 5 — Responsive, accessibility and visual acceptance

### Deterministic source/unit coverage

Add focused coverage without introducing a new test framework for:

- shared layout-mode breakpoints;
- workspace/screen hierarchy not regressing to an always-on giant picker;
- active floor/selection state pure logic where extracted;
- real POI search/filter behavior;
- Realtime building/search filtering;
- absence of unsupported Realtime presence/freshness/marker semantics;
- Recent not rendering sample/fixture activities without a real source;
- navigation labels remain Explore / Realtime / Recent / Settings.

Do not rely only on regex/source-shape tests when a small pure function/component state helper can be exercised behaviorally.

### Emulator/runtime visual acceptance

Use the available Android emulator/runtime path where practical. Prefer real backend/workspace data when available; do not add production fixture data to obtain screenshots.

Capture/inspect representative layouts for at least:

```text
phone portrait          ~360–430 dp wide
phone landscape         short/wide layout
small tablet/POS        ~700–900 dp wide
large tablet landscape  ~1000–1300 dp wide
wide/POS/TV-like        >=1280 dp
very wide               >=1800 dp where available
```

For each applicable size inspect:

- shell/navigation mode;
- content reachability/scroll;
- Explore welcome/location/map/detail composition;
- Realtime header/toolbar/list/detail composition;
- Settings and Recent;
- login at least on phone plus one wider layout;
- orientation/resize transition without duplicate feature ownership.

A screenshot/dev harness may be used only if it is clearly development/test-only, cannot ship as production fixture data, and does not bypass backend/security behavior. Prefer the real app.

### Reference comparison

Maintain a per-layout visual comparison log in `.agents/evidence/plan-033-ui-reference.md`. For every representative size actually exercised, record: viewport/window dimensions, navigation mode, screenshots or bounded visual notes available to the reviewer, reference section compared, structural differences found, whether each difference is fixed or an explicit capability-driven deviation, and any unavailable runtime state that remains Plan 034 evidence. A generic `looks close` statement is not acceptance evidence.

Reviewer acceptance should compare screenshots/source directly against `design/reference/situm-explore-native-responsive-prototype.html`, focusing on:

- hierarchy;
- spacing/density;
- typography scale/weight;
- surface/border/radius treatment;
- responsive composition;
- navigation placement;
- location/permission copy;
- selected-place/Realtime-detail hierarchy;
- truthful deviations explicitly caused by backend/SDK authority.

Pixel-perfect duplication is not required where React Native/platform rendering differs, but unexplained structural divergence is not acceptable.

### Accessibility validation

At minimum validate:

- screen-reader labels/roles for primary controls;
- selected states;
- large text/font scale on key screens;
- hardware-keyboard/D-pad traversal where executable;
- no critical content/action clipped at representative viewports.

## Phase 6 — Validation, closeout and Plan 034 handoff

Run the full truthful non-physical validation available before integration:

- `git diff --check`;
- root tests;
- root lint;
- root typecheck;
- root production build;
- mobile lint;
- mobile typecheck;
- Expo config/doctor under the frozen-version policy;
- clean Expo prebuild where relevant;
- Android `assembleDebug` using the known `/home/farismnrr/Android/Sdk` path;
- emulator/runtime visual checks described above where executable;
- bounded secret/log/source scan;
- full branch diff review against updated `origin/main`.

Update:

- this plan;
- `.agents/evidence/plan-033-ui-reference.md`;
- `.agents/state.md`;
- `AGENTS.md`;
- `ARCHITECTURE.md` if final native presentation/ownership architecture changes materially;
- `DESIGN.md` / `design/data-source-matrix.md` only where final truthful deviations need durable clarification;
- `plans/README.md` and `plans/028-034-native-mobile-roadmap.md`.

### Plan 034 carry-over

Plan 033 may be implementation-approved/integrated after the native UI is reviewer-approved against the canonical reference and all available non-device validation passes. It must **not** convert any physical/runtime E2E item to PASS.

Plan 034 remains responsible for:

- every still-unpassed Plan 030 physical Map/positioning/navigation check;
- every still-unpassed Plan 031 physical Realtime/native-lifecycle check;
- every Plan 032 real cross-client/open/install/deep-link/auth/session/workspace/distribution E2E item;
- physical-device confirmation that the reconciled Plan 033 UI correctly presents permission, location, floor, selected-place, navigation and Realtime states under real runtime conditions;
- final cross-feature lifecycle/security/regression and roadmap closeout.

Do not start Plan 034 until Plan 033 is integrated into updated `main` unless the user explicitly authorizes stacking.

## Definition of done

Plan 033 is implementation-complete only when:

- the native shell and all four approved destinations use the canonical reference hierarchy as closely as real authority allows;
- phone, tablet/POS and wide layouts are meaningfully adaptive, not a single stacked phone layout with a different sidebar;
- phone content is fully reachable and not hidden behind bottom navigation;
- Explore uses real POI/cartography data for search/quick selection and reference-oriented location UX;
- selected-place/floor/navigation presentation is reference-shaped and factual;
- Realtime uses reference-oriented filter/search/list/detail composition without unsupported presence/freshness/marker semantics;
- Settings is production-real and Recent is either backed by a proven existing source or explicitly final/empty without fabricated activity;
- authentication and accessibility basics are reconciled;
- visual/runtime evidence covers representative responsive sizes where executable;
- no backend/security/session/deep-link/feature-lifecycle regression is introduced;
- all remaining physical and cross-client acceptance is explicitly handed to Plan 034, still unpassed;
- reviewer marks the plan PR-ready before any user-gated PR/merge.
