# Plan 032 — Web/Native Handoff & Distribution

Branch: `plan/032-web-native-handoff-distribution`
Base: updated `origin/main` after Plan 031 is integrated
Depends on: Plan 031 complete/integrated
Status: final reviewer remediation required; not PR-ready

## Objective

Finish the native-companion product boundary without consuming the final full-E2E gate: route phone-web Map users to Situm Explore Mobile while preserving accepted desktop/tablet web Map; route every web Realtime entry point to the native app; add safe deep-link/install/download fallbacks; and establish reproducible distribution configuration without committed signing/store secrets.

Full cross-client and physical-device E2E is owned by Plan 033.

## Product policy to implement

```text
/app/map
  desktop/tablet -> web Situm Viewer
  phone          -> native handoff / install CTA

/app/realtime
  desktop        -> native handoff / install CTA
  tablet         -> native handoff / install CTA
  phone          -> native handoff / install CTA
```

## Rules

- Do not remove a working web Map path before its replacement policy is implemented truthfully.
- Realtime native-only is an intentional product policy, not a claim that Situm web APIs cannot read realtime data.
- Web Map eligibility is based on tested viewport/layout capability, not user-agent sniffing.
- Platform/OS detection may select App Store/Play Store/direct-download presentation, but must not be the primary Map capability gate.
- Never put auth/session/Situm credentials in links, QR codes, store URLs or analytics events.
- Deep links may carry non-secret routing context such as feature/workspace/building identifiers only when authorization is rechecked after app open/login.
- Store/signing credentials and private keys remain external/ignored.
- Web/native handoff UI and native destinations remain visibly one Situm Explore product.
- Do not claim physical-device Map, positioning, navigation or Realtime acceptance in this plan. Those previously unpassed Plan 030/031 checks move to Plan 033.
- Plan 032 may close/merge after implementation and truthful non-device validation are reviewer-approved, with all remaining E2E items explicitly handed to Plan 033.
- No PR/merge without explicit user authorization.

## Phase checklist

- [x] Phase 0 — Native release/deep-link readiness and web breakpoint matrix.
- [x] Phase 1 — Native deep-link routing and authenticated context restoration.
- [x] Phase 2 — Reusable web Native App Gate component/configuration.
- [x] Phase 3 — Map desktop/tablet web vs phone-native policy.
- [x] Phase 4 — Realtime all-web native handoff policy.
- [x] Phase 5 — Install/open-app, QR and distribution fallback UX.
- [x] Phase 6 — Production mobile packaging/distribution documentation.
- [x] Phase 7 — Implementation validation, documentation reconciliation and Plan 033 handoff.

## Phase 0 — Readiness and breakpoint matrix

### Execution evidence — 2026-08-17

- Plans 029–031 are integrated in `main`; Plan 030/031 physical-device outcomes remain unpassed and are preserved for Plan 033.
- Existing native identifiers are `com.situm.explore` on Android/iOS. Existing schemes remain `situm-explore-dev`, `situm-explore-staging`, and production `situm-explore`; no signing or store credential is committed.
- No published Play Store/App Store/direct-download destination is currently available in repository configuration. Public distribution destinations are therefore runtime-configured and render an explicit unavailable state until supplied.
- The web Map capability matrix is frozen by usable viewport geometry: Viewer renders when width is at least 768px and height is at least 600px. Representative accepted layout classes are tablet portrait (768×1024), tablet landscape (1024×768), and desktop (at least 1024×600). Smaller/shorter layouts use the native handoff. This is a layout capability threshold, not user-agent classification.
- The app shell's navigation breakpoint remains an independent 801px presentation breakpoint; Map capability does not depend on sidebar visibility.

These observations are non-device readiness evidence only. Real web-to-native opening, install, deep-link, authentication, workspace authorization, and native spatial/realtime outcomes remain Plan 033 acceptance items.

Before changing web routes:

- confirm Plans 029–031 are integrated and their implementation reviews are authoritative;
- confirm the still-unpassed physical-device acceptance from Plans 030–031 is preserved for Plan 033, not silently converted to acceptance;
- confirm actual Android/iOS application identifiers and deep-link configuration from Plan 028/029;
- confirm which distribution targets are actually available (Play Store, App Store, direct Android artifact, internal distribution, etc.); do not invent links;
- test the existing web Situm Viewer at representative phone/tablet/desktop viewport sizes and orientations;
- freeze one explicit Map web-capability threshold/matrix based on usable Viewer layout, not generic device labels;
- account for current app-shell breakpoint behavior so Map gating and navigation do not contradict each other.

If tablet acceptance is not actually usable, record that evidence and obtain an explicit product decision before widening the web Map policy beyond proven layouts.

## Phase 1 — Native deep links

### Execution evidence — 2026-08-17

- Added cold-start and foreground URL handling through the platform `Linking` lifecycle with one removable listener owner.
- Added Map and Realtime parsing for the configured app schemes and HTTPS associated-link shape. Parser output is limited to destination plus validated workspace/building hints; secret-shaped parameters are ignored.
- Unauthenticated links remain pending through the login screen. After authentication and workspace loading, context is applied only through the authorized workspace list; an unowned/deleted workspace is rejected by the existing `WorkspaceContext.select` boundary.
- Map building hints are validated against returned workspace cartography before native Map selection; invalid hints fall back to the first available building.
- Added focused parser/lifecycle regression coverage in `test/mobile-plan-032.test.ts`.

Real device link association/open behavior and login/workspace cross-client E2E remain unpassed for Plan 033.

Implement the frozen Universal Link / Android App Link / app-scheme contract.

Requirements:

- destinations for at least Map and Realtime;
- optional non-secret workspace/building context;
- if app is unauthenticated, preserve intended destination through login without exposing secret state;
- after login, re-fetch/re-authorize workspace context from Nitro before navigation;
- invalid/deleted/unowned workspace context falls back safely;
- no session token, Situm key, password, bearer token or encrypted credential in URL/query/fragment;
- duplicate/open-link lifecycle does not create duplicate positioning/realtime listeners by design and testable state ownership; final full lifecycle E2E remains Plan 033.

## Phase 2 — Reusable Native App Gate

### Execution evidence — 2026-08-17

- Added `NativeAppGate.vue` as the single Map/Realtime web handoff surface.
- It supports feature-specific copy, configured Open in app/install/download actions, QR generation, copyable link, keyboard-accessible buttons/links, and explicit unavailable messaging when store/download destinations are absent.
- Public configuration is read from Nuxt runtime config. The generated target contains only validated `workspaceId` and Map `buildingId` hints; no session, password, Situm credential, bearer token, or encrypted secret is accepted.
- QR generation uses the root `qrcode` package and is performed client-side after mount.
- Added source-level gate/security regression coverage.

Build one reusable web component/composable for native handoff rather than separate ad-hoc Map/Realtime modals.

It should support:

- feature-specific title/copy;
- "Open in app" when a supported deep-link target is configured;
- platform-appropriate install/download action when available;
- QR presentation for desktop/tablet where useful;
- explicit "not available yet" state when a store/build URL is not configured;
- runtime configuration for public store/download/deep-link destinations rather than hardcoded release-specific URLs where appropriate;
- accessibility and keyboard/screen-reader behavior;
- analytics/telemetry only with non-sensitive event metadata;
- visual treatment consistent with canonical Situm Explore web/native references.

## Phase 3 — Web Map policy

### Execution evidence — 2026-08-17

- Replaced the generic Desktop required branch with the shared native Map gate below the frozen 768×600 geometry threshold.
- The cartography `useFetch` remains lazy and now refreshes only when an authorized workspace exists and the viewport is Viewer-capable, so phone layouts do not initialize unnecessary Viewer/cartography work.
- Viewer-capable layouts continue to render the existing `SitumViewer` path and accessibility controls unchanged.
- Resize/orientation changes are owned by one `matchMedia` listener and switch between gate/Viewer branches through Vue state; branch unmounting prevents duplicate Viewer instances.
- Removed the now-unused `useDesktopViewport` abstraction.

Replace the current generic "Desktop required" behavior with the approved product contract.

Requirements:

- desktop/tablet web layouts that passed Phase 0 continue rendering the existing `SitumViewer` path unchanged;
- phone-sized web layouts do not initialize/fetch unnecessary Viewer cartography/auth merely to show the native gate;
- phone UI clearly explains that the mobile Map experience is provided by Situm Explore Mobile;
- CTA opens the Map deep link/install fallback;
- avoid user-agent-only device classification;
- resize/orientation changes transition safely without duplicate Viewer instances or stale native-gate state;
- rename/remove desktop-only abstractions whose semantics no longer match the actual tablet-capable policy.

## Phase 4 — Web Realtime policy

### Execution evidence — 2026-08-17

- `/app/realtime` now uses the shared Native App Gate at every viewport size and identifies Realtime as an intentional native product experience.
- Removed the obsolete unavailable/Coming soon Android modal and misleading technical-absence wording.
- Existing home and app-shell navigation links remain `/app/realtime` entry points and now land on the native handoff page; home copy identifies the native workspace-position experience.
- No web Realtime overlay or Situm web capability claim was added; native Realtime remains the existing foreground, server-mediated list/detail implementation.

Make every web Realtime entry point a native handoff on desktop, tablet and phone.

Requirements:

- `/app/realtime` uses the shared Native App Gate;
- remove misleading "coming soon Android" copy once real destinations exist, or keep a truthful configured-unavailable state for platforms not yet distributed;
- web navigation/home cards remain valid entry points but land on the native handoff experience;
- do not re-enable web realtime overlays as part of this plan;
- copy describes Realtime as a native product decision, not a web technical impossibility.

## Phase 5 — Open/install/QR fallback

### Execution evidence — 2026-08-17

- Native config now always exposes the environment-specific app scheme and conditionally emits iOS Associated Domains and Android App Links intent filters when `EXPO_PUBLIC_UNIVERSAL_LINK_HOST` is supplied.
- Web mobile flow opens the configured HTTPS/app link directly; desktop/tablet flow presents a QR encoding the same non-secret target plus explicit configured install/download links.
- No timer-based app detection or brittle browser blur/visibility fallback is used. When store/download URLs are absent, the gate explicitly says distribution is not yet published.
- Added regression coverage for association configuration and fallback behavior.

Implement a deterministic fallback hierarchy appropriate to the frozen distribution contract, for example:

```text
mobile browser
  -> verified app/universal link
  -> platform store/download fallback when configured

desktop/tablet web
  -> QR containing the same non-secret link
  -> explicit platform install links when configured
```

Do not use brittle timer hacks if Universal/App Links provide a safer OS-native path. If an app-scheme fallback is needed, document platform/browser limitations and keep failure UX truthful.

## Phase 6 — Distribution configuration

### Execution evidence — 2026-08-17

- Added `docs/mobile-distribution.md` with public runtime variables, version/build policy, environment separation, association-file requirements, external signing/store boundaries, artifact/source-map handling, and release destination updates.
- Added Expo version/build-number inputs with safe Android positive-integer validation. Existing identifiers and frozen SDK/platform versions remain unchanged.
- Release signing, provisioning, store delivery, EAS/CI, and private download hosting remain explicitly external; no secrets or private URLs were added.

Provide reproducible production packaging/distribution configuration according to Plan 028 decisions.

Requirements:

- application version/build-number policy;
- Android signing/configuration with secrets external;
- iOS signing/provisioning configuration with secrets external and user/macOS gates explicit;
- store metadata/link configuration location;
- environment separation for development/staging/production backend URLs;
- release artifact/source-map/log symbol handling where applicable;
- no secrets committed to Git, Expo config, build logs or documentation;
- document how a new release updates web install/deep-link destinations without code-secret coupling.

Do not add CI/App Store automation unless the user explicitly authorizes it.

## Phase 7 — Implementation validation and Plan 033 handoff

### Execution evidence — 2026-08-17

- Full non-device validation passed: root build/lint/typecheck/tests (28), mobile prebuild/lint/typecheck, Expo config rendering, and Android debug compilation.
- Built production preview returned HTTP 200 from `/` with security headers and non-secret public mobile config.
- Final acceptance inventory is recorded in `.agents/evidence/plan-032.md` and remains explicitly unpassed for Plan 033. It includes all Plan 030/031 physical carry-over and all Plan 032 cross-client/deep-link/install/auth/workspace/security E2E.
- Architecture, capability matrix, README/plan router, durable state, execution context, session evidence, and Plan 033 handoff were reconciled. No PR, merge, or Plan 033 execution occurred.

Plan 032 implementation is complete on this branch pending review/integration. The terminal Plan 033 gate may start only after this branch is integrated into updated `main`.

Plan 032 validation must prove every contract that does **not** require the final real-device/full-E2E environment:

- root tests/lint/typecheck/build and production web preview;
- mobile lint/typecheck, Expo validation/prebuild and Android build;
- focused tests for deep-link parsing, auth-context restoration, invalid/unowned context handling and listener ownership where testable;
- representative desktop/tablet/phone viewport behavior for web Map/Realtime gates;
- no unnecessary Viewer initialization on phone-native-gated Map;
- configured/unconfigured open/install/QR states are truthful and contain no secret data;
- emulator/runtime smoke where safely available, without treating emulator sensor/GPS behavior as physical acceptance;
- diff and secret checks;
- documentation/architecture/data-source matrix reconciliation.

Before closeout, create an explicit Plan 033 acceptance inventory containing:

- all Plan 030 physical-device carry-over: real building load, permission helper, positioning start/stop/status, blue dot/current floor, real floor transitions where environment permits, known POI interaction, navigation start/cancel/finish/error, and native lifecycle cleanup;
- all Plan 031 physical-device carry-over: Realtime with real authorized workspace data, own-device physical positioning/publishing behavior if applicable, sensor/BLE/Wi-Fi/background behavior where applicable, workspace/lifecycle/logout/restart cleanup;
- Plan 032 full web-to-native E2E: real open/install/deep-link behavior, login restoration, workspace authorization, Map/Realtime destination routing, invalid links, logout/restart, and cross-client secret audit.

These items remain **unpassed** until Plan 033 proves them. Plan 032 may be reviewer-approved and merged once its implementation/non-device evidence passes and this handoff is complete.

Run the Plan 032 validation suite, update durable authority/evidence, commit/push each completed phase, and stop before PR/merge until explicit user authorization. Do not start Plan 033 before Plan 032 is integrated.
