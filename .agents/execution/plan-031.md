# Plan 031 Execution Brief

Repository: `/home/farismnrr/Projects/situm-explore`
Branch: `plan/031-native-realtime-operations`
Plan: `/home/farismnrr/Projects/situm-explore/plans/031-native-realtime-operations.md`

## Mode

Execute Plan 031 end-to-end on the existing branch. Do not pause between successful phases. After each phase: review evidence/diff, update plan/state/durable evidence as needed, validate, commit, push, verify clean/synced, then continue.

Stop only for a real product/security/architecture/capability blocker. Physical-device-only evidence may be recorded as explicit, unpassed Plan 032 carry-over under the current consolidated E2E policy. Never relabel missing physical evidence as passed. Stop before PR/merge and do not start Plan 032.

## Authority

Read `AGENTS.md` first, then `.agents/state.md`, `.agents/memory/decisions.md`, `plans/031-native-realtime-operations.md`, the integrated Plan 030 implementation/review evidence, `DESIGN.md`, `design/reference/situm-explore-native-responsive-prototype.html`, and exact current Situm/backend evidence relevant to Realtime.

Plan 030 is integrated via PR #25 at merge commit `2a751216e752a5da85180925878faf1dddbe5187`. Its physical-device Map/positioning/navigation E2E remains unpassed and is already carried to Plan 032.

## Frozen baseline unless Phase 0 proves otherwise

- Realtime Positions means operational device-position records. Share Live Location is a separate Situm feature and must not be conflated with Realtime Positions.
- Existing owner-scoped Nitro route `/api/workspaces/:workspaceId/situm/realtime` is the preferred remote-monitoring boundary. Its current response is limited to position/device identity, source time, building/floor, accuracy, coordinates, and optional device ID.
- Do not invent friendly person names, online/idle/offline presence, trajectories, remote-marker support, or generic map focus.
- Remote monitoring stays server-mediated unless exact current evidence proves a safer least-privilege native contract. Do not widen the mobile Positioning credential to Read-only/Read & Write for convenience.
- Own-device location remains the Plan 030 native positioning boundary. Do not add background positioning merely because the SDK supports it; Phase 0 must prove a Realtime product need before Phase 4 enables anything.
- If generic remote MapView overlays/focus remain unproven, ship a useful truthful list/detail Realtime experience rather than simulated markers.
- Location data is sensitive: no unnecessary persistence, logs, traces, analytics payloads, or public config.

## Validation and closeout

Run repository baseline plus focused Realtime/security/workspace-isolation tests, mobile lint/typecheck, Expo doctor/prebuild, Android `assembleDebug` with `/home/farismnrr/Android/Sdk`, emulator/non-sensor runtime smoke when safely possible, secret checks, and full branch diff review.

Plan 031 may close and become PR-ready after reviewer-approved implementation/runtime evidence. Enumerate every physical-device-only item still unpassed as Plan 032 carry-over. Plan 032 is the non-deferrable terminal physical-E2E gate.

Report one consolidated result with commits, frozen v1 Realtime semantics, validation evidence, runtime evidence, physical carry-over, PR readiness, and Plan 032 readiness.
