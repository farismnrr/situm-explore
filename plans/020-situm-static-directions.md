# Plan 020 — Situm Static Directions Product Completion

Status: **ready / active**
Branch: `plan/020-situm-static-directions-v2`
Base: exact final pushed Plan 019A HEAD `e0c1cbfdfcaadc1e5abec5e89ece869315f6ac71`
Depends on: Plan 019A complete

## Goal

Finish and polish the desktop static-directions product after Plan 019A proved the real route foundation in production preview.

Plan 019A already proved numeric POI routing, typed Viewer start/cancel commands, forward and reverse route rendering, cancel cleanup, navigation-away/back cleanup, and the mobile desktop-Viewer boundary.

Plan 020 must not replay that foundation. It owns only evidence-backed completion, polish, regression coverage, and review of concrete remaining product gaps.

## Fixed boundaries

- Static routes only between known real Situm POIs.
- Viewer owns route calculation/rendering.
- Keep one `SitumViewer` owner and a small typed command surface.
- No live-navigation/current-location behavior.
- Do not invent route distance, duration, steps, instructions, geometry, ETA, or completion state.
- Third-party Viewer warnings are not automatically app defects.

## Phase 0 — Consume Plan 019A truth

- [ ] confirm this branch starts from `e0c1cbfdfcaadc1e5abec5e89ece869315f6ac71`;
- [ ] confirm stale `plan/020-situm-static-directions` is not used as execution authority;
- [ ] list exactly which route behaviors Plan 019A proved;
- [ ] preserve unresolved route details/events/tags as unresolved;
- [ ] review the observed POI-list mismatch and constrained-route failures without assuming an app defect;
- [ ] identify only concrete remaining product gaps.

## Phase 1 — Route UX polish

Delegate implementation to `worker` only where a concrete gap exists.

- [ ] refine From/To selection/search using real POIs while preserving numeric IDs;
- [ ] investigate why some Viewer-visible POIs were absent from the product POI list; fix only if app ownership is proven;
- [ ] improve building/floor context only where verified;
- [ ] refine start/replace/cancel affordances;
- [ ] preserve empty/same-endpoint validation;
- [ ] retain route-type controls only where current behavior is truthful;
- [ ] treat observed constrained-route estimation failures as a runtime limitation, not success;
- [ ] keep feedback conservative;
- [ ] do not add synthetic route summaries.

## Phase 2 — Paths/discoverability alignment

- [ ] keep `/app/paths` as path/cartography metadata unless a computed-route relationship is verified;
- [ ] remove stale copy saying static directions are unavailable;
- [ ] optionally link Paths/POI surfaces into the map Route tab where useful;
- [ ] do not conflate path resources with computed route results.

## Phase 3 — Conditional verified enrichment

Optional; must not block completion.

- [ ] re-evaluate events/details/tags only if new evidence proves a concrete contract;
- [ ] implement only exact verified enrichment;
- [ ] otherwise leave route details absent;
- [ ] do not chase third-party console warnings unless they are proven app-owned and materially harmful.

## Phase 4 — Final regression smoke

Use `npm run build` then `npm run preview`. Do not use Nuxt dev mode for acceptance. Wait for actual Situm Viewer/cartography readiness before invoking Viewer commands.

- [ ] forward route works;
- [ ] reverse/replacement route works where applicable;
- [ ] cancel/clear works;
- [ ] input validation works;
- [ ] navigate away/back leaves one clean Viewer with no stale route;
- [ ] mobile does not mount desktop Viewer directions;
- [ ] no live-navigation behavior was introduced;
- [ ] record remaining non-blocking third-party warnings separately from app failures.

## Phase 5 — Validation and closeout

- [ ] `git diff --check`;
- [ ] `npm run lint`;
- [ ] `npm run typecheck`;
- [ ] `npm run build`;
- [ ] update plan/state/session evidence;
- [ ] commit and push completed Plan 020;
- [ ] do not create a PR or merge.

## Branch note

The earlier remote `plan/020-situm-static-directions` branch is stale pre-019A history and is superseded as an execution branch. The active branch is `plan/020-situm-static-directions-v2`, created directly from exact final Plan 019A HEAD `e0c1cbfdfcaadc1e5abec5e89ece869315f6ac71`. Do not merge/cherry-pick the stale branch or rewrite shared history.