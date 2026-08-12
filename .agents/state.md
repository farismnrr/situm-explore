# Current State

_Last reviewed: 2026-08-12_

## Current focus

Recover the cumulative Plans 004–009 UI so the Nuxt implementation closely matches the canonical interactive prototype before any backend/Situm data integration begins.

## Phase

**Plan 009A — UI Prototype Fidelity Recovery is next/active on `plan/009a-ui-prototype-fidelity-recovery`.**

The branch is intentionally stacked from the cumulative HEAD of `plan/009-ui-conformance-polish`; therefore it contains all implementation from Plans 004–009.

No PR or merge has been requested.

## Why Plan 009A is required

The user manually tested real login successfully, but rejected current UI fidelity because many screens are visibly different from the prototype.

A repository-wide static audit confirmed major visual drift across shared primitives, authenticated shell, auth, map workspace, cartography, operations, organization/settings, drawers/modals, and page density.

Important finding: Plan 009 is **not actually complete**. Its own file records Phases 4–7 as incomplete after worker capacity was exhausted. Earlier visual signoff checkboxes must not be interpreted as user acceptance; the user's later manual review supersedes them.

## Active contracts

- `AGENTS.md` — root router/workflow.
- `ARCHITECTURE.md` — full-stack Nuxt architecture contract; SOLID/DRY/KISS/layering remain mandatory.
- `DESIGN.md` — visual authority router.
- `design/IMPLEMENTATION.md` — prototype -> Nuxt/Vue/Nuxt UI translation contract.
- `design/data-source-matrix.md` — existing-real vs dummy/local data boundary.
- `design/reference/situm-explore-interactive-prototype.html` — canonical visual/interaction reference, subject to the user's newer explicit design direction.
- `plans/009a-ui-prototype-fidelity-recovery.md` — active recovery checklist.

## Visual authority

1. user's latest explicit direction;
2. canonical HTML;
3. `DESIGN.md`;
4. active recovery plan;
5. implementation guide.

The canonical HTML currently contains stale `S` brand markup, while `DESIGN.md` requires the approved navigation-arrow mark. Plan 009A Phase 0 owns normalizing only that stale reference detail before production fidelity work.

The HTML remains reference only. Production must stay Nuxt 4 + Vue + Nuxt UI and must not copy the prototype stylesheet/JS architecture.

## Main audit findings

Systemic:

- global Nuxt UI button defaults are neutral/outline while many prototype primary actions are dark filled;
- multiple authenticated routes are narrowed with `max-w-6xl` even though the prototype app content extends to ~1480px;
- common page titles/tables/cards/navigation are looser/larger than the compact prototype language;
- shell search/account/status/action composition materially differs from the prototype;
- current `BrandMark.vue` is a thin right arrow rather than the approved navigation-pointer mark.

Public/auth:

- landing is structurally similar but has width/type/action-state drift;
- auth is materially redesigned: unequal desktop columns, underline tabs, different art-card layout, and mobile keeps a partial dark art block instead of hiding it.

Authenticated product:

- Home/Dashboard density and proportions drift;
- Map chrome differs and lacks high-fidelity prototype popover/transient feedback behavior;
- Buildings/POIs add debug/local-fixture UI and use oversized table density;
- Geofences adds an unreferenced filter toolbar;
- Paths uses a different SVG network visual;
- Realtime uses a different live-map composition and persistent alerts;
- Analytics adds local-data UI and uses different tab/heatmap/chart language;
- Users/Organization/Settings add large explanatory alerts/badges and different grid/density decisions;
- shared drawer uses generic slideover composition instead of matching canonical drawer geometry closely.

## Data/runtime boundary during Plan 009A

Keep real:

- `/api/auth/login`;
- `useUserSession()` / logout / auth middleware;
- `/api/me` and PostgreSQL/Drizzle behavior;
- `/api/situm/status` configuration semantics;
- real Situm Viewer creation;
- `MAP_IS_READY` / `APP_ERROR` / initialization errors.

Keep local/dummy:

- registration;
- product metrics/activity;
- cartography product records;
- route previews;
- realtime product data;
- analytics/reports;
- alarms/users/groups/organization;
- new map tools/settings not already part of the real Viewer lifecycle.

Plan 009A must not add new backend endpoints, database work, or Situm product-domain integration.

## Branch / roadmap state

Current cumulative chain:

```text
main
└─ plan/004-ui-foundation-public-auth
   └─ plan/005-authenticated-shell-dashboard
      └─ plan/006-situm-map-workspace
         └─ plan/007-cartography-explorer
            └─ plan/008-operations-reports-ui
               └─ plan/009-ui-conformance-polish
                  └─ plan/009a-ui-prototype-fidelity-recovery  <- active
```

Plan 010 and later backend/integration plans are blocked until:

1. Plan 009A is complete;
2. rendered UI has been reviewed against every reference surface;
3. the user explicitly accepts the recovered UI.

Do not create a PR or merge unless the user explicitly requests it.

## Next action

Phases 0–2 of Plan 009A are complete, reviewed, linted, committed, and pushed. Delegate Phase 3 authenticated shell fidelity to the configured worker.

Final visual signoff must be evidence-based. If browser/screenshot comparison is unavailable to the executing agent, do not mark final fidelity complete; leave that gate pending for user/manual review.
