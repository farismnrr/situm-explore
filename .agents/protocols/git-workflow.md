# Git Workflow Protocol

This protocol is mandatory for Codex whenever executing a plan under `plans/` or making implementation changes on behalf of a plan.

The goals are isolation, reviewability, recoverability, and low process overhead.

## Core rules

1. One plan = one dedicated branch = one dedicated Git worktree.
2. Never implement a plan directly in the main worktree or directly on `main`.
3. Every completed implementation phase must end with a commit and a push to that plan branch.
4. Before every phase commit, update the relevant `.agents/` persistent context and the plan checklist/status.
5. Never open a pull request until the user explicitly asks for one.
6. CI is intentionally deferred for now.
7. Unit tests are intentionally deferred for now; do not add a test framework just for ceremony.
8. Linting is mandatory for code-changing phases and must pass before commit/push.
9. Never commit secrets, `.env`, API keys, database credentials, tokens, or generated credential files.
10. Prefer small, phase-scoped commits with clear Conventional Commit-style messages.

## 1. Start a plan safely

Before creating anything:

```bash
git status --short
git worktree list
git fetch origin
```

The main worktree should remain a clean coordination workspace. Do not silently discard or overwrite existing local changes.

For a plan named, for example, `plans/001-web-foundation.md`, use:

```text
branch:   plan/001-web-foundation
worktree: ../situm-explore-worktrees/001-web-foundation
```

Preferred creation flow:

```bash
mkdir -p ../situm-explore-worktrees
git worktree add -b plan/001-web-foundation ../situm-explore-worktrees/001-web-foundation origin/main
```

Rules:

- Base a new plan branch on the latest fetched `origin/main` unless the plan explicitly depends on another unmerged branch.
- If the branch or worktree already exists, inspect and reuse it instead of recreating it with force.
- Do not use `-B`, `--force`, hard reset, or destructive cleanup as a shortcut.
- Verify the worktree before implementation:

```bash
git branch --show-current
git status --short
```

## 2. Branch naming

Plan branches use:

```text
plan/<plan-number>-<short-slug>
```

Examples:

```text
plan/000-resource-gathering
plan/001-web-foundation
plan/002-some-feature
```

Non-plan maintenance may use conventional prefixes such as `docs/`, `chore/`, `fix/`, or `refactor/`, but plan execution always uses the `plan/` convention.

Do not mix multiple plans into one branch.

## 3. Phase boundaries

A phase is an explicit phase in the plan. If a plan does not use the word "phase", treat each top-level numbered implementation section as a phase unless the plan clearly groups sections differently.

At the start of a phase:

- read the relevant plan section;
- inspect existing code/config before editing;
- confirm the current branch/worktree;
- keep scope limited to that phase.

Do not opportunistically implement future phases just because nearby code is easy to change.

## 4. Mandatory pre-commit persistence checkpoint

Before every phase commit, Codex must run the repository persistence workflow.

At minimum:

1. Update the completed checkboxes/status in the active `plans/*.md` file.
2. Update `.agents/state.md` when current focus, open loops, blockers, or next action changed.
3. Update `.agents/memory/decisions.md` when the phase introduced a durable project/architecture decision.
4. Update `.agents/knowledge/` when reusable technical discoveries were learned.
5. Update `.agents/reflections/` when the phase produced a reusable process/agent lesson.
6. Append a concise phase/session trace to `.agents/sessions/YYYY-MM-DD.md`.
7. Do not fabricate updates to durable stores when nothing durable changed.

The `.agents/` changes belong in the same phase commit as the implementation that produced them. This makes repository history explain both **what changed** and **what the agent learned**.

Never persist secrets or credential values in `.agents/`.

## 5. Validation before commit

Always inspect the change first:

```bash
git status --short
git diff --check
git diff
```

Review staged content before committing:

```bash
git diff --staged
```

### Nuxt lint requirement

Once the Nuxt application exists, use the current Nuxt-recommended ESLint integration:

- `@nuxt/eslint`;
- project-aware ESLint flat config (`eslint.config.mjs` or current generated equivalent);
- a package script equivalent to `eslint .`.

A code-changing phase may not be committed/pushed with lint errors.

Use the repository's selected package manager, for example:

```bash
pnpm lint
# or npm run lint / yarn lint / bun run lint, matching the committed lockfile
```

Do not switch package managers during a plan.

If the phase is docs/resources-only and the Nuxt linter does not exist yet, do not install framework tooling solely to lint Markdown/images. `git diff --check` and appropriate file/resource validation are sufficient until the app bootstrap phase installs the normal lint stack.

If the active plan defines additional validation such as build or typecheck, run it too. Unit tests are not required at this stage unless the user later changes this policy.

## 6. Commit discipline

Commit only after the phase is complete, persistence is updated, and required validation passes.

Use clear Conventional Commit-style subjects, for example:

```text
chore: gather building resources
feat: bootstrap Nuxt web foundation
feat: configure Situm web integration
feat: add authentication flow
chore: configure Drizzle schema
fix: handle missing Situm configuration
```

Guidelines:

- Keep each commit scoped to one completed phase.
- Do not bundle unrelated cleanup.
- Do not use vague subjects such as `update`, `changes`, or `wip` for a completed phase.
- Do not amend/rewrite an already pushed phase commit unless there is a concrete reason.
- Never force-push as a normal workflow. If rewriting public branch history becomes necessary, get explicit user approval first.

## 7. Push after every completed phase

The first push for a plan branch should set its upstream explicitly:

```bash
git push -u origin plan/001-web-foundation
```

Later phase commits:

```bash
git push
```

After pushing, verify:

```bash
git status
git log -1 --oneline
```

Expected state: working tree clean and local branch synchronized with its upstream.

Do not push plan commits directly to `main`.

## 8. Pull request gate

Pushing a branch does **not** authorize opening a PR.

Until the user explicitly asks for a PR:

- do not run `gh pr create`;
- do not call a GitHub PR creation tool;
- do not auto-open a draft PR;
- do not merge the branch into `main`;
- keep the pushed branch/worktree available for review and follow-up changes.

When the user later asks for a PR, review the full branch diff and current `.agents/` state before creating it.

## 9. CI and tests policy for the current phase of the project

### CI

CI is intentionally not configured yet.

- Do not add GitHub Actions or another CI service unless the user explicitly changes this decision.
- Local validation is the quality gate for now.

### Unit tests

Unit tests are intentionally deferred to avoid premature complexity.

- Do not install Vitest/Jest/etc. just to satisfy a generic testing convention.
- Do not add placeholder tests.
- Revisit testing when product logic becomes substantial enough to justify it or the user explicitly requests it.

This does not prohibit lightweight manual verification, lint, typecheck, build checks, migration inspection, or other validation required by the active plan.

## 10. Worktree lifecycle

While a plan is awaiting user review or PR authorization, keep its branch and worktree intact.

Do not automatically delete the worktree immediately after the final push.

After the work is integrated or the user explicitly says the branch can be cleaned up, use normal Git cleanup:

```bash
git worktree remove ../situm-explore-worktrees/001-web-foundation
git worktree prune
```

Delete local/remote branches only when it is clear they are no longer needed.

## Phase closeout checklist

Before saying a phase is complete, all applicable items must be true:

- [ ] Correct plan branch and worktree are active.
- [ ] Phase scope is complete; future phases were not pulled in unnecessarily.
- [ ] Plan checklist/status is updated.
- [ ] `.agents/` persistence pass is complete.
- [ ] No secrets are staged.
- [ ] `git diff --check` passes.
- [ ] Nuxt lint passes for code-changing phases once lint tooling exists.
- [ ] Any additional validation required by the plan passes.
- [ ] Changes are committed with a clear phase-scoped message.
- [ ] Commit is pushed to the plan branch/upstream.
- [ ] No PR was created unless the user explicitly requested it.
