# UI / Situm Capability & Data Source Matrix

This is the current product/capability authority for Situm Explore.

Historical Plans 004–009 used prototype fixtures. Plans 010–016A established the real web/native/security boundary and implemented the first verified Situm read/Viewer capabilities. Plans 017–020 continue only the evidence-backed gaps listed below.

## Important: this matrix is not an endpoint spec

The classification below answers **what belongs in the product and which current plan owns it**.

It does not authorize implementation from memory.

Before a Situm row becomes or expands a `WEB / SITUM` capability, the active plan must record exact evidence for:

- official endpoint or Viewer/SDK method;
- official documentation/source reference;
- installed SDK compatibility where relevant;
- web vs native availability;
- browser Viewer vs authenticated Nitro ownership;
- authentication/permission;
- request inputs actually used;
- response/event fields actually consumed;
- read/write semantics;
- relevant error/empty/stale semantics.

Until those are verified, a retained Situm row is product direction, not permission to guess implementation details.

## Classification rules

- **WEB / PRODUCT** — owned by Situm Explore itself; no Situm backing required.
- **WEB / SITUM** — retained web UI with exact verified Situm REST/Viewer backing.
- **IMPLEMENTED** — current real capability already integrated.
- **FOLLOW-UP** — retained capability assigned to Plans 017–020 and still evidence-gated for its new behavior.
- **NATIVE-ONLY** — requires device positioning/sensors/mobile runtime; absent from the web product.
- **REMOVE** — fake, unsupported, redundant, misleading, or low-value for this POC.
- **UNRESOLVED** — exact capability evidence is incomplete; may not be implemented or presented as real until resolved.

## Surface matrix

| Surface / capability | Classification | Current source / owner | Decision |
| --- | --- | --- | --- |
| Landing | WEB / PRODUCT | Static Nuxt | KEEP |
| Login/session/logout | WEB / PRODUCT | Existing auth/session routes | KEEP REAL |
| App route protection | WEB / PRODUCT | Existing auth middleware + server session guards | KEEP REAL |
| PostgreSQL/app status | WEB / PRODUCT | Existing app/server integration | KEEP REAL |
| Global fake `Sync` | REMOVE | No single real sync operation | REMOVED; Plan 017 may add feature-scoped analytics sync only |
| Map Viewer lifecycle | WEB / SITUM, IMPLEMENTED | `SitumViewer` | KEEP REAL; single Viewer owner |
| Buildings / Floors | WEB / SITUM, IMPLEMENTED | Plan 011 Nitro reads + Viewer selection | KEEP REAL |
| POIs / Categories | WEB / SITUM, IMPLEMENTED | Plan 011 | KEEP REAL |
| POI search/selection | WEB / SITUM, IMPLEMENTED where currently verified | Cartography + Viewer | KEEP verified behavior only |
| Geofence definitions | WEB / SITUM, IMPLEMENTED | Plan 012 | KEEP REAL |
| Geofence stay metrics | WEB / SITUM, FOLLOW-UP | Plan 017 Situm Reports -> ClickHouse | IMPLEMENT only exact verified report fields |
| Geofence session metrics | WEB / SITUM, FOLLOW-UP / optional | Plan 017 only if exact product need/contract is retained | KEEP only if verified/practical |
| Path metadata | WEB / SITUM, IMPLEMENTED | Plan 012 | KEEP REAL |
| Static directions between known points/POIs | WEB / SITUM, FOLLOW-UP | Plan 020 Viewer static directions | IMPLEMENT static directions only after exact runtime verification |
| Route type/accessibility options | WEB / SITUM, FOLLOW-UP | Plan 020 Viewer | KEEP exact verified options |
| Route included/excluded tags | WEB / SITUM, FOLLOW-UP / conditional | Plan 020 Viewer | KEEP only if account/cartography + exact contract make them meaningful |
| Browser `My location` as indoor position | NATIVE-ONLY | Future native SDK roadmap | DO NOT BUILD IN WEB |
| Live blue-dot / sensor positioning | NATIVE-ONLY | Future native SDK roadmap | DO NOT BUILD IN WEB |
| Dynamic walking turn-by-turn / reroute from handset position | NATIVE-ONLY | Future native roadmap | DO NOT BUILD IN WEB |
| End-user `Set user location` developer control | REMOVE | Integration/developer concern | DO NOT EXPOSE |
| Save car / navigate to car | REMOVE for current web POC | No current product owner | DO NOT BUILD |
| Remote-person `Follow user` | UNRESOLVED / default REMOVE | No current product need | DO NOT ADD unless future exact scope changes |
| Select flight | REMOVE | Not part of product domain | DO NOT BUILD |
| Location picker | WEB / SITUM, IMPLEMENTED | Plan 016 Viewer | KEEP REAL |
| Viewer building/floor/camera controls | WEB / SITUM, IMPLEMENTED where verified | Plans 011/016 | KEEP verified controls only |
| Realtime positions server monitoring | WEB / SITUM, IMPLEMENTED | Plan 013 Nitro read | KEEP REAL |
| Realtime positions Viewer overlay | WEB / SITUM, FOLLOW-UP | Plan 019 `loadRealtimePositions` if installed/runtime verified | IMPLEMENT through Viewer, not custom projected markers |
| Browser simulated marker movement | REMOVE | Replaced by real realtime data | DO NOT REINTRODUCE |
| Trajectory playback | WEB / SITUM, FOLLOW-UP / conditional | Plan 019 `loadTrajectory` if installed/runtime verified | KEEP only verified Viewer behavior |
| Invented stale/offline status | REMOVE unless exact source semantic exists | Plan 019 | Prefer factual source timestamp/last-seen text |
| Analytics: visitors | WEB / SITUM, FOLLOW-UP | Plan 017 Reports -> ClickHouse | CORE PLAN 017 |
| Analytics: positioning time | WEB / SITUM, FOLLOW-UP | Plan 017 Reports -> ClickHouse | CORE PLAN 017 |
| Analytics: geofence stay | WEB / SITUM, FOLLOW-UP | Plan 017 Reports -> ClickHouse | CORE PLAN 017 |
| Analytics: Map Viewer usage | WEB / SITUM, FOLLOW-UP / conditional | Plan 017 | KEEP only if exact semantics fit current dashboard/product |
| Analytics: heatmap | WEB / SITUM, FOLLOW-UP / conditional | Plan 017 | KEEP only if exact data volume/coordinates support truthful visualization |
| Analytics: raw data | UNRESOLVED / non-goal for current Plan 017 | Future | Do not ingest just because endpoint exists |
| Analytics: user-position history | UNRESOLVED / non-goal for current Plan 017 | Future | Keep out unless later concrete scope |
| CSV export | WEB / PRODUCT over verified data | Plan 017 ClickHouse-backed export | KEEP for implemented analytics dataset |
| Alarms read-only | WEB / SITUM, FOLLOW-UP | Plan 018 | IMPLEMENT exact verified list/detail/filter fields only |
| Alarm mutations/confirmation/closure | REMOVE from current roadmap | Not authorized | DO NOT BUILD |
| Mobile-side alarm trigger/sensor behavior | NATIVE-ONLY | Future native roadmap | DO NOT BUILD IN WEB |
| Users read-only | WEB / SITUM, IMPLEMENTED | Plan 015 | KEEP REAL |
| Groups read-only | WEB / SITUM, FOLLOW-UP | Plan 018 | IMPLEMENT exact verified list/relationship fields only |
| Organization safe summary | WEB / SITUM, IMPLEMENTED | Plan 015 | KEEP REAL |
| Organization credential/key card | REMOVE | Security detail | DO NOT BUILD |
| Viewer language/accessibility/search controls | WEB / SITUM, IMPLEMENTED where verified | Plan 016 | KEEP verified controls only |
| Generic unverified Viewer config | UNRESOLVED / default REMOVE | No current owner | DO NOT GUESS |
| Invented Map Style gallery | REMOVE unless exact product-worthy contract is later verified | Future | DO NOT BUILD now |
| Generic Images inventory tab | REMOVE | No current product owner | DO NOT BUILD |
| Home Buildings/POIs/Realtime counters | WEB / SITUM, IMPLEMENTED where derived from real upstream reads | Existing implementation | KEEP only exact real counts |
| Home alarm counter | WEB / SITUM, FOLLOW-UP / conditional | Plan 018 | Replace only if exact alarm-count semantics match the UI |
| Home Recent Activity synthetic feed | REMOVE unless natural real source exists | No new event backend solely for UI | DEFAULT REMOVE |
| Dashboard Visitors/positioning/usage metrics | WEB / SITUM, FOLLOW-UP | Plan 017 ClickHouse analytics | Replace placeholders only when metric semantics match exactly |
| Dashboard Active devices/current positions | WEB / SITUM, IMPLEMENTED/FOLLOW-UP | Plan 013 data; Plan 019 presentation | KEEP only exact real semantics |
| Dashboard occupancy people count | WEB / SITUM when exactly derivable | Existing realtime / future evidence | KEEP only if exact real data supports it |
| Dashboard capacity denominator/progress | UNRESOLVED / default REMOVE | No verified capacity source | DO NOT INVENT |

## Plan 017 ClickHouse ownership

ClickHouse is an app-owned server-side analytics store, not a new browser integration and not a replacement for PostgreSQL.

```text
Situm Reports REST
  -> authenticated Nitro ingestion
  -> existing local ClickHouse instance
  -> authenticated app analytics query/export API
  -> browser analytics UI
```

Rules:

- reuse the user's existing local ClickHouse instance;
- do not provision another server or add Docker/Compose for it;
- inspect the instance before creating isolated app-owned objects;
- do not modify/drop unrelated databases/tables;
- ClickHouse credentials remain server-only and never reach browser/public runtime config;
- no hidden ingestion side effect on GET; use explicit feature-scoped sync for this PoC;
- no fake historical rows.

## Credential boundary

The current credential model is final unless a concrete future requirement changes it:

- `NUXT_PUBLIC_SITUM_API_KEY` — browser Viewer credential only;
- `NUXT_SITUM_API_KEY` — private Nitro Situm credential;
- `NUXT_PUBLIC_SITUM_BUILDING_ID` — public identifier.

Protected product Situm/analytics routes require the existing application session. Never create a generic unauthenticated Situm or ClickHouse proxy.

## Evidence gate for Plans 017–020

A valid evidence row/record should include as applicable:

```text
capability
classification
exact endpoint OR exact SDK method
official source reference
installed SDK compatibility (when relevant)
access path: Viewer | authenticated Nitro | app-owned ClickHouse
auth/permission
request/filter inputs consumed
response/event fields consumed
error/empty/stale semantics
current plan owner
```

If an item remains unresolved, it must stay absent or explicitly unavailable; it may not masquerade as a working Situm feature.

## Web/native ownership

```text
WEB
  admin / monitoring / analytics / static map exploration / static directions

NATIVE (future separate roadmap)
  device indoor positioning / blue dot / sensor permissions / motion-aware navigation
```

Plans 017–020 must not quietly pull native positioning scope into the Nuxt web application.
