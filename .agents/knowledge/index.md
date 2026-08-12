# Knowledge Index

This store contains reusable concepts, references, frameworks, and domain knowledge learned through work with the user.

Do not place user-specific facts here; those belong in `../memory/`.

## Current knowledge

### Situm Explore building resource discovery

- Situm discovery mapped local slug `building-1422` to building `19866` (`PT Berjaya Inovasi Global`), with floors `69904` (`lt 1`) and `69905` (`lt 2`). Local JPEGs remain reference assets pending cartography comparison.

Source: observed from Situm API discovery during resource gathering on 2026-08-12.

### Shared PostgreSQL runtime

- The local shared PostgreSQL runtime is defined in `/home/farismnrr/Documents/shared/docker-compose.shared-infra.yml` and runs as container `sensio-postgres` on host port `5432`.
- The instance is PostgreSQL 17.10 with existing databases including `atja_db`, `bnsp`, `keycloak`, `lms`, `masihawam`, `plane`, `plane_preview`, `sensio-iot`, `sensio-notes`, `tuya_manager`, and `postgres`.
- Existing schemas include `public`, TimescaleDB schemas, `broker-auth`, `drizzle`, and `sensio_notes_drizzle`; `situm_explore` is not currently present and is available as the dedicated application schema candidate.

Source: observed from the local Compose file, running container, and read-only PostgreSQL inspection on 2026-08-12.

### Situm web SDK credential boundary

- The installed official `@situm/sdk-js` browser integration initializes `SitumSDK` with `auth.apiKey` and creates a viewer against a DOM element and building ID. This means the chosen web slice must use a clearly named public browser credential rather than pretending a server-only key can initialize the browser SDK.

Source: observed in the installed SDK README during web-foundation implementation on 2026-08-12.

### Repo-native Codex context pattern

- Keep root `AGENTS.md` concise and navigational rather than turning it into a large encyclopedia.
- Put detailed, maintainable context in a structured repository directory and let `AGENTS.md` point to it.
- Use targeted reads as the knowledge base grows instead of loading everything on every task.

Source: project design informed by current Codex guidance and this repository's chosen architecture.

## When this grows

Split substantial topics into dedicated Markdown files and keep this file as the index with one-line descriptions and links.
