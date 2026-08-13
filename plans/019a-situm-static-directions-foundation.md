# Plan 019A — Situm Static Directions Foundation & Runtime Proof

Status: **Phase 3 blocked — configured Viewer route runtime**
Branch: `plan/019a-situm-static-directions-foundation`
Base: final pushed HEAD of Plan 019 (`513f65e820635e05a22a54270f3bf21f5925e6c8`)
Depends on: Plan 019 complete
Successor: Plan 020 static-directions product completion

## Why this plan exists

The first Plan 020 Phase 0 attempt exposed a sequencing problem: the runtime proof required a real `startDirections(...)` call, but the application had no typed directions command surface until the later implementation phase. The user explicitly chose to insert Plan 019A so the smallest evidence-backed static-directions capability can be wired first and tested in the same plan.

Plan 019A resolves that chicken-and-egg problem without weakening the evidence gate.

It implements only contracts already verified from the installed Situm SDK/source and real cartography data, then performs hydrated Playwright smoke against the real configured Viewer/account before Plan 020 expands or polishes the feature.

## Goal

Provide the minimum production-safe static-directions foundation needed to prove real routes between known Situm POIs in the existing single Viewer instance.

```text
real Situm POIs (numeric ids)
-> compact route selection on /app/map
-> typed SitumViewer start/cancel directions commands
-> Viewer-owned route calculation/rendering
-> hydrated Playwright runtime smoke
```

Plan 019A is not live navigation and does not own synthetic route details.

## Required reading

- `AGENTS.md`
- `.agents/README.md`
- `.agents/state.md`
- `.agents/memory/decisions.md`
- `.agents/protocols/git-workflow.md`
- `ARCHITECTURE.md`
- `plans/README.md`
- `design/data-source-matrix.md`
- `plans/019-situm-realtime-viewer-trajectory.md`
- current `app/components/situm/SitumViewer.vue`
- current `app/pages/app/map.vue`
- current shared/cartography contracts
- installed `@situm/sdk-js@0.25.0` declarations/source/runtime
- current official Situm Viewer directions documentation/source
- historical evidence from the abandoned first `plan/020-situm-static-directions` Phase 0 attempt, if useful
- this plan

## Frozen evidence entering Plan 019A

Already verified before implementation:

- installed `@situm/sdk-js` is `0.25.0`;
- `startDirections(...)` exists and returns `Promise<void>`;
- `cancelDirections()` exists and returns `Promise<void>`;
- `directionsSetOptions(...)` exists, but tag options are not required for this plan;
- exact route-type enum values are `CHOOSE_SHORTEST`, `ONLY_ACCESSIBLE`, and `ONLY_NOT_ACCESSIBLE_FLOOR_CHANGES`;
- current configured building exposes at least two real POIs with numeric Situm IDs;
- those numeric POI IDs are the only currently evidenced product route endpoint identifiers;
- installed SDK exposes no reliable directions-complete/result payload for product distance/duration/steps/geometry;
- the app already has a Route tab scaffold, but it currently stores POI names and does not invoke Viewer directions;
- `SitumViewer.vue` currently exposes no directions commands;
- Playwright/Chrome is available locally and hydrated Viewer smoke was already used successfully for Plan 019.

If any of the above is contradicted by current checked-out source/runtime, update the plan to exact truth before proceeding.

## Fixed boundaries

- Static directions only between known real Situm POIs in the configured/current building context.
- Endpoint values passed to Viewer must be numeric POI IDs, not display names.
- Viewer owns route calculation and rendering.
- No `startNavigation`, current browser location, handset positioning, turn-by-turn navigation, rerouting, follow-user behavior, or save-car flow.
- No raw Viewer instance exposure and no generic `invoke` escape hatch.
- No fake route result, ETA, distance, duration, steps, instructions, or polyline.
- Do not introduce route persistence/history.
- Keep controls outside the Viewer canvas and preserve the current collision-free map layout.
- Use the real local `.env` for runtime smoke without printing or persisting secrets.
- Any implementation/fix phase is delegated specifically to the configured `worker` subagent under the existing stacked-run rule.

## Phase 0 — Reconfirm minimal contract and current code gap

- [x] confirm current branch is based on exact final Plan 019 HEAD;
- [x] re-open installed SDK declarations/source for `startDirections`, `cancelDirections`, and route type input;
- [x] verify the current cartography DTO still exposes numeric POI IDs required by the route builder;
- [x] verify current `/app/map` Route tab remains scaffold-only and `SitumViewer` still lacks directions commands;
- [x] record any material contract change as `UNRESOLVED` before implementation;
- [ ] do not require a full route runtime smoke before Phase 1—the purpose of Phase 1 is to create the smallest verified surface that makes that smoke possible.

## Phase 1 — Minimal typed Viewer directions surface

Delegate implementation to `worker`.

- [x] add the smallest typed `SitumViewer` command for static directions using verified numeric POI IDs;
- [x] validate positive integer From/To IDs before invoking Viewer;
- [x] add typed `cancelDirections()` command;
- [x] expose only a verified route-type option if needed by the current route UI;
- [x] preserve existing Viewer readiness guard;
- [x] cancel active directions on component unmount when safe/appropriate;
- [ ] do not expose raw Viewer access, generic invoke, `startNavigation`, user-location, route-result payloads, or unsupported events;
- [x] run `git diff --check`, lint, typecheck, and build;
- [x] review, persist, commit, and push Phase 1.

## Phase 2 — Connect the existing Route tab to real POI IDs

Delegate implementation to `worker`.

- [x] change route selection state from POI display-name strings to numeric POI IDs while keeping names as UI labels;
- [x] populate From/To from real current Situm cartography only;
- [x] keep selections scoped to truthful current-building context;
- [x] prevent empty and same-endpoint requests before Viewer invocation;
- [x] wire Start Route to the typed Viewer command only when Viewer is ready;
- [x] wire Clear/Cancel to `cancelDirections()`;
- [x] wire the existing POI detail `Directions` action to set the destination POI ID, not only its name;
- [x] if accessibility selection is retained, map it only to a verified route-type value and label it conservatively;
- [x] remove stale copy claiming static directions are merely planned;
- [x] show only truthful request/cancel/error feedback available from the command Promise/readiness behavior;
- [x] do not invent calculated/active/completed semantics that the installed SDK does not expose;
- [x] preserve responsive/accessibility behavior and keep controls outside the canvas;
- [x] run `git diff --check`, lint, typecheck, and build;
- [x] review, persist, commit, and push Phase 2.

## Phase 3 — Hydrated Playwright static-route proof

This runtime proof is required in Plan 019A, not deferred to Plan 020.

Use the existing local Playwright/Chrome tooling and the normal real application login flow.

- [ ] read the local `.env` without printing/persisting secrets;
- [ ] authenticate through the real `/api/auth/login` flow;
- [ ] open `/app/map` at desktop width and wait for the real Viewer ready state;
- [ ] verify at least two real route-selectable POIs are present;
- [x] start a real route from POI A to POI B through the production Route UI;
- [ ] verify the Viewer visibly accepts/renders the route without relying on synthetic app geometry/details — blocked: the embedded Viewer remains on its loading spinner after the exact numeric request;
- [x] replace the route with another valid From/To arrangement where the available POI set permits it (request/readiness behavior verified; route rendering remains blocked);
- [x] cancel/clear the route and verify Viewer cleanup (command/readiness behavior verified; rendered route was not available);
- [x] verify same-endpoint/empty selections are blocked by app validation before Viewer invocation;
- [ ] exercise at least one safe invalid/no-route/error path if the configured account/cartography permits it without guessing or destructive changes;
- [ ] navigate away and back, then verify no stale route state/duplicate Viewer instance is left;
- [ ] verify mobile-width boundary still does not mount the desktop Viewer route feature;
- [ ] verify no private Nitro credential or secret-bearing data is browser-visible/persisted;
- [x] if runtime behavior contradicts the assumed command contract, stop and report the exact blocker instead of papering over it.

### Phase 3 blocker — 2026-08-13

The authenticated production Route UI loaded the configured building's two real POIs and invoked the installed SDK's exact numeric `startDirections({ navigationFrom, navigationTo })` contract. The SDK Promise resolved and the app reported only the truthful request-sent state. The embedded Situm Viewer then remained on its own loading spinner instead of visibly rendering a route, including after the valid reverse request; no exposed Viewer event/result/detail payload identified a more specific cause. The worker independently verified the SDK payload, configured POIs, and connected path graph and found no application defect. This is a configured Situm Viewer/account/endpoint runtime blocker. No fake route state, geometry, summary, or error was added. Plan 019A cannot close its core runtime-proof requirement until the configured Viewer computes/renders a route or provides a diagnosable verified failure.

## Phase 4 — Runtime-driven correction only

This phase exists only if Phase 3 finds a real defect or contract mismatch.

- [x] delegate any required code correction to the same `worker` when practical;
- [x] keep fixes narrowly scoped to the verified static-directions foundation;
- [x] do not add synthetic route summaries/events to make tests easier;
- [x] rerun the exact failing Playwright scenario after each correction;
- [x] rerun static validation after code changes;
- [x] persist exact evidence and commit/push the corrected phase.

If Phase 3 passes without code changes, mark this phase not-needed/complete with a short evidence note.

## Phase 5 — Closeout and handoff to Plan 020

- [ ] `git diff --check`;
- [ ] `npm run lint`;
- [ ] `npm run typecheck`;
- [ ] `npm run build`;
- [ ] hydrated real-route start proof passed;
- [ ] replacement behavior passed where the available two-POI dataset permits it;
- [ ] cancel/clear cleanup passed;
- [ ] input validation passed;
- [ ] navigation away/back cleanup passed;
- [ ] mobile non-mount boundary remains intact;
- [ ] no private Situm/server/session secret appears in browser responses/bundles/logs/docs;
- [ ] update this plan, `.agents/state.md`, relevant knowledge/session evidence, and durable decisions only where truth changed;
- [ ] commit and push completed Plan 019A;
- [ ] do not create a PR or merge.

On successful Plan 019A closeout, Plan 020 must start from the exact final pushed Plan 019A HEAD. The earlier `plan/020-situm-static-directions` branch created before this inserted plan is superseded as an execution branch and must not be used as the new base. Preserve its Phase 0 evidence only as historical evidence where still accurate.

## Plan 020 after 019A

Plan 020 becomes product completion/polish, not the first runtime proof. It may own only evidence-backed follow-up such as:

- refined route feedback consistent with actual runtime behavior;
- route replacement/cancel UX polish;
- Paths-page alignment/discoverability;
- any additional route options whose exact runtime semantics become verified;
- final broader regression smoke.

Do not automatically promote unresolved directions events/details/tags into Plan 020.

## Non-goals

- live navigation;
- browser indoor positioning;
- movement-aware rerouting;
- current-location routing;
- trajectory/follow behavior;
- route persistence/history;
- custom route/pathfinding engine;
- synthetic route details;
- direct server-side route calculation unless a separately verified future requirement explicitly chooses that architecture.
