# Plan 032 — Web/Native Handoff, Distribution & Full Regression

Branch: `plan/032-web-native-handoff-distribution`
Base: updated `origin/main` after Plan 031 is integrated
Depends on: Plan 031 complete/integrated
Status: planned

## Objective

Finish the native-companion product boundary: route phone-web Map users to Situm Explore Mobile while preserving web Map on desktop/tablet; route every web Realtime entry point to the native app; add safe deep-link/install/download fallbacks; establish reproducible distribution configuration without committed signing/store secrets; and run full cross-client regression.

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

This plan changes UX routing only after the native destinations exist and are accepted.

## Rules

- Do not remove a working web Map path before native Map acceptance exists.
- Realtime native-only is an intentional product policy, not a claim that Situm web APIs cannot read realtime data.
- Web Map eligibility is based on tested viewport/layout capability, not user-agent sniffing.
- Platform/OS detection may select App Store/Play Store/direct-download presentation, but must not be the primary Map capability gate.
- Never put auth/session/Situm credentials in links, QR codes, store URLs or analytics events.
- Deep links may carry non-secret routing context such as feature/workspace/building identifiers only when authorization is rechecked after app open/login.
- Store/signing credentials and private keys remain external/ignored.
- Web/native handoff UI and native destinations must remain visibly one Situm Explore tenant. Use `DESIGN.md` plus both canonical HTML references; do not introduce platform-specific branding or contradictory feature vocabulary during handoff.
- No PR/merge without explicit user authorization.

## Phase checklist

- [ ] Phase 0 — Native release/deep-link readiness and web breakpoint acceptance matrix.
- [ ] Phase 1 — Native deep-link routing and authenticated context restoration.
- [ ] Phase 2 — Reusable web Native App Gate component/configuration.
- [ ] Phase 3 — Map desktop/tablet web vs phone-native policy.
- [ ] Phase 4 — Realtime all-web native handoff policy.
- [ ] Phase 5 — Install/open-app, QR and distribution fallback UX.
- [ ] Phase 6 — Production mobile packaging/distribution documentation.
- [ ] Phase 7 — Full web/native regression, documentation reconciliation and closeout.

## Phase 0 — Readiness and breakpoint matrix

Before changing web routes:

- confirm Plans 029–031 are integrated and native Map + Realtime destinations work;
- confirm actual Android/iOS application identifiers and deep-link configuration from Plan 028/029;
- confirm which distribution targets are actually available (Play Store, App Store, direct Android artifact, internal distribution, etc.); do not invent links;
- test the existing web Situm Viewer at representative phone/tablet/desktop viewport sizes and orientations;
- freeze one explicit Map web-capability threshold/matrix based on usable Viewer layout, not generic device labels;
- account for current app-shell breakpoint behavior so Map gating and navigation do not contradict each other.

If tablet acceptance is not actually usable, record that evidence and ask the user before widening the web Map policy beyond proven layouts.

## Phase 1 — Native deep links

Implement the frozen Universal Link / Android App Link / app-scheme contract.

Requirements:

- destinations for at least Map and Realtime;
- optional non-secret workspace/building context;
- if app is unauthenticated, preserve intended destination through login without exposing secret state;
- after login, re-fetch/re-authorize workspace context from Nitro before navigation;
- invalid/deleted/unowned workspace context falls back safely;
- no session token, Situm key, password, bearer token or encrypted credential in URL/query/fragment;
- duplicate/open-link lifecycle does not create duplicate positioning/realtime listeners.

## Phase 2 — Reusable Native App Gate

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
- visual treatment, icon language, spacing and copy hierarchy remain consistent with the canonical Situm Explore web/native references so the handoff feels like a continuation of the same product rather than an advertisement for a separate app.

## Phase 3 — Web Map policy

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

Make every web Realtime entry point a native handoff on desktop, tablet and phone.

Requirements:

- `/app/realtime` uses the shared Native App Gate;
- remove misleading "coming soon Android" copy once real destinations exist, or keep a truthful configured-unavailable state for platforms not yet distributed;
- web navigation/home cards remain valid entry points but land on the native handoff experience;
- do not re-enable web realtime overlays as part of this plan;
- copy describes Realtime as a native product decision, not a web technical impossibility.

## Phase 5 — Open/install/QR fallback

Implement a deterministic fallback hierarchy appropriate to the frozen distribution contract, for example:

```text
mobile browser
  -> verified app/universal link
  -> platform store/download fallback when app is not installed or link cannot open

desktop/tablet web
  -> QR containing the same non-secret universal/deep link
  -> explicit platform install links
```

Do not use brittle timer hacks if Universal/App Links provide a safer OS-native path. If an app-scheme fallback is needed, document platform/browser limitations and keep failure UX truthful.

## Phase 6 — Distribution configuration

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

Do not add CI/App Store automation unless the user explicitly authorizes it; repository CI remains separately user-gated.

## Phase 7 — Full regression

Web acceptance:

- desktop Map still loads correct workspace/building;
- accepted tablet layouts still load web Map;
- phone Map shows native gate and does not initialize Viewer unnecessarily;
- Realtime shows native gate at desktop/tablet/phone sizes;
- app shell/navigation responsive behavior remains correct;
- auth/workspaces/analytics/admin flows regress cleanly;
- production build/preview security headers remain intact.

Native acceptance:

- Map and Realtime deep links reach the correct destination after auth;
- invalid/unowned workspace link is rejected safely;
- install/open fallback works on supported Android target and iOS where available;
- workspace switch, logout and app restart do not retain unauthorized context;
- positioning/realtime listeners clean up across deep-link navigation;
- no credentials appear in URLs, QR contents, logs or bundled public configuration;
- Map/Realtime shell, naming, states and responsive hierarchy remain aligned with `design/reference/situm-explore-native-responsive-prototype.html` except for explicitly documented capability-driven deviations.

Run root and mobile validation suites, production web preview, available native production/dev builds, and real-device smoke. Reconcile `ARCHITECTURE.md`, `design/data-source-matrix.md`, `plans/README.md`, `.agents/state.md`, durable decisions/knowledge and final roadmap status to exact runtime truth.

Commit/push every completed phase and stop before PR/merge until explicit user authorization.
