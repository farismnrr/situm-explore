# Plans

Plans are executable implementation checklists for Codex.

## Mandatory execution workflow

Before executing any plan in this directory, read:

1. root `AGENTS.md`;
2. `.agents/README.md`;
3. `.agents/protocols/git-workflow.md`;
4. the active plan file.

Every plan must use its own branch and Git worktree.

Naming convention:

```text
plan:     plans/001-web-foundation.md
branch:   plan/001-web-foundation
worktree: ../situm-explore-worktrees/001-web-foundation
```

Do not execute two plans in the same branch.

After each completed implementation phase:

1. update the plan checklist/status;
2. update relevant `.agents/` memory/state/knowledge/session files;
3. run required validation, including Nuxt lint for code-changing phases once lint tooling exists;
4. commit the completed phase;
5. push the plan branch;
6. stop short of opening a PR unless the user explicitly asks for one.

CI and unit-test infrastructure are intentionally deferred for now. See `.agents/protocols/git-workflow.md` for the full rules.
