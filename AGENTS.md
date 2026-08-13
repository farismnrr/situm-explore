# AGENTS.md

This repository is a persistent agent workspace for Situm Explore.

Keep this file short. Current authority lives in `.agents/state.md`.

## Mandatory read order

1. `.agents/identity.md`
2. `.agents/state.md`
3. `.agents/protocols/chat-lifecycle.md`
4. `.agents/protocols/git-workflow.md`
5. `.agents/memory/decisions.md`
6. `.agents/memory/roadmap-021-025.md` while Plans 021–025 are active
7. `ARCHITECTURE.md`
8. `plans/README.md`
9. `design/data-source-matrix.md` when Situm scope matters
10. the relevant plan

Historical plans/sessions/branches are evidence only. For Plans 021–025, `.agents/state.md` plus `.agents/memory/roadmap-021-025.md` supersede stale pre-refactor wording about permanent single-user/global-Situm configuration. `ARCHITECTURE.md` still describes parts of the pre-refactor runtime until the roadmap migration updates it.

## Current roadmap

Completed:

```text
Plan 017 -> 018 -> 019 -> 019A -> 020 [complete/integrated]
```

Active planning roadmap:

```text
Plan 021 [ready / next]
-> Plan 022 [queued]
-> Plan 023 [queued]
-> Plan 024 [queued]
-> Plan 025 [queued]
```

Planning branch:

`roadmap/021-025-backend-refactor`

No stacked implementation authorization exists for Plans 021–025.

## Backend refactor direction

The roadmap introduces DB-backed users, private single-owner workspaces, workspace-managed Situm configuration, permission-aware behavior, reuse of existing observability infrastructure, request correlation/tracing, and sanitized client error boundaries.

Google OAuth is prepared but its real runtime acceptance is deferred to the user. Email/password register/login is acceptance-critical.

## External integration rule

For Situm behavior: no evidence, no implementation. Verify current official contracts and installed SDK/runtime behavior. Keep unresolved capabilities absent rather than guessing.

## Git workflow

- one plan = one dedicated plan branch;
- never implement directly on `main`;
- avoid destructive history rewriting;
- PR creation and merge are user-gated;
- implementation/fixes for active plan phases go to the configured `worker` subagent;
- parent owns orchestration, review, state/plan persistence, commits, pushes, and transitions.

## Mandatory closeout

Follow `.agents/protocols/persistence.md` and keep durable state aligned with exact current truth.
