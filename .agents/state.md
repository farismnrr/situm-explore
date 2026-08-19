# Current State

_Last reviewed: 2026-08-19_

## Work status

Plan 036 — Realtime Reliability completed and integrated into `main` via PR #35 at merge commit `7a87afb` on 2026-08-19. Acceptance passed with repeated physical POS evidence and automated validation. A pre-PR review hardening pass bounded high-frequency native-fix diagnostics and updated implementation/evidence docs; final validation remained green. The local and remote feature branches were deleted.

Latest integrated product work is PR #35 at merge commit `7a87afb` (`Realtime reliability hardening`). The former `plan/036-realtime-reliability` branch was deleted after merge; Plan 035 was previously integrated through PR #32 at `840c0f9`.

There is currently **no active implementation plan**. Plan 036 is the latest integrated product work; navigation camera/perspective work remains separate future scope.

New implementation work must start from updated `main` on a dedicated plan branch. Historical plans, execution briefs, sessions, reviews, and evidence are not current execution instructions.

## Last completed work

Plan 035 closed the Realtime/foreground-positioning lifecycle defect and Android release/distribution polish. Recorded evidence includes:

- shared shell-scoped foreground positioning ownership;
- Android runtime permission gate before Positioning credential use;
- physical POS sensor-backed positioning and own-device server-mediated Realtime PASS for the bounded Plan 035 scope;
- standardized arm64 Android release artifact generation;
- public MinIO Android distribution and logged-out web download;
- final validation captured in `.agents/evidence/plan-035-realtime-remediation-2026-08-18.md`.

Product/runtime details belong in `README.md`, `ARCHITECTURE.md`, `DESIGN.md`, `design/IMPLEMENTATION.md`, `design/data-source-matrix.md`, and `docs/mobile-distribution.md`. Do not duplicate those contracts here unless a temporary work item changes them.

## Historical limitations

Plan 034 was administratively closed without fabricating full acceptance. Plan 035 later proved the specific physical positioning/Realtime path it remediated, but unrelated Plan 034 items that were never exercised remain historical limitations rather than implicit PASS.

These historical limitations are **not an active backlog by default**. A future scoped plan must explicitly reopen any of them.

Other recorded external/deferred items include Google OAuth runtime acceptance, iOS/macOS device/build delivery, and store/association gates. Revalidate current conditions before treating any historical note as a new blocker.

## Security maintenance note

Historical dependency remediation evidence is in `.agents/evidence/security-dependency-remediation.md`. Do not infer current vulnerability status from that snapshot; run a fresh scan for new security work.

## Current execution authority

For future work read:

1. `AGENTS.md`;
2. this file;
3. `.agents/memory/decisions.md` when durable implementation decisions matter;
4. `.agents/protocols/git-workflow.md`;
5. current product docs relevant to the task;
6. an explicitly created active plan.
