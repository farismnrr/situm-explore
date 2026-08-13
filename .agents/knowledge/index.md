# Knowledge Index

This store contains reusable verified project/domain knowledge. It must not compete with current state or durable decisions.

Current `.agents/state.md`, active durable decisions, roadmap addenda, and the active plan override older observations. Historical findings remain useful only when their scope/date is clear.

## PostgreSQL application boundary

- Situm Explore uses PostgreSQL through `DATABASE_URL`.
- Application-owned Drizzle objects live in the dedicated `situm_explore` schema.
- Do not introduce schema variability or touch unrelated schemas/databases.
- Plans 021–022 add concrete app-owned relational persistence for users, provider identities, workspaces, and protected workspace configuration.
- External Situm resources are not automatically cached in PostgreSQL unless a concrete product requirement owns that persistence.

Source: current architecture + roadmap 021–025.

## Authentication transition

- Current pre-refactor runtime still has an env-defined single-user login.
- Plan 021 replaces that authority with database-backed application users while retaining the sealed Nuxt session mechanism.
- Email/password register/login is required.
- Google OAuth plumbing is prepared in Plan 021, but real provider acceptance is user-owned/manual for now.
- Provider IDs are not application user IDs; app users keep stable application-owned identity.

Source: Plan 021 / roadmap durable decisions.

## Workspace model

- One application user may own many private workspaces.
- A workspace has one owner in Plans 021–025; no invite/member/team tenancy is introduced.
- Different app users may independently configure workspaces that refer to the same external Situm account/organization.
- Situm organization identity is external metadata and must not be treated as application tenancy.

Source: user-approved Plans 021–025 model.

## Situm credential/runtime transition

- The historical baseline uses global Viewer/server Situm environment configuration.
- Plans 021–025 replace that as the final architecture with workspace-managed server-side configuration.
- Stored long-lived workspace credentials must not be returned to browser code.
- Product modes are `VIEW_ONLY` and `VIEW_WRITE`; verified upstream permission remains authoritative.
- Browser Viewer authentication is a separate evidence gate. Current official Situm material supports JWT-based auth, but Plan 022 must verify exact behavior against the installed `@situm/sdk-js` version and the configured account before changing the Viewer path.
- Never persist or print real API key/JWT/token values in repository docs, sessions, logs, or tests.

Source: roadmap 021–025 + current official Situm evidence gate.

## Situm web vs native boundary

- The Nuxt app is an operations/admin/exploration web product, not the device positioning engine.
- Web may consume realtime positions produced by devices and may use verified browser Viewer behavior.
- Sensor-generated indoor blue dot, positioning permission/runtime management, handset live navigation, and movement-aware rerouting remain outside this roadmap.
- UI labels or prototype behavior do not prove Situm capability.

Source: current product boundary.

## Situm external evidence rule

- Model recollection, old plan wording, fixture shapes, and prototype labels are not implementation evidence.
- Verify exact current official endpoint/SDK method, installed-version compatibility, browser/server owner, web/native owner, auth/permission, consumed fields/events, and failure semantics before implementing a new Situm behavior.
- Missing material evidence means `UNRESOLVED`; do not guess or fabricate a successful fallback.

Source: active durable decision.

## Situm SDK JS Viewer evidence

- Installed `@situm/sdk-js` baseline observed in the completed roadmap is version `0.25.0`.
- Existing integrated Viewer work verified realtime overlay and static directions behavior used by the product.
- Trajectory remains unresolved/omitted because full hydrated runtime semantics were not established.
- Static directions remain limited to the verified typed surface; no raw Viewer/generic invoke escape hatch.
- Re-verify installed version/contracts during a future plan when exact SDK behavior materially matters.

Source: completed Plans 019/019A/020 evidence.

## ClickHouse analytics boundary

- Reuse the user's existing local ClickHouse instance; do not provision a second one.
- ClickHouse remains server-side analytics storage; PostgreSQL remains application relational storage.
- Plans 021–025 must make analytics reads/writes workspace-isolated before multi-workspace behavior is complete.
- Legacy pre-workspace rows have no proven owner and must not be assigned to a workspace arbitrarily.

Source: completed Plan 017 + roadmap 021–025.

## Observability discovery rule

- The user already has local observability infrastructure.
- Plan 023 must inspect `docker ps` plus runtime/repository configuration and reuse the existing stack/protocols.
- Do not install duplicate logging/metrics/tracing infrastructure by assumption.
- Correlation/tracing must avoid sensitive values, and detailed internal failures stay server-side.

Source: user-approved Plan 023 direction.

## UI reference translation boundary

- `design/reference/situm-explore-interactive-prototype.html` remains visual/interaction guidance.
- Production remains Nuxt 4 + Vue + Nuxt UI.
- Visual fidelity cannot override current capability/security truth.

Source: current design contract.

## Historical knowledge files

Dedicated knowledge files with an older plan/phase in their title are scoped evidence from that plan. They remain reusable when the exact external contract is still relevant, but they do not reactivate the old roadmap or its execution state.

## When this grows

Split substantial verified topics into focused files and keep this index short enough to act as a router.