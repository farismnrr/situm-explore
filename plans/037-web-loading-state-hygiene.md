# Plan 037 — Web Loading-State Hygiene

Status: **implementation complete / automated validation passed / not yet integrated**

Branch: `plan/037-loading-state-hygiene`

Depends on: current `main` at `82ce275` plus the already-present local workspace changes carried into this branch.

## Objective

Remove transient false empty/error copy from workspace-scoped web surfaces. Data-dependent UI must render a loading skeleton while workspace selection or an `immediate: false` Nuxt request is unresolved, then render empty/error/content only after the relevant request resolves.

## Root cause

Several pages treated only Nuxt `useFetch` status `pending` as loading. Requests configured with `immediate: false` begin in `idle`, so derived arrays and IDs briefly looked empty before watchers started the request. This produced misleading first-frame content such as `0 users`, `Not configured`, `Select a building`, and Map Viewer unavailable/loading text before the intended skeleton.

## Scope

- Add one shared helper defining `idle` and `pending` as unresolved async states.
- Keep workspace-list resolution separate from the legitimate resolved no-workspace state.
- Apply the loading precedence to Home, Dashboard, Buildings, POIs, Geofences, Paths, Alarms, Analytics, Users, Groups, Organization, Workspaces configuration, and browser Map.
- Do not mount the browser `SitumViewer` until workspace cartography resolves to a real building.
- Use a map skeleton while Viewer initialization is unresolved instead of textual loading placeholder copy.
- Preserve real empty, unavailable, no-workspace, and capability states after resolution.
- Preserve unrelated pre-existing workspace changes on this branch.

## Acceptance criteria

- `idle` and `pending` never render data-derived empty/count/configuration states.
- Alarms does not show `Select a building` before cartography loads.
- Map does not show a missing-building Viewer warning before cartography loads.
- Workspace configuration does not show `Not configured` before its read resolves.
- Counts such as users/groups/POIs/buildings/geofences are not presented as zero merely because their request has not started yet.
- True resolved empty/error/no-workspace states remain explicit and truthful.
- Regression coverage protects the shared loading-state contract and the Alarms/Map boundaries.

## Validation

Passed on 2026-08-27:

- `git diff --check`;
- `npm test` — 74/74 passed;
- `npm run lint`;
- `npm run typecheck`;
- `npm run build`.

No production deployment, PR, or merge was performed as part of this request.
