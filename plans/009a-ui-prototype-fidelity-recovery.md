# Plan 009A — UI Prototype Fidelity Recovery

Status: **active-reopened**
Branch: `plan/009a-ui-prototype-fidelity-recovery`
Depends on: cumulative Plans 004–009 implementation present in this branch history
Blocks: Plan 010 and every later backend/Situm integration plan

## Current purpose

This plan was originally created to recover the cumulative Plans 004–009 UI toward the canonical interactive prototype. A later deep review of the pushed 009A branch found that the recovery materially improved the product but **did not yet achieve reliable high-fidelity conformance**.

Previous checked boxes in older 009A execution history are therefore **implementation history only**. They do not prove current visual acceptance. The closure phases in this file are now the active executable checklist and override any earlier visual signoff that conflicts with the findings below.

Do not create a new 009B plan for these findings. Close them in this branch.

## Branch lineage warning

`plan/009a-ui-prototype-fidelity-recovery` was originally created from an earlier cumulative Plan 009 HEAD, but `plan/009-ui-conformance-polish` later received additional commits. The branches are now diverged.

Rules:

- do **not** merge `plan/009-ui-conformance-polish` wholesale into 009A;
- do **not** rebase/reset 009A onto latest Plan 009 merely to make the graph linear;
- inspect later Plan 009 commits only for still-relevant fixes;
- selectively port or reimplement a relevant fix when it is still needed;
- do not reintroduce superseded pre-009A UI while reconciling history;
- 009A remains the cumulative UI recovery baseline to finish and review.

One known still-relevant Plan 009 cleanup is removal of the derived duplicate `app/data/prototype/map.ts`; 009A currently still contains that derived fixture and must reconcile it during Closure Phase 0.

---

# Authority and hard boundaries

Read before implementation:

1. `AGENTS.md`
2. `.agents/README.md`
3. `.agents/state.md`
4. `.agents/protocols/git-workflow.md`
5. `ARCHITECTURE.md`
6. `DESIGN.md`
7. `design/IMPLEMENTATION.md`
8. `design/data-source-matrix.md`
9. `design/reference/situm-explore-interactive-prototype.html`
10. this plan

Visual authority:

1. user's latest explicit direction;
2. canonical HTML reference;
3. `DESIGN.md`;
4. this active recovery plan;
5. `design/IMPLEMENTATION.md`.

The HTML/CSS/JS prototype is a **visual and interaction specification only**. Production remains Nuxt 4 + Vue + Nuxt UI. Do not copy the prototype stylesheet or screen-switching JavaScript architecture into production.

### Existing real behavior that must remain real

Preserve:

- `/api/auth/login`;
- `useUserSession()`;
- auth middleware for `/app/**`;
- logout via session clear;
- `/api/me` and PostgreSQL/Drizzle behavior;
- `/api/situm/status` configuration semantics;
- real `SitumViewer` creation;
- `ViewerEventType.MAP_IS_READY` as the truthful ready transition;
- `ViewerEventType.APP_ERROR` and initialization/missing-config handling.

### UI-roadmap data boundary remains unchanged

Keep local/dummy during this plan:

- registration;
- Home/Dashboard product metrics and activity;
- cartography product records;
- route previews and local navigation actions;
- realtime product data;
- analytics/reports;
- alarms/users/groups/organization;
- new map tools and settings beyond the existing real Viewer lifecycle.

Do not add:

- new Nitro product endpoints;
- database tables/migrations;
- new Situm REST/SDK product-domain integrations;
- Pinia/global store;
- a second component framework;
- speculative service/repository abstractions.

Plan 010 remains blocked until this recovery is complete **and the user explicitly accepts the rendered UI**.

---

# Deep-review findings that reopen 009A

The following findings are current requirements, not optional polish.

## F1 — Previous visual signoff is not sufficient evidence

The pushed plan still has final regression and rendered Phase 10 gates incomplete. Earlier visual checkboxes were marked while authenticated/runtime surfaces were not fully rendered and compared.

Required outcome: no final conformance checkbox is accepted from source inspection alone when browser rendering is available.

## F2 — Auth surface still differs materially

Known mismatches:

- current auth navigation still behaves/looks like underline tabs rather than the canonical segmented gray control;
- register completion still uses a large `UAlert` footprint rather than staying inside the compact canonical form language;
- auth art disappears too late compared with the canonical `800px` transition;
- auth-art brand treatment must be inverse: light/white container with dark navigation-pointer mark;
- canonical desktop remains approximately a 1:1 split with compact two-column art cards.

## F3 — Authenticated responsive breakpoints are inconsistent

The prototype uses meaningful transitions around `1050px`, `800px`, and `520px`. Current production mixes Tailwind `lg=1024` behavior with global CSS that can keep a `208px` content offset while the sidebar is hidden.

Required outcome: no phantom left offset or hidden-sidebar gutter at intermediate widths such as `900px` and `768px`.

## F4 — Landing remains measurably off

Known areas:

- hero type scale/line-height/tracking;
- section/grid spacing;
- Operations two-column gap;
- tablet feature-grid transition;
- exact public width/rhythm.

## F5 — Product page density is not consistently canonical

Several routes still bypass the shared canonical page-header treatment and use 24px headings where the prototype uses the ~30px page-title language.

Multiple tables also add second-line descriptions/IDs/emails that make rows visibly taller than the reference. Truthful data may remain, but secondary content must not alter the canonical silhouette without a justified reason.

## F6 — Map workspace still has silhouette-level drift

Known mismatches:

- center/zoom controls are placed left-bottom instead of canonical right-bottom;
- selected POI uses a large bottom-right card rather than a compact anchored ~240px popover;
- location picker currently uses a modal, while the prototype toggles an on-map marker and transient feedback;
- persistent `Local preview`, `dummy route data`, and inline feedback copy creates extra footprint where the prototype uses compact route UI + toast;
- map route, tabs, control bars, and popover must be evaluated around the real Situm Viewer, not against a fake map replacement.

## F7 — Analytics still uses the wrong visual language

Known mismatches:

- canonical analytics navigation is compact bordered pill controls with dark-filled active state, not underline tabs;
- heatmap should use the canonical compact grid/radial-density language rather than large blurred blobs;
- chart/table/report density still requires rendered comparison.

## F8 — Shared drawer remains too generic

Canonical drawer behavior/geometry:

- ~380px desktop width;
- starts below the app topbar;
- compact ~62px header;
- type pill followed directly by compact detail-list rows;
- ~115px fixed label column;
- divider and full-width View on map action.

Current generic slideover composition must be adjusted to that footprint without giving up Nuxt UI accessibility behavior.

## F9 — Accessibility fixes regressed through branch divergence

A later Plan 009 commit improved subtle-text contrast and tab semantics, but those exact changes are not all present in 009A.

Requirements:

- restore adequate normal-text contrast on light surfaces without destroying the approved visual hierarchy;
- preserve skip-link/navigation accessibility already present;
- ensure true tab interfaces use correct semantics and keyboard behavior;
- preserve visible focus and reduced-motion behavior;
- accessibility may intentionally deviate from the HTML where necessary, but the visual footprint should remain close.

## F10 — Derived fixture duplication remains

`app/data/prototype/map.ts` derives data that already comes from canonical cartography fixtures. Remove the unnecessary duplicate module and derive map selector data from the canonical source at the smallest sensible boundary.

Do not introduce a generic repository/store to solve this.

## F11 — Global transient feedback has a timer ownership bug

`useExploreFeedback()` stores the message globally via `useState`, but each composable invocation owns a separate timer. Two callers can therefore race and clear a newer message with an older timer.

Use one small KISS-safe feedback owner/timer model. Do not build a notification subsystem.

## F12 — Map route has become too large for the architecture contract

`app/pages/app/map.vue` owns substantial Explore, Route, Layers, POI, viewer-tool, modal, building/floor, zoom and feedback behavior in one route file.

Apply SRP/KISS selectively. A reasonable target is a few product-level boundaries such as:

- `MapWorkspaceSidebar`;
- `MapViewerChrome`;
- optionally one focused `useMapWorkspaceState()` composable if reactive coordination genuinely benefits from extraction.

Do **not** split the feature into dozens of tiny files.

## F13 — Durable state/reference locators are stale

Older 009A notes still mention stale brand/reference state and non-canonical selector names. Normalize active state and use actual current reference locations such as `#screen-landing`, authenticated `#app-*` surfaces, `#detailDrawer`, `#searchModal`, and `#viewerModal` as locator hints where useful.

## F14 — Typecheck blocker must be re-proven from a clean current branch

Older state says `nuxt.config.ts` contains a pre-existing session typing blocker, but the currently pushed file no longer obviously matches that historical description.

Do not inherit that blocker by assumption. From a clean checkout of current 009A, rerun typecheck and record the actual current result/error.

---

# Closure Phase 0 — Reconcile branch, plan truth, and active context

No visual redesign in this phase.

- [x] Confirm working branch is `plan/009a-ui-prototype-fidelity-recovery` and working tree is safe.
- [x] Fetch latest refs and document the current 009 vs 009A divergence; do not merge Plan 009 wholesale.
- [x] Inspect the later Plan 009 commits for still-relevant fixes only.
- [x] Remove derived duplicate `app/data/prototype/map.ts` and derive map building/floor options from canonical cartography fixture data.
- [x] Restore any still-required accessibility fix from later Plan 009 only when 009A does not already implement an equivalent or better version.
- [x] Correct stale route/reference selector notes in `.agents/state.md` / session notes where they could mislead future execution.
- [x] Correct stale statements that canonical HTML still contains the old `S`; reference brand normalization is already complete.
- [x] Record that older checked 009A visual boxes are historical evidence and this closure checklist is authoritative.
- [x] `git diff --check`.
- [x] `npm run lint` for code changes.
- [x] commit and push Phase 0.

Acceptance: branch lineage and current instructions are truthful; no missing cleanup is silently assumed to exist because it was committed to a sibling branch.

---

# Closure Phase 1 — Global visual foundation + accessibility repair

Fix systemic causes before route-specific tuning.

- [x] Re-audit `app/app.config.ts` and global semantic CSS against the current reference.
- [x] Keep primary/secondary/ghost/accent `UButton` hierarchy consistent with the prototype.
- [x] Restore accessible muted/subtle text contrast while preserving the light visual hierarchy.
- [x] Ensure canonical page-title utility/composition actually produces the ~30px title language and is used consistently.
- [x] Confirm panel heading, table header/body, card, input, select, badge/pill and toolbar density globally.
- [x] Ensure table rows do not gain unnecessary height from unreferenced secondary lines.
- [x] Preserve visible focus, skip link and reduced-motion behavior.
- [x] Fix tab semantics/keyboard behavior for Analytics and other true tab interfaces.
- [x] Do not create `BaseButton`, `BaseCard`, `BaseInput`, or a parallel design system.
- [x] Render at least one representative public and authenticated surface before closing this phase.
- [x] `git diff --check`.
- [x] `npm run lint`.
- [ ] `npm run typecheck` — blocked by the preserved pre-existing local `nuxt.config.ts` session-cookie typing edit.
- [x] commit and push Phase 1.

---

# Closure Phase 2 — Landing + Login + Register exact recovery

## Landing `/`

- [ ] Match canonical public container width/rhythm.
- [ ] Match hero font size, line-height, tracking and copy width.
- [ ] Match hero two-column gap and preview-window geometry.
- [ ] Match trust strip density.
- [ ] Match Product cards and section vertical spacing.
- [ ] Match Operations two-column gap/composition.
- [ ] Match Analytics stats and dark CTA block.
- [ ] At <=800px, match the canonical single-column hero and one-column feature-grid behavior.
- [ ] At <=520px, match phone-specific hero/action/preview behavior.

## Login `/login`

- [ ] Desktop composition is approximately 1:1 split.
- [ ] Auth-art mark uses canonical inverse treatment.
- [ ] Two art information cards remain compact and two-column on desktop.
- [ ] Login/Register navigation is a segmented gray control, not underline tabs.
- [ ] Auth form/card width and field density match canonical treatment.
- [ ] Real login errors stay compact and do not create unrelated alert-page composition.
- [ ] Real login loading/success/failure behavior remains unchanged.

## Register `/register`

- [ ] Reuse the same Auth shell/composition.
- [ ] Preserve canonical field order and first/last split.
- [ ] Registration remains local/dummy.
- [ ] Completion feedback stays inside the compact form language; remove large page-shifting success alert treatment.

Responsive:

- [ ] Auth art is hidden at the canonical <=800px transition.
- [ ] 768px rendering must not retain desktop auth art.
- [ ] 390px rendering has no horizontal overflow.

Validation:

- [ ] screenshots/render review at 1440, 1024, 768 and 390 widths;
- [ ] `npm run lint`;
- [ ] `npm run typecheck`;
- [ ] commit and push Phase 2.

---

# Closure Phase 3 — Authenticated shell + canonical responsive breakpoints

Primary ownership: `app/layouts/app.vue` and small product shell components only when they materially improve SRP/readability.

Canonical breakpoint behavior to reproduce:

- desktop >=~1050: 228px sidebar;
- laptop ~800–1050: 208px sidebar;
- <=800: sidebar becomes drawer and app main has no persistent sidebar offset;
- <=520: compact topbar/search/action behavior.

Tasks:

- [ ] Remove the phantom 208px left gutter at widths where sidebar is hidden.
- [ ] Do not rely on contradictory `lg=1024` and custom 800px behavior for the same responsibility.
- [ ] Test explicit intermediate width `900px` in addition to 1024/768.
- [ ] Match canonical compact sidebar group/item density and labels.
- [ ] Match account footer: avatar/name/email/overflow + separate Sign out action, using real session/logout.
- [ ] Match 64px topbar, breadcrumb, search trigger with keyboard hint, Sync action and compact POC status pill.
- [ ] Preserve accessible mobile menu/backdrop, `aria-expanded`, `inert`/hidden navigation behavior and focusability.
- [ ] App content max width/padding must match canonical rhythm with no document overflow.
- [ ] Render an authenticated route at 1440, 1024, 900, 768 and 390 widths before close.
- [ ] `npm run lint`.
- [ ] `npm run typecheck`.
- [ ] commit and push Phase 3.

---

# Closure Phase 4 — Route-by-route product density and composition

Do not redesign. Use the canonical page/state as the target.

## Home `/app`

- [ ] Verify welcome card, four stats, 1.4/.6 content grid, building mini, activity rows and Quick Explore against rendered reference.
- [ ] Remove any residual extra copy/spacing that changes silhouette.

## Dashboard `/app/dashboard`

- [ ] Canonical ~30px page title/action alignment.
- [ ] Four compact stats.
- [ ] Visitor chart canvas/density.
- [ ] System status footprint remains truthful for real DB/Situm while matching canonical density.
- [ ] Lower occupancy/alarm 1:1 grid.

## Buildings `/app/buildings`

- [ ] Canonical page head and single-search toolbar; remove status filter if still present.
- [ ] Compact table rows with no unreferenced second-line organization text when it changes row height.
- [ ] Floor coverage and resources panels match canonical density.

## POIs `/app/pois`

- [ ] Canonical search + category filter + POI count.
- [ ] Compact single-line table silhouette; remove unreferenced secondary description row text when necessary.
- [ ] Favorite treatment and drawer trigger match reference.

## Geofences `/app/geofences`

- [ ] Page head -> 3 metrics -> table, no extra toolbar.
- [ ] Compact table; avoid unreferenced identifier second lines that change silhouette.

## Paths `/app/paths`

- [ ] Building-mini path network language.
- [ ] Canonical 1.4/.6 relationship.
- [ ] Compact route result; remove explanatory local-fixture footer copy that is not represented.
- [ ] Route step number/text density matches prototype.

## Realtime `/app/realtime`

- [ ] Auto refresh · 5s is truthful and locally simulated with cleanup.
- [ ] Four compact stats.
- [ ] Building-mini live map and compact activity rows.
- [ ] No persistent visual debug/local-preview labels beyond what reference footprint permits.

## Analytics `/app/analytics`

- [ ] Replace underline report navigation with canonical compact bordered/pill-style controls and dark-filled active state.
- [ ] Visitors/Positioning chart geometry matches canonical 250px-ish canvas/density.
- [ ] Heatmap uses canonical grid/radial density language and approximate 260px height.
- [ ] Stay/Positions tables use canonical compact density.
- [ ] Viewer usage is three compact soft cards.
- [ ] Export feedback is transient.

## Alarms `/app/alarms`

- [ ] Canonical header/open pill + two-filter toolbar.
- [ ] Compact table and status/type pills.

## Users `/app/users`

- [ ] Canonical equal Users/Groups grid.
- [ ] Compact user rows; remove unreferenced email second line from table if it changes reference silhouette.
- [ ] Groups activity rows match canonical density.

## Organization `/app/organization`

- [ ] Canonical 1.4/.6 composition and detail-list rhythm.
- [ ] Keep truthful Read & Write (POC) wording in the same visual role as reference permission pill.
- [ ] Credential boundary stays visually compact; do not expose key value.

## Viewer Settings `/app/settings`

- [ ] 220px settings nav + 14px gap on desktop.
- [ ] Canonical 11px-ish nav/row density and 18px content padding.
- [ ] General/Navigation/Map/Styles/Images state composition matches reference.
- [ ] <=800 settings nav becomes horizontal without overflow bugs.

For each route above:

- [ ] rendered desktop comparison completed;
- [ ] relevant tablet/mobile comparison completed;
- [ ] no extra debug/local-fixture UI materially changes hierarchy.

Validation:

- [ ] `git diff --check`;
- [ ] `npm run lint`;
- [ ] `npm run typecheck`;
- [ ] commit and push Phase 4.

---

# Closure Phase 5 — Map workspace + shared overlay fidelity

This is the highest-priority product surface. The map canvas stays the real Situm Viewer.

## Map workspace `/app/map`

- [ ] 320px desktop / ~280px laptop side panel where canonical applies.
- [ ] Explore/Route/Layers segmented controls match reference.
- [ ] POI rows match canonical size/icon/text density.
- [ ] Route form/result is compact and does not expose persistent `dummy route data` / `Local preview` copy that changes the card footprint.
- [ ] Route/local actions use transient feedback when reference uses toast.
- [ ] Layers rows/switches and More Viewer Tools grid match reference.
- [ ] Building/floor controls match canonical top-left composition.
- [ ] Explore/Realtime/Trajectory mode controls match canonical top-right composition.
- [ ] Center/zoom control cluster is at canonical right-bottom placement and shape.
- [ ] Selected POI is a compact anchored ~240px popover equivalent to canonical `#poiPopover`, not a large bottom-right card.
- [ ] Directions/Favorite behavior remains local and functional.
- [ ] Location picker toggles an on-map marker/selection state like the reference; do not use a separate location-picker modal unless a runtime constraint requires and documents it.
- [ ] Viewer accessibility modal remains a Nuxt UI modal but matches canonical 520px composition.
- [ ] Real Viewer loading/ready/error lifecycle is preserved.
- [ ] No new Situm product feature calls are introduced.

## Shared details drawer

- [ ] ~380px desktop width below topbar.
- [ ] compact ~62px header.
- [ ] type pill -> canonical compact detail-list; do not insert a large unreferenced name/subtitle hero block.
- [ ] detail rows use ~115px fixed label column.
- [ ] divider + full-width View on map action.
- [ ] mobile full-width below topbar.
- [ ] Nuxt UI focus/Escape behavior remains accessible.

## Global search

- [ ] ~520px modal geometry.
- [ ] canonical compact result rows.
- [ ] Cmd/Ctrl+K and Escape work.

## Transient feedback

- [ ] Fix timer ownership so multiple callers cannot clear a newer shared message with an older caller timer.
- [ ] Keep one small KISS-safe feedback mechanism.
- [ ] Dark bottom-right toast footprint matches reference.

Validation:

- [ ] rendered Map Explore state;
- [ ] rendered Route before/after calculation;
- [ ] rendered Layers;
- [ ] rendered selected POI popover;
- [ ] rendered location picker marker state;
- [ ] rendered viewer accessibility modal;
- [ ] rendered details drawer and search modal;
- [ ] 1440, 1024, 900, 768 and 390 width checks where applicable;
- [ ] `npm run lint`;
- [ ] `npm run typecheck`;
- [ ] commit and push Phase 5.

---

# Closure Phase 6 — Architecture / SOLID / DRY / KISS cleanup

Do this **after** the visual shape is correct so architecture cleanup does not become redesign.

- [ ] Keep Nuxt 4 `app/` / root `server/` boundaries intact.
- [ ] Keep one authenticated layout owner.
- [ ] Remove the derived duplicate map fixture if not already removed in Phase 0.
- [ ] Audit `app/pages/app/map.vue` against the architecture rule that pages remain route/composition focused.
- [ ] Extract only clear product responsibilities; prefer a few boundaries such as `MapWorkspaceSidebar` and `MapViewerChrome` if they materially reduce the route file.
- [ ] Introduce `useMapWorkspaceState()` only if it clearly improves reactive coordination; do not create a god composable.
- [ ] Do not create generic UI wrappers for Nuxt UI primitives.
- [ ] Do not add Pinia, event bus, generic API client, DI container, repository layer, or service layer for UI recovery.
- [ ] Ensure fixtures stay typed and canonical under `app/data/prototype/`.
- [ ] Ensure no app code imports `server/` source.
- [ ] `git diff --check`.
- [ ] `npm run lint`.
- [ ] `npm run typecheck`.
- [ ] `npm run build`.
- [ ] commit and push Phase 6.

---

# Closure Phase 7 — Real behavior regression from clean current branch

Do not inherit historical validation results without rerunning them.

Environment-sensitive checks may use local ignored `.env`; never print or commit secret values.

- [ ] Start from clean current 009A checkout.
- [ ] `git diff --check`.
- [ ] `npm run lint`.
- [ ] `npm run typecheck` and record the **actual current** result; do not assume the old `nuxt.config.ts` blocker still exists.
- [ ] `npm run build`.
- [ ] Real login success works.
- [ ] Real login failure remains truthful/compact.
- [ ] unauthenticated `/app` and `/app/**` redirect to `/login`.
- [ ] logout clears session and exits protected app.
- [ ] `/api/me` remains session-protected and uses real DB behavior.
- [ ] `/api/situm/status` retains configuration-only semantics.
- [ ] real Situm Viewer initializes when configured.
- [ ] `MAP_IS_READY` remains the only ready event.
- [ ] `APP_ERROR`, missing-config and initialization error states remain truthful.
- [ ] no new Situm product-domain API/SDK integration was added.
- [ ] no secrets are committed/rendered/logged.
- [ ] update `.agents/state.md` and session trace with actual validation truth.
- [ ] commit and push Phase 7.

If credentials/environment make an actual runtime check impossible, leave only that specific check pending and state the exact blocker. Do not mark it passed from source inspection.

---

# Closure Phase 8 — Evidence-based rendered conformance signoff

This is the mandatory final UI gate.

## Required viewports

At minimum:

- `1440×900` desktop;
- `1024×900` laptop;
- `900×900` intermediate authenticated breakpoint check;
- `768×1024` tablet;
- `390×844` mobile.

## Route/state matrix

Compare canonical HTML and rendered Nuxt side-by-side or via screenshots.

- [ ] `/` desktop/tablet/mobile.
- [ ] `/login` empty/error/loading where practical + tablet/mobile.
- [ ] `/register` empty/completed + tablet/mobile.
- [ ] `/app`.
- [ ] `/app/dashboard`.
- [ ] `/app/map` loading/ready.
- [ ] `/app/map` Explore.
- [ ] `/app/map` Route before/after calculation.
- [ ] `/app/map` Layers.
- [ ] `/app/map` selected POI popover.
- [ ] `/app/map` location picker marker.
- [ ] `/app/map` viewer accessibility modal.
- [ ] `/app/buildings` + drawer.
- [ ] `/app/pois` + drawer.
- [ ] `/app/geofences`.
- [ ] `/app/paths` before/after preview.
- [ ] `/app/realtime` + refresh feedback.
- [ ] `/app/analytics` every report tab.
- [ ] `/app/alarms`.
- [ ] `/app/users` + drawer.
- [ ] `/app/organization`.
- [ ] `/app/settings` General/Navigation/Map/Styles/Images.
- [ ] global search modal.
- [ ] transient toast.
- [ ] mobile sidebar/drawer behavior.

For each state evaluate explicitly:

- [ ] overall silhouette/proportions;
- [ ] content width;
- [ ] typography scale/line-height;
- [ ] spacing rhythm;
- [ ] border/radius/shadow hierarchy;
- [ ] button/action hierarchy;
- [ ] table/card/stat density;
- [ ] responsive behavior;
- [ ] interactive state and overlays.

Rules:

- do not sign off merely because text/data is similar;
- do not sign off from source inspection alone while browser tooling is available;
- do not hide major mismatch behind the label `intentional deviation`;
- acceptable deviations are limited to real auth semantics, real Situm Viewer lifecycle, truthfulness, accessibility, or unavoidable framework behavior;
- every accepted deviation must preserve approximately the canonical visual footprint and be documented below.

### Intentional deviations accepted during final review

Record only after rendered review:

- [ ] none currently approved; add exact deviation + reason if one is genuinely required.

Final gates:

- [ ] all Closure Phases 0–7 complete;
- [ ] all required route/state rendered checks complete;
- [ ] `git diff --check` passes;
- [ ] `npm run lint` passes;
- [ ] `npm run typecheck` passes;
- [ ] `npm run build` passes;
- [ ] `.agents/state.md` and session trace reflect actual final truth;
- [ ] branch is pushed;
- [ ] no PR created;
- [ ] user manual review requested.

---

# Completion boundary

Plan 009A is complete only when:

1. all closure phases above are complete;
2. the current branch passes lint, typecheck and build from a clean checkout;
3. real auth/DB/Situm foundation behavior remains intact;
4. every major route/state has rendered comparison evidence at the relevant canonical viewports;
5. no known silhouette-level mismatch remains;
6. remaining differences are small, explicit, justified and documented;
7. the branch is pushed;
8. **the user explicitly accepts the recovered UI**.

Until then:

- do not create the cumulative UI PR unless the user explicitly asks;
- do not merge to `main`;
- do not start Plan 010;
- do not treat older 009/009A visual checkboxes as final acceptance.
