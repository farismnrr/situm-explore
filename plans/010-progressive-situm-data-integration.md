# Plan 010 — Progressive Situm Data Integration

Status: planned-later
Branch: `plan/010-progressive-situm-data-integration`
Depends on: UI accepted through Plan 009

## Goal

Replace selected dummy read-only surfaces with real Situm data only after the UI is approved. This plan is intentionally later so backend/API expansion does not block UI delivery.

## Credential policy

Current POC uses one `Only Read` Situm key.

- Do not request `Cartography Edition` or `Read & Write` for this plan.
- Never expose credential values in logs/UI/repo.
- If server-side API usage is introduced, evaluate whether the existing browser-visible POC key is still acceptable or whether a dedicated server key should be introduced before productionization.

## Integration order

Do not integrate everything at once.

### Phase 1 — Discovery feasibility

- [ ] Inspect current official Situm JS SDK and REST docs.
- [ ] Inventory which approved UI fields can be obtained with read-only GET/SDK APIs.
- [ ] Decide browser SDK vs Nitro server route per dataset based on current official guidance and credential exposure, not convenience.
- [ ] Keep scope read-only.
- [ ] Document response-to-fixture mapping before replacing data.

### Phase 2 — Buildings & Floors

First real replacement candidate.

- [ ] load buildings/floors through the chosen supported API;
- [ ] map to existing UI types;
- [ ] preserve loading/empty/error states;
- [ ] remove only the replaced dummy fixture records;
- [ ] do not change page design.

### Phase 3 — POIs / Categories

- [ ] load real POIs/categories read-only;
- [ ] keep search/filter client-side unless dataset size proves otherwise;
- [ ] connect `View on map` only when viewer API mapping is reliable;
- [ ] favorites may remain local unless a supported read/write product requirement appears later.

### Phase 4 — Geofences / Paths

- [ ] read real geofences/path metadata if supported and useful;
- [ ] preserve dummy report values unless report endpoints are separately integrated;
- [ ] no cartography writes.

### Phase 5 — Realtime

- [ ] inspect official realtime API/SDK contract and recommended refresh/subscription model;
- [ ] integrate only if POC usage and credential boundary are acceptable;
- [ ] keep polling/subscription simple;
- [ ] avoid queues/websocket infrastructure unless the Situm API actually requires it.

### Phase 6 — Reports / Analytics

Integrate one report at a time based on product value:

- visitors;
- geofence stay time;
- positioning time;
- user positions;
- map viewer usage;
- heatmap if supported.

- [ ] each report keeps current UI contract;
- [ ] no background-job infrastructure unless API latency/contract proves necessary;
- [ ] graceful fallback to clear empty/error state, not dummy values silently mixed with real data.

### Phase 7 — Organization / Users / Alarms

- [ ] integrate only if needed for the POC demonstration;
- [ ] keep these distinct from application auth users;
- [ ] remain read-only.

## Data-boundary rule

A page must be one of:

1. clearly real data;
2. clearly local prototype data in source code;
3. mixed only when each field/group has a deliberate source.

Never silently present dummy values as if they came from Situm.

## Validation per integration

- official API/SDK docs checked;
- no extra permission level required;
- no credential leakage;
- error/rate-limit behavior handled;
- current UI unchanged except loading/empty/error necessities;
- lint/typecheck/build;
- manual API smoke check;
- phase commit/push;
- no PR until authorized.

## Non-goals

- Situm writes;
- POI/geofence/path editing;
- account administration;
- key management UI;
- background workers unless proven necessary;
- broad backend redesign.
