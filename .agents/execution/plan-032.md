# Plan 032 Execution Context

> **Historical execution brief.** This file preserves the instructions used during completed work. It is not current execution authority; consult `.agents/state.md` and create a new explicit plan for future changes.


Branch: `plan/032-web-native-handoff-distribution`
Base: integrated `main` at `2913e3c`, containing prerequisite `ee23bdc`
Scope: Web/Native Handoff & Distribution implementation only; no Plan 033 execution.

## Phase 0 — complete

- Frozen the responsive Map Viewer capability threshold at 768px width × 600px height.
- Confirmed native identifiers/schemes and that store/download destinations are not yet published.
- Added environment-only public mobile distribution configuration to Nuxt runtime config.

## Phase 1 — complete

- Added native cold-start/foreground deep-link parsing and lifecycle ownership for Map and Realtime.
- Preserved pending destination through login and re-authorized optional workspace/building context against Nitro-backed workspace state.
- Added focused parser and secret-shape regression tests.

## Phase 2 — complete

- Added the reusable accessible `NativeAppGate` with configured app/install/download actions, client-side QR, copy link, and truthful unavailable distribution state.
- Added root `qrcode` dependency; no store/signing secrets or credentials are included.

## Phase 3 — complete

- Replaced the generic desktop-only Map branch with the geometry-based native handoff policy.
- Kept the existing Viewer path for capable layouts and gated cartography fetches before phone/short layouts.
- Removed the obsolete desktop-only viewport composable.

## Phase 4 — complete

- Routed `/app/realtime` through the shared gate at every viewport and replaced unavailable/Coming soon wording with the intentional native product policy.
- Kept all existing web navigation entry points valid and updated the home card copy.

## Phase 5 — complete

- Added optional iOS Associated Domains and Android App Links configuration from the public host environment variable.
- Kept deterministic direct-link, QR, store/download, and truthful-unavailable fallback behavior without timer hacks.

## Phase 6 — complete

- Added reproducible version/build-number inputs and the mobile distribution runbook.
- Documented external signing/store/artifact boundaries and environment-specific backend/public-link configuration without committing secrets.

## Phase 7 — complete

- Full root/mobile/build/Expo/Android validation passed; production-preview HTTP smoke passed.
- Reconciled architecture, capability matrix, README/plan router, and Plan 033 handoff evidence.
- Plan 032 implementation is complete pending review/integration. Plan 033 was not started.

## Final reviewer remediation — approved

- `ab35054` resolves the two prior findings: stale building hints are cleared after consumption/workspace change, and install options use OS detection independently of viewport with all configured platforms exposed on desktop/unknown clients.
- Final reviewer authority is `/home/farismnrr/Projects/situm-explore/.agents/reviews/plan-032-final.md`.
- Resolved the foreground Map lifecycle blocker with monotonic `mapRequest` IDs, idempotent request consumption, and a local runtime key that changes only when a new request is applied. A second link to another building in the selected workspace now remounts the Map runtime once without a request-clearing remount loop.
- Added focused sequential same-workspace request coverage and revalidated the implementation. Final reviewer confirmation passed with 31/31 tests plus root/mobile lint/typecheck and diff checks. Keep all physical-device and full cross-client acceptance explicitly UNPASSED for Plan 033; branch integration remains user-gated.

## Plan 033 carry-over

The Plan 030/031 physical-device acceptance remains unpassed. Plan 033 must also run real cross-client handoff, install/open, deep-link, login restoration, workspace authorization, invalid-link, logout/restart, and secret-audit acceptance after this plan is integrated.
