# Situm Explore Capability & Data Source Matrix

This is the current capability/status router. Detailed rules live in `ARCHITECTURE.md`, `design/IMPLEMENTATION.md`, `.agents/state.md`, and any explicitly active future plan.

Plans 017–035 are closed/integrated. Plan 034 retains historical documented acceptance limitations; Plan 035 subsequently verified the physical own-device positioning/server-mediated Realtime path required by its bounded remediation scope. There is no active native roadmap plan.

| Capability | Status / owner |
| --- | --- |
| Email/password auth + registration | Plan 021 |
| Google OAuth plumbing | Plan 021; manual runtime acceptance deferred |
| Private single-owner workspaces | Plan 022 |
| Workspace Situm configuration with verified Read & Write primary and separate Read-only Viewer credentials; server-derived account ID | Plan 022 / Plan 025 |
| Correlation, telemetry reuse, safe error contract | Plan 023 |
| Workspace-scoped Situm backend/account/building context | Plan 024 |
| Workspace UX + full regression | Plan 025 |
| Viewer lifecycle | Implemented on web for ≥768×600 capable layouts; shorter/phone web layouts hand off to native. Historical unexercised cross-client cases remain documented in Plan 034 evidence. |
| Buildings/Floors/POIs/Categories | Implemented on web/workspace context and native mobile Map in Plan 030; historical physical acceptance limitations remain recorded in Plan 034 evidence. |
| Geofences/Paths | Implemented on web/workspace context; native scope only when required/evidenced |
| Static directions between known POIs | Implemented on web; native directions/navigation implemented in Plan 030. Any still-unexercised physical navigation cases remain historical Plan 034 limitations. |
| Realtime operations | Implemented in the native companion as a server-mediated workspace-scoped device-position list/detail experience; generic remote MapView markers and Share Live Location are not used; all web entry points hand off through the shared native gate. Plan 035 physically verified own-device positioning publishing and server-mediated Realtime rendering on the POS. |
| Trajectory | Unresolved/omitted |
| Organization/Users/Groups/Alarms reads | Implemented; migrate workspace context |
| Analytics + CSV | Implemented; make workspace-isolated |
| Legacy pre-workspace analytics rows | Historical/unscoped; do not attribute without evidence/policy |
| Route metrics/steps/geometry/ETA | Unresolved; do not invent |
| Handset positioning/blue dot/live navigation/rerouting | Native-only; implemented in Plan 030. Plan 035 physically verified sensor-backed positioning and Explore ↔ Realtime continuity on the POS; broader historical navigation/floor-transition acceptance limitations remain in Plan 034 evidence. |

The current workspace-scoped Situm, Viewer, building, analytics, native Map, native Realtime and web/native handoff behavior is integrated. Plans 033–035 are closed; historical Plan 034 limitations remain evidence, not active execution scope.

For any new/changed Situm behavior, verify the exact official endpoint/SDK method, installed compatibility, runtime owner, permission semantics, consumed fields/events, and failure behavior. No evidence means unresolved/absent, never fabricated success.
