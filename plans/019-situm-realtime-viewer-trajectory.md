# Plan 019 — Situm Realtime Viewer Overlay & Trajectory

Status: **queued**
Branch: `plan/019-situm-realtime-viewer-trajectory`
Base: final HEAD of Plan 018
Depends on: Plan 018 complete in the explicit stacked 017→020 execution
Stacked successor: Plan 020

## Goal

Upgrade the existing real realtime-position monitoring into a useful desktop web operations surface by letting the Situm Viewer own realtime map visualization and, where verified, trajectory playback.

The existing Nitro `/api/situm/realtime` read remains useful for product lists/counts. The Viewer overlay must use the Viewer SDK's verified public command surface instead of hand-projecting coordinates or drawing fake markers.

## Required reading

- `AGENTS.md`
- `.agents/state.md`
- `.agents/memory/decisions.md`
- `ARCHITECTURE.md`
- `plans/README.md`
- `design/data-source-matrix.md`
- current `/app/realtime`, `/app/map`, `SitumViewer`, Viewer command typings, and realtime DTOs
- latest official Situm SDK JS Viewer docs/source for realtime and trajectory methods
- installed `@situm/sdk-js` version/types/source
- this plan

## Verified direction

Current official Viewer JS exposes dedicated methods for realtime visualization and trajectory handling, including `loadRealtimePositions`, `cleanRealtimePositions`, `loadTrajectory`, and `cleanTrajectory`.

Plan 019 must use those typed Viewer capabilities when the installed version/runtime matches. Do not create a custom coordinate transform/floor-plan projection merely to imitate them.

## Fixed boundaries

- Browser Viewer behavior remains owned by the single `SitumViewer` instance/integration.
- Existing `NUXT_PUBLIC_SITUM_API_KEY` remains Viewer-only; private `NUXT_SITUM_API_KEY` remains Nitro-only.
- Do not expose the private server key to make Viewer realtime work.
- Web displays positions produced by tracked devices; it does not perform handset indoor positioning.
- Do not use `setUserLocation`, `setFollowUser`, startNavigation, sensor-derived blue dot, or movement-aware rerouting as substitutes.
- Do not invent online/offline/stale thresholds. If Situm does not provide an exact status semantic, show factual `last seen`/timestamp context only.
- No background job infrastructure is needed.

## Phase 0 — Viewer/runtime evidence freeze

- [x] verify installed `@situm/sdk-js` signatures and runtime compatibility for `loadRealtimePositions` / `cleanRealtimePositions`;
- [x] verify exact building filter, refresh-rate, customization callback, lifecycle, and failure semantics from official docs/source;
- [x] verify `loadTrajectory` / `cleanTrajectory` inputs and SDK dispatch semantics from official source; account/hydrated-Viewer trajectory behavior remains unresolved;
- [x] confirm the two-key Viewer credential boundary remains unchanged; hydrated credential exercise is deferred to the browser smoke phase;
- [x] inspect current `/api/situm/realtime` timestamps/fields and decide which factual list metadata can be shown without invented stale/offline classification;
- [x] runtime-smoke method availability and isolated cleanup failure behavior without secrets or raw payloads;
- [x] trajectory is explicitly unresolved for implementation until a configured-account/hydrated-Viewer smoke verifies date/user/empty/error behavior; realtime overlay evidence is sufficient to continue its core.

### Phase 0 evidence — 2026-08-13

- Installed package is `@situm/sdk-js` `0.25.0`; typings and runtime expose the target Viewer methods.
- Official source: `situmtech/situm-sdk-js` repository, current `src/viewer/index.ts` and example `7-viewer-realtime-trajectories.html`.
- `loadRealtimePositions({ filter: { buildingIds?: number[] }, refreshRateMs?: number, customizeFeatures?: fn })` supports building IDs only, defaults to 10,000 ms, fetches immediately, clears/replaces a prior interval, maps API GeoJSON into Viewer external features, and lets the callback return device ID plus optional tooltip/icon or `undefined` to suppress rendering. Fetch failures are caught/logged; the interval remains active. `cleanRealtimePositions()` clears the interval and sends an empty external-feature set.
- `loadTrajectory({ fromDate: Date, toDate: Date, buildingId: number, userId?: UUID })` calls the reports trajectory API and sends the returned positions to the Viewer with `PLAY`; the SDK catches/logs request failures. The source documents no date-range bound or special empty-array behavior. `cleanTrajectory()` sends empty trajectory data with paused status and catches/logs dispatch failures.
- The browser Viewer is created with `NUXT_PUBLIC_SITUM_API_KEY`; `NUXT_SITUM_API_KEY` remains Nitro-only. No credential values, cookies, or raw upstream payloads were persisted.
- Current realtime DTO is limited to `id`, ISO `time`, `buildingId`, `floorId`, `accuracy`, `lat`, `lng`, and optional `deviceId`. UI may show factual source timestamp/last-seen text only; no stale/offline classification is supported by this evidence.
- Isolated Node smoke confirmed SDK construction/method availability and that cleanup methods reject when invoked without a valid Viewer transport. A hydrated browser Viewer/account smoke was not run in Phase 0; trajectory therefore remains unresolved and conditional.

## Phase 1 — Typed `SitumViewer` command surface

- [ ] expose the smallest typed component methods needed to start/clean realtime positions;
- [ ] expose trajectory load/clean only if Phase 0 verifies it;
- [ ] do not expose a generic `invoke`, raw Viewer object, or arbitrary command escape hatch;
- [ ] make command readiness/error behavior explicit so callers cannot silently treat a failed Viewer action as success;
- [ ] ensure cleanup runs on unmount/page-mode change so overlays do not leak between routes/sessions.

## Phase 2 — Realtime page Viewer composition

- [ ] replace the placeholder `Live map` treatment in `/app/realtime` with the real `SitumViewer` on desktop;
- [ ] start Viewer realtime positions only after Viewer readiness;
- [ ] scope realtime overlay by the selected building when a verified building filter is available;
- [ ] use a reasonable refresh interval supported by the SDK and avoid duplicate app polling solely for the map overlay;
- [ ] keep Nitro `/api/situm/realtime` for the side list/count/status context where useful;
- [ ] keep controls outside/alongside the Viewer canvas so app chrome does not collide with Situm's own controls;
- [ ] provide truthful loading/no-position/Viewer-error/server-list-error states independently;
- [ ] clean realtime Viewer data when leaving the page or disabling the overlay.

## Phase 3 — People/devices operations panel

- [ ] refine the existing position list with verified identifiers, building/floor, accuracy, and source timestamp fields only;
- [ ] add building/search filtering using existing cartography context where truthful;
- [ ] show factual last-update/last-seen text from source timestamps;
- [ ] avoid invented person names, device ownership, online/offline badges, battery, motion state, or occupancy status;
- [ ] preserve accessibility and useful empty/error states.

## Phase 4 — Trajectory playback (conditional)

- [ ] if Phase 0 verified trajectory, add a compact trajectory control panel for building + user + bounded date range;
- [ ] invoke `loadTrajectory` only with verified inputs and show Viewer-owned trajectory visualization;
- [ ] provide explicit Clear/Stop using `cleanTrajectory`;
- [ ] enforce reasonable date-range bounds to avoid accidental expensive queries;
- [ ] show truthful no-data/error feedback without drawing a synthetic path;
- [ ] do not present trajectory as live navigation or user-follow behavior;
- [ ] if runtime evidence fails, mark this phase unresolved/omitted and close the realtime-overlay core truthfully.

## Phase 5 — Validation and closeout

- [ ] `git diff --check`;
- [ ] `npm run lint`;
- [ ] `npm run typecheck`;
- [ ] `npm run build`;
- [ ] hydrated desktop Viewer smoke for realtime start/filter/refresh/cleanup;
- [ ] Nitro realtime list success/empty/error smoke remains intact;
- [ ] trajectory load/clear/no-data smoke if implemented;
- [ ] navigate away/back and verify no duplicate Viewer instance/polling/overlay leakage;
- [ ] verify no private server credential reaches browser responses/bundles/logs;
- [ ] confirm mobile still does not mount the desktop Viewer surface;
- [ ] update plan/state/evidence/session to exact truth;
- [ ] commit and push the completed branch;
- [ ] do not create a PR or merge.

## Non-goals

- browser indoor positioning;
- custom blue-dot positioning;
- remote-user camera follow;
- handset navigation/rerouting;
- invented stale/offline thresholds;
- custom floor coordinate projection when the Viewer can render the data;
- websocket/event-bus architecture unless Situm's exact retained contract concretely requires it;
- persistence of realtime locations in PostgreSQL or ClickHouse.
