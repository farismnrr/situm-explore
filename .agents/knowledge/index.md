# Knowledge Index

This store contains reusable concepts, references, frameworks, and domain knowledge learned through work with the user.

Do not place user-specific facts here; those belong in `../memory/`.

## Current knowledge

### Situm Explore building resources

- Local building floorplan resources and related Situm identifiers were removed from the repository current tree after the user decided they must not remain publicly distributed.
- Historical Git blobs may still exist; do not restore/recommit those assets without a new explicit user decision.
- A missing local `NUXT_PUBLIC_SITUM_BUILDING_ID` may be resolved from the official Buildings REST listing using the local API key, with the selected ID written only to ignored local `.env`.

Source: repository history and current POC setup decision, 2026-08-12.

### PostgreSQL application boundary

- Situm Explore uses the shared PostgreSQL runtime through `DATABASE_URL`.
- Application-owned Drizzle objects are fixed to the dedicated `situm_explore` schema.
- The earlier resource-gathering observation that `situm_explore` was only an available schema candidate is historical; subsequent foundation work created/applied the application migration and verified `/api/me` against PostgreSQL.
- Do not introduce `DB_SCHEMA` variability or touch unrelated databases/schemas.

Source: foundation implementation/hardening and manual verification on 2026-08-12.

### Situm browser/API credential boundary for the POC

- The official `@situm/sdk-js` browser Viewer initializes `SitumSDK` with `auth.apiKey` and creates a Viewer against a DOM element and building ID.
- Current repository environment naming is `NUXT_PUBLIC_SITUM_API_KEY` plus `NUXT_PUBLIC_SITUM_BUILDING_ID`.
- The time-boxed POC intentionally uses one browser-visible Situm key and the user may provision it with Read & Write permission for speed; revoke/replace it after the POC.
- This broader credential permission does not change Plans 004–009: the existing Viewer lifecycle stays real, while new product-domain Situm integrations remain deferred until after UI acceptance.
- Never persist or print the actual key value in repository context.

Source: installed SDK behavior plus current user/project decision, 2026-08-12.

### UI reference translation boundary

- `design/reference/situm-explore-interactive-prototype.html` is the only visual/interaction reference once the user replaces its placeholder.
- Its HTML/CSS/JS describes UI/UX intent only.
- Production translation must remain Nuxt 4 + Vue + Nuxt UI and follow `ARCHITECTURE.md` / `design/IMPLEMENTATION.md`.
- Plans 004–009 are dummy-first for missing product domains; later integration plans replace selected fixtures after the UI is accepted.

Source: current design/architecture decisions, 2026-08-12.

### Repo-native Codex context pattern

- Keep root `AGENTS.md` concise and navigational rather than turning it into a large encyclopedia.
- Put detailed, maintainable context in structured repository files and let root routers point to them.
- Use targeted reads as the knowledge base grows instead of loading everything on every task.
- Historical plans/session logs are evidence, not higher-priority truth than current durable contracts/state.

Source: repository operating model.

## When this grows

Split substantial topics into dedicated Markdown files and keep this file as the index with short descriptions/links.
