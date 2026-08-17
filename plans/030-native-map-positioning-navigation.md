# Plan 030 — Native Map, Positioning & Navigation

Branch: `plan/030-native-map-positioning-navigation`
Base: updated `origin/main` after Plan 029 is integrated
Depends on: Plan 029 complete/integrated
Status: planned

## Objective

Deliver the native mobile spatial experience: Situm MapView, workspace/building context, permissions, foreground positioning/blue dot, floor and POI interaction, and evidence-backed mobile directions/navigation using the least-privilege mobile Situm auth contract established by Plans 028–029.

## Rules

- Use the current `@situm/react-native` surface proven by Plan 028; do not infer native-wrapper features from Android/iOS APIs.
- Prefer Situm Remote Configuration for positioning parameters when current official guidance recommends it; avoid hardcoding tuning parameters without a product requirement.
- Keep the Read & Write workspace credential server-only.
- Positioning permission/sensor failures are normal product states, not generic crashes.
- Do not fake route metrics, geometry, steps or navigation events that the SDK does not actually expose.
- Physical-device evidence is required for real positioning claims.
- No PR/merge without explicit user authorization.

## Phase checklist

- [ ] Phase 0 — Dependency, SDK and real-device pre-flight.
- [ ] Phase 1 — Workspace-bound native MapView and cartography readiness.
- [ ] Phase 2 — Permission/user-helper and positioning lifecycle.
- [ ] Phase 3 — Blue-dot/current-position and building/floor lifecycle.
- [ ] Phase 4 — POI discovery/selection and map interaction.
- [ ] Phase 5 — Evidence-backed directions and navigation.
- [ ] Phase 6 — App lifecycle, failure handling and resource cleanup.
- [ ] Phase 7 — Real-device acceptance and closeout.

## Phase 0 — Pre-flight

- Confirm Plan 029 is integrated and mobile login/workspace/Situm auth works.
- Recheck the exact installed Situm React Native API and changelog for any behavior changed since Plan 028.
- Identify an available calibrated building/profile and physical-device acceptance path without persisting credentials.
- Record Android/iOS differences for permissions/background behavior before implementing shared abstractions.

## Phase 1 — Native MapView

Implement the Map destination as a real native Situm MapView owned by the selected workspace.

Requirements:

- load only when authenticated workspace + mobile Situm authority + valid building context exist;
- use backend-derived workspace/building context where application ownership matters;
- never expose primary Read & Write credentials;
- loading/empty/error states are product-owned;
- map instance lifecycle is singular and explicit;
- switching workspace/building tears down stale map state before loading the new context;
- no hidden fallback to demo/default Situm content.

## Phase 2 — Permissions and positioning

Implement the exact current Situm permission/user-helper flow proven in Plan 028.

Requirements:

- request only permissions required by the target platform/SDK mode;
- explain denied/permanently-denied/disabled-sensor states clearly;
- start positioning only from an explicit product lifecycle state;
- stop/remove updates reliably when leaving the owning flow;
- surface location/status/error callbacks safely;
- positioning configuration uses the approved Remote Configuration/profile model unless a local override is explicitly justified;
- do not log raw sensitive location streams unnecessarily.

## Phase 3 — Current position / blue dot

Provide truthful device-position behavior:

- current indoor/outdoor location as produced by Situm;
- expected building/floor transitions;
- map follows/selects floor only according to proven SDK behavior;
- stale/no-fix/error states are visually distinguishable;
- app resume does not accidentally create duplicate positioning listeners;
- workspace switch cannot leave positioning authenticated against the previous workspace.

## Phase 4 — Cartography interaction

Implement the minimum mobile map interactions needed by the product:

- building/floor context;
- POI search/list/selection if the proven MapView/API supports it;
- focus/select POI;
- clear selection/state on workspace/building change;
- accessible mobile controls around the native MapView.

Do not replicate every web administration surface inside mobile.

## Phase 5 — Directions/navigation

Implement only navigation contracts proven against the installed React Native SDK:

- select/start from current location or another supported origin;
- destination based on real known Situm POI/location identifiers;
- navigation start/progress/destination/cancel/error callbacks;
- stop/cancel previous navigation before starting a new one when required by current SDK semantics;
- optional voice/TTS only when current platform behavior is proven and product-owned;
- no invented ETA/steps/distance if the SDK does not expose them reliably.

Keep static web directions unchanged; this plan adds the mobile navigation owner rather than rewriting the web route model.

## Phase 6 — Lifecycle and cleanup

Verify:

- foreground/background transitions;
- screen lock/resume where testable;
- workspace switch;
- logout while positioning/navigation is active;
- network loss/recovery;
- permission revocation;
- repeated start/stop without duplicate listeners;
- cleanup of native listeners, MapView refs and positioning sessions.

Background positioning is not automatically enabled just because the SDK supports it. Enable it only if the frozen mobile product requirements and platform permission policy require it; otherwise record it for Plan 031 if Realtime needs it.

## Phase 7 — Acceptance

At minimum on a real supported Android device (and iOS where an eligible host/device is available):

- authenticated workspace map loads the correct real building;
- no demo/foreign building flashes or persists;
- permission helper flow is usable;
- positioning starts/stops and receives real status/location evidence;
- blue dot/current floor behavior is truthful;
- POI selection works for a known real POI;
- navigation start/cancel/finish/error behavior matches current SDK evidence;
- app navigation away/back and restart do not duplicate sessions;
- no credentials appear in logs/traces/screenshots/repo files.

Run repository and mobile validation from Plan 029, update durable architecture/capability evidence, commit/push each completed phase, and stop before PR until user authorization.
