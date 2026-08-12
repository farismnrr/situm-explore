# Plans

Plans are executable implementation checklists for Codex.

## Mandatory execution workflow

Before executing any plan in this directory, read:

1. root `AGENTS.md`;
2. `.agents/README.md`;
3. `.agents/protocols/git-workflow.md`;
4. root `ARCHITECTURE.md`;
5. the active plan file;
6. `DESIGN.md` and its linked implementation/reference documents when the plan changes UI/UX.

Every plan must use its own branch. Use the repository's normal working directory; do not create a linked Git worktree unless the user explicitly asks for one.

Naming convention:

```text
plan:   plans/004-ui-foundation-public-auth.md
branch: plan/004-ui-foundation-public-auth
```

Typical start:

```bash
git status --short
git fetch origin
git switch main
git pull --ff-only origin main
git switch -c plan/004-ui-foundation-public-auth origin/main
```

Do not execute two plans in the same branch and do not implement a plan directly on `main`.

## Sequential dependency rule

The roadmap is intended to be executed sequentially.

If a plan declares `Depends on: Plan N`, the dependency must already be complete and integrated into `main` before the next plan starts.

Normal flow:

```text
finish plan branch
-> validate + push
-> user reviews
-> user explicitly authorizes PR/integration
-> dependency lands in main
-> sync main
-> create the next plan branch from updated origin/main
```

Do **not** silently start the next plan from stale `main` and do not silently stack a new plan branch on an unmerged dependency.

If the dependency is complete but has not been integrated because PR/merge authorization is still pending, stop at that boundary. Only use stacked plan branches when the user explicitly asks for that workflow.

This rule prevents a sequential plan from losing files/routes/contracts created by the previous plan.

## Historical plans

Plans marked complete/closed are implementation history, not current instructions.

- Do not resurrect deleted paths, old environment-variable names, superseded architecture, or superseded design guidance merely because an old plan mentions them.
- Current `AGENTS.md`, `ARCHITECTURE.md`, `DESIGN.md`, durable `.agents/` decisions/state, and the active plan override historical plan details.
- Plan 003 in particular is historical: its rendered UI was not accepted as the current visual source of truth.

## Architecture and documentation discipline

All implementation must respect the Nuxt 4 app/server/shared boundaries in `ARCHITECTURE.md`. Do not introduce speculative services, repositories, stores, layers, or generic abstractions merely because a plan adds a new surface.

When a phase changes setup, environment-variable names, route entry points, architecture paths, or runtime behavior described by root documentation, update the relevant docs in the same phase. Do not knowingly leave README/architecture/setup instructions pointing at the pre-phase structure.

After each completed implementation phase:

1. update the plan checklist/status;
2. update relevant `.agents/` memory/state/knowledge/session files;
3. run required validation, including Nuxt lint for code-changing phases;
4. commit the completed phase;
5. push the plan branch;
6. stop short of opening a PR unless the user explicitly asks for one.

CI and unit-test infrastructure are intentionally deferred for now. See `.agents/protocols/git-workflow.md` for the full rules.
