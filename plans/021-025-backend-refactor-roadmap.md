# Backend Refactor Roadmap — Plans 021–025

Status: **planning ready; integration gate before Plan 021**

Planning branch: `roadmap/021-025-backend-refactor`

## Sequence

```text
Plan 021 — Identity & Auth Foundation
-> Plan 022 — Private Workspaces & Situm Configuration
-> Plan 023 — Observability, Correlation & Safe Error Boundary
-> Plan 024 — Workspace-scoped Situm Backend Migration
-> Plan 025 — Workspace UX & Full Regression
```

The current integrated runtime is the migration baseline; the items above are approved future plan ownership, not claims that the refactor is already implemented.

Normal workflow requires this planning branch to be integrated into `main` before Plan 021 starts unless stacked execution is explicitly authorized.

Read these before execution:

- `.agents/state.md`
- `.agents/memory/decisions.md`
- `.agents/memory/roadmap-021-025.md`
- `ARCHITECTURE.md`
- `plans/021-025-prerequisites.md`
- the active plan

Plans 021–025 retain the existing web/native and Situm evidence boundaries. New or changed Situm behavior still requires exact current evidence.

Validation baseline: `git diff --check`, lint, typecheck, build, and production preview runtime acceptance.
