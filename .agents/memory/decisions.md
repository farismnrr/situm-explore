# Decisions

## 2026-08-12 — Repo-native persistence foundation

- Keep root `AGENTS.md` concise and use it as a router into `.agents/`.
- Treat `.agents/` as the canonical persistent context directory for agent state/memory/protocols.
- Require a persistence pass at the end of every conversation.
- Create a concise session trace for every conversation.
- Update durable stores selectively to avoid memory noise and duplication.

Status: active.

## 2026-08-12 — UI visual baseline

- Use Nuxt UI v4 semantic aliases with a restrained blue primary and zinc neutral palette; keep success, info, warning, and error semantic.
- Use Nuxt UI semantic text, background, and border utilities as the shared surface language instead of a parallel hard-coded palette.
- Preserve the existing/system sans font stack.
- The earlier top-bar-only / no-sidebar conclusion from Plan 003 is no longer authoritative.

Status: superseded by the canonical interactive UI reference for composition/information architecture; reusable token lessons may remain where they match the populated reference.

## 2026-08-12 — Web foundation implementation

- Use `nuxt-auth-utils` for sealed sessions and its scrypt password utilities; the first slice authenticates one configured owner credential rather than introducing account management.
- Use `@situm/sdk-js` Map Viewer in the browser with the current POC Situm API-key configuration.
- Drizzle owns only the fixed `situm_explore` PostgreSQL schema and its application-owned tables.

Status: active.

## 2026-08-12 — Initial web architecture

- Build web first; native/mobile is explicitly deferred.
- Use a single full-stack Nuxt application for frontend and backend to minimize operational complexity.
- Keep backend routes and server logic inside Nuxt/Nitro rather than introducing a separate backend service.
- Use Nuxt UI for UI primitives.
- Integrate Situm on the web first using environment-based configuration; do not commit real credentials.
- Reuse the existing PostgreSQL database, but isolate Situm Explore in its dedicated PostgreSQL schema.
- Codex must inspect the existing database before applying migrations and must not modify unrelated schemas/tables.
- Use Drizzle ORM for application-owned database access and migrations.
- Use a maintained Nuxt-oriented auth module/plugin rather than building custom authentication infrastructure.
- Avoid premature architecture: no monorepo, microservices, queues, separate API app, or native layer until requirements justify them.

Status: active, refined by the Nuxt 4 architecture contract below.

## 2026-08-12 — Git execution workflow

- Every plan must be implemented on its own dedicated `plan/<number>-<slug>` branch.
- Use the normal repository working directory. Linked Git worktrees are no longer required and should not be created unless the user explicitly requests them.
- New plan work should start from the latest fetched `origin/main` unless an explicit dependency requires another base.
- Never implement a plan directly on `main`.
- Every completed implementation phase must update the plan and relevant `.agents/` persistence first, then be validated, committed, and pushed to the plan branch.
- Pull requests are user-gated: pushing a plan branch must never automatically create a PR, including a draft PR.
- CI is intentionally deferred for now.
- Unit tests/test-runner infrastructure are intentionally deferred for now to avoid premature complexity.
- Nuxt lint is mandatory for code-changing phases and must pass before commit/push.
- Avoid force-push/destructive Git operations as normal workflow; preserve small, reviewable, phase-scoped history.

Status: active.

## 2026-08-12 — Foundation hardening before product work

- One narrow hardening plan was completed before further product/UI work.
- Hardening addressed public-resource exposure policy, least-privilege Situm browser credentials, reproducible Nuxt ESLint setup, truthful Situm viewer readiness, fixed `situm_explore` schema ownership, and stale completed-plan checklist state.
- Manual authenticated/API and Situm browser checks were confirmed complete by the user after integration.

Status: complete; the later POC credential decision below intentionally relaxes the earlier least-privilege setup for speed.

## 2026-08-12 — UI/UX design direction

- Target a clean minimalist SaaS visual language with light mode only.
- Keep Nuxt UI as the design/component foundation rather than creating a parallel custom design system.
- Root `DESIGN.md` is the single design router. Do not recreate `.agents/design/` or another parallel design-guidance tree.
- Preserve working auth, PostgreSQL, and Situm behavior during UI work.

Status: active.

## 2026-08-12 — Canonical UI reference and rebuild roadmap

- Plan 003 was closed because its rendered UI was too far from the user's expectation; closing/merging it did not mean that visual direction was accepted.
- `design/reference/situm-explore-interactive-prototype.html` is the **only** HTML visual/interaction reference.
- The user will manually replace that file's placeholder content with the approved prototype.
- While the file still contains only placeholder content such as `Hello World`, AI must not infer, reconstruct, or implement the intended UI from memory or generic references.
- The populated HTML is visual/interaction intent only; production must translate it into Nuxt/Vue/Nuxt UI rather than copying raw HTML/CSS/JS architecture.
- `DESIGN.md` is the design router; `design/IMPLEMENTATION.md` is the Nuxt translation contract; `design/data-source-matrix.md` defines real-vs-dummy boundaries.
- Plans 004–009 implement the approved UI first. Existing integrations stay real; missing product domains use typed local dummy data so UI scope does not expand the backend.
- During UI-first work, keep real: login/session/logout, auth middleware, `/api/me`, PostgreSQL behavior, `/api/situm/status` configuration semantics, and the existing Situm Viewer `MAP_IS_READY` / `APP_ERROR` lifecycle.
- During UI-first work, keep dummy/local: registration, business metrics, cartography lists not yet exposed by the app, route previews around the viewer, realtime, reports/analytics, alarms, organization/users, and viewer settings not already wired.
- Additional Situm backend/API integrations happen only after Plans 004–009 are complete and manually accepted, in later dedicated plans.

Status: active.

## 2026-08-12 — Nuxt 4 layered architecture contract

- Root `ARCHITECTURE.md` is the single application architecture/folder/dependency contract and is mandatory reading for implementation work.
- Use Nuxt 4's native split: Vue application code under `app/`; Nitro/server code under root `server/`; genuinely cross-runtime types/pure helpers under root `shared/`.
- Apply layered architecture lightly: presentation -> client coordination -> HTTP transport -> application service only when needed -> DB/external integrations.
- Pages stay route/composition focused; composables own reusable reactive coordination; API handlers own transport concerns; DB/external integration code remains server-only.
- KISS is the default tie-breaker. SOLID is applied to real responsibilities/dependencies, and DRY follows proven repetition rather than speculative abstraction.
- Do not create generic repositories/services, DI containers, Pinia stores, Nuxt layers, generic API clients, or empty architecture folders without a concrete current requirement.
- Plan 004 Phase 0 performs the one-time migration from the current backwards-compatible root Vue structure into Nuxt 4 `app/` before the UI surface expands. Existing URLs/auth/DB/Situm behavior must remain unchanged during that migration.

Status: active.

## 2026-08-12 — Time-boxed Situm POC credential and discovery

- Use one environment variable, `NUXT_PUBLIC_SITUM_API_KEY`, for the Situm POC credential.
- The user may provision that one key with Read & Write permission to maximize implementation speed during the POC; revoke or replace it after the POC.
- Plans 004–009 remain UI-first and dummy-first for missing product domains despite the broader key permission.
- If `NUXT_PUBLIC_SITUM_BUILDING_ID` is missing locally, the agent may discover accessible buildings via `GET https://api.situm.com/api/v1/buildings` with the `X-API-KEY` header and write only the selected building ID to ignored local `.env`.
- Backend/API integrations that use broader Situm capabilities belong in later dedicated plans after UI acceptance, not inside the UI roadmap.

Status: active.
