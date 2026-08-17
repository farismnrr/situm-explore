# Plan 029 — Native App Foundation & Workspace Session

Branch: `plan/029-native-app-foundation`
Base: updated `origin/main` after Plan 028 is integrated
Depends on: Plan 028 complete/integrated
Status: in progress

## Objective

Create the production-owned Situm Explore Mobile application foundation using the exact contracts frozen by Plan 028: React Native + Expo development build, existing Situm Explore application identity/workspaces, secure native session handling, least-privilege Situm mobile authorization, environment configuration, navigation shell, and safe error/telemetry boundaries.

Do not implement the production Map, positioning/navigation, or Realtime feature set yet.

## Rules

- Reuse the existing Nitro backend, PostgreSQL users, workspace ownership and safe-error conventions.
- No second backend, second user database or duplicated business authority.
- Do not expose the workspace Read & Write Situm credential to mobile.
- Follow the Plan 028 auth/session and secure-storage decisions exactly; reopen them only with new evidence.
- Keep secrets and signing material external/ignored.
- Use the repository's npm workflow; do not introduce a second package manager.
- Treat `DESIGN.md` and `design/reference/situm-explore-native-responsive-prototype.html` as the binding native visual/interaction reference. Reuse the existing Situm Explore tenant identity rather than creating a separate native design system.
- Capability/security truth from Plan 028 overrides prototype presentation; document any required visual/interaction deviation instead of faking unavailable behavior.
- No PR/merge without explicit user authorization.

## Frozen Plan 028 inputs

Plan 029 uses these exact contracts without reopening them by assumption:

- Structure: standalone `mobile/` package; no npm workspaces.
- Stack: Expo 57.0.13, React Native 0.86.2, React 19.2.3, `@situm/react-native` 3.19.2, `react-native-webview` 13.16.1, Android min/compile/target SDK 24/36/36, JDK 21, Kotlin 2.1.20, and Gradle 9.3.1.
- Application session: the same PostgreSQL-backed application identity as web; mobile login issues the same sealed h3 session value; native sends it through `x-nuxt-session`; maximum age is seven days; possession is bearer-equivalent authentication; `expo-secure-store` `~15.0.x` is the only approved persistent storage boundary. Server-side revocation/version checks are mandatory before production auth acceptance. Logout must clear server and local state according to the frozen contract, while local deletion is not itself server revocation.
- Situm authority: a dedicated workspace Positioning API key, encrypted at rest server-side and issued only after owner authorization. Never expose the Read & Write primary or reuse the browser Viewer credential. JWT remains unselected. Realtime remains server-mediated.
- Native identity: Android application ID `com.situm.explore`; iOS bundle ID `com.situm.explore`.
- UI authority: `DESIGN.md` and `design/reference/situm-explore-native-responsive-prototype.html` remain binding visual/interaction references. Capability and security evidence takes precedence; unavailable interactions require truthful fallbacks.

Required early gates:

- Revalidate the `@situm/react-native` 3.19.2 published `lib/` TypeScript omission before choosing any workaround.
- Implement the mobile session response and server-side session revocation/version checks.
- Implement owner-authorized Positioning credential issuance without returning either broader Situm credential.
- Prove `expo-secure-store` behavior on an actual Android development build.
- Preserve iOS as MACOS/DEVICE-GATED when macOS/Xcode/device access is unavailable.

## Phase checklist

- [x] Phase 0 — Pre-flight and Plan 028 contract verification.
- [x] Phase 1 — Production mobile project scaffold and reproducible native configuration.
- [x] Phase 2 — Environment, API client, safe error and correlation boundary.
- [x] Phase 3 — Native login/session/logout using existing application identity.
- [x] Phase 4 — Workspace list/select and mobile Situm credential readiness.
- [ ] Phase 5 — Mobile shell, lifecycle and secure persistence.
- [ ] Phase 6 — Foundation acceptance and persistence closeout.

## Phase 0 — Contract verification

- Confirm Plan 028 is integrated into updated `main`.
- Read the frozen version/auth/session/storage/distribution decisions and refuse to substitute newer guesses silently.
- Recheck current SDK release notes only if the dependency version materially changed since Plan 028; record any required revalidation.

## Phase 1 — Mobile project

Create the mobile application in the standalone `mobile/` package selected by Plan 028; do not add npm workspaces.

Requirements:

- React Native + Expo development-build project using the frozen versions;
- reproducible native Android/iOS generation/configuration;
- Situm native repository/plugin configuration survives the approved regeneration workflow;
- application/bundle identifiers match Plan 028;
- TypeScript strict enough for app-owned contracts;
- platform-specific config is explicit and minimal;
- build output, machine-local SDK paths, provisioning files and signing secrets remain ignored/external;
- do not convert the entire repository into a generic monorepo abstraction unless Plan 028 proved it necessary.

## Phase 2 — API boundary

Add a small typed mobile API layer for the existing Nitro backend.

Requirements:

- environment-aware API base URL without embedded credentials;
- existing request/correlation header conventions reused where practical;
- safe normalized product errors; detailed diagnostics stay server-side;
- timeouts/cancellation on app-owned network calls where the runtime supports them;
- no direct PostgreSQL/ClickHouse access;
- no generic backend proxy or raw endpoint escape hatch;
- authenticated workspace routes remain owner-checked server-side.

## Phase 3 — Application session

Implement the Plan 028-approved native application-session model.

Acceptance-critical behavior:

- login with existing email/password account;
- same app user identity as web;
- session survives an ordinary app restart only when the approved security model allows persistence;
- logout clears/revokes native session material according to the frozen contract;
- invalid/expired/revoked session returns to login safely;
- no password/session token stored in AsyncStorage/plaintext files/logs/traces;
- rate-limited existing auth endpoints remain respected rather than bypassed with a parallel auth path.

Implement the narrow mobile session response required by the frozen sealed h3 session contract and keep all user/workspace authorization in the existing server model. Do not introduce a JWT or second identity system.

## Phase 4 — Workspace context and mobile Situm authority

Implement:

- owner-scoped workspace list;
- selected workspace state;
- workspace switching;
- clear states for missing/incomplete mobile Situm configuration;
- the exact Plan 028 least-privilege mobile Situm auth flow;
- organization/permission validation before mobile authority is issued;
- no Read & Write credential in mobile responses, storage or bundles.

Extend workspace configuration/persistence with authenticated encryption and write-only UX metadata for the dedicated Positioning credential, following the existing primary/Viewer credential pattern. Issue it only after owner authorization; never return the Read & Write primary or browser Viewer credential. Keep Realtime server-mediated.

## Phase 5 — Shell and lifecycle

Provide the minimum real app shell required by Plans 030–031:

- authenticated navigation structure;
- workspace switcher/access point;
- placeholder Map and Realtime destinations clearly marked as not yet implemented;
- loading/offline/error states;
- session/workspace restoration;
- foreground/background lifecycle hooks needed by later plans without starting positioning prematurely;
- accessibility basics and mobile-safe layouts;
- no duplicate web admin/analytics UI unless required by the mobile product.

Visual acceptance for this phase:

- shell, brand, surface treatment, typography/density, icon language and responsive navigation follow the native reference;
- phone, tablet/POS and wide-display layouts preserve the reference hierarchy rather than merely scaling one phone layout;
- placeholder destinations use the same Map/Realtime vocabulary that Plans 030–031 will implement;
- no dark-mode/native-only visual identity is introduced unless the user later explicitly changes the product direction.

## Phase 6 — Acceptance

Required local checks include the root repository validation plus the mobile package's lint/typecheck/build checks frozen by Plan 028.

Runtime acceptance on available physical/simulator targets must prove:

- login/logout;
- session persistence/expiry behavior;
- workspace selection/switching;
- owner isolation;
- mobile Situm auth readiness without credential leakage;
- app restart behavior;
- safe handling of backend unavailability;
- no secrets in logs, tracked files or generated distributable bundle inspection where practical.

Do not claim iOS runtime acceptance if no iOS-capable host/device is available; record the external gate explicitly.

## Closeout

Update the plan, `.agents/state.md`, durable decisions/knowledge when warranted, architecture/capability docs if runtime truth changed, and session evidence before every phase commit. Commit/push each completed phase according to repository protocol; stop before PR until user authorization.
