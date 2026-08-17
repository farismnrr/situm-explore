# Native Companion Roadmap — Plans 028–033

Status: **in progress; Plans 028–031 integrated, Plans 032–033 remaining**

Original planning branch: `roadmap/028-032-native-mobile`
Current acceptance split: `roadmap/032-033-e2e-split`

## Product decision

Situm Explore adds a native companion application while keeping the existing Nuxt application as the web/admin/analytics client and Nitro as the single application backend.

Approved experience policy:

```text
Map
  desktop/tablet web  -> existing web Situm Viewer
  phone web           -> open/download Situm Explore Mobile

Realtime
  desktop web         -> open/download Situm Explore Mobile
  tablet web          -> open/download Situm Explore Mobile
  phone web           -> open/download Situm Explore Mobile
```

Native ownership includes handset positioning, blue dot, mobile sensor/permission lifecycle, mobile navigation, and the native realtime experience. The native app is a second client, **not** a second backend.

## Technology direction

Target stack: React Native + Expo development builds + `@situm/react-native`, using the exact capability/auth evidence frozen by Plans 028–031.

## Sequence

```text
Plan 028 — Native Capability, Auth & Distribution Spike [integrated]
-> Plan 029 — Native App Foundation & Workspace Session [integrated]
-> Plan 030 — Native Map, Positioning & Navigation [integrated; physical E2E unpassed]
-> Plan 031 — Native Realtime Operations [integrated; physical E2E unpassed]
-> Plan 032 — Web/Native Handoff & Distribution
-> Plan 033 — Full E2E Acceptance & Roadmap Closeout
```

Each dependent plan starts from updated `origin/main` only after its predecessor is integrated, unless the user explicitly authorizes stacked execution.

## Consolidated E2E policy

Plans 030 and 031 were allowed to integrate after implementation/build/test review because no supported physical Android device and calibrated runtime path were available. Their physical-only acceptance was **deferred, not passed**.

Plan 032 is now implementation-focused. It owns web/native routing, deep-link behavior, install/open fallback, distribution configuration, and all truthful non-device validation available from builds, unit/integration tests, browser viewport checks, and emulator/runtime smoke. Plan 032 must enumerate every remaining end-to-end acceptance item but does **not** own the final full E2E gate.

Plan 033 is the terminal, non-deferrable full E2E gate. It inherits:

- every unpassed supported-device Map/positioning/navigation check from Plan 030;
- every unpassed supported-device Realtime/native lifecycle check from Plan 031;
- cross-client web-to-native, deep-link, install/open, auth/session/workspace and distribution-path E2E from Plan 032;
- final security/secret/logging and lifecycle regression across the completed native roadmap.

Emulator evidence may supplement Plan 033 but cannot satisfy real indoor-positioning, BLE/Wi-Fi/sensor, blue-dot/floor-transition, or equivalent physical-device claims. If the required supported physical Android device/runtime environment is unavailable, Plan 033 remains blocked and the roadmap remains incomplete. There is no further deferral after Plan 033.

## Cross-plan architecture rules

- Keep one application backend: the existing Nitro server.
- Reuse the existing PostgreSQL users/workspaces and workspace ownership checks.
- Do not create a second auth/user database for mobile.
- The existing Read & Write Situm primary credential remains server-only.
- The existing Read-only Viewer credential remains the browser Viewer credential unless evidenced authority explicitly supersedes it.
- Mobile Situm authority remains least-privilege; do not embed the Read & Write credential in the app.
- Do not hardcode application secrets, Situm credentials, signing secrets, store credentials, or backend session tokens in source or build config.
- Use OS-backed secure storage for approved mobile session material.
- Do not put auth/session/Situm credentials in deep-link URLs, QR codes, store links or analytics.
- Web Map capability is determined by tested viewport/layout capability, not user-agent sniffing. Platform detection may be used only for install/store selection.
- Realtime being native-only is an intentional product policy; do not describe it as a technical impossibility of the web SDK.
- Situm capability changes remain subject to **no evidence, no implementation**.

## Cross-plan native UI/UX contract

Native implementation uses `DESIGN.md` plus `design/reference/situm-explore-native-responsive-prototype.html` as the canonical native visual/interaction reference.

- Native remains the same Situm Explore product as web.
- Adapt interaction for phone, tablet/POS and wide layouts without changing product truth.
- Keep Map and Realtime vocabulary coherent across clients.
- Realtime remains device-position oriented; do not invent person names or online/idle/offline state.
- Permission UX remains contextual and degradable.
- The HTML reference never overrides capability/security evidence.

## Platform target

Target Android and iOS from one React Native codebase. Supported Android physical-device acceptance is the mandatory locally executable gate for Plan 033 when the required device/building/profile/credentials are available. iOS build/device acceptance may remain explicitly macOS/Apple-device gated when the execution environment cannot run Xcode; source/config acceptance must still be complete and truthful.

## Roadmap completion condition

The roadmap is complete only when Plan 033 has discharged every accumulated E2E carry-over and:

- native login/session and workspace selection use the existing application identity model;
- mobile Situm authentication is least-privilege and evidence-backed;
- native Map/positioning/navigation is accepted on a real supported Android device;
- native Realtime is truthful and accepted for its frozen scope;
- phone web Map routes to native handoff while accepted desktop/tablet web Map remains available;
- all web Realtime entry points route to native handoff;
- deep links/install fallback work end-to-end without leaking credentials;
- distribution/signing configuration is documented without committed secrets;
- final web/native/full-device regression evidence is recorded;
- architecture, capability matrix, plans and durable agent context match final runtime truth.
