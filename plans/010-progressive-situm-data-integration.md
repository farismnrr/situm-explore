# Plan 010 — Progressive Situm Data Integration

Status: planned-later
Branch: `plan/010-progressive-situm-data-integration`
Depends on: UI accepted through Plan 009

## Goal

Replace selected dummy read-only surfaces with real Situm data only after the UI is approved. This plan is intentionally later so backend/API expansion does not block UI delivery.

## Mandatory UI-preservation reference

Canonical visual/interaction reference:

`design/reference/situm-explore-interactive-prototype.html`

Before integrating any dataset, **open the canonical HTML and read the exact screen that consumes that dataset**. This plan changes data sources, not product composition.

Required mapping:

- Buildings/Floors -> `#app-buildings` and `#app-map` building/floor controls.
- POIs/Categories -> `#app-pois` and `#app-map` Explore/POI states.
- Geofences -> `#app-geofences` and Map Layers UI.
- Paths/Routing -> `#app-paths` and `#app-map` Route UI.
- Realtime -> `#app-realtime` and Map Realtime mode/layer.
- Reports -> `#app-analytics` and every matching `.report-pane`.
- Organization/Users/Alarms -> `#app-organization`, `#app-users`, `#app-alarms`.

Per integration:

1. Read the relevant HTML section first.
2. Inspect the accepted Nuxt implementation produced by Plans 004–009.
3. Map real API responses into the existing accepted UI contract.
4. Do not redesign layout, navigation, card/table density, labels, or interaction hierarchy simply because the data becomes real.
5. UI changes are limited to truthful loading/empty/error states or unavoidable capability differences, which must be documented.

## Credential policy

Current POC uses one `Only Read` Situm key.

- Do not request `Cartography Edition` or `Read & Write` for this plan.
- Never expose credential values in logs/UI/repo.
- If server-side API usage is introduced, evaluate whether the existing browser-visible POC key is still acceptable or whether a dedicated server key should be introduced before productionization.

## Integration order

Do not integrate everything at once.

### Phase 1 — Discovery feasibility

- [ ] Read all relevant canonical HTML target screens before defining data mappings.
- [ ] Inspect current official Situm JS SDK and REST docs.
- [ ] Inventory which approved UI fields can be obtained with read-only GET/SDK APIs.
- [ ] Decide browser SDK vs Nitro server route per dataset based on current official guidance and credential exposure, not convenience.
- [ ] Keep scope read-only.
- [ ] Document response-to-existing-UI-type mapping before replacing data.

### Phase 2 — Buildings & Floors

First real replacement candidate.

Before implementation, read `#app-buildings` and `#app-map` building/floor controls.

- [ ] load buildings/floors through the chosen supported API;
- [ ] map to existing UI types;
- [ ] preserve loading/empty/error states;
- [ ] remove only the replaced dummy fixture records;
- [ ] do not change accepted page design.

### Phase 3 — POIs / Categories

Before implementation, read `#app-pois` and `#app-map` Explore/POI states.

- [ ] load real POIs/categories read-only;
- [ ] keep search/filter client-side unless dataset size proves otherwise;
- [ ] connect `View on map` only when viewer API mapping is reliable;
- [ ] favorites may remain local unless a supported read/write product requirement appears later;
- [ ] preserve accepted POI UI composition.

### Phase 4 — Geofences / Paths

Before implementation, read `#app-geofences`, `#app-paths`, and matching Map Layers/Route UI.

- [ ] read real geofences/path metadata if supported and useful;
- [ ] preserve dummy report values unless report endpoints are separately integrated;
- [ ] no cartography writes;
- [ ] preserve accepted page/map composition.

### Phase 5 — Realtime

Before implementation, read `#app-realtime` and Map Realtime mode/layer states.

- [ ] inspect official realtime API/SDK contract and recommended refresh/subscription model;
- [ ] integrate only if POC usage and credential boundary are acceptable;
- [ ] keep polling/subscription simple;
- [ ] avoid queues/websocket infrastructure unless the Situm API actually requires it;
- [ ] preserve accepted Realtime UI hierarchy.

### Phase 6 — Reports / Analytics

Before each report integration, open `#app-analytics` and the exact matching `.report-pane`.

Integrate one report at a time based on product value:

- visitors;
- geofence stay time;
- positioning time;
- user positions;
- map viewer usage;
- heatmap if supported.

- [ ] each report keeps current accepted UI contract;
- [ ] no background-job infrastructure unless API latency/contract proves necessary;
- [ ] graceful fallback to clear empty/error state, not dummy values silently mixed with real data.

### Phase 7 — Organization / Users / Alarms

Before implementation, read `#app-organization`, `#app-users`, and `#app-alarms`.

- [ ] integrate only if needed for the POC demonstration;
- [ ] keep these distinct from application auth users;
- [ ] remain read-only;
- [ ] preserve accepted UI composition.

## Data-boundary rule

A page must be one of:

1. clearly real data;
2. clearly local prototype data in source code;
3. mixed only when each field/group has a deliberate source.

Never silently present dummy values as if they came from Situm.

## Validation per integration

- relevant canonical HTML target screen re-read before implementation;
- official API/SDK docs checked;
- no extra permission level required;
- no credential leakage;
- error/rate-limit behavior handled;
- accepted UI unchanged except loading/empty/error necessities;
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
