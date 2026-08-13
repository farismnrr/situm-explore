# UI / Situm Capability & Data Source Matrix

This is the current product/capability authority for the transition from the accepted UI baseline into real Situm integration.

Historical Plans 004–009 intentionally used prototype fixtures. Starting in Plan 010, a Situm-domain UI element may no longer remain permanently fake merely for visual fidelity: it must map to a verified real web capability, be product-owned, be native-only and absent from web, or be removed.

## Important: this matrix is not an endpoint spec

The classification below answers **what belongs in the product and which plan owns it**.

It does not authorize an implementation from memory.

Before a row becomes an implemented `WEB / SITUM` capability, Plan 010 Phase 3 must record exact evidence for:

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

Until those are verified, a retained Situm row is a **product direction**, not permission to guess implementation details.

## Classification rules

- **WEB / PRODUCT** — owned by Situm Explore itself; no Situm backing required.
- **WEB / SITUM** — retained web UI with exact verified Situm REST/Viewer backing.
- **TRANSITION** — retained product capability still using fixture/local state until its assigned later plan replaces it.
- **NATIVE-ONLY** — requires device positioning/sensors/mobile runtime; absent from the web product.
- **REMOVE** — fake, unsupported, redundant, misleading, or low-value for this POC.
- **UNRESOLVED** — exact capability evidence is incomplete; may not be implemented or presented as real until resolved.

## Surface matrix

| Surface / capability | Classification | Target source / owner | Decision |
| --- | --- | --- | --- |
| Landing | WEB / PRODUCT | Static Nuxt | KEEP |
| Login/session/logout | WEB / PRODUCT | Existing `/api/auth/login`, `nuxt-auth-utils` | KEEP REAL |
| Dummy registration | REMOVE | No real account-creation owner in current POC | REMOVE in Plan 010 |
| App route protection | WEB / PRODUCT | Existing auth middleware + server session guards | KEEP REAL |
| PostgreSQL/app status | WEB / PRODUCT | Existing `/api/me` | KEEP REAL |
| Global fake `Sync` | REMOVE | No single real sync operation | REMOVE in Plan 010 |
| Map Viewer lifecycle | WEB / SITUM | Existing `SitumViewer` lifecycle | KEEP REAL; preserve verified lifecycle only |
| Buildings / Floors | WEB / SITUM, TRANSITION | Plan 011, authenticated Nitro reads + Viewer selection context | KEEP; exact evidence required before Plan 011 coding |
| POIs / Categories | WEB / SITUM, TRANSITION | Plan 011 | KEEP; exact evidence required |
| POI favorite/search UI | WEB / SITUM when verified | Plan 011 or 016 | KEEP only with exact evidence |
| Geofence definitions | WEB / SITUM, TRANSITION | Plan 012 | KEEP; exact evidence required |
| Geofence stay/session metrics | WEB / SITUM, TRANSITION | Plan 014 reports | KEEP only from real report evidence |
| Path metadata | WEB / SITUM, TRANSITION | Plan 012 | KEEP; exact evidence required |
| Static directions between known points/POIs | WEB / SITUM, TRANSITION | Plan 012 / Viewer | KEEP only with exact routing evidence |
| `My location` as browser indoor position | NATIVE-ONLY | Future native SDK roadmap | REMOVE from web |
| Live blue-dot / sensor positioning | NATIVE-ONLY | Future native SDK roadmap | DO NOT BUILD IN WEB |
| Dynamic walking turn-by-turn / reroute from handset position | NATIVE-ONLY | Future native SDK roadmap | REMOVE from web |
| End-user `Set user location` developer control | REMOVE | Integration/developer concern, not user-facing source | REMOVE |
| Save car / navigate to car | REMOVE for current web POC | No current product owner after boundary review | REMOVE |
| Remote-person `Follow user` | UNRESOLVED / default REMOVE | Plan 010 exact semantics verification | REMOVE unless exact evidence + useful product semantic exists |
| Select flight | REMOVE | Not part of product domain | REMOVE |
| Location picker | WEB / SITUM when exact method verified | Plan 016 if retained | KEEP only with exact evidence |
| Viewer building/floor/camera controls | WEB / SITUM when exact methods verified | Plan 011/016 | KEEP only verified controls |
| Realtime positions monitoring | WEB / SITUM, TRANSITION | Plan 013 | KEEP; exact API/Viewer evidence required |
| Browser simulated marker movement | REMOVE | Replaced by real realtime data | REMOVE in Plan 013 |
| Trajectory | UNRESOLVED / candidate WEB / SITUM | Plan 013/016 | KEEP only if exact evidence matches product intent |
| Analytics: visitors | WEB / SITUM, TRANSITION | Plan 014 | KEEP; exact report evidence required |
| Analytics: positioning time | WEB / SITUM, TRANSITION | Plan 014 | KEEP; exact report evidence required |
| Analytics: heatmap | WEB / SITUM, TRANSITION | Plan 014 | KEEP only if exact real contract/data volume is practical |
| Analytics: geofence stay/session | WEB / SITUM, TRANSITION | Plan 014 | KEEP; exact report evidence required |
| Analytics: user positions | WEB / SITUM, TRANSITION | Plan 014 | KEEP; exact report evidence required |
| Analytics: Map Viewer usage | WEB / SITUM, TRANSITION | Plan 014 | KEEP; exact report evidence required |
| CSV export | WEB / SITUM when verified | Plan 014 real report output/data | KEEP only from real report/data; remove fixture-only export |
| Alarms read-only | WEB / SITUM, TRANSITION | Plan 015 | KEEP; exact read evidence required |
| Mobile-side alarm trigger/sensor behavior | NATIVE-ONLY / OUT OF SCOPE | Future native roadmap | DO NOT ADD TO WEB |
| Users / Groups read-only | WEB / SITUM, TRANSITION | Plan 015 | KEEP; exact read evidence required |
| Organization safe summary | WEB / SITUM, TRANSITION | Plan 015 | KEEP only safe real fields |
| Organization credential/key card | REMOVE | Implementation/security detail | REMOVE |
| Viewer language/accessibility/search controls | WEB / SITUM when verified | Plan 016 | KEEP only exact verified controls |
| Follow-user-by-default setting | UNRESOLVED / default REMOVE | Plan 010 | REMOVE unless exact useful web semantic is verified |
| Static route constraints/tags | WEB / SITUM when verified | Plan 012/016 | KEEP only exact verified options |
| Map configuration/profile | WEB / SITUM when verified | Plan 016 | KEEP only real options with exact evidence |
| Invented Map Style gallery | UNRESOLVED / default REMOVE | Plan 016 conditional | REMOVE unless a useful exact read/use contract is verified |
| Generic Images inventory tab | REMOVE | No current product-worthy generic inventory owner | REMOVE |
| Home Buildings/POIs/Realtime/Alarm counters | WEB / SITUM, TRANSITION | Derive from Plans 011/013/015 | KEEP only from exact real upstream data |
| Home Recent Activity synthetic feed | REMOVE unless natural real source exists | No new event backend solely for UI | DEFAULT REMOVE |
| Dashboard Visitors/Avg stay/Viewer sessions | WEB / SITUM, TRANSITION | Plan 014 | KEEP only from exact report evidence |
| Dashboard Active devices | WEB / SITUM, TRANSITION | Plan 013 | KEEP only from exact realtime/device evidence |
| Dashboard occupancy people count | WEB / SITUM when derivable | Plan 013 | KEEP only if exact real data supports it |
| Dashboard capacity denominator/progress | UNRESOLVED / default REMOVE | Plan 010 mapping | REMOVE unless exact real capacity source exists |

## Evidence ledger status

Before Plan 010 closes, every retained `WEB / SITUM` row must be backed by an execution evidence ledger in Plan 010 notes or an updated section of this matrix.

A valid evidence row must include:

```text
capability
classification
exact endpoint OR exact SDK method
official source reference
installed SDK compatibility (when applicable)
access path: Viewer | authenticated Nitro
read/write
auth/permission
UI fields/events consumed
later plan owner
```

No later plan may infer missing values.

If an item remains `UNRESOLVED` at closeout, it must be absent from the working web UI or explicitly blocked/non-functional; it may not masquerade as a working Situm feature.

## Credential boundary

### Legacy current state

The accepted baseline still initializes the browser Viewer with `NUXT_PUBLIC_SITUM_API_KEY`.

That is historical POC implementation, not authorization for future REST/domain integrations.

### Target boundary

- Product REST/domain integrations use private Nitro runtime credentials.
- Browser code never receives the server REST credential.
- Every product `/api/situm/*` endpoint requires the existing Situm Explore session.
- `NUXT_PUBLIC_SITUM_BUILDING_ID` may remain public.
- Browser Viewer auth uses the smallest safe exact mechanism verified by Plan 010 against current official docs + installed SDK.
- Never create a generic unauthenticated Situm proxy.

Do not invent the private env name or Viewer token flow before Plan 010 verifies it.

## Fixture replacement rule

Fixtures under `app/data/prototype/` are transitional only.

1. Plan 010 removes fixture data/types used solely by removed UI.
2. Plans 011–015 remove fixtures only after the corresponding real source works.
3. Plan 016 removes local dummy Viewer/settings success behavior only for retained verified capabilities.
4. A failed real request must show truthful failure/empty state; it must not silently fall back to believable fake data.

## Web/native ownership

```text
WEB
  admin / monitoring / analytics / static map exploration / static routing

NATIVE (future separate roadmap)
  device indoor positioning / blue dot / sensor permissions / motion-aware navigation
```

No Plan 010–016 implementation may quietly pull native positioning scope into the Nuxt web application.