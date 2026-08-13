# Situm Explore Capability & Data Source Matrix

This is the current capability/status router. Detailed rules live in `ARCHITECTURE.md`, `design/IMPLEMENTATION.md`, `.agents/state.md`, and the active plan.

Plans 017–020 are complete/integrated. Plans 021–025 migrate the working product to DB-backed users and private workspace context.

| Capability | Status / owner |
| --- | --- |
| Email/password auth + registration | Plan 021 |
| Google OAuth plumbing | Plan 021; manual runtime acceptance deferred |
| Private single-owner workspaces | Plan 022 |
| Workspace Situm configuration + `VIEW_ONLY` / `VIEW_WRITE` | Plan 022 |
| Correlation, telemetry reuse, safe error contract | Plan 023 |
| Workspace-scoped Situm backend/account/building context | Plan 024 |
| Workspace UX + full regression | Plan 025 |
| Viewer lifecycle | Implemented; migrate workspace context |
| Buildings/Floors/POIs/Categories | Implemented; migrate workspace context |
| Geofences/Paths | Implemented; migrate workspace context |
| Static directions between known POIs | Implemented; keep Viewer-owned rendering |
| Realtime overlay | Implemented; migrate workspace context |
| Trajectory | Unresolved/omitted |
| Organization/Users/Groups/Alarms reads | Implemented; migrate workspace context |
| Analytics + CSV | Implemented; make workspace-isolated |
| Legacy pre-workspace analytics rows | Historical/unscoped; do not attribute without evidence/policy |
| Route metrics/steps/geometry/ETA | Unresolved; do not invent |
| Handset positioning/blue dot/live navigation/rerouting | Native-only; do not build in this web roadmap |

The current pre-refactor runtime still contains process-global Situm/Viewer/building context. Plans 022–024 migrate that context; old global configuration is not the final target.

For any new/changed Situm behavior, verify the exact official endpoint/SDK method, installed compatibility, runtime owner, permission semantics, consumed fields/events, and failure behavior. No evidence means unresolved/absent, never fabricated success.
