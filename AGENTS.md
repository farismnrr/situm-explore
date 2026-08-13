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
7. `plans/021-025-prerequisites.md` while Plans 021–025 are active
8. `design/ROADMAP-021-025-OVERRIDES.md` while Plans 021–025 are active
9. `ARCHITECTURE.md`
10. `plans/README.md`
11. `design/data-source-matrix.md` when Situm scope matters
12. the relevant plan
13. `DESIGN.md` / `design/IMPLEMENTATION.md` when presentation changes

Historical plans/sessions/branches are evidence only.

For Plans 021–025, `.agents/state.md`, `.agents/memory/roadmap-021-025.md`, and `design/ROADMAP-021-025-OVERRIDES.md` supersede stale pre-refactor wording about permanent env-defined users, absence of registration, global Situm credentials/building context, or unfinished Plans 017–020.

## Current roadmap

```text
Plan 017 -> 018 -> 019 -> 019A -> 020 [complete/integrated]

Plan 021 [ready after roadmap integration]
-> Plan 022 [queued]
-> Plan 023 [queued]
-> Plan 024 [queued]
-> Plan 025 [queued]
```

Planning branch:

`roadmap/021-025-backend-refactor`

No stacked implementation authorization exists for Plans 021–025.

## Backend refactor direction

The roadmap introduces DB-backed users, private single-owner workspaces, encrypted workspace-managed Situm configuration, permission-aware backend behavior, reuse of existing observability infrastructure, request correlation/tracing, workspace-isolated analytics, and sanitized client error boundaries.

Google OAuth is prepared but its real runtime acceptance is deferred to the user. Email/password register/login is acceptance-critical.

## External integration rule

For Situm behavior: no evidence, no implementation. Verify current official contracts and installed SDK/runtime behavior. Keep unresolved capabilities absent rather than guessing.

## Git workflow

- one plan = one dedicated plan branch;
- never implement directly on `main`;
- normal dependent plans start only after prerequisite work is integrated into `main`;
- avoid destructive history rewriting;
- PR creation and merge are user-gated;
- implementation/fixes for active plan phases go to the configured `worker` subagent;
- parent owns orchestration, review, state/plan persistence, commits, pushes, and transitions.

## Mandatory closeout

Follow `.agents/protocols/persistence.md` and keep durable state aligned with exact current truth.
