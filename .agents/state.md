# Current State

_Last reviewed: 2026-08-12_

## Current focus

Finish **Plan 009B targeted UI closure** for four rendered surfaces that the user reports are still visibly broken compared with the canonical prototype:

- `/app/analytics`
- `/app/users`
- `/app/organization`
- `/app/settings`

Active parent plan:

`plans/009b-ui-final-fidelity-punch-list.md`

Authoritative next checklist:

`plans/009b-targeted-closure-analytics-organization.md`

Execution branch:

`plan/009b-ui-final-fidelity-punch-list`

Latest implementation baseline reviewed before the addendum: `e42cfd1d92b81bf26e0ce7ce36584617ca483a67`.

No PR or merge is authorized.

## Why this remains Plan 009B

This is not a new feature or architecture scope. The four broken pages expose an unfinished 009B migration problem:

- route-local padding/font/spacing still overrides the shared Nuxt UI/product foundation;
- repeated panel/header/list/detail/settings patterns still lack one actual owner in all callers;
- existing reusable components are sometimes bypassed;
- source-level conformance was insufficient to prove rendered fidelity.

Do **not** create Plan 009C for these findings. Create 009C only if, after this targeted closure, remaining issues are genuinely isolated page-specific punch-list items rather than shared-foundation/reuse failures.

## Private rendered preview targets

The user supplied:

- `http://100.99.88.53:3000/app/analytics`
- `http://100.99.88.53:3000/app/users`
- `http://100.99.88.53:3000/app/organization`
- `http://100.99.88.53:3000/app/settings`

These `100.x` private-network addresses are not reachable from the remote reviewer environment used to create the addendum. Do not claim live pixel inspection from that environment.

When executing locally where the URLs are reachable, browser/screenshot comparison against `design/reference/situm-explore-interactive-prototype.html` is mandatory before closing 009B.

## Deep audit findings

### Shared foundation ownership

The Nuxt primitive theme is materially closer to the prototype now, but the focused routes still contain route-level recipes that defeat it.

Required shared owners during the targeted closure:

- keep `ProductPageHeader` for authenticated page heads;
- reconcile one shared canonical panel/header framing owner;
- use/reconcile `ProductDetailList` instead of Organization-specific detail-row CSS;
- introduce/reconcile a small reusable compact setting-row component for repeated title/description/control rows;
- use one activity-row owner where Users Groups and Settings Images genuinely share the canonical dot/title/meta/trailing grammar;
- keep `useTabKeyboard` as the shared tab keyboard behavior;
- keep `useExploreFeedback` as the shared transient feedback owner.

Do not create generic `Base*` wrappers, Pinia, event bus, god composables, generic component factories, or backend abstractions for this UI closure.

### Analytics

Current source still differs from canonical in important ways:

- page select is wider than the canonical ~150px footprint;
- Export CSV adds an unreferenced icon;
- report panels use inconsistent route-local padding/negative-margin recipes;
- Visitors/Positioning panel metadata differs from the canonical right-meta contract;
- heatmap is currently taller, has four spots, and adds an unreferenced floating building label;
- table/report pane framing still needs one shared panel/body owner.

### Users & groups

Current source is visibly looser than canonical:

- panel headers use large manual padding/second-line count instead of the compact title + right meta owner;
- desktop table cells override `.table-density` with large `py-4`/`px-5` classes;
- desktop user rows add email as a second line;
- user links are blue instead of canonical dark table-link language;
- group rows add a third description line and omit the canonical trailing chevron.

### Organization

Current source bypasses existing shared detail-list ownership:

- page recreates `.detail-list/.detail-row` scoped CSS instead of using `ProductDetailList`;
- detail body does not match canonical panel-body spacing;
- panel headers add `POC context` / `Configured` badges that are absent from canonical composition;
- right credential card hardcodes stale `Only Read` while current project truth is Read & Write-capable POC permission.

Preserve truthful permission wording while keeping the canonical visual footprint.

### Viewer Settings

Current source is substantially too large/loose:

- settings grid uses 16px gap instead of canonical 14px;
- Reset demo adds an unreferenced icon;
- section title is 16px instead of canonical ~13px;
- section intro is 12px instead of ~10px;
- row titles/descriptions are 14px/12px instead of ~11px/10px;
- several rows use `py-4` instead of canonical ~13px vertical padding;
- select/input widths differ materially from canonical footprints;
- Images uses a different nested soft-card composition instead of canonical activity-list rows.

## Active execution order

Execute `plans/009b-targeted-closure-analytics-organization.md` sequentially:

1. Closure Phase A — shared product-pattern owners;
2. Phase B — Analytics;
3. Phase C — Users & groups;
4. Phase D — Organization;
5. Phase E — Viewer Settings;
6. Phase F — cross-route reuse enforcement;
7. rendered comparison on the four private preview URLs;
8. user acceptance.

Do not mark a phase visually complete from source inspection alone when local browser tooling can render the private preview.

## Canonical density anchors

Important shared reference geometry:

```text
panel head              15px 16px padding; 13px title; 10px right meta
panel body              16px padding
main grid gap            14px
activity row             11px vertical; 11px title; 10px meta
compact table th         10px; 10px 12px padding
compact table td         11px; 11px 12px padding
analytics tab            32px min-height; 10px type; 8px radius
analytics chart          250px
heatmap                  260px
settings layout          220px / 1fr; 14px gap
settings nav item        35px min-height; 11px type
setting section          18px padding
setting row              13px vertical; 11px title; 10px description
compact detail row       115px / 1fr; 12px gap; ~11px type
```

The canonical HTML remains the final visual authority.

## Runtime/data boundary

Keep real and unchanged:

- `/api/auth/login`;
- `useUserSession()` / logout / auth middleware;
- `/api/me` and PostgreSQL/Drizzle behavior;
- `/api/situm/status` configuration semantics;
- real Situm Viewer lifecycle;
- `MAP_IS_READY` / `APP_ERROR` / missing-config handling.

Keep UI-roadmap data local/dummy until later integration plans:

- analytics/report data;
- users/groups/organization fixture data;
- viewer settings/local actions;
- other product-domain fixtures already deferred by the roadmap.

No new backend endpoint, migration, Situm product-domain integration, or credential change belongs in this closure.

## Backend roadmap gate

**Do not start Plan 010.**

Plan 010 remains blocked until:

1. this targeted 009B closure is implemented;
2. the four focused rendered routes are reviewed against the canonical prototype;
3. reusable component/logic ownership is accepted;
4. the user explicitly accepts the final UI baseline or defines a new explicitly scoped UI follow-up.

## Next action

Start **Closure Phase A** from `plans/009b-targeted-closure-analytics-organization.md` on the existing 009B branch. Do not create 009C yet and do not create a PR.
