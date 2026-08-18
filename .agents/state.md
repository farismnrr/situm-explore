# Current State

_Last reviewed: 2026-08-18_

## Current focus

There is currently **no active implementation plan or plan branch**. Plans 017–035 are closed/integrated or administratively closed as recorded in their plan/evidence files. The latest integrated native/mobile work landed through PR #32 at merge commit `840c0f9` (`Complete realtime remediation and Android release flow`); the former `plan/035-realtime-remediation` branch was deleted locally and remotely after merge.

New product work must start from updated `main` on a new dedicated plan branch. Historical plans, execution briefs, sessions, reviews, and evidence remain context/evidence only and must not be treated as current execution instructions.

## Native companion final state

The native companion remains a standalone React Native + Expo application under `mobile/`, sharing the existing Nitro/PostgreSQL application identity and workspace ownership model. Nitro remains the single application backend.

Current product/security boundaries:

- web Map remains available on capable desktop/tablet Viewer layouts; phone web Map uses the native handoff policy;
- web Realtime entry points use the native handoff policy;
- native Realtime remains server-mediated through owner-scoped workspace APIs;
- the workspace Read & Write Situm credential remains server-only;
- browser Viewer uses the separate verified Read-only Viewer credential;
- native positioning uses the dedicated least-privilege Positioning credential only after owner authorization and explicit user action;
- mobile application/session material remains protected by the existing sealed-session + SecureStore contract;
- unsupported presence/freshness/remote-marker/route semantics remain absent rather than fabricated.

Plan 035 fixed the foreground-positioning lifecycle defect by moving singleton Situm callback/request ownership into a shell-scoped `ForegroundPositioningSession`, with explicit stop, workspace switch, logout, background, native error/stopped, and teardown handling. Android runtime permission gating occurs before Positioning-credential retrieval/native positioning.

Physical POS evidence for the bounded Plan 035 scope is PASS: the device produced real `SITUM_PROVIDER` indoor fixes for building `19866` / floor `69905` with HIGH quality and approximately 1.3 m accuracy; starting location from Realtime continued fixes; the server-mediated poll returned the real reported position; Realtime rendered it; and Explore ↔ Realtime continuity was physically verified. This later evidence supersedes the earlier Plan 034-era `LOCATION 8002`/provider-blocker observation for this **specific positioning/Realtime path**, but it does not retroactively convert every separate unexercised Plan 034 navigation, floor-transition, deep-link, cross-client, iOS, or store-delivery criterion to PASS.

## Android release and distribution

The Android release path is standardized and documented in `docs/mobile-distribution.md`.

- Application label: `Situm Explore`.
- Android package: `com.situm.explore`.
- Current version: `1.0.0`, versionCode `1`.
- Release target: `arm64-v8a` only for the current standalone distribution path.
- Versioned artifact naming: `situm-explore-v<semver>-android-arm64.apk`.
- Stable public alias: `situm-explore-latest-android-arm64.apk`.
- Release helper: `mobile/scripts/build-android-release.cjs` via `npm run build:android:release` in `mobile/`.
- Release builds fail closed when `EXPO_PUBLIC_API_BASE_URL` is missing, local, or non-HTTPS.
- Icon/adaptive icon/splash are sourced from the committed `mobile/assets/` branding assets.
- Public APK distribution uses the anonymous-read MinIO path under `https://minio.farismunir.my.id/situm-explore/android/`.
- Logged-out staging users can reach the Android download CTA; the APK itself does not require application login.

The final v1.0.0 artifact validated during Plan 035 closeout had SHA-256 `b7ba41ee87ab1858110748b40560e3d3a4ff1c584bdccc0758785baccb609b82`; treat hashes as release evidence, not as a permanent version-independent constant.

## Validation baseline

At the Plan 035/PR #32 closeout:

- root tests passed 64/64;
- root lint/typecheck passed;
- mobile lint/typecheck passed;
- Android arm64 release build passed;
- the release APK contained the public HTTPS backend URL and no `127.0.0.1:3000` marker;
- the release installed on the physical POS without a launch crash;
- public MinIO versioned/stable APK URLs returned HTTP 200 with the expected APK MIME type and matching checksum;
- staging was recreated and reached healthy state with the stable Android download URL.

Future work must rerun the gates appropriate to its scope; do not reuse these results as evidence for changed code.

## Closed native roadmap and historical limitations

Plans 028–035 are historical/closed. `plans/028-034-native-mobile-roadmap.md`, Plans 030–035, and `.agents/evidence/` retain the exact evolution of acceptance claims.

Plan 034 was explicitly closed by user decision without fabricating a full physical/cross-client E2E PASS. Some acceptance items therefore remain historical limitations, including any Plan 034 criteria not subsequently exercised by Plan 035 (for example broader navigation/floor-transition/deep-link/cross-client/iOS/store-delivery paths). These are **not an active backlog by default**; a future plan must explicitly choose to reopen them.

Google OAuth runtime acceptance remains deferred/user-owned. iOS compile/device acceptance remains macOS/Apple-device gated. Public HTTPS association and store delivery/signing remain separate external gates unless future scope selects them.

## Security dependency status

UUID remediation is integrated through the compatible `xcode -> uuid@11.1.1` override. The two historical `image-size` advisories remain recorded in npm/GitHub published-version scanning with no upstream patched release at the time of remediation; the scoped `patch-package` ICNS loop fix and residual evidence are retained in `.agents/evidence/security-dependency-remediation.md`.

Do not infer current dependency vulnerability status from this historical note; re-scan before making a new security claim.

## Current authority

Read, in order as relevant:

1. `AGENTS.md`;
2. this file;
3. `.agents/memory/decisions.md`;
4. `ARCHITECTURE.md`;
5. `plans/README.md`;
6. `design/data-source-matrix.md` for Situm/product capability scope;
7. `DESIGN.md` / `design/IMPLEMENTATION.md` for presentation changes;
8. a future active plan only after it is explicitly created.

Historical plans/sessions/branches remain evidence only.
