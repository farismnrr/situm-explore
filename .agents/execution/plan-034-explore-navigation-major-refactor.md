# Plan 034 Remediation — Explore Map-First & Guidance UX Major Refactor

> **Historical execution brief.** This file preserves the instructions used during completed work. It is not current execution authority; consult `.agents/state.md` and create a new explicit plan for future changes.


Repo: `/home/farismnrr/Projects/situm-explore`
Branch: `plan/034-full-e2e-acceptance`
Parent authority: `/home/farismnrr/Projects/situm-explore/plans/034-full-e2e-acceptance.md`
Physical target: Android POS `100.113.52.76:35911`, landscape `1366×720`
Status: implementation complete; physical positioning gate blocked by vendor runtime

## Objective

Refactor the native Explore experience from a card-heavy dashboard into a map-first interaction model, and refactor indoor navigation into a tracked guidance experience inspired by Google Maps / ride-hailing trip views.

The product should feel native to a POS/tablet navigation task:

- Explore defaults to a large/full Situm map occupying nearly all available content area.
- Avoid duplicating Situm SDK capabilities with permanent custom panels, lists, floor controls, and location cards unless a product-level need remains.
- Guidance mode prioritizes the moving/current position, active route, destination, remaining distance, and stop/recenter actions.
- User panning can temporarily break follow mode, with an explicit recenter affordance.
- Phone/tablet/POS layouts remain responsive.

This is a bounded Plan 034 acceptance remediation. Do not redesign authentication, security, credential boundaries, backend ownership, or Realtime semantics.

## Current problems

`/home/farismnrr/Projects/situm-explore/mobile/src/map/NativeMapScreen.tsx` currently renders:

- welcome card;
- search field;
- quick POI chips;
- building selector;
- Situm MapView;
- separate location status card;
- custom floor selector;
- separate POI detail panel;
- custom POI list.

On the physical `1366×720` POS this creates excessive vertical flow and duplicates capabilities already exposed by Situm MapView/SDK.

The desired product direction is map-first rather than dashboard-first.

## Non-negotiables

Preserve all existing security and authority boundaries:

- primary Read & Write key remains server-only;
- Viewer authority remains separate;
- mobile Positioning credential remains dedicated least-privilege `POSITIONING` and encrypted server-side;
- native retrieves Positioning credential only through authenticated `/api/workspaces/:workspaceId/mobile-positioning`;
- no credentials in mobile env/evidence/logs;
- Realtime remains server-mediated;
- no direct client widening of backend authority.

Also preserve:

- authenticated workspace ownership checks;
- secure session restore/logout behavior;
- lifecycle stop/cancel behavior;
- real cartography only;
- no fake/mock location, POI, floor, route, or navigation state for acceptance;
- current error/fail-closed behavior.

## UX direction

### Explore / browse mode

Default authenticated Explore should be dominated by Situm MapView.

Target structure conceptually:

```text
┌ nav ┬────────────────────────────────────────────┐
│     │                                            │
│     │                                            │
│     │                SITUM MAP                   │
│     │                                            │
│     │                             ◎ recenter     │
│     │                                            │
└─────┴────────────────────────────────────────────┘
```

Keep product chrome minimal:

- existing app rail/bottom nav as appropriate;
- compact workspace context/status where useful;
- small retry/error overlays;
- recenter/location affordance when required;
- optional compact search/POI affordance only if Situm MapView does not expose a usable native equivalent in the frozen SDK.

Do not keep permanent right-side `Select a place`, `PLACES`, `LEVELS`, or verbose location explanation panels if the native Situm map already provides equivalent interactions.

### Guidance mode

When a destination/navigation starts, switch into a focused trip/guidance presentation.

Desired behavior:

- Situm map remains the dominant surface;
- current position marker is visually central;
- camera follows current position when follow mode is active;
- route remains visible;
- floor updates track navigation/positioning as supported;
- compact navigation HUD/bottom sheet shows destination and current guidance state;
- remaining distance updates from navigation progress;
- explicit Stop action is always reachable;
- explicit Recenter appears when follow mode is broken by user interaction;
- arrival, outside-route, cancelled, and error states are represented clearly without replacing the map with a dashboard.

Do not attempt pseudo-3D or unsupported camera capabilities. Use only documented/existing Situm APIs proven compatible with the frozen package.

## SDK capabilities to verify before implementation

Inspect the installed frozen package and official Situm docs for exact signatures/behavior of:

- `MapViewRef.followUser()`;
- `MapViewRef.unfollowUser()`;
- `navigateToPoi()`;
- navigation progress callbacks;
- `NavigationProgress.closestLocationInRoute` or equivalent route-snapped location capability;
- POI selection/deselection;
- floor changes;
- map/user interaction callback(s) capable of detecting when the user manually pans/zooms;
- any native search/floor UI provided by the frozen SDK;
- current position marker/orientation behavior.

Do not guess API signatures from web examples if they differ from `/home/farismnrr/Projects/situm-explore/mobile/node_modules/@situm/react-native`.

## State model

Create or refine an explicit interaction model instead of implicit booleans.

At minimum represent:

- browse;
- positioning-starting;
- positioning-active;
- guidance-following;
- guidance-free-pan;
- outside-route;
- arrived;
- cancelled;
- error.

The implementation may reuse existing `NavigationOwnershipState` where appropriate, but UI follow-mode ownership should remain separately understandable/testable.

## Phase checklist

- [x] Phase 0 — SDK/runtime capability audit and current-screen inventory.
- [x] Phase 1 — Refactor Explore to map-first layout.
- [x] Phase 2 — Implement explicit guidance/follow/recenter interaction model.
- [x] Phase 3 — Add compact guidance HUD / bottom sheet.
- [x] Phase 4 — Responsive and lifecycle regression pass.
- [x] Phase 5 — Automated/static validation.
- [ ] Phase 6 — Physical POS acceptance — BLOCKED only for positioning-dependent navigation by the vendor provider runtime.
- [x] Phase 7 — Plan 034 evidence/state reconciliation.

## Phase 0 — Capability audit

Inspect these files first:

- `/home/farismnrr/Projects/situm-explore/mobile/src/map/NativeMapScreen.tsx`
- `/home/farismnrr/Projects/situm-explore/mobile/src/map/state.ts`
- `/home/farismnrr/Projects/situm-explore/mobile/src/ui/layout.ts`
- `/home/farismnrr/Projects/situm-explore/mobile/App.tsx`
- `/home/farismnrr/Projects/situm-explore/mobile/node_modules/@situm/react-native`
- `/home/farismnrr/Projects/situm-explore/.agents/reference/native-ui-reference.html`

Confirm exact available map/navigation APIs from the installed package before coding.

Record any meaningful mismatch between official docs and installed package in evidence, but do not persist irrelevant research noise.

## Phase 1 — Map-first Explore

Refactor `/home/farismnrr/Projects/situm-explore/mobile/src/map/NativeMapScreen.tsx` so:

- MapView receives nearly all available authenticated content height on POS/tablet;
- map size is based on actual available viewport, not an oversized fixed height plus stacked content;
- remove permanent duplicate controls/panels that Situm SDK already provides;
- retain only minimal product overlays needed for Situm Explore-specific state;
- browser/search fallback, if retained, should be compact and optionally collapsible rather than consuming large permanent space;
- map remains usable in phone layout via responsive adaptation;
- errors can overlay the map or present an unobtrusive state without destroying the map-first hierarchy when recovery is possible.

Target POS acceptance: immediately after Explore loads, most of the visible area should be the live Situm map.

## Phase 2 — Follow/recenter guidance behavior

When navigation starts:

- enter `guidance-following`;
- call the proven Situm follow-user API;
- keep current position/route as the visual focus;
- update remaining distance from navigation progress;
- use closest route position if the SDK explicitly supports it and this improves marker/route consistency;
- handle floor changes through Situm callbacks/native map behavior.

When user manually pans/zooms and the SDK exposes a reliable interaction signal:

- transition to `guidance-free-pan`;
- stop automatic follow without stopping navigation;
- show Recenter.

When Recenter is pressed:

- restore follow mode;
- return to `guidance-following`.

If the frozen SDK does not expose a reliable user-gesture callback, do not invent fragile heuristics. Document the limitation and implement the best supported recenter/follow UX.

## Phase 3 — Guidance HUD / bottom sheet

Create a compact overlay suitable for both POS landscape and phone portrait/landscape.

Minimum information:

- destination name;
- remaining distance where available;
- current navigation state/message;
- Stop action;
- Recenter when applicable.

Optional only if backed by real SDK data:

- next maneuver/instruction;
- floor name;
- route status.

Do not fake turn-by-turn instructions from geometry if Situm does not expose them.

The overlay must not cover most of the map.

## Phase 4 — Responsive + lifecycle

Verify:

- POS landscape `1366×720`;
- tablet-width behavior;
- phone behavior;
- rotation/window resize if supported;
- app background stops location/navigation according to existing policy;
- resume does not falsely continue stale follow/guidance state;
- workspace switch cancels/invalidates navigation safely;
- logout clears navigation/positioning ownership;
- deep-link Map/Realtime behavior remains intact after the separate staging APK scheme issue is resolved.

## Phase 5 — Automated/static validation

Add narrow tests for pure state transitions where practical.

At minimum cover:

- browse -> guidance-following;
- guidance-following -> guidance-free-pan;
- guidance-free-pan -> guidance-following via recenter;
- guidance -> arrived/cancelled/error;
- Stop visibility/ownership rules;
- no Directions without current usable position remains enforced;
- no stale position is reused for navigation.

Run:

- `cd /home/farismnrr/Projects/situm-explore/mobile && npm run lint`
- `cd /home/farismnrr/Projects/situm-explore/mobile && npm run typecheck`
- relevant mobile tests;
- Android build when native package/config changes require it;
- `cd /home/farismnrr/Projects/situm-explore && git diff --check`
- root focused Plan 030/031/033/034 regressions as relevant.

## Phase 6 — Physical POS acceptance

Use device:

`100.113.52.76:35911`

Known local development routes:

- Metro device `tcp:8081` should point to the active host Metro port;
- staging API device `tcp:3000` -> host `tcp:3005`.

Physical PASS requires:

1. Explore loads real workspace cartography.
2. Map is the dominant visible surface at `1366×720`.
3. No permanent duplicate right-side Select a place/Places/Levels dashboard consumes major screen area unless proven necessary due SDK limitations.
4. Real POI can be selected through supported map interaction.
5. Positioning can be requested through the normal product flow.
6. If physical vendor positioning remains blocked by the known Android provider issue, UI/guidance code must still be verified as far as real runtime permits and blocker recorded honestly; do not fake a location to claim E2E PASS.
7. With a real current position available, starting Directions enters guidance/follow mode.
8. Remaining route progress updates from real Situm navigation callbacks.
9. Stop is reachable.
10. Recenter/follow behavior works to the extent supported by frozen Situm SDK.
11. Background/resume does not retain unsafe stale navigation state.
12. No crash/redbox/runtime exception.

## Phase 7 — Evidence

Write physical/runtime findings to:

`/home/farismnrr/Projects/situm-explore/.agents/evidence/plan-034-explore-navigation-refactor-2026-08-18.md`

Update:

- `/home/farismnrr/Projects/situm-explore/plans/034-full-e2e-acceptance.md`
- `/home/farismnrr/Projects/situm-explore/.agents/state.md`

only with evidence-backed PASS/BLOCKED statements.

Do not persist credentials, session tokens, positioning keys, or secret-bearing screenshots/logs.

## Exit criteria

This remediation is complete when:

- Explore is clearly map-first;
- permanent duplicate Situm controls are removed or specifically justified;
- guidance has an explicit follow/recenter model;
- guidance HUD is compact and task-oriented;
- lint/typecheck/tests pass;
- physical POS UI is validated;
- any positioning/device limitation is documented without false PASS;
- Plan 034 evidence/state are reconciled.
