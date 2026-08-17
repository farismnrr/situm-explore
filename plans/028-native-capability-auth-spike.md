# Plan 028 — Native Capability, Auth & Distribution Spike

Branch: `plan/028-native-capability-auth-spike`
Base: updated `origin/main` after the native roadmap planning branch is integrated
Depends on: `plans/028-032-native-mobile-roadmap.md`
Status: active — Phase 3 complete; Phase 4 next

## Objective

Prove the exact current contracts required to build Situm Explore Mobile before production mobile code is introduced. Freeze the React Native/Expo version matrix, Situm mobile capability surface, mobile application-session transport, least-privilege Situm authentication model, secure-storage boundary, deep-link identifiers, and build/distribution workflow.

This is an evidence plan. Do not implement product Map/Realtime screens here.

Downstream native UI implementation is visually governed by `DESIGN.md` and `design/reference/situm-explore-native-responsive-prototype.html`. Plan 028 must not redesign that reference; it must identify any SDK/platform constraints that Plans 029–032 need to apply truthfully when translating it to React Native.

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
- [x] Phase 1 — Freeze React Native / Expo / Situm SDK compatibility matrix.
- [x] Phase 2 — Prove native Map, positioning, permission and navigation surfaces.
- [x] Phase 3 — Freeze least-privilege Situm mobile authentication contract.
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

### Phase 1 evidence — 2026-08-17

Selected matrix, proven by package metadata, Expo prebuild, Expo Doctor, and a disposable Android development build:

| Component | Frozen value / evidence |
| --- | --- |
| Node / npm | Node 24.15.0 / npm 11.16.0 on the proof host; Expo 57 requires Node >=22.13. |
| Expo / React Native / React | Expo SDK 57.0.13 / React Native 0.86.2 / React 19.2.3. Expo SDK 57 is New Architecture-only. |
| Situm wrapper / WebView | `@situm/react-native` 3.19.2 / `react-native-webview` 13.16.1. Wrapper peers are React >=17, React Native *, React DOM >=17 and WebView >=11. |
| Situm native SDKs | Android 3.38.0 (`3.38.0@aar`) / iOS 3.41.0. |
| Android | min SDK 24 / compile SDK 36 / target SDK 36 / build tools 36.0.0. |
| Android toolchain | JDK 21.0.10 / Kotlin 2.1.20 / Gradle wrapper 9.3.1. |
| iOS | Effective app minimum 16.4 (Expo matrix); Xcode 26.4+; CocoaPods integration through the wrapper podspec; SPM is not used by this package. |

Proof details:

- A disposable proof at `/tmp/situm-explore-plan028-proof` installed the exact matrix, including `react-dom` 19.2.3 for the wrapper peer contract. `npx expo-doctor` reported 20/21 checks passed; the sole warning was React Native Directory metadata stating `@situm/react-native` is “Untested on New Architecture.” This is a directory warning, not a compile failure.
- `npx expo prebuild --clean` completed on Linux and generated Android/iOS native projects. CocoaPods installation was skipped because the host is not macOS. Generated Android `gradle.properties` had `newArchEnabled=true`.
- With Android SDK `/home/farismnrr/Android/Sdk`, `ANDROID_HOME=... ANDROID_SDK_ROOT=... ./gradlew assembleDebug -PreactNativeArchitectures=arm64-v8a --max-workers=2 --console=plain` completed `BUILD SUCCESSFUL in 50s` and produced `android/app/build/outputs/apk/debug/app-debug.apk`. The log shows Expo/RN Gradle plugin configuration, Situm Java compilation, React Native WebView codegen/CMake, and APK packaging.
- The wrapper's own `android/build.gradle` declares `https://repo.situm.es/artifactory/libs-release-local`; the clean prebuild/build required no application-owned Maven edit and resolved the Situm Android AAR. No custom Expo config plugin or local patch is warranted by this proof.
- Android compilation under Expo SDK 57 / React Native 0.86 New Architecture is proven. This does not prove that `@situm/react-native` is fully compatible with New Architecture, nor does it prove runtime Map/positioning/navigation behavior.
- The wrapper `ReactNativeSitumPlugin.podspec` declares `SitumSDK` 3.41.0 and uses CocoaPods for the iOS native dependency. The effective Expo/iOS baseline is 16.4, which is the selected intersection for the app. iOS native compilation is MACOS-GATED on this Linux host; iOS runtime is DEVICE/MACOS-GATED. Package/podspec compatibility is evidence-proven at source/package level only, not an iOS compile PASS.

Repository structure decision: Plan 029 should use a standalone `mobile/` package, not npm workspaces. The existing root is a single Nuxt package with no workspace arrangement; keeping the future native package isolated preserves the smallest reproducible change and avoids coupling native dependency resolution to the web lockfile. Plan 029 must create that package; this phase creates no production mobile project.

Phase 1 capability/UI constraint handoff: this proof establishes native build integration only. It does not authorize the approved reference's Map, blue-dot, floor, POI, directions, route-metric, remote-position, background, or Share Live Location interactions. Those remain Phase 2 evidence questions; unsupported reference states must use documented truthful fallbacks.

### Phase 2 evidence — 2026-08-17

The exact installed wrapper source was inspected from `/tmp/situm-explore-plan028-proof/node_modules/@situm/react-native` at 3.19.2. The Android module compiled in Phase 1. The source proves the following public surface; no production screen or credential-backed runtime test was performed.

| Reference interaction | Classification | Evidence / downstream constraint |
| --- | --- | --- |
| Root initialization / `SitumProvider` | PROVEN SUPPORTED | Provider initializes the plugin, applies `apiDomain`, and accepts `apiKey` or `token`; children render only after initialization/auth effects complete. |
| MapView / current map destination | PROVEN SUPPORTED | `MapView` is a React Native WebView-backed component requiring `buildingIdentifier`; it exposes load/error, POI, floor and favorite callbacks plus imperative map controls. Native compile is proven; map rendering/runtime remains device/backend-gated. |
| Building selection | SUPPORTED WITH PLATFORM/OWNER DIFFERENCE | `fetchBuildings`, `fetchBuildingInfo`, and `MapView` building configuration are exposed. There is no public imperative `selectBuilding` method; Plan 030 must own workspace/building changes by controlled MapView lifecycle/remount and must clear stale state. |
| Contextual location permission / user helper | PROVEN SUPPORTED WITH PLATFORM DIFFERENCE | `configureUserHelper`, `enableUserHelper`, and `disableUserHelper` exist; the helper addresses missing Location/Bluetooth permission and sensors. Android/iOS system permission behavior still requires device proof. Request only from positioning-dependent actions. |
| Find my location / blue dot | PROVEN SUPPORTED | `requestLocationUpdates`/`removeLocationUpdates`, `onLocationUpdate`, status and error callbacks exist; MapView forwards location/status/error to its viewer. Runtime sensor accuracy and denial states require device proof. |
| Floor switching | PROVEN SUPPORTED | `MapViewRef.selectFloor` and `onFloorChanged`, plus `fetchFloorsFromBuilding`, are present. Floor IDs are string-based in SDK data and must not be conflated with display level numbers. |
| POI selection/search/details | PROVEN SUPPORTED | Indoor/outdoor POI fetch, category fetch, `selectPoi`, `deselectPoi`, category selection, search and POI callbacks are present. HTML `infoHtml` is upstream data and needs safe product rendering later. |
| Directions/navigation | PROVEN SUPPORTED | `MapViewRef.navigateToPoi`/`navigateToPoint`/`cancelNavigation`, `requestDirections`, navigation start/progress/destination/out-of-route/cancel/error callbacks and update/remove methods exist. The wrapper's `Directions` alias is `any`; route metrics must be used only from concrete returned progress/route fields. |
| Route metrics/instructions | SUPPORTED WITH TRUTHFUL LIMIT | `NavigationProgress` source types expose distances, time-at-1m/s, indications, points and segments; however the MapView viewer event payload and real device semantics were not runtime-proven. Do not display ETA/steps/geometry unless the later device proof confirms the exact payload. |
| Generic Realtime positions | PROVEN DATA API; TRUTHFUL MAP FALLBACK REQUIRED | `requestRealTimeUpdates(options)` emits `realtimeUpdated`/`realtimeError`; `RealTimeRequest` is `{building, pollTime}` and `RealTimeData` is `{locations: Location[]}`. Location data includes coordinates, building/floor and accuracy where present. No public MapView remote-marker/focus API exists; Plan 031 must retain a list/detail experience and only map-focus if separately proven. |
| Selected remote-position focus | BLOCKED / UNPROVEN | The wrapper has no public remote-marker overlay or selected-remote focus method. Do not simulate a marker or identity mapping. |
| Background positioning | SUPPORTED WITH PLATFORM DIFFERENCE; NOT ENABLED BY THIS SPIKE | Android `LocationRequest` exposes foreground-service options; iOS source handles foreground/background notifications and Always authorization only when configured. This does not prove a safe product background contract. Plan 030 must not request background location in the initial flow. |
| Share Live Location | PROVEN API SURFACE; SEMANTICS/DEVICE GATED | `startShareLiveLocation`/`stopShareLiveLocation` exist and MapView handles share-session start/stop messages plus `setShareLiveLocationSession`. Session creation, permissions, links and cross-device behavior require later device/backend proof. |

Platform/source constraints:

- Android and iOS both expose the base wrapper methods, token bridges, positioning, directions, realtime and Share Live Location native methods. Android additionally exposes foreground-service notification options in `LocationRequest`; iOS exposes `outdoorLocationOptions` as Android-only in the TypeScript contract and maps Always/When-In-Use authorization through iOS location APIs.
- `MapView` uses `react-native-webview`; external links default to the system browser unless intercepted. The native share polyfill path is explicitly Android-only in the MapView source. `validateMapViewProjectSettings` is guarded to iOS.
- The public npm package declares `lib/typescript` and `lib/module` in `package.json`, but the 3.19.2 published tarball/install has no `lib/` directory. Metro uses its `react-native: src/index` entry and the Android build succeeds, so this is not a native compilation blocker. It is a TypeScript package-resolution issue that Plan 029 must recheck before choosing a local declaration/source-resolution workaround; no patch is introduced in Plan 028.

Phase 2 conclusion: native build integration, MapView, positioning, cartography, navigation, permissions helper, generic realtime data, and Share Live Location API surfaces are source-proven. Generic remote map overlays/focus, runtime payload semantics, system permissions, background behavior, session sharing and iOS compilation remain unproven or gated as classified above. No capability is promoted to production implementation solely from this source proof.

### Phase 3 evidence — 2026-08-17

Auth evidence reviewed:

- Installed `@situm/react-native` 3.19.2 exposes `SitumPlugin.setToken(token)`, `SitumProvider.token`, and native Android/iOS token bridges. The Provider documentation states token renewal is the client's responsibility.
- Current official React Native changelog evidence recorded in Phase 0 says JWT support was added in wrapper 3.19.0. The current official React Native quickstart does not define a Situm Explore-compatible token issuer, claims, lifetime, refresh endpoint, or revocation contract. The native source accepts an opaque string and returns only a boolean success result.
- Current official API-key guidance ([Managing API Keys](https://situm.com/docs/managing-api-keys/), updated 2026-03-16) says Positioning keys provide basic cartography/internal location access and are the normal mobile-SDK key; Only Read additionally permits all data reads including Realtime; Read & Write is for internal tasks and must not be available to final users. The REST quickstart corroborates the permission ladder ([REST API Quickstart](https://situm.com/docs/websdk-rest-api-quickstart-guide/)).

Frozen v1 contract:

1. Do not select JWT for Plan 029. Wrapper availability alone is insufficient without a proven issuer, token format/claims, lifetime, refresh, revocation and failure contract.
2. Each native-enabled workspace must have a dedicated Situm **Positioning** API key, separate from the server-only Read & Write primary and separate from the browser Read-only Viewer credential. It is encrypted at rest with the existing server-side workspace secret boundary and is never bundled, logged, placed in public runtime configuration or put in URLs.
3. After the authenticated Situm Explore application session and owner/workspace authorization succeed, a future server-owned endpoint may issue the dedicated Positioning key to the native client over the authenticated transport. The native app may keep it in memory for the session; persistence is optional and, if required, must use the Phase 5 OS secure-storage decision. Plan 029 must not return the primary or Viewer credential in this flow.
4. The Positioning key is for the wrapper’s Map/cartography/positioning/navigation path only. Read-only Realtime and other broad GET operations remain server-mediated through the existing owner-scoped Nitro boundary unless a later evidence change proves a narrower contract.
5. A missing, revoked, or invalid Positioning key is a recoverable auth/configuration state. Native UI must show a safe unavailable/retry state and must not silently substitute the primary, Viewer, or a guessed token.

Auth decision: PASS for the dedicated Positioning-key contract; JWT is explicitly UNSELECTED/UNPROVEN, not rejected as impossible. No credential value or auth endpoint was implemented in this evidence phase.

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

Plan 028 closeout must also hand downstream plans an explicit capability-to-reference note for any native reference interaction that cannot be implemented exactly as drawn (for example generic remote-position map overlays, permission helpers, route metrics, background behavior or platform-specific navigation differences). Absence of such a capability means a documented truthful fallback, never prototype-matching fake behavior.

## Validation

At minimum:

- repository docs validation and `git diff --check`;
- any disposable Expo proof must build/run far enough to prove the claimed native integration on available platforms;
- no credential/secret matches in tracked changes;
- no generated native/build artifacts committed unless the frozen Plan 029 structure explicitly requires them.

## Acceptance evidence

Report exact official sources/package versions inspected, runtime/build proofs performed, capability table, auth/session decision, unresolved external gates, and the explicit go/no-go decision for Plan 029.
