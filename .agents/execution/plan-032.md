# Plan 032 Execution Context

Branch: `plan/032-web-native-handoff-distribution`
Base: integrated `main` at `2913e3c`, containing prerequisite `ee23bdc`
Scope: Web/Native Handoff & Distribution implementation only; no Plan 033 execution.

## Phase 0 — complete

- Frozen the responsive Map Viewer capability threshold at 768px width × 600px height.
- Confirmed native identifiers/schemes and that store/download destinations are not yet published.
- Added environment-only public mobile distribution configuration to Nuxt runtime config.

## Phase 033 carry-over

The Plan 030/031 physical-device acceptance remains unpassed. Plan 033 must also run real cross-client handoff, install/open, deep-link, login restoration, workspace authorization, invalid-link, logout/restart, and secret-audit acceptance after this plan is integrated.
