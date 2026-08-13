# Plan 017 — Situm Analytics & Reports with ClickHouse

Status: **ready**
Branch: `plan/017-situm-analytics-clickhouse`
Base: final HEAD of `roadmap/017-020-next-features`
Depends on: Plans 010–016A integrated into `main`; UI refinement PRs #10 and #11 integrated
Stacked successor: Plan 018

## Goal

Turn `/app/analytics` from an evidence-gated empty state into a real analytics feature backed by official Situm Reports data persisted and queried through the user's existing local ClickHouse instance.

The intended flow is:

```text
Situm Reports REST
-> authenticated Nitro ingestion
-> existing local ClickHouse
-> authenticated app analytics API
-> /app/analytics (+ existing dashboard metrics where truthful)
```

This plan intentionally uses ClickHouse for analytics persistence/querying. PostgreSQL/Drizzle remains for application-owned relational data and must not be repurposed as the analytics store.

## Required reading

- `AGENTS.md`
- `.agents/README.md`
- `.agents/state.md`
- `.agents/memory/decisions.md`
- `.agents/protocols/git-workflow.md`
- `ARCHITECTURE.md`
- `plans/README.md`
- `design/data-source-matrix.md`
- current `package.json`, `nuxt.config.ts`, `.env.example`
- current `server/integrations/situm/*` and `/api/situm/*`
- current `/app/analytics` and dashboard surfaces
- official current Situm REST/OpenAPI Reports documentation
- official current ClickHouse Node.js client documentation
- this plan

## Fixed product/architecture decisions

- Reuse the ClickHouse server already installed/running on the user's laptop.
- Do **not** install another ClickHouse server, create Docker/Compose infrastructure, replace the existing instance, or modify unrelated databases/tables.
- Phase 0 must discover the real local connection/config safely. Do not print, persist, or ask the user to paste secrets.
- If app-owned ClickHouse objects are needed, keep them isolated. Prefer an app-owned `situm_explore` database when the existing instance permits it; otherwise use clearly app-owned `situm_explore_*` tables in an appropriate existing database. Never drop or rewrite unrelated objects.
- Prefer the official current ClickHouse Node.js client when a Node dependency is required; verify the current package/API before coding.
- ClickHouse credentials/config remain Nitro/server-only. Nothing secret enters `runtimeConfig.public`, browser bundles, responses, logs, or docs.
- Situm Reports access uses the existing private `NUXT_SITUM_API_KEY` boundary and protected Nitro routes.
- No background worker/queue/cron is required for this PoC. Sync is an explicit product operation.
- No fake analytics data or believable fallback fixtures.

## Situm scope

Official Situm REST currently exposes report families including visitors, positioning time, geofencing stay time, geofencing session matches, heatmap, raw data, user positions, Map Viewer usage, and JSON/CSV output.

Core Plan 017 product scope:

1. Visitors;
2. Positioning time;
3. Geofencing stay time;
4. ClickHouse-backed CSV export for the implemented analytics dataset.

Conditional follow-up inside this plan only if exact contract/runtime volume stays small and clear:

- Map Viewer usage summary;
- heatmap.

Raw data, user-position history, broad trajectory analytics, and every possible report combination are **not** required for Plan 017 completion.

## Phase 0 — Evidence + local ClickHouse discovery

- [x] inspect the latest official Situm OpenAPI and verify the exact endpoint, auth, query parameters, date/time-zone semantics, response/meta/statistics shape, CSV behavior, and relevant empty/error behavior for each core report;
- [x] inspect the installed `@situm/sdk-js` version/source only where useful; lack of a wrapper does not block verified direct Nitro REST;
- [x] run safe live probes against the configured Situm account to capture only the fields needed by the product; do not persist sensitive/raw payloads in docs;
- [x] detect and connect to the user's existing local ClickHouse instance without provisioning a new server;
- [x] record non-secret ClickHouse version/connectivity facts and determine the smallest server-only runtime config needed by the app;
- [x] inspect existing ClickHouse databases/tables before creating anything and choose an isolated app-owned namespace;
- [x] verify the official current Node.js client/API before adding a dependency;
- [x] record exact consumed report fields and ClickHouse column types before schema implementation;
- [x] if a core report contract or ClickHouse connectivity is genuinely unavailable, stop and report the exact blocker rather than guessing.

### Phase 0 evidence record (2026-08-13)

- Official Situm OpenAPI: `GET /api/v1/reports/visitors.{format}`, `positioning_time.{format}`, and `geofencing_stay_time.{format}`; API key auth uses `X-API-KEY`, and read-only permission covers GET endpoints. Core filters verified: `building_id` (visitors/positioning), `building_ids` (geofencing), required `from_date`/`to_date`, optional grouping and `time_zone`; CSV is selected with `.csv`. JSON responses expose `data`, `meta`, `rows`, and `statistics`; report metadata describes returned fields and statistics expose elapsed/rows-read/bytes-read. Non-UTC timezone output is local time without an offset.
- Live account probes for a configured building and bounded UTC window returned HTTP 200 for JSON and CSV on all three core reports. Observed JSON fields: visitors `date`, `visitors`; positioning time `timestamp`, `total`, `avg`, `std`; geofence stay `timestamp`, `device_id`, `user_id`, `building_id`, `floor_id`, `matched_fence_id`, `seconds_in_fence`, `stay_time`, `sessions_count`. The tested geofence window returned zero rows (truthful empty result). No raw payloads or credentials were persisted.
- `@situm/sdk-js` is declared at `^0.25.0` but is not installed in the current local dependency tree; no Reports wrapper was relied on. Direct authenticated Nitro REST remains the verified access path.
- Existing local ClickHouse is reachable through the configured private HTTP endpoint; `/ping` succeeded, authenticated SQL succeeded, and version is `26.7.1.1315`. Existing databases include `atja_analytics` and the isolated `situm_explore_analytics`; unrelated ATJA tables were inspected only and not modified. Minimal server-only runtime inputs are URL, user, password, and database.
- Official current ClickHouse Node.js client/API was reviewed; Phase 1 may add `@clickhouse/client` and use its HTTP client/query/insert API. No dependency or schema was added in Phase 0.
- Provisional schema mapping for Phase 1: visitors (`date` Date/DateTime-compatible, `visitors` UInt64); positioning (`timestamp` Date/DateTime-compatible, `total`/`avg`/`std` Float64); geofence stay (`timestamp` DateTime-compatible, identifiers String/UUID-compatible, building/floor UInt64, `seconds_in_fence` Float64, `stay_time` String, `sessions_count` UInt64). Exact ClickHouse nullability/order key remains a Phase 1 implementation decision based on ingestion normalization.

## Phase 1 — ClickHouse integration boundary

- [ ] add the smallest server-only ClickHouse client module under the existing Nuxt/Nitro architecture;
- [ ] add/document only the runtime variables actually required by the discovered local connection; never commit real values;
- [ ] implement a health/readiness check that distinguishes ClickHouse availability from Situm availability without exposing connection details/secrets;
- [ ] create only app-owned database/tables needed for the verified report fields;
- [ ] choose a simple ClickHouse engine/order key appropriate to the verified data and document why;
- [ ] make repeated ingestion of the same report/window idempotent so explicit re-sync does not silently duplicate analytics rows;
- [ ] do not add a generic repository/ORM abstraction or migration framework unless the concrete implementation truly requires it.

## Phase 2 — Situm report ingestion

- [ ] implement a focused server integration for the three core report families using verified official contracts;
- [ ] add a protected explicit analytics sync endpoint/action with validated date range/building/filter inputs actually supported by Situm;
- [ ] normalize only the fields needed by current analytics UI/querying and write them to ClickHouse;
- [ ] preserve source/report-window identity needed for deterministic re-sync/idempotency;
- [ ] surface truthful source-empty, no-data, auth, rate/validation, and ClickHouse-write failures;
- [ ] never make a GET page/API request perform hidden ingestion side effects;
- [ ] keep raw source payload retention out of scope unless a verified field cannot otherwise be represented safely.

## Phase 3 — ClickHouse analytics query API

- [ ] add protected app-owned analytics read endpoints backed by ClickHouse, not direct browser-to-ClickHouse access;
- [ ] support a bounded date range and relevant building/geofence filters based on the verified stored dimensions;
- [ ] expose truthful summaries for visitors, positioning time, and geofence stay time;
- [ ] add CSV export from the implemented ClickHouse dataset with explicit content type/filename and session protection;
- [ ] validate/parameterize all user-controlled query inputs; do not concatenate unsafe SQL;
- [ ] keep response DTOs small and purpose-built for the UI.

## Phase 4 — `/app/analytics` real UI

- [ ] replace the Plan 014 disconnected empty state with real loading/empty/error/success states;
- [ ] add a compact date-range/building filter appropriate to the verified API;
- [ ] add an explicit `Sync from Situm` action scoped to this page/feature (not a fake global sync);
- [ ] show real visitors, positioning-time, and geofence-stay summaries using Nuxt UI and current design tokens;
- [ ] add simple charts/tables only when the verified data supports them; do not synthesize trends;
- [ ] add CSV export for the currently filtered ClickHouse-backed dataset;
- [ ] preserve responsive/accessibility behavior and avoid reintroducing prototype-only visualizations;
- [ ] where the current dashboard already has matching analytics placeholders, replace them only when the exact metric semantics match the new real query; otherwise leave/remove the unresolved metric rather than relabeling data.

## Phase 5 — Optional report enrichment

This phase is conditional and must not block Plan 017 completion if the exact contracts/data are impractical.

- [ ] evaluate Map Viewer usage report against the current dashboard/product intent;
- [ ] evaluate heatmap report payload size/coordinates and whether a truthful web visualization is practical;
- [ ] implement only the optional item(s) that pass evidence/runtime review cleanly;
- [ ] mark unsupported/impractical items explicitly unresolved and continue to closeout without fake substitutes.

## Phase 6 — Validation and closeout

- [ ] `git diff --check`;
- [ ] `npm run lint`;
- [ ] `npm run typecheck`;
- [ ] `npm run build`;
- [ ] live ClickHouse connectivity/query smoke using the existing local instance;
- [ ] live Situm -> ClickHouse sync smoke for each implemented core report;
- [ ] repeat the same sync window and verify idempotent row/results behavior;
- [ ] authenticated analytics read + CSV export smoke;
- [ ] unauthorized app-session behavior verified;
- [ ] Situm failure and ClickHouse unavailable/error behavior remain truthful;
- [ ] verify ClickHouse/Situm secrets are absent from responses, logs, docs, and built client assets;
- [ ] update this plan, `.agents/state.md`, relevant durable knowledge/decisions, and the session log to exact truth;
- [ ] commit and push the completed phase/plan branch;
- [ ] do not create a PR or merge.

## Non-goals

- ClickHouse installation/provisioning/cluster operations;
- replacing PostgreSQL/Drizzle;
- background ingestion workers/queues/cron;
- generic BI platform/dashboard builder;
- every Situm report family;
- fake historical analytics;
- native positioning;
- Situm write/mutation features.
