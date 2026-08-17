# Situm Explore Capability & Data Source Matrix

This is the current capability/status router. Detailed rules live in `ARCHITECTURE.md`, `design/IMPLEMENTATION.md`, `.agents/state.md`, and the active plan.

Plans 017–031 are complete/integrated. Plan 032 implementation is complete pending integration; Plan 033 owns consolidated full E2E acceptance and roadmap closeout.

| Capability | Status / owner |
| --- | --- |
| Email/password auth + registration | Plan 021 |
| Google OAuth plumbing | Plan 021; manual runtime acceptance deferred |
| Private single-owner workspaces | Plan 022 |
| Workspace Situm configuration with verified Read & Write primary and separate Read-only Viewer credentials; server-derived account ID | Plan 022 / Plan 025 |
| Correlation, telemetry reuse, safe error contract | Plan 023 |
| Workspace-scoped Situm backend/account/building context | Plan 024 |
| Workspace UX + full regression | Plan 025 |
| Viewer lifecycle | Implemented on web for ≥768×600 capable layouts; shorter/phone web layouts hand off to native; cross-client acceptance remains Plan 033 |
| Buildings/Floors/POIs/Categories | Implemented on web/workspace context and native mobile Map in Plan 030; real-device acceptance remains Plan 033 |
| Geofences/Paths | Implemented on web/workspace context; native scope only when required/evidenced |
| Static directions between known POIs | Implemented on web; native directions/navigation implemented in Plan 030 with physical-device acceptance remaining in Plan 033 |
| Realtime operations | Implemented in the native companion as a server-mediated workspace-scoped device-position list/detail experience; generic remote MapView markers and Share Live Location are not used; all web entry points hand off through the shared native gate; cross-client acceptance remains Plan 033 |
| Trajectory | Unresolved/omitted |
| Organization/Users/Groups/Alarms reads | Implemented; migrate workspace context |
| Analytics + CSV | Implemented; make workspace-isolated |
| Legacy pre-workspace analytics rows | Historical/unscoped; do not attribute without evidence/policy |
| Route metrics/steps/geometry/ETA | Unresolved; do not invent |
| Handset positioning/blue dot/live navigation/rerouting | Native-only; implemented in Plan 030 with real supported-device acceptance still unpassed and owned by Plan 033 |

The current workspace-scoped Situm, Viewer, building, analytics, native Map and native Realtime behavior is integrated. Plans 032–033 finish handoff/distribution and full E2E acceptance; they are not an unfinished backend migration.

For any new/changed Situm behavior, verify the exact official endpoint/SDK method, installed compatibility, runtime owner, permission semantics, consumed fields/events, and failure behavior. No evidence means unresolved/absent, never fabricated success.
