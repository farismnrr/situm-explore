# Current State

_Last reviewed: 2026-08-13_

## Integrated baseline

Plans 017–020 are complete and integrated into `main` by PR #12. The new roadmap starts from current `main`.

## Active roadmap

Planning branch:

`roadmap/021-025-backend-refactor`

```text
Plan 021 — Identity & Auth Foundation                       [ready / next]
Plan 022 — Private Workspaces & Situm Configuration         [queued]
Plan 023 — Observability, Correlation & Safe Error Boundary [queued]
Plan 024 — Workspace-scoped Situm Backend Migration         [queued]
Plan 025 — Workspace UX & Full Regression                   [queued]
```

No stacked implementation authorization exists for Plans 021–025. Use the normal one-plan/one-branch transition workflow unless the user explicitly changes it.

## Roadmap conflict rule

While Plans 021–025 are active, read `.agents/memory/roadmap-021-025.md` after the general decisions file. That roadmap addendum plus this state file supersede stale pre-refactor wording that treats permanent single-user/global-Situm configuration as the end state.

`ARCHITECTURE.md` still describes parts of the current pre-refactor runtime until implementation updates the architecture contract. Treat it as current-runtime evidence, not as authority to cancel the approved roadmap transition.

## Locked direction

- real application users replace the current single-user runtime model;
- one user may own many private workspaces;
- workspaces are single-owner and have no member/invite model in this roadmap;
- different users may independently point workspaces at the same external Situm account;
- Google OAuth is prepared but its real runtime acceptance is deferred to the user;
- Situm configuration becomes workspace-managed instead of global runtime configuration;
- product access modes are `VIEW_ONLY` and `VIEW_WRITE`, with upstream permission remaining authoritative;
- existing observability infrastructure must be discovered and reused;
- browser-to-server requests gain correlation/trace context;
- internal failure details remain server-side while client errors stay sanitized.

## Transition note

Current `main` still reflects the pre-refactor runtime model. Plans 021–024 own the migration. Do not remove the old path before its replacement is working and accepted.

## Next action

Execute Plan 021 only from `plan/021-auth-identity-foundation`, based on this roadmap state. Plans 022–025 remain queued until the normal transition gate is satisfied or the user explicitly authorizes another execution mode.
