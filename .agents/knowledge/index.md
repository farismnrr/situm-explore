# Knowledge Index

This store contains reusable verified concepts/references/frameworks learned through work with the user.

Do not place user-specific facts here; those belong in `../memory/`.

Current durable decisions override stale knowledge entries. Historical observations should be explicitly labeled historical.

## Current knowledge

### Situm Explore building resources

- Local building floorplan resources and related Situm identifiers were removed from the public repository tree after the user decided they must not remain publicly distributed.
- Historical Git blobs may still exist; do not restore/recommit those assets without a new explicit user decision.
- `NUXT_PUBLIC_SITUM_BUILDING_ID` is an identifier, not a credential, and may remain public when required by the browser Viewer.
- Building discovery/auth mechanics must follow the current Plan 010 credential contract rather than historical setup snippets when those conflict.

Source: repository history + current Plan 010 boundary, reviewed 2026-08-13.

### PostgreSQL application boundary

- Situm Explore uses the shared PostgreSQL runtime through `DATABASE_URL`.
- Application-owned Drizzle objects are fixed to the dedicated `situm_explore` schema.
- Do not introduce `DB_SCHEMA` variability or touch unrelated databases/schemas.
- External Situm data is not automatically persisted/cached in PostgreSQL; new persistence requires a concrete app-owned requirement.

Source: foundation implementation/hardening + current architecture contract.

### Situm credential/runtime boundary

- The accepted baseline historically initializes the browser Viewer from `NUXT_PUBLIC_SITUM_API_KEY`; this is legacy POC behavior, not the future REST integration contract.
- New Situm REST/domain integrations use private Nitro runtime credentials behind authenticated product routes.
- The server REST credential must never be exposed through public runtime config or browser code.
- Browser Viewer authentication is a separate integration boundary and must be verified against current official Situm documentation/source and the installed `@situm/sdk-js` version before migration.
- Never persist or print actual key/JWT/token values.

Source: current Plan 010, architecture, and durable security decision, reviewed 2026-08-13.

### Situm web vs native boundary

- The Nuxt web app is an operations/admin/exploration client, not the device positioning engine.
- Web may consume realtime locations produced by positioned devices and may use verified browser Viewer behavior.
- Sensor-generated indoor blue dot, positioning permission/runtime management, and movement-aware navigation/rerouting belong to a future native/mobile roadmap.
- A UI label or prototype interaction does not prove that a capability exists on web.

Source: Plan 010 capability review, 2026-08-13.

### Situm external evidence rule

- Model recollection, prototype labels, fixture shapes, and historical plans are not implementation evidence.
- Before coding a Situm capability, verify exact current official endpoint/SDK method, web/native availability, browser/server owner, auth/permission, and fields/events consumed.
- Installed SDK compatibility matters for Viewer methods.
- Missing material evidence means `UNRESOLVED`; do not guess or fabricate a successful fallback.

Source: current Plan 010 execution contract, 2026-08-13.

### UI reference translation boundary

- `design/reference/situm-explore-interactive-prototype.html` remains the single visual/interaction reference.
- Production remains Nuxt 4 + Vue + Nuxt UI.
- Visual fidelity and capability truth are separate: Plan 010 may remove native-only/fake/unsupported controls even when they exist in the prototype.
- Current capability/data truth lives in `design/data-source-matrix.md` + active plan, not historical UI plans.

Source: current design contracts, reviewed 2026-08-13.

### Repo-native Codex context pattern

- Keep root `AGENTS.md` concise and navigational.
- Put current detailed context in maintainable structured files.
- Use targeted reads as context grows.
- Historical plans/session logs are evidence, not higher-priority truth than current durable contracts/state.
- Current architecture docs must describe current structure, not completed migration instructions.

Source: repository operating model.

## When this grows

Split substantial verified topics into dedicated Markdown files and keep this file as an index with short descriptions/links.