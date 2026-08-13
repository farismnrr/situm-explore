# UI / Situm Capability & Data Source Matrix

This is the current authority for the transition from the accepted UI baseline into real Situm integration.

Historical Plans 004–009 intentionally used prototype fixtures. Starting in Plan 010, a Situm-domain UI element may no longer remain permanently fake merely for visual fidelity: it must map to a real web capability, be classified native-only, or be removed.

## Classification rules

- **WEB / PRODUCT** — owned by Situm Explore itself; does not require Situm backing.
- **WEB / SITUM** — retained web UI with an exact Situm REST/Viewer owner.
- **NATIVE-ONLY** — requires device positioning/sensors/mobile runtime; absent from the web product.
- **REMOVE** — fake, unsupported, redundant, or low-value for this POC.
- **TRANSITION** — current fixture exists only until its assigned later plan replaces it.

## Surface matrix

| Surface / capability | Classification | Target source / owner | Decision |
| --- | --- | --- | --- |
| Landing | WEB / PRODUCT | Static Nuxt | KEEP |
| Login/session/logout | WEB / PRODUCT | Existing `/api/auth/login`, `nuxt-auth-utils` | KEEP REAL |
| Dummy registration | REMOVE | No real account-creation owner in current POC | REMOVE in Plan 010 |
| App route protection | WEB / PRODUCT | Existing auth middleware + server session guards | KEEP REAL |
| PostgreSQL/app status | WEB / PRODUCT | Existing `/api/me` | KEEP REAL |
| Global fake `Sync` | REMOVE | No single real sync operation | REMOVE in Plan 010 |
| Map Viewer lifecycle | WEB / SITUM | `SitumViewer` / JS Viewer | KEEP REAL |
| Buildings / Floors | WEB / SITUM, TRANSITION | Plan 011, authenticated Nitro REST + Viewer selection context | KEEP |
| POIs / Categories | WEB / SITUM, TRANSITION | Plan 011 | KEEP |
| POI favorite/search UI | WEB / SITUM when verified | Plan 011 or 016 per Plan 010 exact mapping | KEEP only if mapped |
| Geofence definitions | WEB / SITUM, TRANSITION | Plan 012 | KEEP |
| Geofence stay/session metrics | WEB / SITUM, TRANSITION | Plan 014 reports | KEEP only from real report source |
| Path metadata | WEB / SITUM, TRANSITION | Plan 012 | KEEP |
| Static directions between known points/POIs | WEB / SITUM, TRANSITION | Plan 012 / Viewer | KEEP |
| `My location` as browser indoor position | NATIVE-ONLY | Future native SDK roadmap | REMOVE from web |
| Live blue-dot / sensor positioning | NATIVE-ONLY | Future native SDK roadmap | DO NOT BUILD IN WEB |
| Dynamic walking turn-by-turn / reroute | NATIVE-ONLY | Future native SDK roadmap | REMOVE from web |
| End-user `Set user location` control | REMOVE | Developer integration method, no user-facing source | REMOVE |
| Save car / navigate to car | REMOVE for current web POC | Not needed after web/native boundary review | REMOVE |
| Remote-person `Follow user` | REMOVE unless exact semantics verified | Plan 010 must verify before retention | DEFAULT REMOVE |
| Select flight | REMOVE | Capability not part of this product domain | REMOVE |
| Location picker | WEB / SITUM | Viewer, Plan 016 if retained | KEEP |
| Viewer building/floor/camera controls | WEB / SITUM | Viewer, Plan 011/016 | KEEP |
| Realtime positions monitoring | WEB / SITUM, TRANSITION | Plan 013 | KEEP |
| Browser simulated marker movement | REMOVE | Replaced by real realtime data | REMOVE in Plan 013 |
| Trajectory | WEB / SITUM when mapped | Plan 013/016 | KEEP only if mapped |
| Analytics: visitors | WEB / SITUM, TRANSITION | Plan 014 | KEEP |
| Analytics: positioning time | WEB / SITUM, TRANSITION | Plan 014 | KEEP |
| Analytics: heatmap | WEB / SITUM, TRANSITION | Plan 014 | KEEP if practical/mapped |
| Analytics: geofence stay/session | WEB / SITUM, TRANSITION | Plan 014 | KEEP |
| Analytics: user positions | WEB / SITUM, TRANSITION | Plan 014 | KEEP |
| Analytics: Map Viewer usage | WEB / SITUM, TRANSITION | Plan 014 | KEEP |
| CSV export | WEB / SITUM | Real report output/data, Plan 014 | KEEP; remove fixture-only export |
| Alarms read-only | WEB / SITUM, TRANSITION | Plan 015 | KEEP |
| Mobile-side alarm trigger/sensor behavior | NATIVE-ONLY / OUT OF SCOPE | Future native roadmap | DO NOT ADD TO WEB |
| Users / Groups read-only | WEB / SITUM, TRANSITION | Plan 015 | KEEP |
| Organization safe summary | WEB / SITUM, TRANSITION | Plan 015 | KEEP |
| Organization credential/key card | REMOVE | Implementation/security detail | REMOVE |
| Viewer language/accessibility/search controls | WEB / SITUM when mapped | Plan 016 | KEEP only exact verified controls |
| Follow-user-by-default setting | REMOVE unless exact useful web semantic verified | Plan 010 | DEFAULT REMOVE |
| Static route constraints/tags | WEB / SITUM when mapped | Plan 012/016 | KEEP only verified options |
| Map configuration/profile | WEB / SITUM when mapped | Plan 016 | KEEP only real options |
| Invented Map Style gallery | REMOVE unless read/use contract verified | Plan 016 conditional | DEFAULT REMOVE |
| Generic Images inventory tab | REMOVE | No product-worthy generic inventory owner | REMOVE |
| Home Buildings/POIs/Realtime/Alarm counters | WEB / SITUM, TRANSITION | Derive from Plans 011/013/015 | KEEP |
| Home Recent Activity synthetic feed | REMOVE unless a natural real source exists | No new event backend solely for UI | REMOVE |
| Dashboard Visitors/Avg stay/Viewer sessions | WEB / SITUM, TRANSITION | Plan 014 | KEEP |
| Dashboard Active devices | WEB / SITUM, TRANSITION | Plan 013 | KEEP |
| Dashboard occupancy people count | WEB / SITUM when derivable | Plan 013 | KEEP if real |
| Dashboard capacity denominator/progress | REMOVE unless real source mapped | Plan 010 mapping | DEFAULT REMOVE |

## Credential boundary

### Current legacy state

The accepted baseline still initializes the browser Viewer with `NUXT_PUBLIC_SITUM_API_KEY`. That is historical POC implementation, not authorization for future REST integrations.

### Target boundary

- Product REST/domain integrations use **private Nitro runtime credentials**.
- Browser code never receives the server REST credential.
- Every `/api/situm/*` product endpoint requires the existing Situm Explore authenticated session.
- `NUXT_PUBLIC_SITUM_BUILDING_ID` may stay public.
- Browser Viewer auth must use the smallest safe mechanism verified in Plan 010; migrate away from a public broad-permission key when the supported Viewer flow is confirmed.
- Never create a generic unauthenticated proxy.

## Fixture replacement rule

Fixtures under `app/data/prototype/` are transitional only.

1. Plan 010 removes fixture data/types that exist solely for removed UI.
2. Plans 011–015 remove fixtures only after a corresponding real source is working.
3. Plan 016 removes local dummy Viewer/settings success behavior only for retained real capabilities.
4. A failed real request must show a truthful failure/empty state; it must not silently fall back to believable fake data.

## Web/native ownership

```text
WEB
  admin / monitoring / analytics / static map exploration / static routing

NATIVE (future, separate roadmap)
  device indoor positioning / blue dot / sensor permissions / motion-aware navigation
```

No Plan 010–016 implementation may quietly pull native positioning scope into the Nuxt web application.
