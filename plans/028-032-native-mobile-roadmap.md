# Native Companion Roadmap — Plans 028–032

Status: **planned; implementation not started**

Planning branch: `roadmap/028-032-native-mobile`

## Product decision

Situm Explore will add a native companion application while keeping the existing Nuxt application as the web/admin/analytics client and Nitro as the single application backend.

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

Target stack: React Native + Expo development builds + `@situm/react-native`, subject to the hard capability/auth evidence gate in Plan 028.

Current official evidence as of 2026-08-17 supports an Expo development-build integration path and a React Native `MapView`; current Situm mobile documentation also supports positioning/navigation concepts and recommends Positioning-permission credentials for normal mobile SDK use. Native Android/iOS SDKs recently added JWT-token authorization, but the public React Native surface must be verified before any token-based design is implemented.

Primary evidence starting points:

- https://situm.com/docs/a-basic-react-native-app/
- https://situm.com/docs/react-native-sdk-changelog/
- https://situm.com/docs/mobile-sdks-positioning/
- https://situm.com/docs/managing-api-keys/
- https://developers.situm.com/sdk_documentation/react-native/

## Sequence

```text
Plan 028 — Native Capability, Auth & Distribution Spike
-> Plan 029 — Native App Foundation & Workspace Session
-> Plan 030 — Native Map, Positioning & Navigation
-> Plan 031 — Native Realtime Operations
-> Plan 032 — Web/Native Handoff, Distribution & Full Regression
```

Normal workflow requires this planning branch to be integrated into `main` before Plan 028 starts. Each later plan starts from updated `origin/main` only after its predecessor is integrated, unless the user explicitly authorizes stacked execution.

## Cross-plan architecture rules

- Keep one application backend: the existing Nitro server.
- Reuse the existing PostgreSQL users/workspaces and workspace ownership checks.
- Do not create a second auth/user database for mobile.
- The existing Read & Write Situm primary credential remains server-only.
- The existing Read-only Viewer credential remains the browser Viewer credential unless a later evidenced change supersedes it.
- Mobile Situm authority must be least-privilege. Prefer a short-lived token if the current React Native SDK exposes a proven token contract; otherwise use a dedicated Positioning-permission credential according to current Situm guidance. Never embed the Read & Write credential in the app.
- Do not hardcode application secrets, Situm credentials, signing secrets, store credentials, or backend session tokens in source or build config.
- Use OS-backed secure storage for mobile session/credential material when the chosen auth contract requires persistence.
- Do not put auth/session/Situm credentials in deep-link URLs.
- Web Map capability is determined by tested viewport/layout capability, not user-agent sniffing. Platform detection may be used only for choosing install/store destinations.
- Realtime being native-only is an intentional product policy; do not describe it as a technical impossibility of the web SDK.
- Situm capability changes remain subject to **no evidence, no implementation**.

## Cross-plan native UI/UX contract

Native implementation must use `DESIGN.md` plus `design/reference/situm-explore-native-responsive-prototype.html` as the canonical native visual/interaction reference.

- Native remains the same Situm Explore tenant/product as web: reuse the existing light cool-neutral palette, brand mark, typography/density intent, border-first surfaces, radius/shadow language and Lucide-style icons rather than creating a separate visual identity.
- Adapt interaction for native/window size without changing product truth: phone may use bottom navigation, tablet/POS may use a compact rail, and large/wide displays may use an expanded sidebar according to the reference.
- Keep cross-client feature vocabulary coherent. Map remains the Map product destination even when the screen copy is end-user-oriented (for example, “Where do you want to go?”). Realtime remains Realtime positions rather than an invented social/presence concept.
- Realtime native UI must align with the same Situm/backend data semantics used by the web history/current workspace route: device/position identity, building, floor, accuracy, coordinates where useful, and source time/freshness. Do not invent person names or online/idle/offline state unless a later evidenced contract proves them.
- Permission UX is contextual and degradable: request location only from a feature that needs it, keep supported browsing/route-planning flows usable when permission is denied where the evidenced SDK flow allows it, and do not request background location merely because the platform exposes it.
- The HTML reference never overrides capability/security evidence. If Plan 028 or an installed SDK proves a referenced interaction unavailable, implement the truthful supported state and document the deviation rather than simulating success.

## Platform target

Target Android and iOS from one React Native codebase. Android physical-device acceptance is expected to be locally executable when an Android device/toolchain is available. iOS build/device acceptance may remain explicitly user/macOS-gated if the execution environment cannot run Xcode; source/config acceptance must still be complete and truthful.

## Roadmap completion condition

The roadmap is complete only when:

- native login/session and workspace selection use the existing application identity model;
- mobile Situm authentication is least-privilege and evidence-backed;
- native Map/positioning/navigation is accepted on a real supported device;
- native Realtime is truthful and accepted for its frozen scope;
- phone web Map routes to native handoff while desktop/tablet web Map remains available;
- all web Realtime entry points route to native handoff;
- deep links/install fallback do not leak credentials;
- distribution/signing configuration is documented without committed secrets;
- web and native regression evidence is recorded;
- architecture, capability matrix, and durable agent context match final runtime truth.
