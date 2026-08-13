# Plan 016A Phase 0 — Config Inventory and Gap Check

_Audit only. No runtime code changed._

## 1. Variables declared in `.env.example`

- `NUXT_PUBLIC_APP_URL`
- `DATABASE_URL`
- `NUXT_PUBLIC_SITUM_API_KEY`
- `NUXT_SITUM_READ_API_KEY`
- `NUXT_SITUM_WRITE_API_KEY`
- `NUXT_SITUM_API_KEY` (documented as temporary compatibility)
- `NUXT_PUBLIC_SITUM_BUILDING_ID`
- `NUXT_SESSION_PASSWORD`
- `NUXT_SESSION_COOKIE_SECURE`
- `AUTH_EMAIL`
- `AUTH_PASSWORD_HASH`

## 2. Variables actually referenced in code

Only `nuxt.config.ts` reads `process.env.*` directly; everything downstream consumes `useRuntimeConfig()`.

`nuxt.config.ts` `runtimeConfig` wires:
- `session.password` ← `NUXT_SESSION_PASSWORD`
- `session.cookie.secure` ← `NUXT_SESSION_COOKIE_SECURE`
- `databaseUrl` ← `DATABASE_URL`
- `authEmail` ← `AUTH_EMAIL`
- `authPasswordHash` ← `AUTH_PASSWORD_HASH`
- `situmApiKey` ← `NUXT_SITUM_API_KEY`
- `public.appUrl` ← `NUXT_PUBLIC_APP_URL` (default `http://localhost:3000`)
- `public.situmApiKey` ← `NUXT_PUBLIC_SITUM_API_KEY`
- `public.situmBuildingId` ← `NUXT_PUBLIC_SITUM_BUILDING_ID`

**`NUXT_SITUM_READ_API_KEY` and `NUXT_SITUM_WRITE_API_KEY` are NOT wired into `runtimeConfig` at all** — grep across the repo (excluding docs/plans) finds zero references to them outside `.env.example`, `.agents/memory/decisions.md`, `.agents/state.md`, and `plans/016a-*.md`. No server code reads `config.situmReadApiKey` / `config.situmWriteApiKey` because those `runtimeConfig` keys do not exist yet.

Consumers found:
- `server/db/client.ts` — `config.databaseUrl`
- `drizzle.config.ts` — `process.env.DATABASE_URL` directly (bypasses Nuxt runtimeConfig, expected for drizzle-kit CLI) and `schemaFilter: ['situm_explore']`
- `server/api/auth/login.post.ts` — `config.authEmail`, `config.authPasswordHash`
- `server/integrations/situm/client.ts` — `config.situmApiKey` (private, used for all current Nitro Situm reads)
- `server/api/situm/status.get.ts` — `config.situmApiKey`, `config.public.situmApiKey`, `config.public.situmBuildingId`
- `app/components/situm/SitumViewer.vue` — `config.public.situmApiKey`, `config.public.situmBuildingId`

No consumer of `config.public.appUrl` found anywhere in `app/`, `server/`, or config files besides its own declaration in `nuxt.config.ts`.

## 3. Classification

| Variable | Status |
|---|---|
| `DATABASE_URL` | matches (used in `server/db/client.ts`, `drizzle.config.ts`) |
| `NUXT_PUBLIC_SITUM_API_KEY` | matches (used in `SitumViewer.vue`, `status.get.ts`) |
| `NUXT_PUBLIC_SITUM_BUILDING_ID` | matches (used in `SitumViewer.vue`, `status.get.ts`) |
| `NUXT_SITUM_API_KEY` | matches, but documented as temporary/compat-only — still the *only* private Situm key actually wired into runtime config and used by every current Nitro Situm read path |
| `NUXT_SESSION_PASSWORD` | matches |
| `NUXT_SESSION_COOKIE_SECURE` | matches |
| `AUTH_EMAIL` | matches |
| `AUTH_PASSWORD_HASH` | matches |
| `NUXT_SITUM_READ_API_KEY` | **documented-but-unused** — declared in `.env.example`/decisions/state/plan docs, not wired into `nuxt.config.ts` `runtimeConfig`, not read anywhere in server code |
| `NUXT_SITUM_WRITE_API_KEY` | **documented-but-unused** — same gap as above; also intentionally meant to stay unused until an approved mutation exists, but currently it isn't even plumbed |
| `NUXT_PUBLIC_APP_URL` | **documented-but-unused** — wired into `runtimeConfig.public.appUrl` but no consumer references `config.public.appUrl` anywhere in `app/` or `server/` |

No **used-but-undocumented** variables were found — every `process.env.*` reference in `nuxt.config.ts` and `drizzle.config.ts` has a matching `.env.example` entry.

## 4. `DB_SCHEMA` runtime contract check

`DB_SCHEMA` does not appear anywhere in the codebase (grep for `DB_SCHEMA` across all `.ts` files returns zero matches outside this note). It is not part of `.env.example`, not part of `runtimeConfig`, and not read by any server code. It is **not part of the current runtime contract** — the schema name is hardcoded instead (see §5). If `DB_SCHEMA` is referenced in older plan docs as a stale variable to remove, that reference is already stale/moot since it was never wired in the current codebase.

## 5. Drizzle schema fixed to `situm_explore`

Confirmed. Both:
- `drizzle.config.ts`: `schemaFilter: ['situm_explore']`
- `server/db/schema.ts`: `const app = pgSchema('situm_explore')`

hardcode the schema name literally. There is no environment variable indirection for the schema name anywhere in the current code.

## 6. `NUXT_PUBLIC_APP_URL` consumer check

No real current consumer. It is declared in `.env.example`, wired through to `runtimeConfig.public.appUrl` in `nuxt.config.ts`, but nothing in `app/` or `server/` reads `config.public.appUrl` (or `useRuntimeConfig().public.appUrl`). Recommendation for Phase 1/2: either find/add a real consumer (e.g. for absolute URL generation, redirects, CORS/session config) or remove the variable and its runtimeConfig wiring, and drop it from `.env.example`. This should be an explicit decision made in a later phase, not silently resolved here.

## 7. Config contradictions found (no behavior changed)

1. **Credential-split gap**: `.agents/state.md` and `plans/016a-*.md` describe the target state as already having `NUXT_SITUM_READ_API_KEY` / `NUXT_SITUM_WRITE_API_KEY` as the intended read/write split, with `NUXT_SITUM_API_KEY` as a temporary compatibility variable "until the runtime configuration/client plumbing is migrated." In the actual code, that migration has **not started**: `nuxt.config.ts` has no `situmReadApiKey`/`situmWriteApiKey` runtimeConfig keys at all, and `server/integrations/situm/client.ts` + `server/api/situm/status.get.ts` still read only `config.situmApiKey` (backed by `NUXT_SITUM_API_KEY`). This matches Plan 016A's own unchecked checklist items (`add private runtime config for NUXT_SITUM_READ_API_KEY`, etc. are still `- [ ]`), so it is expected/pending work, not a surprise — but confirmed here as the concrete current gap Phase 1/2 must close.
2. **`NUXT_PUBLIC_APP_URL` orphaned**: declared, defaulted, and plumbed into public runtime config, but has no consumer. Either dead config or a missing integration point (see §6).
3. **`DB_SCHEMA` referenced in prior planning language** (per Plan 016A's stated scope in `.agents/state.md` item 4, "including stale variables such as `DB_SCHEMA`") but not present anywhere in `.env.example` or code today — so there is nothing to remove at the `.env.example`/runtime level; the schema name is hardcoded (§5). If any historical doc still instructs someone to set `DB_SCHEMA`, that instruction is stale and should be corrected/ignored rather than acted upon as a code change.

## Summary for Phase 1/2 workers

- Add `situmReadApiKey` / `situmWriteApiKey` to `runtimeConfig` in `nuxt.config.ts`, sourced from `NUXT_SITUM_READ_API_KEY` / `NUXT_SITUM_WRITE_API_KEY`.
- Migrate `server/integrations/situm/client.ts` (and any other private-key consumers, currently just `status.get.ts`) from `config.situmApiKey` to `config.situmReadApiKey` for read paths.
- Decide and act on `NUXT_PUBLIC_APP_URL`: find a real consumer or remove it.
- No action needed for `DB_SCHEMA` — it does not exist in current runtime contract or `.env.example`.
- Drizzle schema name `situm_explore` is intentionally hardcoded in two places (`drizzle.config.ts`, `server/db/schema.ts`); this is consistent, not a contradiction.
