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
9. `plans/021-025-prerequisites.md` while the backend-refactor roadmap is active
10. `design/data-source-matrix.md` when Situm/product capability scope matters
11. the relevant plan
12. `DESIGN.md` / `design/IMPLEMENTATION.md` for presentation changes

Historical plans/sessions/branches are evidence only and do not override current state, durable decisions, architecture, or the active plan.

## Current roadmap

Completed/integrated:

```text
Plan 017 -> 018 -> 019 -> 019A -> 020 [complete/integrated]
```

Active planning roadmap:

```text
Plan 021 [ready after roadmap integration]
-> Plan 022 [queued]
-> Plan 023 [queued]
-> Plan 024 [queued]
-> Plan 025 [queued]
```

Planning branch:

`roadmap/021-025-backend-refactor`

No stacked implementation authorization exists for Plans 021–025.

## Backend-refactor direction

The roadmap introduces DB-backed users, real email/password registration/login, private single-owner workspaces, workspace-managed Situm configuration, permission-aware behavior, reuse of existing observability infrastructure, request correlation/tracing, workspace-isolated analytics, and sanitized client error boundaries.

Google OAuth is prepared but real runtime acceptance is deferred to the user.

The current integrated runtime still contains legacy env-defined auth/global Situm context until the owning plans replace it. That runtime state is migration input, not the final architecture.

## External integration rule

For Situm behavior: **no evidence, no implementation**. Verify current official contracts and installed SDK/runtime behavior. Keep unresolved capabilities absent rather than guessing.

## Git workflow

- one plan = one dedicated plan branch;
- never implement directly on `main`;
- avoid destructive history rewriting;
- PR creation and merge are user-gated;
- dependent plans normally start after the preceding plan is integrated into updated `main`;
- implementation/fixes for active plan phases go to the configured `worker` subagent;
- parent owns orchestration, review, state/plan persistence, commits, pushes, and transitions.

## Mandatory closeout

Follow `.agents/protocols/persistence.md` and keep durable state aligned with exact current truth.
