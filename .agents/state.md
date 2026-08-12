# Current State

_Last reviewed: 2026-08-12_

## Current focus

Execute **Plan 009B — Nuxt UI Foundation Fidelity & Reusability** before any more page-by-page UI recovery or backend/Situm integration.

The user reviewed the post-009A product and concluded that many 1:1 differences originate from the shared UI foundation itself: buttons, primary/accent semantics, cards, controls, pills, typography, spacing, overlays, and duplicated UI/logic patterns.

The correct next move is therefore **components/foundation first**, not another broad page-by-page patch pass.

## Roadmap state

**Plan 009A is closed with known UI gaps.**

009A closure is historical/administrative and is not a claim of final pixel-perfect UI acceptance.

**Plan 009B is now fully scoped and planned-ready.**

Plan file:

`plans/009b-ui-final-fidelity-punch-list.md`

Execution branch:

`plan/009b-ui-final-fidelity-punch-list`

When execution is authorized, create the 009B branch from the latest cumulative `plan/009a-ui-prototype-fidelity-recovery` HEAD, not stale `main`, because the UI roadmap has intentionally been developed as an explicitly authorized stacked branch chain and none of Plans 004–009A have been integrated yet.

No PR or merge is currently authorized.

## Plan 009B objective

Align the **Nuxt UI component foundation itself** with the canonical prototype before further page-layout fidelity work.

Main requirements:

1. translate canonical prototype tokens into a coherent Nuxt UI theme;
2. restore the prototype's semantic distinction between **dark ink primary actions** and **blue accent actions/states**;
3. make shared primitive geometry match the prototype closely;
4. create/reconcile reusable product components for genuinely repeated product composition;
5. create/reconcile small reusable composables/utilities for genuinely repeated client behavior;
6. migrate all current routes to the shared foundation so identical semantic roles do not drift page by page;
7. perform primitive-by-primitive rendered conformance before returning to page-layout polish.

## Reuse-first contract

For every future UI/client-logic change:

1. search existing Nuxt UI theme/components/composables/utilities first;
2. reuse an existing owner when semantics match;
3. if a repeated product pattern or repeated behavior has no owner, extract the smallest appropriate shared implementation;
4. migrate duplicate callers when they should change together;
5. keep genuinely unique page behavior local.

Do not create a generic framework merely to satisfy DRY.

### Low-level primitives

Prefer Nuxt UI theming/configuration for:

- buttons;
- cards;
- inputs/selects/textareas;
- badges/pills;
- switches/tabs;
- modal/popover/slideover/toast primitives.

Do not automatically create cosmetic `BaseButton`, `BaseCard`, `BaseInput`, etc. A wrapper is justified only for a real Situm Explore product semantic or shared behavior that Nuxt UI configuration cannot express cleanly.

### Reusable product UI

Examples of legitimate shared responsibilities when repeated:

- page header/title/actions;
- stat cards;
- product status pills;
- panel framing;
- toolbar/filter composition;
- compact detail lists;
- shared details drawer;
- search trigger/results;
- transient feedback presentation;
- repeated activity/list rows when behavior and geometry truly match.

### Reusable logic

Examples when repeated:

- transient feedback timer ownership;
- tablist keyboard behavior;
- equivalent filtering/search behavior;
- shared component-selection/disclosure coordination.

Prefer composables for reactive/lifecycle behavior and utilities for pure deterministic logic. No Pinia, event bus, god composable or speculative abstraction.

## Canonical foundation intent

The prototype's core visual semantics include:

```text
background        #f6f7f9
surface           #ffffff
surface-subtle    #fafbfc
surface-hover     #f4f5f7
text              #16181c
text-muted        #515862
border            #e6e8ec
border-strong     #d8dce2
ink               #111827
ink-hover         #202939
accent            #2563eb
```

Important distinction:

- normal primary product action = dark `ink`;
- blue = explicit accent/selected/highlight role;
- do not let Nuxt UI's `primary` naming make the whole product blue.

Approximate canonical primitive geometry:

```text
button            40px / 13px / radius 10
button-sm         34px / 12px / radius 9
icon-button       36x36 / radius 9
input/select      42px / radius 10
pill              28px / 11px
switch            36x20
main card         radius 16 / 1px border / subtle shadow
soft card         radius 12 / subtle surface / border
page title        ~30px / 1.08 line-height / tight tracking
```

The canonical HTML remains final visual authority for exact values and representative states. Accessibility may require a restrained contrast deviation for small text.

## Current known systemic issue

At 009B plan creation, current Nuxt config still maps `primary` to blue and defaults plain `UButton` to `primary + solid + sm`, while the canonical prototype uses dark ink for normal primary actions, blue only as accent, and ~40px for normal buttons.

This is a cross-route foundation defect and is one of the first Phase 1 targets.

## Active contracts

- `AGENTS.md` — root router/workflow.
- `ARCHITECTURE.md` — Nuxt 4 architecture, SOLID/DRY/KISS/layering.
- `DESIGN.md` — visual authority router.
- `design/IMPLEMENTATION.md` — prototype -> Nuxt/Vue/Nuxt UI translation contract.
- `design/data-source-matrix.md` — existing-real vs dummy/local boundary.
- `design/reference/situm-explore-interactive-prototype.html` — canonical visual/interaction reference.
- `plans/009b-ui-final-fidelity-punch-list.md` — active planned UI foundation work.

## Runtime/data boundary remains unchanged

Keep real:

- `/api/auth/login`;
- `useUserSession()` / logout / auth middleware;
- `/api/me` and PostgreSQL/Drizzle behavior;
- `/api/situm/status` configuration semantics;
- real Situm Viewer creation;
- `MAP_IS_READY` / `APP_ERROR` / initialization errors.

Keep local/dummy until later integration plans:

- registration;
- product metrics/activity;
- cartography product records;
- route previews;
- realtime product data;
- analytics/reports;
- alarms/users/groups/organization;
- new map tools/settings beyond the existing real Viewer lifecycle.

Plan 009B must not add new backend endpoints, migrations, Situm product-domain reads/writes, or credential changes.

## Backend roadmap gate

**Do not start Plan 010.**

Plan 010 and later Situm integration plans remain blocked until:

1. Plan 009B foundation work is complete;
2. the user accepts the shared component foundation;
3. any later page/layout-specific UI punch list required by manual review is complete or explicitly waived;
4. the user explicitly accepts the final rendered UI baseline overall.

## Next action

When the user starts 009B:

1. fetch latest refs;
2. create `plan/009b-ui-final-fidelity-punch-list` from the latest cumulative 009A HEAD;
3. execute Plan 009B Phase 0 inventory first;
4. do not start broad page-layout redesign before the shared primitive/component/logic ownership matrix is established;
5. validate and commit/push each phase;
6. do not create a PR without explicit authorization.