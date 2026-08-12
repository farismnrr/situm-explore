# Current State

_Last reviewed: 2026-08-12_

## Current focus

Finish the reopened Plan 009A UI fidelity recovery so the cumulative Plans 004–009 Nuxt application closely matches the canonical interactive prototype before any backend/Situm data integration begins.

## Active phase

**Plan 009A — UI Prototype Fidelity Recovery is active/reopened on `plan/009a-ui-prototype-fidelity-recovery`.**

A deep review of the pushed 009A branch found that the recovery materially improved the UI but is **not yet ready for PR/merge or user acceptance**. Older 009A visual checkboxes are implementation history only; the new Closure Phases 0–8 in `plans/009a-ui-prototype-fidelity-recovery.md` are the authoritative execution checklist.

No PR or merge has been requested.

## Branch lineage truth

009A was originally created from an earlier cumulative HEAD of `plan/009-ui-conformance-polish`, but Plan 009 later received additional commits. The two branches are now diverged.

Do not merge Plan 009 wholesale into 009A and do not reset/rebase 009A merely to linearize history. Inspect later Plan 009 commits selectively and port/reimplement only still-relevant fixes that are missing from 009A.

Closure Phase 0 removed the derived duplicate `app/data/prototype/map.ts`; map building/floor selectors now derive from the canonical cartography fixture source.

## Active contracts

- `AGENTS.md` — root router/workflow.
- `ARCHITECTURE.md` — full-stack Nuxt architecture contract; SOLID/DRY/KISS/layering remain mandatory.
- `DESIGN.md` — visual authority router.
- `design/IMPLEMENTATION.md` — prototype -> Nuxt/Vue/Nuxt UI translation contract.
- `design/data-source-matrix.md` — existing-real vs dummy/local data boundary.
- `design/reference/situm-explore-interactive-prototype.html` — canonical visual/interaction reference.
- `plans/009a-ui-prototype-fidelity-recovery.md` — active reopened closure checklist.

## Visual authority

1. user's latest explicit direction;
2. canonical HTML;
3. `DESIGN.md`;
4. active recovery plan;
5. implementation guide.

The brand reference was already normalized to the approved filled navigation-pointer mark during 009A Phase 0. Do not treat the old `S` mark as current truth.

The HTML remains reference only. Production stays Nuxt 4 + Vue + Nuxt UI and must not copy the prototype stylesheet or JavaScript screen-switching architecture.

Useful canonical locator hints include current reference surfaces such as `#screen-landing`, authenticated `#app-*` screens, `#detailDrawer`, `#searchModal`, `#viewerModal`, and `#poiPopover` where present. Locator names are hints only; visual/function meaning remains authoritative.

## Deep-review findings that currently block completion

### Branch / governance

- 009A diverged from later Plan 009 commits; relevant fixes must be reconciled selectively.
- Previous 009A checked visual boxes do not prove final rendered conformance.
- Final route/state signoff remains incomplete.

### Public/auth

- auth navigation still needs canonical segmented gray treatment instead of underline-tabs;
- register completion must avoid a large page-shifting success alert;
- auth-art must disappear at the canonical <=800px transition;
- auth-art brand mark needs canonical inverse treatment;
- landing typography/grid/breakpoint details still require exact rendered recovery.

### Authenticated shell / responsive

- current breakpoint ownership mixes Tailwind `lg=1024` behavior with prototype transitions around 1050/800/520;
- the 640–1100 app offset can create a phantom ~208px left gutter while sidebar is hidden;
- authenticated rendering must be checked at 1440, 1024, **900**, 768 and 390 widths.

### Product routes

- canonical ~30px page-title treatment is not consistently used across routes;
- multiple tables add secondary lines that make rows taller than the reference;
- Analytics still needs canonical compact dark-active pill tabs and heatmap language;
- several route/card/table surfaces remain too spacious and need rendered comparison.

### Map / overlays

- center/zoom cluster should match canonical right-bottom placement;
- selected POI should be a compact anchored ~240px popover, not a large bottom-right card;
- location picker should use an on-map marker/state like the reference rather than a separate modal;
- persistent local/dummy explanation copy should not replace prototype-like transient feedback;
- shared drawer still needs canonical fixed-label-column composition;
- shared transient feedback timer ownership can race across callers.

### Architecture / accessibility

- `app/pages/app/map.vue` has grown large enough to justify a small number of clear product boundaries while staying KISS;
- map building/floor selectors derive directly from canonical cartography fixtures;
- later Plan 009 accessibility improvements must be reconciled selectively where 009A regressed contrast/tab semantics;
- do not create generic UI wrappers, Pinia, event bus, DI, repository/service layers, or backend expansion for this recovery.

### Validation truth

Older state reported a pre-existing `nuxt.config.ts` typecheck blocker, but that exact historical change is not obviously present in the currently pushed file. Do **not** assume the blocker still exists. Rerun `npm run typecheck` from a clean current 009A checkout and record the actual result.

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

## Roadmap gate

Plan 010 and all later backend/integration plans remain blocked until:

1. all Plan 009A Closure Phases 0–8 are complete;
2. clean-branch lint/typecheck/build pass;
3. real auth/DB/Situm foundation regression checks pass or an exact environment-only blocker is documented;
4. every major route/state receives rendered comparison at relevant reference viewports;
5. no known silhouette-level UI mismatch remains;
6. the user explicitly accepts the recovered UI.

Do not create a PR or merge unless the user explicitly requests it.

## Next action

Closure Phases 0–6 are complete, reviewed, committed, and pushed. Phase 7 clean-config typecheck and source/API smoke checks pass; successful login/logout and configured Situm Viewer runtime checks remain pending because credentials/services/browser tooling are unavailable. Phase 8 rendered conformance is pending manual user review. Do not mark Plan 009A complete until the rendered UI is accepted.

Do not start Plan 010.
