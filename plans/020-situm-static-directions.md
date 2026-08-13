# Plan 020 — Situm Static Directions Product Completion

Status: **queued after Plan 019A**
Branch: `plan/020-situm-static-directions`
Base: exact final pushed HEAD of Plan 019A
Depends on: `plans/019a-situm-static-directions-foundation.md` complete

## Goal

Finish and polish the desktop static-directions product only after Plan 019A has already implemented and Playwright-proven the minimal real route foundation.

Plan 019A owns the first production wiring and runtime proof:

- numeric real POI endpoint selection;
- typed Viewer `startDirections`/`cancelDirections` surface;
- production Route-tab connection;
- valid real-route start;
- replace/cancel/input-validation smoke;
- hydrated browser cleanup/security regression.

Plan 020 must not replay that foundation. It starts from the exact final Plan 019A HEAD and only adds evidence-backed completion/polish.

## Required reading

- `AGENTS.md`
- `.agents/state.md`
- `.agents/memory/decisions.md`
- `ARCHITECTURE.md`
- `plans/README.md`
- `design/data-source-matrix.md`
- `plans/019a-situm-static-directions-foundation.md`
- Plan 019A runtime evidence/session notes
- current `/app/map`, `/app/paths`, cartography contracts, and `SitumViewer`
- installed/current Situm Viewer directions docs/source
- this plan

## Fixed boundaries

- Static routes only between known real Situm endpoints/POIs.
- Viewer owns route calculation/rendering.
- No `startNavigation`, browser `My location`, sensor positioning, turn-by-turn navigation, movement-aware rerouting, follow-user behavior, save-car flow, or flights.
- Do not manufacture route distance, duration, steps, instructions, geometry, ETA, or completion state.
- Only promote runtime behavior actually proven in Plan 019A or separately re-verified here.
- Keep the single `SitumViewer` owner and its small typed command surface; no raw Viewer/generic invoke.
- Controls remain outside the Viewer canvas and must not collide with Situm-owned UI.

## Phase 0 — Consume Plan 019A runtime truth

- [ ] confirm branch starts from the exact final pushed Plan 019A HEAD;
- [ ] read Plan 019A browser evidence and list exactly which route behaviors are proven;
- [ ] preserve any unresolved directions events/result/details/tags as unresolved;
- [ ] identify only concrete product gaps that remain after the proven foundation;
- [ ] do not re-open already-proven foundation work without evidence of regression.

## Phase 1 — Route UX polish

Delegate implementation to `worker` only where a concrete gap exists.

- [ ] refine From/To selection/search using real POIs without changing the numeric-ID contract;
- [ ] improve building/floor context only where the verified route scope supports it;
- [ ] refine route start/replace/cancel affordances based on Plan 019A runtime behavior;
- [ ] preserve input validation for empty/same endpoint;
- [ ] preserve accessible route option only if its exact enum mapping was proven;
- [ ] keep feedback conservative where Viewer exposes no completion/result event;
- [ ] do not add fake route summary cards.

## Phase 2 — Paths/discoverability alignment

- [ ] keep `/app/paths` as path/cartography metadata unless an exact computed-route relationship is evidenced;
- [ ] remove/reword stale copy that says static directions are unavailable once the proven route feature is live;
- [ ] optionally link from Paths/POI surfaces into the map Route tab when useful and truthful;
- [ ] do not conflate path resources with computed route results.

## Phase 3 — Conditional verified enrichment

This phase is optional and must not block completion.

- [ ] re-evaluate directions events/details/tags only if new runtime evidence from Plan 019A/current account proves a concrete contract;
- [ ] implement only exact verified enrichment;
- [ ] leave distance/duration/steps/instructions/geometry absent unless a reliable product-safe payload is proven;
- [ ] leave included/excluded tag controls absent if the configured cartography has no meaningful verified tags.

## Phase 4 — Final regression smoke

Use existing local Playwright/Chrome and the real login flow.

- [ ] valid route start still works;
- [ ] route replacement still works where available POIs permit it;
- [ ] cancel/clear cleanup still works;
- [ ] input validation still blocks invalid local requests;
- [ ] navigate away/back leaves one clean Viewer instance with no stale route;
- [ ] mobile still does not mount desktop Viewer directions;
- [ ] no native/live-navigation language or behavior was introduced;
- [ ] no private Nitro/session secret reaches browser-visible output.

## Phase 5 — Validation and closeout

- [ ] `git diff --check`;
- [ ] `npm run lint`;
- [ ] `npm run typecheck`;
- [ ] `npm run build`;
- [ ] update plan/state/session/evidence to exact truth;
- [ ] commit and push completed Plan 020;
- [ ] do not create a PR or merge.

## Branch note

An earlier `plan/020-situm-static-directions` branch was created before Plan 019A existed and captured the original sequencing blocker. That branch is superseded as an execution base. When Plan 020 starts after 019A, create/recreate the execution branch from the exact final Plan 019A HEAD according to the current Git workflow; do not merge/cherry-pick the stale pre-019A branch merely to preserve its history. Historical evidence may be consulted only where still accurate.

## Non-goals

- live navigation;
- handset/browser indoor positioning;
- current-location routing;
- rerouting/follow-user behavior;
- route persistence/history;
- custom route/pathfinding engine;
- synthetic route summary/geometry/instructions.
