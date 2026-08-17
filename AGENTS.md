# AGENTS.md

This repository is a persistent agent workspace for Situm Explore.

Keep this file short. Current authority lives in `.agents/state.md`.

## Mandatory read order

1. `.agents/identity.md`
2. `.agents/state.md`
3. `.agents/execution/plan-030.md` when Plan 030 is active
4. `.agents/protocols/chat-lifecycle.md`
5. `.agents/protocols/git-workflow.md`
6. `.agents/memory/decisions.md`
7. `.agents/memory/roadmap-021-025.md` for completed-roadmap context when needed
8. `ARCHITECTURE.md`
9. `plans/README.md`
10. `plans/021-025-prerequisites.md` when historical prerequisite context is needed
11. `design/data-source-matrix.md` when Situm/product capability scope matters
12. the relevant plan
13. `DESIGN.md` / `design/IMPLEMENTATION.md` for presentation changes

Historical plans/sessions/branches are evidence only and do not override current state, durable decisions, architecture, or the active plan.

## Current roadmap

Completed/integrated:

```text
Plan 017 -> 018 -> 019 -> 019A -> 020 [complete/integrated]
```

Completed implementation roadmap:

```text
Plan 021 -> Plan 022 -> Plan 023 -> Plan 024 -> Plan 025 [complete on stacked branch]
```

Plans 026–029 are complete/integrated via PRs #20–#24. Plan 030 native Map/positioning/navigation implementation is reviewer-approved and PR-ready pending user authorization on `plan/030-native-map-positioning-navigation`; its unpassed physical-device E2E is explicitly carried to Plan 032's terminal gate. Plans 031–032 remain dependent follow-ups. Final Plan 025 Viewer acceptance passed; Google OAuth runtime remains user-owned and deferred.

## Backend-refactor direction

The completed roadmap introduced DB-backed users, real email/password registration/login, private single-owner workspaces, workspace-managed Situm configuration, permission-aware behavior, reuse of existing observability infrastructure, request correlation/tracing, workspace-isolated analytics, and sanitized client error boundaries.

Google OAuth is prepared but real runtime acceptance is deferred to the user.

The legacy env-defined auth/global Situm context is historical migration evidence from before Plans 021–025. The current integrated source/runtime and completed-plan outcomes are authoritative; do not resurrect the legacy global model.

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
