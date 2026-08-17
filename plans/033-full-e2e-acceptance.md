# Plan 033 — Full E2E Acceptance & Roadmap Closeout

Branch: `plan/033-full-e2e-acceptance`
Base: updated `origin/main` after Plan 032 is integrated
Depends on: Plan 032 complete/integrated
Status: planned

## Objective

Run the complete cross-client and supported-Android physical-device acceptance for the native companion roadmap, including every E2E item previously deferred from Plans 030–031 because no supported physical device/runtime path was available, plus the web/native handoff and distribution flows implemented in Plan 032.

This is the terminal roadmap gate. No E2E item may be deferred again.

## Mode

Plan 033 is acceptance-first, not a new feature plan.

- Do not add new product scope.
- If E2E exposes a defect, fix only the minimum regression/correctness issue required to satisfy existing approved behavior, then rerun affected acceptance.
- Do not weaken acceptance criteria to make tests pass.
- Do not fabricate physical-device, sensor, positioning, store/install or deep-link evidence.
- Emulator evidence is supplemental only where physical semantics matter.
- No PR/merge without explicit user authorization, and do not merge Plan 033 while any mandatory Android physical-E2E gate remains incomplete.

## Required environment

At minimum for mandatory Android acceptance:

- a supported physical Android device connected and visible to the development toolchain;
- a reachable Situm Explore backend configured for the mobile app without committing secrets;
- a real authenticated owner account/workspace suitable for acceptance;
- an owner-authorized least-privilege Positioning credential issued through the application boundary;
- a calibrated Situm building/profile suitable for positioning/navigation evidence;
- network/Bluetooth/Wi-Fi/sensor capabilities required by the frozen positioning flow;
- a build/install path for the current Android application;
- configured deep-link/open/install destinations required by the Plan 032 distribution contract, or truthful configured-unavailable expectations where release distribution is still externally gated.

If these mandatory prerequisites are unavailable, record the exact missing item and keep Plan 033 **BLOCKED**. Do not move roadmap completion elsewhere.

## Phase checklist

- [ ] Phase 0 — Freeze the inherited E2E inventory and environment readiness.
- [ ] Phase 1 — Web handoff and distribution-path E2E.
- [ ] Phase 2 — Native auth, deep-link, workspace and session E2E.
- [ ] Phase 3 — Plan 030 physical Map/positioning/navigation acceptance.
- [ ] Phase 4 — Plan 031 physical Realtime/native lifecycle acceptance.
- [ ] Phase 5 — Cross-feature lifecycle, security and failure regression.
- [ ] Phase 6 — Final full regression rerun and roadmap closeout.

## Phase 0 — Acceptance inventory and readiness

Before testing, reconcile exact carry-over from Plans 030–032.

### Plan 030 carry-over — currently unpassed

- authenticated workspace Map loads the correct real calibrated building;
- no demo/foreign building flash or stale previous-workspace credential/building state;
- contextual permission/User Helper flow is usable;
- real positioning starts/stops and produces actual Situm status/location evidence;
- blue dot/current floor behavior matches observed real location data;
- real floor-transition behavior is truthful where the physical environment permits an actual transition;
- known real POI selection works;
- navigation start/progress/cancel/destination/error behavior matches observed installed-SDK behavior;
- background/resume, navigation away/back, workspace switch, logout and restart do not duplicate or retain stale positioning/navigation sessions.

### Plan 031 carry-over — currently unpassed

- Realtime works on a supported physical device with real authorized workspace data;
- correct workspace position records only; no cross-workspace leakage;
- source timestamps/accuracy/coordinates remain truthful with no invented presence/freshness state;
- own-device physical positioning/publishing behavior is verified only to the extent required by the frozen Realtime scope;
- Bluetooth/Wi-Fi/sensor/background behavior is verified where actually required by the frozen scope;
- foreground/background, navigation away/back, workspace switch, logout and restart stop/restart Realtime data flow without stale unauthorized data.

### Plan 032 carry-over — full E2E

- real web Map handoff on phone and preserved accepted desktop/tablet Viewer behavior;
- web Realtime handoff on desktop/tablet/phone;
- open-in-app/deep-link behavior on the real supported Android target;
- install/download fallback behavior for every actually configured distribution target;
- QR content and external links contain only approved non-secret context;
- unauthenticated deep links survive login and reach the intended authorized destination;
- invalid/deleted/unowned workspace context is rejected safely;
- logout/restart clears or reauthorizes context correctly;
- no duplicate positioning/Realtime listeners across deep-link navigation.

Record prerequisites and evidence locations before Phase 1.

## Phase 1 — Web handoff and distribution-path E2E

Exercise the real web/native boundary rather than only component tests.

Web Map:

- desktop accepted layout loads the existing web Viewer path;
- tablet accepted layout loads the existing web Viewer path;
- phone layout shows the native handoff and does not initialize unnecessary Viewer auth/cartography;
- resize/orientation transitions remain safe and truthful.

Web Realtime:

- desktop/tablet/phone all land on the native handoff experience;
- copy remains an intentional product-policy message, not a false technical limitation;
- no legacy web Realtime implementation is accidentally re-enabled.

Open/install/QR:

- real supported app link/custom scheme opens the intended native destination where configured;
- configured install/download fallback resolves correctly;
- unconfigured store/platform targets show truthful unavailable state;
- QR decodes to the same approved non-secret routing target;
- no session, password, Situm credential, bearer token or encrypted secret is present in URL/query/fragment/QR.

## Phase 2 — Native auth, deep-link, workspace and session E2E

On the real installed Android app:

- cold-open Map deep link while logged out -> login -> authorized Map destination;
- cold-open Realtime deep link while logged out -> login -> authorized Realtime destination;
- logged-in deep links reach the requested destination without creating duplicate feature owners/listeners;
- non-secret workspace/building hints are re-fetched and authorized server-side;
- invalid/deleted/unowned workspace hints fall back safely;
- session expiry removes protected data and requires reauthentication;
- logout clears local session material and protected location/Realtime state according to the frozen Plan 029 contract;
- app restart restores only authorized persisted context.

## Phase 3 — Plan 030 physical Map/positioning/navigation acceptance

Use a real calibrated environment and supported Android device.

Map and cartography:

- load the selected workspace's real building;
- switch workspace/building without old key/cartography flash;
- select real floors/POIs and verify displayed names/floor/category are cartography-backed.

Positioning:

- exercise contextual permission flow;
- start positioning and capture real status/location evidence;
- verify stop/error/background invalidate the current fix truthfully;
- confirm blue dot/current-floor behavior against observed environment;
- perform an actual floor transition where feasible; if the calibrated physical site cannot support a real transition test, this specific requirement remains incomplete and Plan 033 cannot claim it passed.

Navigation:

- choose a known real POI from a real current fix;
- start navigation;
- observe real progress payload behavior used by the UI;
- exercise cancel;
- exercise destination completion where physically feasible;
- exercise out-of-route/error behavior where safely reproducible without inventing events;
- verify stop-positioning/background/building/workspace changes cancel or invalidate navigation truthfully;
- repeat navigation away/back and restart to ensure no duplicate native sessions/listeners.

## Phase 4 — Plan 031 physical Realtime/native lifecycle acceptance

Using the same authorized workspace where possible:

- load Realtime on the physical app and observe real server-mediated workspace positions;
- verify only current authorized workspace records are shown;
- source time, building/floor, accuracy and coordinates match the server contract;
- no UI element implies online/fresh/healthy state without authority;
- refresh/polling works while foreground-active;
- leaving Realtime/backgrounding cancels in-flight polling and stops the cadence;
- returning resumes a single polling owner;
- workspace switch clears old records immediately and loads only the new workspace;
- session expiry/auth failure clears protected records;
- logout/restart does not expose stale Realtime data;
- exercise any own-device/background publishing behavior only if the frozen Plan 031 scope actually requires it; otherwise record it as intentionally absent, not failed.

## Phase 5 — Cross-feature lifecycle, security and failure regression

Exercise sequences that cross Plan boundaries:

- Map -> Realtime -> Map while positioning/navigation is active;
- deep-link into Realtime while Map previously owned positioning;
- workspace switch while moving between Map and Realtime;
- background/resume from each feature;
- logout while Map positioning/navigation is active;
- logout while Realtime has data and an in-flight refresh;
- session expiry while protected native data is visible;
- network loss/recovery for Map-owned application requests and Realtime polling;
- repeated app restart/cold-open/deep-link sequences.

Security evidence:

- no primary Read & Write or Viewer credential delivered to mobile;
- no application session or Positioning credential in URLs, QR, screenshots meant for shared evidence, logs/traces, analytics or repository files;
- sensitive location streams are not dumped into normal logs;
- no cross-workspace location/cartography data remains visible after authority changes.

## Phase 6 — Final regression and closeout

Rerun the complete repository and mobile validation suite after any E2E remediation:

- root tests, lint, typecheck and production build;
- mobile lint/typecheck;
- Expo doctor/prebuild under frozen-version policy;
- Android build/install for the accepted device;
- production web preview and responsive handoff regression;
- focused deep-link/session/workspace/Realtime/Map regressions;
- `git diff --check` and secret scan;
- final physical-device smoke across Map and Realtime.

Closeout requires:

- every mandatory Plan 030/031 physical carry-over marked with real evidence;
- every Plan 032 cross-client E2E item marked with real evidence;
- failures/remediations documented without hiding limitations;
- `ARCHITECTURE.md`, `design/data-source-matrix.md`, `plans/README.md`, `.agents/state.md`, durable decisions/evidence and roadmap status reconciled to exact runtime truth;
- no remaining deferred native-roadmap E2E item.

Plan 033 is PR-ready only when all mandatory Android/full-E2E checks pass. If any required physical acceptance is still unavailable, keep the plan blocked and the roadmap incomplete.
