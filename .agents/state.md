# Current State

_Last reviewed: 2026-08-13_

## Current focus

The UI roadmap through Plan 009B and the Situm backend/web roadmap Plans 010–016A are complete and integrated into `main`.

The user's manual UI refinement pass is also integrated into `main` through PRs #10 and #11. Treat updated `main` (including those refinements) as the product/code baseline. The abandoned `chore/ui-refine-login-map-feedback` branch is superseded and must not be used as a base or source of truth.

A new substantive roadmap is prepared on `roadmap/017-020-next-features`:

- Plan 017 — Situm Analytics & Reports with the user's existing local ClickHouse instance;
- Plan 018 — Situm Groups & Alarms read-only integration;
- Plan 019 — Situm realtime Viewer overlay + conditional trajectory;
- Plan 020 — Situm static directions between known points/POIs.

Plan 017 is the next active/ready plan. Plans 018–020 are queued.

## Explicit stacked execution authorization — Plans 017–020

The user explicitly authorized one uninterrupted stacked execution for Plans 017→018→019→020.

Branch chain:

```text
roadmap/017-020-next-features
-> plan/017-situm-analytics-clickhouse
-> plan/018-situm-groups-alarms-read
-> plan/019-situm-realtime-viewer-trajectory
-> plan/020-situm-static-directions
```

Rules for this stack:

- create Plan 017 from the final HEAD of `roadmap/017-020-next-features`;
- after each plan is fully validated, persisted, committed, and pushed, create the next plan branch from that plan's final HEAD;
- do not branch Plans 018–020 from stale `main`;
- do not merge/cherry-pick merely to simulate the stack;
- do not create a PR and do not merge during this execution;
- implementation for every phase is delegated specifically to the configured `worker` subagent; the parent agent owns orchestration, review, plan/state updates, commits, pushes, and phase/plan transitions;
- if the configured `worker` profile cannot be spawned, stop and report that blocker instead of silently substituting another agent/model;
- otherwise proceed through all phases/plans without waiting for user confirmation between phases;
- a material core blocker must be reported truthfully rather than guessed around; optional sub-capabilities explicitly marked conditional in a plan may remain unresolved without blocking completion of the verified core.

## Plan 017 ClickHouse decision

The user already has a local ClickHouse installation/instance on the laptop and explicitly wants Plan 017 to use it.

Plan 017 rules:

- reuse the existing local ClickHouse server;
- do not provision/install another ClickHouse server and do not add Docker/Compose for it;
- safely discover the actual local connection/config at runtime without printing or persisting secrets;
- never ask the user to paste credentials into chat;
- inspect existing databases/tables before creating app-owned objects and never alter/drop unrelated objects;
- keep ClickHouse access Nitro/server-only;
- use ClickHouse for Situm analytics/report persistence/querying while PostgreSQL/Drizzle remains the application relational store;
- no background worker/queue/cron is required for this PoC; analytics ingestion is an explicit product sync operation.

## Current Situm implementation baseline

- Plan 010 — implementation/review complete; web/native/security/evidence boundary frozen.
- Plan 011 — implementation complete: Buildings/Floors/POIs/Categories reads and map selection context.
- Plan 012 — implementation complete for verified Geofences/Paths reads; static directions were previously unresolved and now belong to Plan 020 evidence/runtime verification.
- Plan 013 — implementation complete for current-position monitoring; Viewer realtime overlay/trajectory were previously unresolved and now belong to Plan 019 evidence/runtime verification.
- Plan 014 — skipped-unresolved historically; official report surface is now sufficiently concrete to justify Plan 017, but exact consumed fields/filters/runtime behavior must still be re-verified before coding.
- Plan 015 — implementation complete for Organization + Users reads; Groups + Alarms now belong to Plan 018 exact-contract/runtime verification.
- Plan 016 — implementation complete for verified Viewer language, font-size, accessibility-panel, and location-picker commands.
- Plan 016A — complete: final Situm credential contract, environment/config cleanup, Nuxt 4 tsconfig cleanup, static/security validation, and live runtime smoke for implemented Situm server reads.
- PRs #10/#11 — current UI refinement baseline integrated into `main`, including the revised auth/map/settings/home/mobile behavior.

## Final Situm credential contract

Exactly two Situm keys remain intentional:

- `NUXT_PUBLIC_SITUM_API_KEY` — browser Viewer credential only.
- `NUXT_SITUM_API_KEY` — single private Nitro credential for all server-side Situm operations.
- `NUXT_PUBLIC_SITUM_BUILDING_ID` — public identifier.

Do not reintroduce separate private read/write keys unless a future concrete requirement justifies that complexity.

All Nitro Situm operations use the private `NUXT_SITUM_API_KEY`. The private key must never enter browser/public runtime config, client bundles, logs, docs, or error payloads.

## Evidence gate

For Situm behavior: **no evidence, no implementation**.

Before adding a capability, verify the exact current official endpoint/SDK method, installed SDK compatibility where relevant, auth/permission, request parameters, consumed response/event fields, web/native ownership, browser/server ownership, and relevant failure/empty/stale semantics.

Current official evidence indicates:

- Situm Reports exposes multiple JSON/CSV analytics families suitable for Plan 017;
- Groups/Alarms exist in Situm REST but Plan 018 still must freeze the exact list/detail/filter/relationship contracts actually consumed;
- Viewer JS exposes realtime/trajectory methods suitable for Plan 019, subject to installed-version/runtime smoke;
- Viewer JS exposes static directions methods suitable for Plan 020, subject to installed-version/runtime smoke.

If a material contract remains unverified, keep that exact sub-capability unresolved/absent rather than inventing behavior.

## Web/native boundary

The Nuxt product remains the web operations/admin/exploration console.

Native-only scope remains outside this roadmap:

- handset indoor positioning / blue dot from sensors;
- Wi-Fi/BLE positioning and permission handling;
- movement-aware live turn-by-turn navigation/rerouting;
- other mobile-runtime positioning behavior.

Plan 019 may visualize device-produced realtime positions through the Viewer. Plan 020 is static directions only and must not introduce `My location` or live navigation semantics.

## Validation baseline

Current repository validation commands remain:

- `git diff --check`;
- `npm run lint`;
- `npm run typecheck`;
- `npm run build`.

Each new plan adds its own live/runtime smoke requirements and must persist exact tested vs unresolved truth before completion.

## Plan 017 Phase 0 result

Phase 0 evidence and local ClickHouse discovery completed on 2026-08-13. Official current Situm OpenAPI and safe live probes verified the three core report paths, required date/building filters, optional grouping/time-zone behavior, JSON `data`/`meta`/`rows`/`statistics` shape, and CSV responses. The configured account returned HTTP 200 for all three core reports; the tested geofence window was empty. The existing local ClickHouse is healthy and authenticated, version `26.7.1.1315`, with isolated database `situm_explore_analytics`; unrelated `atja_analytics` tables were not changed. `@situm/sdk-js` is declared at `^0.25.0` but absent from the installed tree, so direct Nitro REST is the verified report path. No secrets or raw payloads were persisted.

## Plan 017 Phase 1 result

Phase 1 implementation completed on 2026-08-13. The server-only ClickHouse boundary uses the official `@clickhouse/client`, private `CLICKHOUSE_*` runtime inputs, authenticated `/api/health`, and isolated `situm_explore_analytics` tables for the three verified report families plus sync identities. Schema initialization is limited to the app-owned namespace; no unrelated ClickHouse objects were changed. Validation passed: `git diff --check`, lint, typecheck, and build. Phase 2 is next.

## Plan 017 Phase 2 result

Phase 2 implementation completed on 2026-08-13. Protected `POST /api/analytics/sync` now fetches the three verified Situm Reports families through direct Nitro REST, validates supported date/building inputs, normalizes only required fields, writes to isolated ClickHouse tables, records sync identity, and synchronously replaces the exact source window on re-sync. Static validation passed; live sync and idempotency smoke remain required at Plan 017 closeout. Phase 3 is next.

## Plan 017 Phase 3 result

Phase 3 implementation completed on 2026-08-13. Protected summary and CSV export APIs query only the requested report window from ClickHouse, support bounded date/building/geofence filters, use parameterized SQL, and keep ClickHouse server-only. Static validation passed; full build and live query/export/auth smoke remain required at Plan 017 closeout. Phase 4 is next.

## Plan 017 Phase 4 result

Phase 4 implementation completed on 2026-08-13. `/app/analytics` now presents real protected ClickHouse-backed summaries/tables, date/building/geofence filters, explicit building-scoped Situm sync, loading/empty/error/success states, and CSV export. Validation passed: `git diff --check`, lint, typecheck, and build. Phase 5 optional evaluation is next.

## Plan 017 Phase 6 validation result

Phase 6 runtime smoke completed on 2026-08-13 through the real login endpoint. For the tested window/building, Visitors sync returned 13 rows, Positioning Time returned 7 rows, and Geofencing Stay Time returned HTTP 200 empty; exact repeats returned the same rows and ClickHouse counts remained 13 and 7. Authenticated summary returned HTTP 200 real data; CSV returned HTTP 200 with `text/csv` and content-disposition filenames; unauthenticated summary returned HTTP 401. Invalid Situm timezone returned HTTP 502, and a separate process with a reversible `CLICKHOUSE_URL` override returned authenticated summary HTTP 503. The geofence retry was HTTP 200 empty. The numeric Positioning Time timestamp contract fix is applied, with non-destructive preservation/migration of any prior app-owned table. No secrets, hashes, or cookies were persisted. Final static validation passed; optional Map Viewer usage and heatmap remain unresolved. Plan 017 is complete.

## Next action

Plan 017 Phase 5 optional evaluation completed on 2026-08-13. Map Viewer usage and heatmap remain explicitly unresolved: official evidence confirms only endpoint families/purpose, not the exact consumed schemas, filters, runtime payloads, or truthful visualization semantics. No optional implementation was added. Plan 017 Phase 6 and closeout are complete; next is Plan 018 from Plan 017's exact pushed HEAD.

Do not create a PR or merge during the run. After Plan 020 is fully complete, stop with a concise final summary and leave the final cumulative Plan 020 branch pushed for user review/integration.

## Plan 018 Phase 0 result

Phase 0 exact-contract and live evidence completed on 2026-08-13. Official OpenAPI verifies Groups list-only reads with `has_parent` and no documented detail/membership/pagination contract. Alarms list/detail reads, filters, stable fields, enums, authenticated errors, empty arrays, and detail 404 semantics were verified. Safe live probes returned one group, zero alarms for the configured building (including active-only), and 404 for a nonexistent alarm detail. Group membership presentation remains unresolved; no implementation was performed. Phase 1 is next.

## Plan 018 Phase 1 result

Phase 1 server reads completed on 2026-08-13. Protected Groups and Alarms list/detail endpoints now use the verified direct Nitro REST contracts, strict DTO normalization, supported filters, truthful empty/error/404 behavior, and no mutations or speculative relationships. Phase 2 is next.

## Plan 018 Phase 2 result

Phase 2 Groups surface completed on 2026-08-13. `/app/groups` now provides real protected Groups data, verified parent filtering, local search, responsive loading/error/empty/success states, and organization navigation. Memberships and speculative counts/roles remain absent. Phase 3 is next.
