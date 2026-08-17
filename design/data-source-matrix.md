# Situm Explore Capability & Data Source Matrix

This is the current capability/status router. Detailed rules live in `ARCHITECTURE.md`, `design/IMPLEMENTATION.md`, `.agents/state.md`, and the active plan.

Plans 017–027 are complete/integrated. Plans 028–032 are the approved, not-yet-implemented native companion roadmap for mobile positioning/navigation/realtime plus web/native handoff.

| Capability | Status / owner |
| --- | --- |
| Email/password auth + registration | Plan 021 |
| Google OAuth plumbing | Plan 021; manual runtime acceptance deferred |
| Private single-owner workspaces | Plan 022 |
| Workspace Situm configuration with verified Read & Write primary and separate Read-only Viewer credentials; server-derived account ID | Plan 022 / Plan 025 |
| Correlation, telemetry reuse, safe error contract | Plan 023 |
| Workspace-scoped Situm backend/account/building context | Plan 024 |
| Workspace UX + full regression | Plan 025 |
| Viewer lifecycle | Implemented on web; desktop/tablet web remains target, phone-native handoff planned in Plan 032 |
| Buildings/Floors/POIs/Categories | Implemented on web/workspace context; native mobile subset planned in Plan 030 |
| Geofences/Paths | Implemented on web/workspace context; native scope only when required/evidenced |
| Static directions between known POIs | Implemented on web; native directions/navigation planned in Plan 030 |
| Realtime operations | Workspace-scoped backend capability exists; product UI is planned native in Plan 031, with all web Realtime entry points handing off in Plan 032 |
| Trajectory | Unresolved/omitted |
| Organization/Users/Groups/Alarms reads | Implemented; migrate workspace context |
| Analytics + CSV | Implemented; make workspace-isolated |
| Legacy pre-workspace analytics rows | Historical/unscoped; do not attribute without evidence/policy |
| Route metrics/steps/geometry/ETA | Unresolved; do not invent |
| Handset positioning/blue dot/live navigation/rerouting | Native-only; planned for the React Native companion in Plan 030, not the Nuxt web runtime |

The current workspace-scoped Situm, Viewer, building, and analytics behavior is fully integrated. Plans 028–032 are additive native-client work, not an unfinished backend migration.

For any new/changed Situm behavior, verify the exact official endpoint/SDK method, installed compatibility, runtime owner, permission semantics, consumed fields/events, and failure behavior. No evidence means unresolved/absent, never fabricated success.
