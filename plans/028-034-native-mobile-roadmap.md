# Native Companion Roadmap — Plans 028–034

Status: **closed by user decision on 2026-08-18; Plan 034 retains documented unpassed physical blockers rather than claiming full E2E PASS**

Original planning branch: `roadmap/028-032-native-mobile`
Acceptance split branch: `roadmap/032-033-e2e-split`
Historical UI/E2E reconciliation branch: `roadmap/033-034-native-ui-reconciliation`

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
-> Plan 032 — Web/Native Handoff & Distribution [integrated]
-> Plan 033 — Native UI/UX Reference Reconciliation [complete/integrated]
-> Plan 034 — Full E2E Acceptance & Roadmap Closeout [closed by user decision; limitations retained]
-> Plan 035 — Realtime Remediation [complete/integrated via PR #32]
```

Historical sequencing rule: each dependent plan started from updated `origin/main` after its predecessor unless the user explicitly authorized stacking. The roadmap is now closed.

## Consolidated E2E policy

Plans 030 and 031 were allowed to integrate after implementation/build/test review because no supported physical Android device and calibrated runtime path were available. Their physical-only acceptance was **deferred, not passed**.

Plan 032 is integrated. It owns web/native routing, deep-link behavior, install/open fallback and distribution configuration; its real cross-client/open/install/auth/workspace acceptance remains explicitly unpassed.

Plan 033 is the final native presentation implementation pass before physical/full E2E. It reconciles shell, Explore/Map, Realtime, Recent, Settings and authentication with the canonical native responsive reference across phone, tablet/POS and wide layouts while preserving all backend/SDK/security truth from Plans 028–032. It may close on reviewer-approved implementation plus truthful non-device/emulator visual validation, but it may not convert physical-device or cross-client acceptance to PASS.

Plan 034 was originally defined as the terminal, non-deferrable full E2E gate. On 2026-08-18 the user explicitly superseded that roadmap-administration rule and closed Plan 034 with truthful documented blockers. It inherited:

- every unpassed supported-device Map/positioning/navigation check from Plan 030;
- every unpassed supported-device Realtime/native lifecycle check from Plan 031;
- cross-client web-to-native, deep-link, install/open, auth/session/workspace and distribution-path E2E from Plan 032;
- real-device presentation/interaction confirmation for the reconciled Plan 033 native UI;
- final security/secret/logging and lifecycle regression across the completed native roadmap.

Historical acceptance rule: emulator evidence could not satisfy physical sensor/device claims. Plan 034 was later closed administratively with those limitations preserved. Plan 035 subsequently verified real POS sensor-backed positioning plus server-mediated own-device Realtime for its narrower remediation scope; that does not retroactively convert every unexercised Plan 034 item to PASS.

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

Target Android and iOS from one React Native codebase. Supported Android physical-device acceptance is the mandatory locally executable gate for Plan 034 when the required device/building/profile/credentials are available. iOS build/device acceptance may remain explicitly macOS/Apple-device gated when the execution environment cannot run Xcode; source/config acceptance must still be complete and truthful.

## Roadmap completion condition

Original completion criteria were defined as follows. The later explicit closure override remains authoritative and preserves any unmet item as historical limitation rather than silently converting it to PASS:

- native login/session and workspace selection use the existing application identity model;
- mobile Situm authentication is least-privilege and evidence-backed;
- native Map/positioning/navigation is accepted on a real supported Android device;
- native Realtime is truthful and accepted for its frozen scope;
- native shell, Explore, Realtime, Recent, Settings and authentication match the canonical responsive reference as closely as real backend/SDK authority allows across phone, tablet/POS and wide layouts;
- phone web Map routes to native handoff while accepted desktop/tablet web Map remains available;
- all web Realtime entry points route to native handoff;
- deep links/install fallback work end-to-end without leaking credentials;
- distribution/signing configuration is documented without committed secrets;
- final web/native/full-device regression evidence is recorded;
- architecture, capability matrix, plans and durable agent context match final runtime truth.


## 2026-08-18 closure override

By explicit user decision, this roadmap was administratively closed without converting unresolved physical acceptance to PASS. The then-observed vendor POS positioning blocker (`LOCATION 8002`, `network provider enabled=false`) and other unexercised physical/cross-client gates remain truthful historical limitations in Plan 034 evidence. Plan 035 was then executed as a separate bounded remediation, physically verified real Situm indoor fixes and own-device server-mediated Realtime, and was integrated through PR #32 at merge commit `840c0f9`. No active native-roadmap plan remains.
