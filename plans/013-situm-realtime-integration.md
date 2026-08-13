# Plan 013 — Situm Realtime Monitoring Integration

Status: **complete**
Branch: `plan/013-situm-realtime-integration`
Base: Plan 012 final HEAD `94c1247` (explicit stacked execution; not integrated into `main`)
Depends on: Plan 012 complete and available as the stacked parent branch

## Goal

Replace dummy/simulated realtime positions with real Situm tracking data for the **web monitoring console** and retained Viewer overlays.

This plan consumes positions produced by tracked devices. It does not make the browser perform indoor positioning.

## Required reading

- `AGENTS.md`
- `ARCHITECTURE.md`
- `design/data-source-matrix.md`
- completed Plan 010 capability mapping
- completed Plans 011–012
- current Realtime and Map implementation
- this plan

## Boundary

Keep:

- current positions;
- online/stale/offline state when supported by mapped data;
- people/device list;
- map markers/realtime overlay;
- explicit refresh or supported refresh cadence;
- trajectory only where exact Viewer/report capability is mapped.

Do not add:

- browser Wi-Fi/BLE positioning;
- handset blue-dot generation;
- device permission flows;
- mobile background positioning;
- fake remote-user `Follow` semantics unless Plan 010 verified the exact Viewer behavior.

## Credential/data path

- Realtime REST data uses the private authenticated Nitro path frozen by Plan 010 unless Plan 010 explicitly assigns a Viewer-owned browser path.
- Browser Viewer overlay uses only the accepted browser Viewer auth mechanism.
- Never expose the server Situm credential to browser code.
- No custom websocket service, queue, worker, or DB history unless an actual requirement is separately approved.

## Phase 1 — Revalidate realtime contract

- [x] Confirm current official auth and position fields; cadence/stale/disconnect semantics remain unresolved and are not presented.
- [x] Confirm exact fields required by retained UI.
- [x] Use one authenticated Nitro position dataset for the list and current-state surface.

## Phase 2 — Real positions

- [x] Replace simulated position fixtures with real current positions.
- [x] No browser-side fake marker movement timer remains.
- [x] Add truthful loading/empty/error states; stale/offline semantics remain explicitly unresolved.
- [x] Use one canonical position model for the list/current-state surface.

## Phase 3 — Refresh / Viewer overlay

- [x] Implement explicit user refresh through the authenticated route.
- [ ] Viewer realtime overlay (deferred: exact filter/customization mapping not verified).
- [x] Do not create infrastructure beyond the official contract.

## Phase 4 — Trajectory/focus behavior

- [ ] Trajectory remains unresolved and absent because Plan 010 did not close its product mapping.
- [x] Remote-person focus/follow remains absent.

## Validation

- [x] no simulated movement remains for replaced data;
- [x] no browser self-positioning claim;
- [x] no user/device administration mutation;
- [x] no credential leakage;
- [x] `git diff --check`;
- [x] `npm run lint`;
- [x] `npm run typecheck`;
- [x] `npm run build`;
- [ ] manual realtime/error smoke (requires configured Situm credentials/session; unavailable here);
- [x] update plan + `.agents/`, commit/push;
- [x] no PR until user authorization.

## Non-goals

- native positioning;
- historical trajectory storage in PostgreSQL;
- custom presence service;
- reports integration;
- user/device administration.
