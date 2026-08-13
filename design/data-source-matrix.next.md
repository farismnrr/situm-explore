# Situm Explore Capability & Data Source Matrix

This is the current product/capability authority for Situm Explore.

Plans 017–020 are complete/integrated. Plans 021–025 change application identity, workspace ownership, credential scope, observability/error handling, and multi-workspace behavior. They do not authorize speculative Situm capabilities.

## Classification

- **WEB / PRODUCT** — owned by Situm Explore itself.
- **WEB / SITUM** — backed by verified Situm REST/Viewer behavior.
- **IMPLEMENTED** — integrated real behavior exists in the current baseline.
- **MIGRATE 021–025** — real baseline behavior exists but must move to the new identity/workspace/error architecture.
- **UNRESOLVED** — material evidence remains incomplete; keep absent/unclaimed.
- **NATIVE-ONLY** — belongs to a device/native positioning runtime, not this Nuxt web app.
- **REMOVE** — intentionally absent; do not reintroduce without new explicit scope.

This matrix is not an endpoint specification. External Situm behavior still requires exact official/current contract verification and installed-SDK compatibility where relevant.

## Application identity / tenancy

| Capability | Classification | Current/target owner | Decision |
| --- | --- | --- | --- |
| Email/password login/session/logout | WEB / PRODUCT, MIGRATE 021 | current env auth -> PostgreSQL users + Nuxt sealed session | Replace env-defined owner authority with stable DB user identity |
| Self-service registration | WEB / PRODUCT, Plan 021 | PostgreSQL users | Implement real `/register` |
| Google OAuth | WEB / PRODUCT, Plan 021 | provider identity + Nuxt auth utility | Prepare schema/provider/config; runtime acceptance remains manual/user-owned |
| App route/API protection | WEB / PRODUCT, IMPLEMENTED/MIGRATE 021 | Nuxt middleware + server session guards | Keep server-side enforcement; session references DB user |
| Private workspaces | WEB / PRODUCT, Plan 022 | PostgreSQL | One owner, many workspaces; no invites/members |
| Workspace switching | WEB / PRODUCT, Plans 022/025 | app state + server ownership | Active product context changes by owned workspace |
| Workspace Situm configuration | WEB / PRODUCT, Plan 022 | protected PostgreSQL server data | Write-only secret input; safe metadata/status output |
| Workspace permission mode | WEB / PRODUCT, Plans 022/025 | `VIEW_ONLY` / `VIEW_WRITE` + upstream truth | Local UX/enforcement never overrides real upstream authorization |

## Situm context transition

| Capability | Classification | Decision |
| --- | --- | --- |
| Global Viewer credential | legacy pre-refactor runtime | Migrate away as final authority; stored workspace credential must not be exposed to browser |
| Global Nitro Situm credential | legacy pre-refactor runtime | Migrate server operations to per-workspace context |
| Global public building ID | legacy pre-refactor runtime | Cannot remain authoritative across workspaces; migrate account/building context |
| Browser Viewer authentication | WEB / SITUM, MIGRATE 022/024 | Verify installed SDK/current official auth contract; prefer short-lived least-privilege auth |
| Situm permission discovery | WEB / SITUM, evidence-gated | Non-destructive validation only; do not mutate merely to test write permission |

## Existing Situm product capabilities

| Surface / capability | Classification | Current source / migration owner | Decision |
| --- | --- | --- | --- |
| Map Viewer lifecycle | WEB / SITUM, IMPLEMENTED/MIGRATE | `SitumViewer.vue`; Plans 022/024 | Keep one Viewer owner; migrate auth/account/building context |
| Buildings / Floors | WEB / SITUM, IMPLEMENTED/MIGRATE | Nitro cartography; Plan 024 | Keep real behavior, resolve by owned workspace |
| POIs / Categories | WEB / SITUM, IMPLEMENTED/MIGRATE | Nitro cartography; Plan 024 | Keep real behavior, workspace-scope requests |
| POI search/selection | WEB / SITUM, IMPLEMENTED | Viewer/cartography | Keep verified behavior |
| Geofence definitions | WEB / SITUM, IMPLEMENTED/MIGRATE | Nitro; Plan 024 | Keep and workspace-scope |
| Path metadata | WEB / SITUM, IMPLEMENTED/MIGRATE | Nitro; Plan 024 | Keep and workspace-scope |
| Static directions between known POIs | WEB / SITUM, IMPLEMENTED/MIGRATE | Viewer; Plans 019A/020 -> 024 context | Keep numeric POI endpoint contract and Viewer-owned rendering |
| Route accessibility option | WEB / SITUM, IMPLEMENTED | Viewer verified enum behavior | Keep conservative failure messaging |
| Route distance/duration/steps/geometry/ETA | UNRESOLVED | no reliable product contract | Do not invent |
| Realtime positions server read | WEB / SITUM, IMPLEMENTED/MIGRATE | Nitro; Plan 024 | Keep real behavior, resolve per workspace |
| Realtime Viewer overlay | WEB / SITUM, IMPLEMENTED/MIGRATE | Viewer; Plan 024 context | Keep real overlay/cleanup behavior |
| Trajectory playback | UNRESOLVED | incomplete hydrated semantics | Keep omitted until exact evidence exists |
| Organization safe summary | WEB / SITUM, IMPLEMENTED/MIGRATE | Nitro; Plan 024 | Keep read behavior, workspace-scope |
| Situm users read-only | WEB / SITUM, IMPLEMENTED/MIGRATE | Nitro; Plan 024 | Keep verified read fields only |
| Groups read-only | WEB / SITUM, IMPLEMENTED/MIGRATE | Nitro; Plan 024 | Keep verified list/filter fields; no invented membership semantics |
| Alarms read-only | WEB / SITUM, IMPLEMENTED/MIGRATE | Nitro; Plan 024 | Keep verified list/detail/filter behavior |
| Alarm mutations/confirmation/closure | REMOVE unless newly approved | no current owner | Do not add |
| Existing verified product mutations | WEB / SITUM where current code proves them | Plan 024 migration + Plan 025 permission UX | Retain only already verified scenarios; `VIEW_ONLY` must not present false success |

## Analytics

| Capability | Classification | Current source / migration owner | Decision |
| --- | --- | --- | --- |
| Visitors report | WEB / SITUM, IMPLEMENTED/MIGRATE | Situm Reports -> ClickHouse; Plan 024 | Workspace-isolate storage/query/sync identity |
| Positioning time | WEB / SITUM, IMPLEMENTED/MIGRATE | Situm Reports -> ClickHouse; Plan 024 | Workspace-isolate |
| Geofence stay time | WEB / SITUM, IMPLEMENTED/MIGRATE | Situm Reports -> ClickHouse; Plan 024 | Workspace-isolate |
| CSV export | WEB / PRODUCT, IMPLEMENTED/MIGRATE | ClickHouse-backed API | Export only workspace-authorized data |
| Legacy pre-workspace analytics rows | historical unscoped data | existing ClickHouse | Do not assign arbitrarily; exclude from workspace reads unless attribution is proven |
| Heatmap / Viewer usage metrics | UNRESOLVED unless current code/evidence proves otherwise | future evidence | Do not expand during backend migration |

## Observability / errors

| Capability | Classification | Owner | Decision |
| --- | --- | --- | --- |
| Browser -> Nitro correlation | WEB / PRODUCT, Plan 023 | frontend + Nitro | Use standard context supported by existing stack |
| Nitro/downstream tracing | WEB / PRODUCT, Plan 023 | existing observability stack | Reuse discovered stack; no duplicate containers by assumption |
| Structured server diagnostics | WEB / PRODUCT, Plan 023 | server observability | Redact sensitive data |
| Safe client error contract | WEB / PRODUCT, Plans 023–025 | Nitro + UI | Validation/auth/forbidden/etc. are safe; critical/internal details stay server-side |
| Support/reference ID | WEB / PRODUCT, Plan 023/025 | correlation layer | May be shown for unexpected failures when useful |

## Web/native boundary

| Capability | Classification | Decision |
| --- | --- | --- |
| Browser `My location` as indoor positioned handset | NATIVE-ONLY | Do not build in this web roadmap |
| Sensor-generated blue dot | NATIVE-ONLY | Do not build |
| Handset live turn-by-turn navigation | NATIVE-ONLY | Do not build |
| Movement-aware rerouting | NATIVE-ONLY | Do not build |
| Monitoring positions produced by devices | WEB / SITUM | Keep verified realtime behavior |
| Static map directions between known points | WEB / SITUM | Keep verified static directions |
| Save car / flight / generic developer controls | REMOVE | Do not restore without explicit new product scope |

## Evidence record requirement

Before a new/changed Situm capability is implemented, record as applicable:

```text
capability
exact endpoint or SDK method
official/current source
installed SDK compatibility
browser Viewer vs authenticated Nitro owner
auth/permission semantics
request/filter inputs consumed
response/event fields consumed
error/empty/stale/runtime semantics
active plan owner
```

Missing material evidence means the capability stays unresolved/absent.

## Plans 021–025 final target

After Plan 025 closeout:

- app identity is DB-backed;
- workspace ownership is server-authoritative;
- Situm configuration is protected workspace-owned server data;
- no long-lived stored workspace credential is public/browser-visible;
- Situm/account/building context is workspace-scoped;
- analytics is workspace-isolated;
- permission-aware UX is truthful;
- client errors are sanitized and critical diagnostics are traceable server-side;
- this matrix is reconciled again to remove migration labels that are no longer needed.