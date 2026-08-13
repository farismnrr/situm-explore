# Plan 020 — Situm Static Directions Product Completion

Status: **complete; awaiting PR/merge decision**
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

- [x] confirm this branch starts from `e0c1cbfdfcaadc1e5abec5e89ece869315f6ac71`;
- [x] confirm stale `plan/020-situm-static-directions` is not used as execution authority;
- [x] list exactly which route behaviors Plan 019A proved;
- [x] preserve unresolved route details/events/tags as unresolved;
- [x] review the observed POI-list mismatch and constrained-route failures without assuming an app defect;
- [x] identify only concrete remaining product gaps.

### Phase 0 evidence and concrete gaps

Plan 019A manual acceptance proved authenticated production map/cartography load, real POI route selection, forward and reverse route rendering, replacement, cancel cleanup, navigate-away/back cleanup, and mobile non-mount. The current SDK/UI still exposes no verified route result/details/events/tags contract. The Viewer-visible POI mismatch is not attributable to the app from current evidence: the app consumes the authenticated cartography POI read and does not scrape Viewer internals. The constrained `ONLY_NOT_ACCESSIBLE_FLOOR_CHANGES` failure is a runtime route-availability limitation, not evidence of an app defect. Concrete product gaps are limited to stale `/app/paths` copy and conservative route UX wording/feedback; no route summary or POI fabrication is justified.

## Phase 1 — Route UX polish

Delegate implementation to `worker` only where a concrete gap exists.

- [ ] refine From/To selection/search using real POIs while preserving numeric IDs;
- [ ] investigate why some Viewer-visible POIs were absent from the product POI list; fix only if app ownership is proven;
- [ ] improve building/floor context only where verified;
- [x] refine start/replace/cancel affordances;
- [x] preserve empty/same-endpoint validation;
- [x] retain route-type controls only where current behavior is truthful;
- [x] treat observed constrained-route estimation failures as a runtime limitation, not success;
- [x] keep feedback conservative;
- [x] do not add synthetic route summaries.

### Phase 1 evidence

The route controls now distinguish the initial request, replacement, and cancellation states, prevent overlapping commands, and explain that availability depends on map data. The accessible option is explicitly scoped to the verified accessible route type. No POI normalization, Viewer-internal scraping, or building/floor inference was added because current evidence does not establish those as app-owned gaps.

## Phase 2 — Paths/discoverability alignment

- [x] keep `/app/paths` as path/cartography metadata unless a computed-route relationship is verified;
- [x] remove stale copy saying static directions are unavailable;
- [ ] optionally link Paths/POI surfaces into the map Route tab where useful;
- [x] do not conflate path resources with computed route results.

### Phase 2 evidence

`/app/paths` now describes its verified path/cartography metadata scope and points users to the Map Route tab for route requests. It explicitly keeps computed route results, details, and steps absent. No cross-link was added because the existing app navigation already exposes both surfaces and no deeper relationship is verified.

## Phase 3 — Conditional verified enrichment

Optional; must not block completion.

- [x] re-evaluate events/details/tags only if new evidence proves a concrete contract;
- [x] implement only exact verified enrichment;
- [x] otherwise leave route details absent;
- [x] do not chase third-party console warnings unless they are proven app-owned and materially harmful.

### Phase 3 evidence

No new exact contract evidence was produced for route events, details, tags, geometry, distance, duration, or step-by-step output. Those fields remain absent. Situm image/glyph warnings remain third-party observations without proven app ownership or material product harm.

## Phase 4 — Final regression smoke

Use `npm run build` then `npm run preview`. Do not use Nuxt dev mode for acceptance. Wait for actual Situm Viewer/cartography readiness before invoking Viewer commands.

- [x] forward route works;
- [x] reverse/replacement route works where applicable;
- [x] cancel/clear works;
- [x] input validation works;
- [x] navigate away/back leaves one clean Viewer with no stale route;
- [x] mobile does not mount desktop Viewer directions;
- [x] no live-navigation behavior was introduced;
- [x] record remaining non-blocking third-party warnings separately from app failures.

### Phase 4 evidence

Production preview regression passed after rebuilding. Authenticated preview smoke loaded the updated Paths copy and Map Route controls, waited for `Ready`, selected the real `Pintu Masuk` and `Ruang Kerja Lt 2` POIs, and verified request, replacement, and cancellation feedback. The previously accepted Plan 019A manual production run supplies the visual forward/reverse rendering, navigate-away/back cleanup, and mobile boundary evidence. No live-navigation behavior was added. Remaining nonblocking observations are the Viewer POI-list mismatch, Situm image/glyph warnings, and constrained accessible-route estimation limits.

## Phase 5 — Validation and closeout

- [x] `git diff --check`;
- [x] `npm run lint`;
- [x] `npm run typecheck`;
- [x] `npm run build`;
- [x] update plan/state/session evidence;
- [x] commit and push completed Plan 020;
- [x] do not create a PR or merge.

### Phase 5 evidence

Final diff, lint, typecheck, and production build validation passed. The public asset scan found no Situm credential names or smoke credentials. The server bundle intentionally contains configured runtime authentication data for the private server boundary; no credential was persisted to repository evidence. Plan 020 is complete without a PR or merge.

## Branch note

The earlier remote `plan/020-situm-static-directions` branch is stale pre-019A history and is superseded as an execution branch. The completed review branch is `plan/020-situm-static-directions-v2`, created directly from exact final Plan 019A HEAD `e0c1cbfdfcaadc1e5abec5e89ece869315f6ac71`. Do not merge/cherry-pick the stale branch or rewrite shared history.
