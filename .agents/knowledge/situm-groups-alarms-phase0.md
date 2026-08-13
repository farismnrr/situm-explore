# Situm Groups & Alarms — Plan 018 Phase 0

Source: official Situm REST OpenAPI at https://developers.situm.com/pages/rest/openapi/ and safe authenticated probes on 2026-08-13. No credentials or raw payloads are stored.

## Groups

- `GET /api/v1/groups` returns an array of groups.
- Documented filter: `has_parent` boolean.
- Documented fields: `id`, `uuid`, `name`, `organization_id`, `parent_group_id`, `icon_colour`, `is_staff`.
- No documented group detail, membership, pagination, or user/device relationship endpoint.
- Live: HTTP 200, one group overall; HTTP 200, zero groups for `has_parent=true`.
- Membership display is unresolved. Do not infer membership from names or IDs.

## Alarms

- `GET /api/v1/alarms` returns an array; `GET /api/v1/alarms/{id}` returns an alarm or HTTP 404.
- Documented filters: `organization_id`, `building_id`, `active`, `type`, `startDate`, `endDate`, `created_by`, `secondsFromCreation`. The OpenAPI marks `building_id` required despite describing it as optional; live omission was accepted with HTTP 200 and an empty array. No pagination parameters are documented.
- Stable fields: `uuid`, coordinates (`x`, `y`, `lat`, `lng`), `building_id`, `floor_id`, `outside`, `inside`, `created_at`, `updated_at`, `type`, `status_changes`, `active`, `current_state`, `custom_fields`. `chat_room` is deprecated.
- Types: `BREACH`, `DANGER`, `DEADMAN`, `EMERGENCY`, `STATIONARY`, `GEOFENCE_MAX_STAY_TIME`, `ASSISTANCE_REQUEST`; official prose marks BREACH, EMERGENCY, and STATIONARY as do-not-use/deprecated. States include `OPEN`, `CLOSED`, `CONFIRMED`, `MARKED_FALSE`, `OTHER` (the schema for `current_state` omits OPEN although the prose says OPEN is the initial state).
- Live: configured building list and `active=true` filter both returned HTTP 200 empty arrays. Nonexistent UUID detail returned HTTP 404 with an error object. No mutation was attempted.

## Access and SDK

- Official OpenAPI documents authenticated access and list errors `401/403/422/500`; detail adds `404`.
- Installed `@situm/sdk-js` exposes no Groups or Alarms wrapper in its declarations; this does not disprove REST support. Direct authenticated Nitro REST is the verified path.
- Existing users response exposes `group_ids` and `groups` fields upstream, but relationship presentation remains unapproved until explicitly mapped and verified.
