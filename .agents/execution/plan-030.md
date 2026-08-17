# Plan 030 Execution Brief

Repository: `/home/farismnrr/Projects/situm-explore`
Branch: `plan/030-native-map-positioning-navigation`
Plan: `/home/farismnrr/Projects/situm-explore/plans/030-native-map-positioning-navigation.md`

## Mode

Execute Plan 030 end-to-end. Do not pause between successful phases. After each phase: review evidence/diff, update plan/state/durable evidence as needed, run phase validation, commit, push, verify clean/synced, then continue.

Stop only for a real product/security/architecture/capability blocker or when truthful physical-device acceptance cannot proceed. Do not fabricate device/runtime evidence. Stop before PR/merge and do not start Plan 031.

## Authority

Read `AGENTS.md` first, then current state/durable decisions, `plans/030-native-map-positioning-navigation.md`, `DESIGN.md`, `design/reference/situm-explore-native-responsive-prototype.html`, and relevant Plan 028/029 evidence.

Plan 029 is integrated and authoritative for the native foundation: existing Nitro/PostgreSQL identity, sealed `x-nuxt-session`, SecureStore, owner-scoped workspace context, dedicated Positioning credential, Expo 57 stack, responsive shell, and no second backend.

For Situm behavior: no evidence, no implementation. Recheck the exact installed `@situm/react-native` 3.19.2 surface and current official evidence before relying on a capability. Native Android/iOS SDK APIs do not prove React Native wrapper support.

## Guardrails

- Keep Read & Write and Viewer credentials out of mobile.
- Use only the dedicated owner-authorized Positioning credential for native SDK auth.
- Do not implement Realtime/Share Live Location; Plan 031 owns Realtime.
- Do not fake map data, position freshness, route metrics, directions steps, navigation events, permissions, or online state.
- Initial Map flow must not request background location unless a proven Plan 030 requirement requires it.
- Workspace/building switches and logout must tear down stale MapView/positioning/navigation state.
- Preserve the approved Situm Explore native visual hierarchy across phone, tablet/POS, and wide layouts.
- Generated/build/signing/credential artifacts remain ignored/external.

## Review

Final reviewer findings are authoritative for remediation: `/home/farismnrr/Projects/situm-explore/.agents/reviews/plan-030-final.md`. Resolve every implementation blocker before claiming Plan 030 is blocked only by physical acceptance or PR-ready.

## Acceptance

Run repository baseline plus mobile lint/typecheck, Expo doctor/prebuild, Android `assembleDebug` with `/home/farismnrr/Android/Sdk`, focused tests, secret checks, and full branch diff review.

Physical-device evidence is mandatory before claiming real positioning/blue-dot/navigation acceptance. If no suitable calibrated building/profile, credential, or physical supported device is available, complete every truthfully testable phase first, record the exact gate, and stop Plan 030 as BLOCKED rather than inventing acceptance.

At completion report one consolidated Plan 030 result, commits, validation, device evidence/external gates, Plan 031 readiness, and PR readiness.
