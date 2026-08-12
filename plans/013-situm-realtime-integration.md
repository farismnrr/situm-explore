# Plan 013 — Situm Realtime Integration

Status: planned-later
Branch: `plan/013-situm-realtime-integration`
Depends on: UI accepted; Plan 010 feasibility decisions

## Goal

Replace dummy realtime positions with the simplest supported real Situm realtime flow while preserving the accepted Realtime and Map Viewer UI.

## Phases

1. [ ] Verify current official realtime SDK/API contract, authentication, update cadence, filters, and limits.
2. [ ] Choose the simplest supported browser/server data path.
3. [ ] Implement real current-position loading with explicit loading/empty/error states.
4. [ ] Update `/app/realtime` cards/list/map markers from real data.
5. [ ] Wire `Follow` to the existing real Map Viewer only when viewer APIs support it safely.
6. [ ] Add refresh/subscription behavior no more complex than required by the API.
7. [ ] Avoid background workers, queues, custom websocket infrastructure, or database history unless later justified.
8. [ ] Validate disconnect/reconnect and stale-data presentation.
9. [ ] lint/typecheck/build + manual smoke + phase commits/pushes.

## Non-goals

- historical trajectory storage in PostgreSQL;
- custom presence service;
- writes/device administration;
- reports integration.
