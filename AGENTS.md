# AGENTS.md

This repository is a persistent agent workspace for Situm Explore.

Keep this file short. Current authority lives in `.agents/state.md`.

## Mandatory read order

1. `.agents/identity.md`
2. `.agents/state.md`
3. `.agents/protocols/chat-lifecycle.md`
4. `.agents/protocols/git-workflow.md` for repository work
5. `.agents/memory/decisions.md` when roadmap/product boundaries matter
6. `ARCHITECTURE.md`
7. `plans/README.md`
8. `design/data-source-matrix.md` when Situm capability scope matters
9. the relevant plan

Historical plans/sessions/branches are evidence only.

## Current roadmap truth

```text
Plan 017  [complete]
-> Plan 018  [complete]
-> Plan 019  [complete]
-> Plan 019A [complete]
-> Plan 020  [complete]
```

Completed review branch:

`plan/020-situm-static-directions-v2`

It started from exact final Plan 019A HEAD:

`e0c1cbfdfcaadc1e5abec5e89ece869315f6ac71`

The older `plan/020-situm-static-directions` branch is stale pre-019A history and is superseded as an execution branch. Do not use it as current authority.

## External integration rule

For Situm behavior: no evidence, no implementation. Verify current official contracts and installed SDK/runtime behavior. Keep unresolved capabilities absent rather than guessing.

## Architecture boundary

Use the current Nuxt 4 structure and keep one Viewer owner with a small typed surface. Static directions remain Viewer-owned; live handset navigation/current-location behavior stays outside this web roadmap.

## Git workflow

- one plan = one dedicated plan branch;
- never implement directly on `main`;
- avoid destructive history rewriting;
- do not create a PR or merge unless explicitly authorized;
- implementation/fixes for active plan phases go specifically to the configured `worker` subagent;
- parent owns orchestration, review, plan/state updates, commits, pushes, and transitions.

## Mandatory closeout

Follow `.agents/protocols/persistence.md` and keep durable state aligned with exact current truth.
