# Current State

_Last reviewed: 2026-08-13_

## Completed lineage

- Plan 017 — complete.
- Plan 018 — complete.
- Plan 019 — complete; trajectory remains unresolved/omitted.
- Plan 019A — complete; manual production-preview acceptance passed.

Final pushed Plan 019A HEAD:

`e0c1cbfdfcaadc1e5abec5e89ece869315f6ac71`

Manual Plan 019A acceptance proved real map/cartography load, forward and reverse static-route rendering, cancel cleanup, navigate-away/back cleanup, and the mobile desktop-Viewer boundary.

Non-blocking observations retained for Plan 020 review: some Viewer-visible POIs were absent from the product POI list; constrained `ONLY_NOT_ACCESSIBLE_FLOOR_CHANGES` requests could fail to estimate; Situm/Mapbox emitted internal image/glyph warnings. Treat these as evidence, not automatic app bugs.

## Active plan — 020

- plan: `plans/020-situm-static-directions.md`
- branch: `plan/020-situm-static-directions-v2`
- base: exact final Plan 019A HEAD `e0c1cbfdfcaadc1e5abec5e89ece869315f6ac71`
- status: **ready / active**

`plan/020-situm-static-directions-v2` was created directly from the exact final Plan 019A HEAD to preserve non-destructive history.

The earlier remote `plan/020-situm-static-directions` branch at stale pre-019A lineage (`c902e53`) is superseded as an execution branch. Do not merge, cherry-pick, reset, force-push, or use it as current authority. Historical evidence from it may be consulted only where still accurate.

Current chain:

```text
roadmap/017-020-next-features
-> plan/017-situm-analytics-clickhouse            [complete]
-> plan/018-situm-groups-alarms-read              [complete]
-> plan/019-situm-realtime-viewer-trajectory      [complete]
-> plan/019a-situm-static-directions-foundation   [complete]
-> plan/020-situm-static-directions-v2            [ACTIVE]
```

## Execution rules

- execute Plan 020 phases sequentially;
- implementation/fixes go specifically to the configured `worker` subagent;
- parent owns orchestration, review, state/plan/session updates, commits, pushes, and transitions;
- if the configured worker cannot spawn, stop rather than substituting another agent/model;
- no PR and no merge;
- runtime acceptance uses production build + preview, not Nuxt dev mode;
- wait for actual Situm Viewer/cartography readiness before Viewer commands.

## Static-directions evidence boundary

Already proven by Plan 019A:

- numeric POI-id From/To selection;
- typed `startDirections` and `cancelDirections`;
- Viewer-owned route rendering;
- forward/reverse route rendering;
- cancel cleanup;
- navigate-away/back cleanup;
- mobile non-mount boundary.

Keep absent unless exact evidence proves otherwise:

- route completion/result payloads;
- distance/duration/steps/instructions/geometry/ETA;
- reliable route lifecycle events;
- tag semantics;
- live navigation/current-position/rerouting behavior.

Never expose raw Viewer access or a generic invoke surface.

## Validation baseline

- `git diff --check`;
- `npm run lint`;
- `npm run typecheck`;
- `npm run build`.

## Next action

Plan 020 is complete on `plan/020-situm-static-directions-v2` at final pushed HEAD. Production preview smoke passed for the updated Paths copy and Map Route request/replacement/cancellation controls; accepted Plan 019A manual evidence covers visual forward/reverse rendering, cleanup, and mobile boundary. The Viewer-visible POI mismatch is not proven app-owned, constrained route failures remain runtime limitations, and unresolved route details/events/tags remain absent. The branch is ready for the user's separately gated review/merge decision; no PR or merge was created. Do not replay the resolved foundation or use the stale pre-019A branch.
