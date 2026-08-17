# Plan 029 — Execution Brief

[PLAN]
Execute `plans/029-native-app-foundation.md` completely, Phase 0 through Phase 6.

[BRANCH]
Use `plan/029-native-app-foundation`. It was created from updated `origin/main` after Plan 028 merged via PR #23 (`e5e15ee9f7dd58ad2f1c4c7fe217cc1aa8956453`). Do not use a worktree and do not implement on `main`.

[AUTHORITY]
Read and obey, in repository authority order:
- `AGENTS.md`
- `.agents/state.md`
- `.agents/memory/decisions.md`
- `ARCHITECTURE.md`
- `plans/README.md`
- `plans/028-native-capability-auth-spike.md`
- `plans/029-native-app-foundation.md`
- `DESIGN.md`
- `design/reference/situm-explore-native-responsive-prototype.html`

Plan 028 decisions are frozen inputs. Do not reopen them by preference or upgrade dependencies casually.

[EXECUTION]
- Execute the whole plan without routine reviewer pauses.
- After each completed phase: update evidence/state as required, validate, review diff, commit, push, verify clean/synced, then continue.
- Stop only for a real blocker requiring a security/architecture/product decision or when repository state contains unrelated user changes.
- For ordinary warnings/issues, choose the smallest evidence-backed solution, record it, and continue.

[NON-NEGOTIABLE]
- Native app lives in standalone `mobile/`; no npm workspaces and no second backend.
- Keep existing PostgreSQL/Nitro identity and workspace authorization authoritative.
- Native application session is the frozen sealed h3 session via `x-nuxt-session`, max age 7 days, treated as a bearer-equivalent secret, persisted only through `expo-secure-store`.
- Production auth acceptance requires server-side session revocation/version validation; local logout/deletion alone is not revocation.
- Native Situm authority is the dedicated owner-authorized Positioning credential. Never expose the Read & Write primary or browser Viewer credential. JWT remains unselected. Realtime stays server-mediated.
- Revalidate the published `@situm/react-native` TypeScript `lib/` omission in the real `mobile/` package before applying any workaround. Do not patch/vendor/fork speculatively.
- UI/UX must follow `DESIGN.md` and the approved native HTML reference. Capability/security truth overrides prototype presentation.

[SCOPE]
Plan 029 may implement the mobile scaffold, API boundary, auth/session/revocation, SecureStore, workspace context, Positioning credential configuration/issuance, deep-link foundation, responsive shell, and truthful Map/Realtime placeholders.

Do NOT implement production positioning, blue dot, POI flows, directions/navigation, Realtime polling/UI, remote-position overlays, or Share Live Location. Those belong to Plans 030–031.

[ACCEPTANCE]
Run the exact validation required by Plan 029 plus repository baseline checks. Android build/runtime claims require real evidence. Keep iOS explicitly macOS/device-gated when unavailable. Never persist or print real secrets.

[REVIEW]
Final reviewer findings are authoritative for remediation: `.agents/reviews/plan-029-final.md`. Resolve every blocking finding before claiming Plan 029 complete or PR-ready.

[DONE]
When Phase 0–6 are complete, committed, pushed, and the branch is clean/synced, stop and provide one consolidated Plan 029 report with validation, commits, unresolved gates, Plan 030 readiness, and PR readiness.

Do not create a PR, merge, delete the branch, or start Plan 030.
