# Plan 016A Phase 4 — REST Evidence Follow-up (Reports, Groups, Alarms)

Date: 2026-08-13
Scope: Evidence-gathering only. No implementation code written.

Method: Web search + WebFetch against official Situm documentation
(situm.com/docs, developers.situm.com). No access to an authenticated
Situm account, API key, or the interactive OpenAPI/Swagger UI (it is
JS-rendered and returned only navigation shells to WebFetch, not the
expanded endpoint specs). All findings below are traceable to specific
fetched pages; nothing is inferred beyond what the pages state.

## 1. Reports / Analytics / CSV

Status: **PARTIALLY RESOLVED** (paths and purpose confirmed; exact
parameter/response schema still unresolved)

Confirmed via `https://situm.com/docs/websdk-rest-api-changelog/`:

- `GET /api/v1/reports/geofencing_stay_time` — time a user/device spent
  in a geofence (added v1.92.0, 2022-03-09)
- `GET /api/v1/reports/visitors` — unique visitors in buildings, by time
  aggregation (v1.92.0)
- `GET /api/v1/reports/raw_data` — raw positioning data (v1.92.0)
- `GET /api/v1/reports/user_positions` — user trajectories (v1.92.0)
- `GET /api/v1/reports/heatmap` — positioning density (v1.92.0)
- `GET /api/v1/reports/geofencing_stay_time_historical` (v1.95.0,
  2022-12-15)
- `GET /api/v1/reports/geofencing_sessions_matches_historical` —
  devices inside geofences over a period; returns a list of
  entrance/exit "stay" records per device/geofence (v1.95.0; also
  described independently by search snippet)
- `GET /api/v1/reports/map_viewer.{format}` — Map Viewer user events,
  format-suffixed path implying CSV/JSON output selection (v1.111.2,
  2026-04-28)

Auth: base API uses `https://api.situm.com/api/v1/` with either JWT
bearer (`Authorization: Bearer ...`) or API key (`X-API-KEY: ...`),
confirmed via `https://situm.com/docs/websdk-rest-api-quickstart-guide/`.
Not confirmed which specific auth mode/permission tier the reports
endpoints require.

Still UNRESOLVED for this capability:
- Exact required/optional query parameters per endpoint (date range,
  building id, device/user filters) — not returned by any fetched page;
  the human-facing `situm.com/docs/reports/` page only documents the
  Dashboard UI filters (date range, building, floor, user, device,
  geofence), not the REST query parameter names/types.
- Exact JSON/CSV response schema per endpoint.
- Pagination behavior (no pagination parameters found in any source).
- Permissions/API-key tier required (the quickstart page lists 5 key
  tiers — read-write, cartography edition, read-only, positioning,
  disabled — but does not map reports endpoints to a tier).
- Failure/error behavior (no error code documentation found).
- The `@situm/sdk-js` `ReportsApi` class only wraps `getTrajectory()`
  (confirmed via `developers.situm.com/sdk_documentation/sdk-js/classes/_internal_.ReportsApi.html`),
  which does not by itself prove the other REST paths above are
  unavailable — consistent with the plan's rule that SDK absence isn't
  proof of REST absence.

Conclusion: paths and general purpose are now evidenced (an improvement
over Plans 010/014, which had zero verified paths). Parameter/response/
pagination/permission/error contracts remain unresolved. Not yet
sufficient for implementation. If pursued, Plan 017+ would need to
either obtain an authenticated Situm account to hit these endpoints
directly and observe real request/response shapes, or get the OpenAPI
spec content through an authenticated/rendered channel (the public
Swagger UI at `developers.situm.com/pages/rest/openapi/index.html` is
JS-rendered and did not return usable spec content to this session's
fetch tooling).

## 2. Groups read

Status: **UNRESOLVED**

- `https://situm.com/docs/user-management/` confirms Groups exist as a
  Dashboard *feature* ("Situm allows you to create groups and
  subgroups, assigning each user to one of them") used for filtering in
  the Real-Time panel and Reports, and for color-coding — but documents
  only UI behavior, not any REST path.
- No `GET /api/v1/groups`-style path (or any group-related path) was
  found in the REST API changelog, the quickstart guide, or search
  results.
- `@situm/sdk-js` has no groups API surface as previously confirmed in
  Plan 015.

What's missing: no public REST endpoint for reading groups has been
located anywhere in official documentation. This may mean group data is
only exposed indirectly (e.g., as a filter parameter to other endpoints
such as reports, or as a field on the user-management endpoints) rather
than as its own resource — but that is speculation, not evidence.

Conclusion: insufficient evidence to implement. No public REST endpoint
found. Remains UNRESOLVED and absent, consistent with Plan 015's
finding.

## 3. Alarms read

Status: **PARTIALLY RESOLVED** (write path confirmed; read/list path
UNRESOLVED)

Confirmed via `https://situm.com/docs/websdk-rest-api-changelog/`:
- `POST /api/v1/alarms` exists and, as of v1.100.0 (2023-06-27), gained
  support for a new alarm type `ASSISTANCE_REQUEST` in the alarm
  *creation* operation. This confirms an Alarms REST resource exists
  under `/api/v1/alarms`, but the changelog entry documents a write
  (create) operation only.

Not found in any fetched source:
- A `GET /api/v1/alarms` (or `/api/v1/alarms/{id}`) listing/read path,
  its query parameters (status, date range, building, geofence, etc.),
  response schema, or pagination.
- Permissions/API-key tier required for alarm reads.
- Error/failure behavior for alarm reads.

The Dashboard-facing `https://situm.com/docs/real-time/` and
`https://situm.com/docs/reports/` pages both reference "Alarms" as a
report/monitoring category in the UI, which is consistent with alarm
data being readable somehow (likely via the Dashboard's own backend or
possibly folded into the reports endpoints), but neither page states a
REST contract for reading alarms directly.

Conclusion: existence of the `/api/v1/alarms` resource is confirmed
(via the POST/create changelog entry), which is stronger evidence than
Plan 015 had (which found nothing). However the read/list contract
(path, parameters, schema, pagination, permissions, errors) is still
UNRESOLVED — insufficient to implement a read feature confidently.

## Overall recommendation for Plan 017+

- Reports: worth scoping as Plan 017+ but only after either (a)
  obtaining a real Situm API key with reports read permission and
  probing the confirmed paths directly to record real
  request/response pairs, or (b) getting usable (non-JS-shell) access
  to the official OpenAPI spec content. Do not implement against
  guessed schemas.
- Groups: do not scope for implementation yet — no REST contract
  evidence exists at all. If needed, first determine whether group
  data appears as a field/filter on another already-verified endpoint
  (e.g., users or reports) rather than assuming a dedicated groups
  endpoint exists.
- Alarms: worth a narrower Plan 017+ investigation specifically aimed
  at finding/confirming the GET/list alarms contract now that the
  `/api/v1/alarms` resource itself is confirmed to exist; write access
  should stay out of scope (read-only per Plan 015's constraints).

No implementation code, routes, fixtures, or UI changes were made in
this session.
