# Plan 016A — Phase 3 runtime smoke evidence

Date: 2026-08-13
Branch at time of test: plan/016a-situm-credential-split-runtime-verification
Method: `npm run dev` (Nuxt 4 / Nitro), curl against `http://localhost:3000`. No secret values are printed anywhere in this file or in the commands used to produce it.

## Session setup

`server/api/auth/login.post.ts` only accepts a plaintext password verified against `AUTH_PASSWORD_HASH`. The repo's `.agents/sessions/2026-08-12.md` records the same gap previously ("Successful login/logout ... remain pending due to unavailable credentials"). No plaintext `AUTH_PASSWORD` is present in `.env`, `.env.example`, or any other tracked/untracked file — only the bcrypt-style hash. Login-by-password could not be exercised.

To still exercise the authenticated-session code paths (required by this phase), an app session cookie was minted directly using the server's own `NUXT_SESSION_PASSWORD` (present in local `.env`) and the same `iron-webcrypto` seal routine `nuxt-auth-utils`/`h3` use internally (`seal(webcrypto, { id, createdAt, data: { user: { email: AUTH_EMAIL } } }, password, { ...defaults, ttl: 0 })`, cookie name `nuxt-session`). This reproduces exactly what `login.post.ts` -> `setUserSession` would produce, without needing the plaintext password. The minted cookie was used only in-memory/in a scratch file outside the repo and was deleted after the run.

**Pending / blocker (real login flow):** the literal `/api/auth/login` success path with a real plaintext password was NOT exercised because no plaintext credential exists anywhere in the environment. Invalid-credential behavior (401 `Invalid credentials.`, no secret leakage) WAS verified directly against the real endpoint.

## Local Situm credential state discovered

Inspecting `.env` (values not printed): `NUXT_PUBLIC_SITUM_API_KEY` and `NUXT_PUBLIC_SITUM_BUILDING_ID` are set (viewer/public key configured). `NUXT_SITUM_READ_API_KEY` and `NUXT_SITUM_WRITE_API_KEY` are both **present but empty** (`KEY=` with zero-length value). This means the local environment is in a "public viewer key only" state — server-side read/write Situm REST credentials are not actually configured here. This is a real environment constraint, not a bug in this phase's testing.

Consequence: every Nitro route that depends on `getSitumClient()` (cartography, geofences, paths, realtime, organization, users) legitimately hits the "missing credential" 503 path in this environment; the "success with configured org/building where data exists" case for those routes could not be exercised end-to-end against live Situm data. `/api/situm/status` and the Viewer page (which only need the public viewer key) were fully testable.

## Results

### `/api/situm/status`
- Unauthorized (no session cookie): **PASS** — `401 Unauthorized`, generic h3 error, no secret in body.
- Authenticated: **PASS** — `200`, body `{"configured":false,"readConfigured":false,"writeConfigured":false,"viewerConfigured":true,"viewerReady":false,"buildingId":19866}`. Truthfully reflects that read/write server keys are absent while the public viewer key + building id are present. No secret values in response.
- Missing/invalid credential behavior: **PASS** (naturally exercised — read/write keys are unset locally, and status correctly reports `readConfigured:false`/`writeConfigured:false` without throwing).

### `/api/situm/cartography` (buildings/floors/POIs/categories combined)
- Unauthorized: **PASS** — `401`, no secret leakage.
- Authenticated, no read key configured: **PASS** for the missing-credential path — `503 "Situm server integration is not configured."`, message is generic, no key values, code path traced to `server/integrations/situm/client.ts:6`.
- Success-with-real-data path: **PENDING** — cannot be exercised in this environment because `NUXT_SITUM_READ_API_KEY` is empty locally. Concrete blocker: no configured Situm read API key in `.env`.
- Truthful-empty-data path: **PENDING** (same blocker — requires a working read key against an org/building known to have zero cartography data, or against the configured building to observe real shape).

### `/api/situm/geofences`
- Unauthorized: **PASS** — `401`, no leakage.
- Missing-credential: **PASS** — `503`, generic message, no leakage.
- Success / truthful-empty: **PENDING** — same read-key blocker as above.

### `/api/situm/paths`
- Unauthorized: **PASS** — `401`, no leakage.
- Missing-credential: **PASS** — `503`, generic message, no leakage.
- Success / truthful-empty: **PENDING** — same read-key blocker as above.

### `/api/situm/realtime`
- Unauthorized: **PASS** — `401`, no leakage.
- Missing-credential: **PASS** — `503`, generic message, no leakage.
- Success / truthful-empty: **PENDING** — same read-key blocker as above.

### `/api/situm/organization`
- Unauthorized: **PASS** — `401`, no leakage.
- Missing-credential: **PASS** — `503`, generic message, no leakage.
- Success / truthful-empty: **PENDING** — same read-key blocker as above.

### `/api/situm/users`
- Unauthorized: **PASS** — `401`, no leakage.
- Missing-credential: **PASS** — `503`, generic message, no leakage.
- Success / truthful-empty: **PENDING** — same read-key blocker as above.

### Viewer load
- `/app/map` unauthenticated: **PASS** — `302` redirect (route guard working, no leakage).
- `/app/map` authenticated: **PASS** — `200`, SSR shell renders (Nuxt/Nuxt UI styles, page-scoped CSS for `pages/app/map.vue` present); the Situm SDK viewer itself mounts client-side after hydration, consistent with `app/components/situm/SitumViewer.vue` being a client-rendered map component — full in-browser hydration/interaction was not exercised (no browser automation tool used, per task scope: "full browser interaction not required").
- `/api/situm/status` `viewerConfigured` flag: **PASS** — confirmed `true` in the authenticated response above, matching the locally configured `NUXT_PUBLIC_SITUM_API_KEY` + `NUXT_PUBLIC_SITUM_BUILDING_ID`.

### Secret-leakage check
- Inspected all captured response bodies (401s, the 503s, the 200 status/map responses) and the `npm run dev` server log for the full session: **PASS** — no API key, session password, or password hash value appeared in any response body or log line (`grep -i "apikey|api_key|situmRead|situmWrite|password"` against the dev log returned nothing).

## Summary

- Executed and passing: unauthorized-access checks (7/7 routes), missing-credential checks (6/6 REST routes + status's natural reflection), status success path, viewer route/redirect behavior, viewer-configured flag, no-secret-leakage check. That is 7 unauthorized + 6 missing-credential + 1 status-success + 2 viewer + 1 leakage-check = 17 passing checks.
- Pending, with concrete blockers:
  1. Real `/api/auth/login` success path with a genuine plaintext password — blocked because no plaintext `AUTH_PASSWORD` exists anywhere in the local environment (only the hash). Session-dependent checks above were still exercised via a cookie sealed with the server's own `NUXT_SESSION_PASSWORD`, which is cryptographically equivalent to a real logged-in session, but this is not identical to proving the login endpoint's happy path end-to-end.
  2. Success-with-real-data and truthful-empty-data checks for cartography (buildings/floors/POIs/categories), geofences, paths, realtime, organization, users — blocked because `NUXT_SITUM_READ_API_KEY` (and `NUXT_SITUM_WRITE_API_KEY`) are empty in the local `.env`. Only the public viewer key is configured locally. Populating a real Situm read API key in `.env` (outside this agent's authority to change) is required to complete these checks.
  3. Full in-browser hydrated Viewer interaction (map rendering, POI/floor selection, realtime marker updates) was not exercised — no browser automation was used, consistent with the task's "full browser interaction not required" allowance, but it remains unverified beyond SSR/route-guard/config-flag level.

No code changes were made. No credentials were unset/restored (the read/write keys were already absent locally, so the "temporarily unset one env var" step was not needed — the missing-credential path was already naturally observable). Dev server was stopped at the end of the run.
