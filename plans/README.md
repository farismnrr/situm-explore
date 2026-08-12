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
plan:   plans/002-foundation-hardening.md
branch: plan/002-foundation-hardening
```

Typical start:

```bash
git status --short
git fetch origin
git switch main
git pull --ff-only origin main
git switch -c plan/002-foundation-hardening origin/main
```

Do not execute two plans in the same branch and do not implement a plan directly on `main`.

All implementation must respect the Nuxt 4 app/server/shared boundaries in `ARCHITECTURE.md`. Do not introduce speculative services, repositories, stores, layers, or generic abstractions merely because a plan adds a new surface.

After each completed implementation phase:

1. update the plan checklist/status;
2. update relevant `.agents/` memory/state/knowledge/session files;
3. run required validation, including Nuxt lint for code-changing phases;
4. commit the completed phase;
5. push the plan branch;
6. stop short of opening a PR unless the user explicitly asks for one.

CI and unit-test infrastructure are intentionally deferred for now. See `.agents/protocols/git-workflow.md` for the full rules.
