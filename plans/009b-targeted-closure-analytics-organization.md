# Plan 009B Addendum — Analytics & Organization UI Targeted Closure

Status: **active-targeted-closure**
Branch: `plan/009b-ui-final-fidelity-punch-list`
Parent plan: `plans/009b-ui-final-fidelity-punch-list.md`
Baseline reviewed: `e42cfd1d92b81bf26e0ce7ce36584617ca483a67`
Focused routes:

- `/app/analytics`
- `/app/users`
- `/app/organization`
- `/app/settings`

Private preview targets supplied by the user:

- `http://100.99.88.53:3000/app/analytics`
- `http://100.99.88.53:3000/app/users`
- `http://100.99.88.53:3000/app/organization`
- `http://100.99.88.53:3000/app/settings`

This addendum is the **authoritative next execution checklist** for Plan 009B. The parent plan remains the foundation contract; this addendum closes the specific route-level failures that show the migration to the shared foundation is still incomplete.

Plan 010 remains blocked.

---

## Why this stays in 009B instead of becoming 009C

The four broken screens do not represent a new architecture or feature scope. They expose the same unfinished Plan 009B problem:

- repeated product patterns still use route-local Tailwind/CSS instead of one shared owner;
- route-local padding/font/spacing overrides defeat the canonical shared density;
- reusable components already exist but are not consistently used;
- some patterns originally classified as `intentionally local` are now proven repeated enough to deserve a shared product owner;
- source-level similarity was treated as sufficient even though rendered composition still differs materially.

Create Plan 009C only if, after this closure, the remaining issues are genuinely isolated page-specific punch-list items that no longer belong to the shared foundation/reuse contract.

---

# Review limitation and rendered gate

The supplied `100.x` preview URLs are private-network addresses and are not reachable from the remote reviewer environment used for this audit. Do **not** claim that this audit visually inspected those live pixels.

This addendum was produced from:

1. the latest pushed 009B source at `e42cfd1`;
2. the canonical interactive HTML reference;
3. the current shared Nuxt UI/product components;
4. exact canonical CSS geometry for panel heads, tables, analytics, settings, activity rows and detail rows.

Execution on the user's machine / Codex environment must open the supplied preview URLs and compare rendered output directly with the canonical HTML before closing this addendum.

Rendered evidence is mandatory when the executing environment has browser/screenshot tooling.

---

# Canonical geometry relevant to these routes

Use the canonical HTML itself as final authority. Important repeated values include:

```text
app content             max 1480px; desktop padding 30px 28px 50px
page head               margin-bottom 22px
page description        13px / 1.5
panel head              padding 15px 16px; border-bottom
panel title              13px
panel right meta         10px
panel body               padding 16px
main grid gap            14px
activity row             padding 11px 0; 8px / 1fr / auto columns
activity title           11px
activity meta            10px
compact table th         10px; padding 10px 12px
compact table td         11px; padding 11px 12px
analytics tab            min-height 32px; px 10px; font 10px; radius 8px
analytics chart          height 250px
heatmap                  height 260px
settings layout          220px / 1fr; gap 14px
settings nav             padding 8px
settings nav item        min-height 35px; px 9px; font 11px; radius 8px
setting section          padding 18px
setting section title    13px
setting section intro    10px
setting row              padding 13px 0; gap 18px
setting row title        11px
setting row description  10px
compact detail row       115px / 1fr; gap 12px; font 11px
```

Accessibility-required contrast deviations may remain, but they must not change the footprint/density unnecessarily.

---

# Root findings from the deep source/reference audit

## F1 — Foundation migration is incomplete

The Nuxt primitive theme is now much closer to the reference, but these routes still hardcode their own layout/density. The visual result therefore depends on page-local class recipes instead of the reusable foundation.

Examples:

- Users applies `px-5 py-4` and other route-level table padding on top of `.table-density`;
- Settings uses `text-sm`, `text-xs` and `py-4` for rows whose canonical type is around 11px/10px with 13px vertical padding;
- Organization owns `.detail-list` / `.detail-row` scoped CSS even though `ProductDetailList.vue` already exists;
- Analytics owns several unique panel-head/table padding recipes and negative-margin patterns rather than one panel/body owner.

Required outcome: when the semantic pattern is shared, route files provide content/state, not the visual recipe.

## F2 — A reusable panel owner is missing from actual migration

Canonical `panel-head` is repeated across Analytics, Users, Organization and many other surfaces:

```text
15px 16px padding
13px title
10px right meta
bottom border
single horizontal title/meta hierarchy
```

Current routes still reproduce this inconsistently.

Required outcome: create/reconcile one small reusable product panel framing/header owner (name according to existing conventions, e.g. `ProductPanelHeader` / `ProductPanel`) and migrate these four routes where semantics match.

Do not build a giant card abstraction.

## F3 — Shared detail-list ownership is being bypassed

`ProductDetailList.vue` already owns canonical-like `115px + 1fr` detail geometry, but Organization recreates rows locally with flex/space-between.

Required outcome: Organization must use the shared detail-list owner. Extend the component minimally only if a status/pill value needs a scoped slot or small typed semantic option.

Do not duplicate a second organization-specific detail-row system.

## F4 — Settings-row repetition is now proven

The settings page repeats the same title/description/control row many times, and the viewer settings modal uses the same product grammar.

The earlier `intentionally local` classification is superseded by actual repetition.

Required outcome: introduce/reconcile a small `ProductSettingRow`-style component (exact name may follow repo conventions) with:

- title;
- description;
- trailing control slot;
- canonical compact spacing/type;
- responsive stacking behavior;
- no knowledge of business state.

Use it across settings panes and compatible viewer-settings rows.

## F5 — Activity/list rows are visually drifting

Users Groups and Settings Images use the same canonical `activity-list/activity-row` visual grammar but currently render different spacing/content density.

Required outcome: if one small shared activity-row component can represent dot + title + one metadata line + trailing content without becoming generic soup, use it. Otherwise use one shared product CSS/component owner and keep route-specific content local.

Do not preserve duplicate route-level padding recipes.

---

# Closure Phase A — Shared product-pattern owners first

Do this before route-specific tuning.

- [x] Confirm current branch is `plan/009b-ui-final-fidelity-punch-list` and start from latest pushed 009B HEAD.
- [x] Read the canonical CSS for `.panel-head`, `.panel-body`, `.activity-row`, `.table`, `.detail-row`, `.analytics-tab`, `.chart`, `.heatmap`, `.settings-layout`, `.settings-nav`, `.setting-section`, `.setting-row`.
- [x] Reconcile one shared product panel/header owner for canonical panel title + right metadata.
- [x] Reconcile `ProductDetailList` so Organization can use it without route-local detail-row CSS.
- [x] Add/reconcile a compact reusable settings-row component for repeated title/description/control rows.
- [x] Add/reconcile shared activity-row ownership only if it cleanly covers Users Groups + Settings Images (and optionally other proven identical rows).
- [ ] Keep `ProductPageHeader`, `ProductStatusBadge`, `useExploreFeedback`, `useTabKeyboard` as existing owners where applicable.
- [ ] Do not add `BaseCard`, `BaseTable`, `BaseRow`, generic config-driven UI engines, Pinia, event bus, or a god composable.
- [x] Remove/stop using route-level sizes/padding that directly contradict the shared owner.
- [x] `git diff --check`.
- [x] `npm run lint`.
- [x] `npm run typecheck`.
- [x] commit and push this phase.

Acceptance: the four focused pages can be tuned mostly by content/composition rather than each defining its own repeated visual primitives.

---

# Closure Phase B — Analytics exact conformance

Reference: canonical `#app-analytics` plus canonical `.analytics-tabs`, `.analytics-tab`, `.chart`, `.heatmap`, `.panel-head`, `.panel-body`, `.table`.

## Page head

- [x] Keep `ProductPageHeader`.
- [x] Date select rendered width matches canonical 150px footprint (not a generic wider `w-40` unless rendered measurement proves equivalence).
- [x] `Export CSV` matches canonical secondary text-only action; remove the unreferenced download icon.
- [x] Preserve local CSV behavior and transient feedback.

## Report tabs

- [x] Match canonical flex-wrap behavior rather than forcing a desktop horizontal-scroll strip when wrapping is available.
- [x] Each tab: ~32px minimum height, 10px horizontal padding, 10px text, 8px radius, 1px border.
- [x] Active tab uses dark ink background/border + white text.
- [x] Inactive tabs use white surface + canonical border/muted text.
- [x] Preserve correct tab semantics, roving tabindex and Arrow/Home/End keyboard behavior through `useTabKeyboard`.

## Report card/panels

- [x] Use one consistent shared panel-head/body framing for every report pane; remove route-specific negative-margin/header recipes.
- [x] Visitors panel right meta is `Unique indoor visitors` like the reference; do not replace that slot with the selected date range.
- [x] Positioning panel right meta is `Tracked duration by user`.
- [x] Stay panel right meta is `Average duration`.
- [x] Positions panel right meta is `Latest report rows`.
- [x] Viewer usage panel right meta is `Sessions & interactions`.

## Charts / heatmap

- [x] Visitor/positioning chart overall height and inner padding follow canonical 250px chart geometry.
- [x] Keep canonical restrained gray bars with pale-blue accent bars; do not turn the chart into a generic Nuxt/Tailwind primary chart.
- [x] Heatmap is canonical 260px high, not the current 320px.
- [x] Heatmap uses three canonical density spots, not four.
- [x] Remove the unreferenced `Main Building · Floor 1` floating label unless the user explicitly asks to keep it.
- [x] Match canonical low-blur red/amber/yellow density treatment.

## Tables / viewer usage

- [x] Stay and Positions tables use shared compact table density with no route-level p-4/p-6 shell that changes canonical footprint.
- [x] Viewer usage uses canonical `panel-body grid-3` + soft stat cards and canonical compact type.

Validation:

- [x] Render `http://100.99.88.53:3000/app/analytics` at 1440x900 and compare side-by-side with canonical Analytics.
- [x] Check every report tab.
- [x] Check 1024px, 768px and 390px behavior.
- [x] No horizontal document overflow.
- [x] `git diff --check`, lint, typecheck.
- [x] commit and push Analytics closure.

---

# Closure Phase C — Users & groups exact conformance

Reference: canonical `#app-users`, `.grid-equal`, `.panel-head`, `.table`, `.activity-row`.

## Page/grid

- [x] Keep `ProductPageHeader` with the compact `Only Read` action pill.
- [x] Desktop Users/Groups cards use equal columns with canonical 14px gap.

## Users card

- [x] Use shared panel header: title `Users`, right meta `<count> members` on the same compact header line.
- [x] Remove the second-line header paragraph footprint.
- [x] Desktop table rows use canonical compact shared table density only.
- [x] Remove route-level `px-5 py-4`, `px-4 py-4`, `py-3`, etc. that override shared 10/11px table sizing.
- [x] Name cell is single-line in the canonical table. Do not render email as a second line in the desktop row.
- [x] User name link uses canonical dark text/weight/underline-on-hover language, not blue `text-info` link styling.
- [x] Preserve user selection and details drawer behavior.
- [x] Mobile fallback may expose email if useful, but must remain compact and must not redefine desktop density.

## Groups card

- [x] Use shared panel header: title `Groups`, right meta `<count> groups`.
- [x] Each group row matches canonical dot + title + one metadata line + trailing chevron.
- [x] Remove the extra group description line from the canonical card footprint.
- [x] Use canonical dot tones and compact 11px/10px activity typography.

Validation:

- [x] Render `http://100.99.88.53:3000/app/users` at 1440x900 and compare side-by-side with canonical Users.
- [x] Verify drawer open state separately.
- [x] Check 1024px, 768px and 390px behavior.
- [x] `git diff --check`, lint, typecheck.
- [x] commit and push Users closure.

---

# Closure Phase D — Organization exact conformance

Reference: canonical `#app-organization`, `.grid-2`, `.panel-head`, `.panel-body`, `.detail-list`, `.detail-row`, `.soft-card`.

## Grid/panels

- [x] Desktop relationship is canonical 1.4fr / .6fr with 14px gap.
- [x] Left panel header contains `Situm organization` + plain right meta `Current organization`; remove the extra `POC context` badge.
- [x] Right panel header contains `POC credential boundary` + plain right meta `Prototype rule`; remove the extra `Configured` badge.

## Detail list

- [x] Use `ProductDetailList` (or the same shared owner) instead of page-local `.detail-list/.detail-row` scoped CSS.
- [x] Rows use canonical 115px label column + remaining value column, ~12px gap, compact ~11px type.
- [x] Wrap the detail list in the canonical panel-body spacing rather than letting rows visually touch the card edges.
- [x] Remove superseded Organization-specific detail CSS after migration.

## Permission truthfulness

The old HTML says `Only Read`, but the current POC truth is a Read & Write-capable key. Do not regress truthfulness merely to copy stale text.

- [x] Use truthful `Read & Write (POC)` (or the latest project-approved equivalent) in the same compact visual role as the reference permission pill.
- [x] Do not hardcode `Only Read` in the credential card while the organization detail says `Read & Write (POC)`.
- [x] Keep the credential value secret; never render/log it.

## Credential boundary card

- [x] Canonical soft-card padding approximately 14px.
- [x] `Browser viewer key` + truthful compact permission pill on one row.
- [x] Explanatory text matches canonical size/line-height/footprint while remaining factually correct for the real POC.
- [x] Divider spacing approximately 15px.
- [x] Bottom context text remains compact and truthful; do not add a larger admin-warning block.

Validation:

- [x] Render `http://100.99.88.53:3000/app/organization` at 1440x900 and compare side-by-side with canonical Organization.
- [x] Check 1024px, 768px and 390px behavior.
- [x] `git diff --check`, lint, typecheck.
- [x] commit and push Organization closure.

---

# Closure Phase E — Viewer Settings exact conformance

Reference: canonical `#app-settings`, `.settings-layout`, `.settings-nav`, `.setting-section`, `.setting-row`, `.setting-copy`, `.activity-row`.

## Page head/layout

- [x] Keep `ProductPageHeader`.
- [x] `Reset demo` matches canonical secondary **text-only** button; remove the unreferenced rotate icon.
- [x] Desktop settings layout is exactly 220px + 1fr with 14px gap.

## Settings navigation

- [x] Card padding 8px.
- [x] Each item min-height ~35px, horizontal padding ~9px, font ~11px, radius ~8px.
- [x] Active item uses canonical neutral `#eef0f2`-like surface + dark text, not a generic oversized nav state.
- [x] Preserve tab semantics and `useTabKeyboard` behavior.
- [x] At <=800px, navigation becomes the canonical horizontal scroll row.

## Setting section typography/density

- [x] Section padding 18px.
- [x] Section heading ~13px, not current `text-base`/16px.
- [x] Section intro ~10px, not current `text-xs`/12px.
- [x] Use the shared compact setting-row component for every compatible row.
- [x] Row padding ~13px 0 and gap ~18px.
- [x] Row title ~11px.
- [x] Row description ~10px with canonical 1.4 line-height.
- [x] Do not keep `py-4`, `text-sm`, `text-xs` route-local sizing that makes the entire page visibly taller than the prototype.

## Control widths

Match canonical rendered footprints unless accessibility/responsive constraints require a deliberate small deviation:

```text
Language                 ~160px
Excluded tags            ~220px
Configuration profile    ~170px
Default building         ~190px
Default floor            ~150px
```

- [x] Control height/radius still comes from shared Nuxt UI primitive theme.

## Styles / Images tabs

- [x] Map style soft cards use canonical ~13px padding, 80px preview height and ~9px preview radius.
- [x] Images uses canonical activity-list row grammar rather than a large nested soft-card/list block if that changes silhouette.
- [x] Image rows show dot + filename + one metadata line + trailing status pill with canonical density.

Validation:

- [x] Render `http://100.99.88.53:3000/app/settings` at 1440x900 and compare side-by-side with canonical Settings.
- [x] Review **General, Navigation, Map configuration, Map styles, Images** tabs individually.
- [x] Check 1024px, 768px and 390px behavior.
- [x] `git diff --check`, lint, typecheck.
- [x] commit and push Settings closure.

---

# Closure Phase F — Cross-route reuse enforcement

After all four routes visually match:

- [ ] Search Analytics/Users/Organization/Settings for repeated `panel-head` recipes; shared owner must be used where semantics match.
- [ ] Search for route-level table-cell padding/font overrides that fight `.table-density`; remove unjustified overrides.
- [ ] Search for duplicate detail-row implementations; Organization must not own a parallel detail-list system.
- [ ] Search repeated setting-row markup; compatible rows use one shared component.
- [ ] Search repeated activity-row markup; use one shared owner where the canonical grammar is actually identical.
- [ ] Keep unique charts/report data/settings state local.
- [ ] Do not move route state into presentation components just to reduce line count.
- [ ] `git diff --check`.
- [ ] `npm run lint`.
- [ ] `npm run typecheck`.
- [ ] `npm run build`.
- [ ] update parent Plan 009B status/session/state with actual closure evidence.
- [ ] commit and push.

---

# Final rendered acceptance gate

Do **not** close Plan 009B from source inspection alone.

Required user-visible comparison:

1. open canonical HTML reference;
2. open each supplied private preview URL;
3. use the same viewport;
4. compare silhouette, not just text;
5. fix mismatches;
6. repeat until accepted.

Minimum desktop review: `1440x900`.

Also review `1024`, `768`, and `390` widths where responsive behavior materially changes.

For every route explicitly check:

```text
page header footprint
card widths/heights
panel header density
body padding
text size/line-height
row density
control dimensions
status-pill dimensions
horizontal/vertical gaps
active/selected state
responsive stacking
```

Plan 009B is not complete until:

- [ ] Analytics rendered state is accepted;
- [ ] Users rendered state is accepted;
- [ ] Organization rendered state is accepted;
- [ ] Settings rendered state and every settings tab are accepted;
- [ ] reusable component/logic ownership is accepted;
- [ ] lint/typecheck/build pass;
- [ ] no backend/Situm product-domain integration was added;
- [ ] no PR was created without explicit authorization;
- [ ] user explicitly accepts this targeted closure.

Plan 010 remains blocked until the final UI baseline is explicitly accepted.
