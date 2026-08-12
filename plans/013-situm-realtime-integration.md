# Plan 013 — Situm Realtime Integration

Status: planned-later
Branch: `plan/013-situm-realtime-integration`
Depends on: UI accepted; Plan 010 feasibility decisions

## Goal

Replace dummy realtime positions with the simplest supported real Situm realtime flow while preserving the accepted Realtime and Map Viewer UI.

## Mandatory HTML-first UI reference

Canonical visual/interaction reference:

`design/reference/situm-explore-interactive-prototype.html`

Before implementation, read:

- `#app-realtime` for stat cards, live-map preview, device list, refresh and Follow behavior;
- `#app-map` Realtime mode/layer and live-position presentation.

Real realtime data must fit the accepted UI contract. Do not redesign Realtime because API payloads expose extra fields; ignore non-required fields unless a later product decision adds them.

## Phases

1. [ ] Re-read `#app-realtime` and `#app-map` Realtime states before defining the real-data mapping.
2. [ ] Verify current official realtime SDK/API contract, authentication, update cadence, filters, and limits.
3. [ ] Choose the simplest supported browser/server data path.
4. [ ] Implement real current-position loading with explicit loading/empty/error states that fit the accepted Realtime composition.
5. [ ] Update `/app/realtime` cards/list/map markers from real data without changing the accepted visual hierarchy.
6. [ ] Wire `Follow` to the existing real Map Viewer only when viewer APIs support it safely and preserve the reference interaction intent.
7. [ ] Add refresh/subscription behavior no more complex than required by the API.
8. [ ] Avoid background workers, queues, custom websocket infrastructure, or database history unless later justified.
9. [ ] Validate disconnect/reconnect and stale-data presentation.
10. [ ] Compare Realtime and Map Realtime states against the canonical HTML after integration.
11. [ ] lint/typecheck/build + manual smoke + phase commits/pushes.

## Non-goals

- historical trajectory storage in PostgreSQL;
- custom presence service;
- writes/device administration;
- reports integration.
