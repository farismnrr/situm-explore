# Plan 035 — Realtime Remediation

Status: queued — new bounded scope requested after Plan 034 closure

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

## Phase 1+

Expand this plan only from reproduced evidence. Keep remediation narrowly scoped to the confirmed Realtime defect, add regression coverage, then validate on the physical POS where applicable.

## Acceptance

Plan 035 may close only when the reproduced Realtime issue is fixed, focused regression tests pass, mobile/root lint and typecheck pass, `git diff --check` passes, and the relevant physical/runtime path is revalidated or a genuine external blocker is documented.
