# Plan 013 — Situm Realtime Monitoring Integration

Status: planned-later
Branch: `plan/013-situm-realtime-integration`
Depends on: Plan 012 complete, reviewed, and integrated into `main`

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

- [ ] Confirm current official auth, filters, cadence/limits, and stale/disconnect semantics.
- [ ] Confirm exact fields required by retained UI.
- [ ] Confirm whether list/cards and Viewer overlay can share one canonical real dataset without duplicate fetching.

## Phase 2 — Real positions

- [ ] Replace simulated position fixtures with real current positions.
- [ ] Remove browser-side fake marker movement timer.
- [ ] Add truthful loading/empty/error/stale states.
- [ ] Use one canonical position model for stats/list/map context.

## Phase 3 — Refresh / Viewer overlay

- [ ] Implement the smallest supported refresh model.
- [ ] Wire retained realtime overlay to `SitumViewer` where mapped.
- [ ] Do not create infrastructure beyond the official contract.

## Phase 4 — Trajectory/focus behavior

- [ ] Wire trajectory only when mapped to a real web capability and useful to the current UI.
- [ ] Keep remote-person focus/follow only if Plan 010 documented an exact supported semantic; otherwise it remains removed.

## Validation

- [ ] no simulated movement remains for replaced data;
- [ ] no browser self-positioning claim;
- [ ] no user/device administration mutation;
- [ ] no credential leakage;
- [ ] `git diff --check`;
- [ ] `npm run lint`;
- [ ] `npm run typecheck`;
- [ ] `npm run build`;
- [ ] manual realtime/stale/error smoke;
- [ ] update plan + `.agents/`, commit/push;
- [ ] no PR until user authorization.

## Non-goals

- native positioning;
- historical trajectory storage in PostgreSQL;
- custom presence service;
- reports integration;
- user/device administration.
