# Plan 031 — Native Realtime Operations

Branch: `plan/031-native-realtime-operations`
Base: updated `origin/main` after Plan 030 is integrated
Depends on: Plan 030 complete/integrated
Status: planned

## Objective

Deliver the native Realtime product experience for authenticated workspace owners without widening mobile credential authority unnecessarily. Reuse native positioning for the device itself and reuse owner-scoped backend Realtime reads for operational monitoring unless the current Situm React Native SDK proves a safer/equivalent native contract.

Realtime is intentionally a native product destination in this roadmap even if some monitoring data is technically readable on the web.

## Rules

- Keep application/workspace authorization in the existing Nitro backend.
- A Positioning-permission mobile Situm credential must not be silently upgraded to Read-only or Read & Write solely to simplify Realtime.
- Prefer existing owner-scoped backend Realtime APIs for other-device/user monitoring when that preserves least privilege.
- Share Live Location/session-based Situm features may be used only when their current semantics match the product requirement exactly.
- Do not fabricate map overlays, trajectories, online state or freshness semantics.
- Treat location data as sensitive operational data: minimize persistence/logging and expose only to authorized workspace users.
- No PR/merge without explicit user authorization.

## Phase checklist

- [ ] Phase 0 — Freeze Realtime product semantics and current SDK/backend evidence.
- [ ] Phase 1 — Native realtime data boundary and typed state model.
- [ ] Phase 2 — Realtime operations screen and freshness/error states.
- [ ] Phase 3 — Map/focus/live-location integration where proven.
- [ ] Phase 4 — Own-device positioning/background behavior required by Realtime.
- [ ] Phase 5 — Privacy, lifecycle, performance and failure handling.
- [ ] Phase 6 — Real-device/runtime acceptance and closeout.

## Phase 0 — Realtime contract

Before implementation, answer with current evidence:

- what the existing workspace-scoped Nitro Realtime route returns and how it derives Situm authority;
- whether current mobile product needs remote-user/device monitoring, Share Live Location, own-device publishing, or a combination;
- exact freshness/timestamp/online fields available from Situm;
- whether `@situm/react-native` exposes a supported generic remote-position overlay or only Share Live Location session display;
- whether remote monitoring requires Read-only Situm authority and therefore should remain server-mediated;
- whether own-device realtime publishing is already inherent in normal Situm positioning or needs an explicit session/action.

Record one frozen v1 Realtime scope. Unsupported semantics remain absent.

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
- no implication that every user/device is online if the upstream contract does not prove that.

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

## Phase 6 — Acceptance

Use real workspace/Situm data where available without persisting credentials.

Acceptance must prove the frozen v1 semantics end-to-end:

- correct workspace positions only;
- no cross-workspace leakage;
- truthful freshness/empty/error states;
- native navigation away/back and workspace switching cleanly stop/restart data flow;
- own-device positioning/background behavior works where included;
- map/live-session integration works only for proven SDK capabilities;
- no broad credential exposure in app bundle, traffic logs, application logs or repository files.

Run repository/mobile validations, update architecture/capability evidence, commit/push each phase, and stop before PR until user authorization.
