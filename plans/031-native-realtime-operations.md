# Plan 031 — Native Realtime Operations

Branch: `plan/031-native-realtime-operations`
Base: updated `origin/main` after Plan 030 is integrated
Depends on: Plan 030 complete/integrated
Status: implementation remediation required after final reviewer pass; not PR-ready

## Objective

Deliver the native Realtime product experience for authenticated workspace owners without widening mobile credential authority unnecessarily. Reuse native positioning for the device itself and reuse owner-scoped backend Realtime reads for operational monitoring unless the current Situm React Native SDK proves a safer/equivalent native contract.

Realtime is intentionally a native product destination in this roadmap even if some monitoring data is technically readable on the web.

## Rules

- Keep application/workspace authorization in the existing Nitro backend.
- A Positioning-permission mobile Situm credential must not be silently upgraded to Read-only or Read & Write solely to simplify Realtime.
- Prefer existing owner-scoped backend Realtime APIs for other-device/user monitoring when that preserves least privilege.
- Share Live Location/session-based Situm features may be used only when their current semantics match the product requirement exactly.
- Do not fabricate map overlays, trajectories, online state or freshness semantics.
- Treat `DESIGN.md` and `design/reference/situm-explore-native-responsive-prototype.html` as the visual/interaction reference for Realtime, while keeping the current Situm/backend data contract authoritative.
- Keep Realtime vocabulary aligned with web/backend semantics. Do not replace device/position records with invented person identities or social-presence language unless a proven identity mapping exists.
- Treat location data as sensitive operational data: minimize persistence/logging and expose only to authorized workspace users.
- Plan 031 must still prove every implementation/server/runtime contract that is testable without physical sensor evidence. Physical-device E2E for own-device positioning/background behavior and device-dependent Realtime interactions may be carried forward only to Plan 032's hard final E2E gate, where it becomes mandatory and non-deferrable.
- No PR/merge without explicit user authorization.

## Phase checklist

- [x] Phase 0 — Freeze Realtime product semantics and current SDK/backend evidence.
- [x] Phase 1 — Native realtime data boundary and typed state model.
- [x] Phase 2 — Realtime operations screen and freshness/error states.
- [x] Phase 3 — Map/focus/live-location integration where proven.
- [x] Phase 4 — Own-device positioning/background behavior required by Realtime.
- [x] Phase 5 — Privacy, lifecycle, performance and failure handling.
- [x] Phase 6 — Implementation/runtime acceptance, explicit physical-E2E carry-over, and closeout.

## Phase 0 — Realtime contract

Before implementation, answer with current evidence:

- what the existing workspace-scoped Nitro Realtime route returns and how it derives Situm authority;
- whether current mobile product needs remote-user/device monitoring, Share Live Location, own-device publishing, or a combination;
- exact freshness/timestamp/online fields available from Situm;
- exact fields already exposed by the workspace-scoped Nitro route (`deviceId`/position identity, source time, building, floor, accuracy and coordinates) and whether any later enrichment is actually proven;
- whether `@situm/react-native` exposes a supported generic remote-position overlay or only Share Live Location session display;
- whether remote monitoring requires Read-only Situm authority and therefore should remain server-mediated;
- whether own-device realtime publishing is already inherent in normal Situm positioning or needs an explicit session/action.

Record one frozen v1 Realtime scope. Unsupported semantics remain absent.

The baseline v1 UI semantics should remain device-position oriented unless Phase 0 proves more: show device/position identity, building/floor context, accuracy where useful, and source-time/last-seen information. A timestamp must not be converted into an `online`, `idle` or `offline` presence claim without explicit upstream evidence.

## Phase 1 — Data boundary

Implement a typed Realtime state model with the smallest authority surface.

Preferred shape unless Phase 0 evidence disproves it:

```text
own device
  -> native Situm positioning (least-privilege mobile auth)

other devices/users / operational monitoring
  -> authenticated Situm Explore Nitro workspace route
  -> server-held Situm authority
  -> sanitized native response
```

Requirements:

- no direct mobile ClickHouse/PostgreSQL access;
- workspace ownership verified server-side;
- no raw primary credential or broad Situm bearer token delivered to mobile;
- bounded polling/subscription cadence based on actual upstream contract;
- request cancellation when screen/workspace changes;
- data model includes only fields needed by the product.

## Phase 2 — Native Realtime screen

Build the mobile Realtime destination with truthful states:

- selected workspace context;
- current positions/list/cards appropriate to proven data;
- timestamp/freshness indication when available;
- distinguish loading, no positions, stale data, permission/auth failure and upstream failure;
- refresh/retry behavior bounded and explicit;
- workspace switch clears old realtime state immediately;
- no implication that every user/device is online if the upstream contract does not prove that;
- responsive list/detail/map composition follows the approved native reference while preserving the same factual field meanings as the web/backend contract;
- selecting a record may focus/highlight its mapped position only when the native capability is actually proven; otherwise keep a useful list/detail experience without simulated markers.

The screen must be useful without requiring a map overlay if generic remote markers are not supported by the native MapView contract.

## Phase 3 — Map/live-location integration

If current evidence supports it, integrate Realtime with native MapView using the exact supported mechanism.

Potential proven paths include:

- focus/select a real reported location/building/floor;
- Share Live Location session display through the current React Native `MapViewRef` contract;
- another documented generic realtime overlay if the installed SDK actually exposes one.

If no generic remote overlay exists, do not fake markers inside Situm MapView. Keep the Realtime list/detail experience and document the limitation.

## Phase 4 — Own-device lifecycle

If the frozen Realtime scope requires the mobile device to keep publishing/positioning beyond the foreground Map screen:

- implement the minimum required foreground/background positioning contract;
- follow current Android/iOS permission and foreground-service/background-location policies exactly;
- show clear user state when background permission/service is unavailable;
- stop publishing/positioning on logout or when the product state requires it;
- avoid duplicate listeners/services across app resume/navigation.

Do not request background location merely because it is available.

## Phase 5 — Privacy/performance/failures

Verify:

- no location payloads are written to normal logs/traces unless explicitly minimized and justified;
- no mobile caching of other-user location history unless product requirements explicitly need it;
- polling/subscription stops off-screen and on logout;
- upstream timeouts/rate limits are handled safely;
- large position sets remain bounded and usable;
- workspace isolation remains intact;
- session expiry does not leave Realtime data visible to an unauthenticated user.

## Phase 6 — Implementation/runtime acceptance and E2E carry-over

Use real workspace/Situm data where safely available without persisting credentials. Before Plan 031 can close, prove every non-physical contract that the available backend/emulator/runtime can truthfully exercise:

- correct workspace positions only;
- no cross-workspace leakage;
- truthful freshness/empty/error states;
- native navigation away/back and workspace switching cleanly stop/restart data flow;
- map/live-session integration works only for proven SDK capabilities;
- no broad credential exposure in app bundle, traffic logs, application logs or repository files.

Any acceptance item that materially depends on a supported physical device—especially own-device positioning/background behavior, sensor-dependent publishing, or physical-device Realtime lifecycle—must be listed explicitly as **unpassed Plan 032 carry-over** rather than guessed or silently dropped. Plan 031 may be reviewed/integrated once its implementation/runtime evidence is approved and every such carry-over is recorded.

Plan 032 is the non-deferrable final gate: it must exercise the accumulated Plan 030 and Plan 031 physical-device E2E before roadmap closeout/merge.

## Closeout disposition (2026-08-17)

Plan 031 implementation and non-physical runtime contracts passed on the plan branch. The final evidence is in `.agents/reviews/plan-031-final.md` and `.agents/evidence/plan-031-realtime.md`. Physical-device Realtime lifecycle, own-device Realtime positioning/publishing, sensor behavior, and accumulated native lifecycle checks remain explicitly unpassed Plan 032 carry-over. No PR or merge was created.

Run repository/mobile validations, update architecture/capability evidence, commit/push each phase, and stop before PR until user authorization.
