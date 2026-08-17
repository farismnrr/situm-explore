# Plan 028 — Native Capability, Auth & Distribution Spike

Branch: `plan/028-native-capability-auth-spike`
Base: updated `origin/main` after the native roadmap planning branch is integrated
Depends on: `plans/028-032-native-mobile-roadmap.md`
Status: active — Phase 0 complete; Phase 1 next

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

- [x] Phase 0 — Pre-flight, dependency and authority reconciliation.
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

### Phase 0 evidence — 2026-08-17

- Dependency/base: roadmap PR #22 is integrated into `main` at merge commit `e9091107f6676e15a0a5887629bb62e84aede0aa`; Plan 027 remains integrated via PR #21. `plan/028-native-capability-auth-spike` was created cleanly from that exact `origin/main` commit.
- Official React Native quickstart: `https://situm.com/docs/a-basic-react-native-app/`, updated 2026-04-17. It explicitly supports an Expo workflow, requires a development build because Situm contains native code, requires `npx expo prebuild`, states Expo Go is insufficient, and currently requires re-applying the Situm Maven repository after prebuild regeneration unless the project automates that safely.
- Official React Native changelog: `https://situm.com/docs/react-native-sdk-changelog/`, updated 2026-08-13. Current top release is 3.19.2 (2026-08-13); 3.19.0 (2026-07-29) added JWT token authentication through `SitumPlugin.setToken()` and optional `SitumProvider.token`, made `SitumProvider.apiKey` optional, and updated the example to React Native 0.83.10 / Android target SDK 37. The current stable marker remains 3.18.27 (2026-07-27). Exact version selection is Phase 1; exact token contract is Phase 3.
- Official React Native TypeDoc: `https://developers.situm.com/sdk_documentation/react-native/typedoc/` is the public wrapper reference used for later exact-surface proof.
- Official positioning guide: `https://situm.com/docs/mobile-sdks-positioning/`, updated 2026-08-05. It documents React Native positioning start/stop and location/status/error concepts and recommends Remote Configuration where possible. Exact callable wrapper surfaces remain Phase 2.
- Official API-key guidance: `https://situm.com/docs/managing-api-keys/`, updated 2026-03-16. Positioning permission is the normal mobile-SDK key level; Read-only is for broader read APIs such as Reporting/Realtime; Read & Write is for internal tasks and should not be available to final users.
- Native auth evidence is distinct from wrapper evidence: Android changelog `https://situm.com/docs/android-sdk-changelog/` (updated 2026-08-03) added `Configuration.setToken()` in 3.37.0 and currently lists 3.38.0; iOS changelog `https://situm.com/docs/ios-sdk-changelog/` (updated 2026-08-14) added `SITServices.setToken()` in 3.40.0 and currently lists 3.41.0. The React Native changelog now separately proves wrapper token support from 3.19.0, but Phase 3 must still freeze token format/lifetime/refresh semantics before implementation.
- Parent review rejected the worker's generic “dual JWT/API-key authentication schema” wording because it did not distinguish native SDK evidence from the React Native wrapper. The current official 3.19.0 changelog resolves wrapper availability, but no Phase 3 auth design is inferred yet.
- Phase 0 blocker result: none. The roadmap assumptions remain compatible with current official evidence and Phase 1 may proceed.

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
