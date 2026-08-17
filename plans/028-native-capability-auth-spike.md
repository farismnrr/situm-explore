# Plan 028 — Native Capability, Auth & Distribution Spike

Branch: `plan/028-native-capability-auth-spike`
Base: updated `origin/main` after the native roadmap planning branch is integrated
Depends on: `plans/028-032-native-mobile-roadmap.md`
Status: planned

## Objective

Prove the exact current contracts required to build Situm Explore Mobile before production mobile code is introduced. Freeze the React Native/Expo version matrix, Situm mobile capability surface, mobile application-session transport, least-privilege Situm authentication model, secure-storage boundary, deep-link identifiers, and build/distribution workflow.

This is an evidence plan. Do not implement product Map/Realtime screens here.

## Rules

- No capability claim without current official documentation, installed-package/source evidence, or a bounded runtime proof.
- No production credential values in source, docs, logs, traces, screenshots, or test fixtures.
- Never send the workspace Read & Write Situm credential to a mobile client.
- Do not create a second backend or user database.
- Expo Go is not an acceptance environment for native Situm code.
- Do not choose EAS, local signing, app-store workflow, cookie libraries, token libraries, or secure-storage libraries by habit; prove the smallest contract needed.
- No PR/merge without explicit user authorization.

## Phase checklist

- [ ] Phase 0 — Pre-flight, dependency and authority reconciliation.
- [ ] Phase 1 — Freeze React Native / Expo / Situm SDK compatibility matrix.
- [ ] Phase 2 — Prove native Map, positioning, permission and navigation surfaces.
- [ ] Phase 3 — Freeze least-privilege Situm mobile authentication contract.
- [ ] Phase 4 — Freeze application login/session transport for native.
- [ ] Phase 5 — Freeze secure-storage, deep-link and distribution contracts.
- [ ] Phase 6 — Evidence summary, durable decisions and Plan 029 readiness gate.

## Phase 0 — Pre-flight

- Confirm Plan 027 is integrated and the native roadmap planning branch has landed in `main`.
- Start from clean, updated `origin/main` on the dedicated Plan 028 branch.
- Read current official Situm React Native quickstart, reference, changelog, mobile positioning docs, API-key guidance, and native Android/iOS auth changelogs.
- Record exact evidence dates/versions; do not rely on earlier chat summaries as authority.

## Phase 1 — Compatibility matrix

Determine and record the exact supported combination for the repository:

- Node/npm version;
- React Native version;
- Expo SDK / development-build workflow;
- `@situm/react-native` version;
- `react-native-webview` version;
- Android min/target SDK, JDK/Gradle requirements and Situm Maven repository handling;
- iOS minimum version, Xcode/CocoaPods/SPM requirements as applicable;
- whether Expo prebuild requires a config-plugin/local patch to preserve Situm native repository/config changes safely across regeneration;
- whether the repository should keep the mobile package standalone under `mobile/` or use npm workspaces. Prefer the smallest repository change that preserves reproducibility.

A fresh bounded proof project may be created outside tracked production source or in a clearly disposable/ignored location. Do not accidentally commit generated credentials or machine-local SDK paths.

## Phase 2 — Situm mobile capability proof

Using the exact current React Native package/reference, prove the callable surface needed by later plans:

- root initialization (`SitumProvider` or current equivalent);
- native `MapView` creation and building selection;
- permission helper / user-helper behavior;
- positioning start/stop and location/status/error callbacks;
- Remote Configuration support and recommended ownership;
- floor/building/POI interactions needed by the product;
- route/navigation start, progress, finish/cancel/error behavior;
- lifecycle behavior on foreground/background transitions;
- Share Live Location / realtime-related methods that actually exist in the React Native wrapper;
- exact Android/iOS differences that later plans must respect.

Do not infer a React Native method merely because the underlying Android/iOS SDK has it.

## Phase 3 — Situm mobile authentication contract

Freeze exactly one least-privilege design for Plan 029+.

Evidence questions:

1. Does the current `@situm/react-native` public API expose JWT/token authorization corresponding to current native Android `Configuration.setToken()` and iOS `SITServices.setToken()`?
2. If yes, what token format, lifetime, refresh responsibility and initialization method are documented/proven?
3. If no, what exact React Native API-key initialization path is current?
4. Can a Situm Positioning-permission API key satisfy Map + positioning/navigation requirements used by this product?
5. Which Realtime operations, if any, require Read-only authority and therefore must remain server-mediated instead of widening the mobile credential?

Preferred decision order:

```text
proven short-lived mobile Situm token
  -> use token, refresh through Situm Explore backend without exposing Read & Write

otherwise
  -> dedicated encrypted workspace Positioning credential
     -> owner-authenticated backend issuance to mobile
     -> persisted only using approved OS secure storage if persistence is required
```

If neither path can be proven safe, Plan 029 is blocked and the user must receive the evidence rather than a guessed implementation.

## Phase 4 — Application authentication/session transport

The mobile app must authenticate as the same PostgreSQL-backed Situm Explore user and access the same owner-scoped workspaces.

Prove the smallest secure transport between React Native and existing Nitro auth:

- whether the existing sealed HttpOnly cookie session can be reliably established, persisted, sent and cleared by the selected React Native/Expo stack on both platforms;
- whether platform cookie persistence requires additional native tooling and how logout/revocation behaves;
- if the cookie contract is not sufficiently reliable, design a dedicated mobile application-session token that still resolves to the same app user and ownership checks without creating a second identity system;
- define expiration, revocation/logout, rotation, storage, CSRF applicability and correlation/telemetry behavior;
- define how base API URL/environment selection works without embedding secrets.

Do not implement a new mobile bearer-token system unless this phase proves the existing cookie session unsuitable and records the security tradeoff explicitly.

## Phase 5 — Secure storage, links and distribution

Freeze:

- approved OS-backed secure storage mechanism for mobile session/Situm material;
- application identifiers/bundle IDs/package names;
- development, staging and production URL schemes/Universal Links/Android App Links strategy;
- deep-link payload contract (`workspace`, optional building/feature context) with **no credentials/tokens in URLs**;
- Android development-build and production artifact path;
- iOS development/build path and which steps are user/macOS-gated;
- whether distribution uses stores, direct Android artifact, EAS, local native build, or a combination. Choose only what the repository/user environment can actually own;
- signing/store secret ownership and ignored/external configuration.

## Phase 6 — Readiness gate

Before marking Plan 028 complete, persist a concise capability matrix that answers all material unknowns above and updates current architecture/decisions where appropriate.

Plan 029 may start only when all of these are frozen:

- exact mobile dependency/version matrix;
- exact mobile directory/build workflow;
- exact application-session transport;
- exact Situm mobile auth model;
- exact secure-storage boundary;
- exact supported platform baseline;
- exact deep-link/application identifiers;
- exact distribution workflow or clearly recorded external gate.

## Validation

At minimum:

- repository docs validation and `git diff --check`;
- any disposable Expo proof must build/run far enough to prove the claimed native integration on available platforms;
- no credential/secret matches in tracked changes;
- no generated native/build artifacts committed unless the frozen Plan 029 structure explicitly requires them.

## Acceptance evidence

Report exact official sources/package versions inspected, runtime/build proofs performed, capability table, auth/session decision, unresolved external gates, and the explicit go/no-go decision for Plan 029.
