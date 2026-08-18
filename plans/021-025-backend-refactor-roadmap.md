# Backend Refactor Roadmap — Plans 021–025

> **Historical roadmap.** Plans 021–025 are complete/integrated; this file is retained for architecture and sequencing history, not current execution.


Status: **complete/integrated through Plan 025; the former Viewer security blocker was resolved in Plan 025. Google OAuth runtime acceptance remains separately deferred.**

Planning branch: `roadmap/021-025-backend-refactor`

## Sequence

```text
Plan 021 — Identity & Auth Foundation
-> Plan 022 — Private Workspaces & Situm Configuration
-> Plan 023 — Observability, Correlation & Safe Error Boundary
-> Plan 024 — Workspace-scoped Situm Backend Migration
-> Plan 025 — Workspace UX & Full Regression
```

Historical note: this file originally described future ownership. Plans 021–025 are now complete/integrated; the sequence below is retained as roadmap history.

Historical sequencing rule: the planning branch was integrated before execution proceeded.

Read these before execution:

- `.agents/state.md`
- `.agents/memory/decisions.md`
- `.agents/memory/roadmap-021-025.md`
- `ARCHITECTURE.md`
- `plans/021-025-prerequisites.md`
- the relevant historical plan

Plans 021–025 retain the existing web/native and Situm evidence boundaries. New or changed Situm behavior still requires exact current evidence.

Validation baseline: `git diff --check`, lint, typecheck, build, and production preview runtime acceptance.
