# Plan 035 — Realtime Remediation

Status: implementation complete; physical own-device publishing remains externally blocked

Depends on: Plan 034 closed; normal branch workflow should start from the integrated Plan 034 result unless the user explicitly authorizes stacked execution.

## Objective

Diagnose and fix the newly observed native Realtime issue without reopening Plan 034 or weakening the frozen Realtime/security architecture.

## Non-negotiable boundaries

- Realtime remains server-mediated.
- Do not expose Read & Write, Viewer, or Positioning credentials to Realtime/client logs.
- Do not invent online/offline presence, freshness, map markers, or device semantics unsupported by the backend/Situm contract.
- Preserve session/workspace authorization and fail-closed behavior.
- Do not treat the Plan 034 vendor positioning blocker as a Realtime defect unless evidence directly links them.
- No PR/merge/production change without user authorization.

## Phase 0 — Reproduce and classify

1. Capture the exact Realtime symptom on the physical POS and/or supported runtime.
2. Determine whether the failure is UI/layout, polling/lifecycle, API contract, workspace authorization, payload normalization, empty-state handling, navigation handoff, or another bounded cause.
3. Record objective evidence without secrets.
4. Inspect the frozen implementation and relevant Plan 031/032/033/034 evidence before modifying behavior.

## Phase 1 — Shared foreground positioning ownership

Implemented a single authenticated-shell `ForegroundPositioningSession`. A follow-up audit also added an explicit Android runtime permission gate before credential retrieval/native positioning; manifest declaration alone was insufficient. It owns the process-global Situm location callbacks and request/remove lifecycle, obtains only the existing dedicated POSITIONING credential on explicit Locate me, survives Explore/Realtime tab unmounts, and stops on explicit stop, workspace switch, logout, background, native error/stopped, or app teardown. Explore consumes the session; Realtime remains server-mediated.

Installed SDK evidence confirms `@situm/react-native@3.19.2` exposes singleton callback setters and process-wide positioning. `@situm/sdk-js@0.25.0` returns both `features` and `devicesInfo`; coordinates remain mapped only from `features`. A direct runtime probe returned `features=0, devicesInfo=0`, while the POS workspace Realtime screen truthfully rendered no positions.

## Phase 2 — Deterministic regression coverage

Added `test/mobile-plan-035-positioning.test.ts` covering explicit start, tab-consumer survival/duplicate starts, idempotent stop, workspace invalidation, background no-auto-restart, native error/stopped fail-closed behavior including native-producer teardown, and Realtime/security source contracts.

## Acceptance

## Acceptance classification

- Reproduced issue/root cause: PASS — Explore unmount cleanup stopped process-wide positioning; this is removed from screen cleanup.
- Shared lifecycle ownership and Explore ↔ Realtime persistence: PASS — controller is shell-scoped and covered by deterministic tests.
- Explicit stop, workspace switch, logout, background, restart, native error/stopped, and navigation ownership: PASS — controller/consumer paths and tests are fail-closed; restart creates a new stopped session.
- Realtime server mediation and credential boundary: PASS — mobile Realtime reads only `/api/workspaces/:workspaceId/situm/realtime`; no mobile Situm read credential is used; server continues mapping `features` only.
- Malformed payload/workspace/building freshness guards: PASS — existing Plan 030/031 tests remain green; Plan 035 does not weaken them.
- Root/mobile validation: PASS — `git diff --check`, root tests, root lint/typecheck, mobile lint/typecheck, and Android debug build pass.
- POS app install/navigation/UI reachability: PASS — debug APK installed on `100.113.52.76:35911`; 1366×720 app content, reverse mappings, authenticated Realtime empty state, and Explore/Realtime navigation verified.
- Android runtime permission request path: PASS — explicit foreground gate is implemented and deterministic tests prove denial cannot start native positioning; physical PermissionController/package grant evidence recorded.
- Physical sensor-backed positioning and own-device Realtime publishing: BLOCKED — after remediation-time device settings, Android reports Location enabled, Bluetooth on, and `network provider enabled=true`, but the POS still has `last location=null`; Situm transitions `CALCULATING → STOPPED` without a sensor-backed `onLocationUpdate`. No own-device publishing/navigation PASS is claimed.
