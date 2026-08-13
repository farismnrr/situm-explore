# Plans

Plans are executable implementation checklists for Codex.

## Mandatory execution workflow

Before executing any plan in this directory, read:

1. root `AGENTS.md`;
2. `.agents/README.md`;
3. `.agents/protocols/git-workflow.md`;
4. root `ARCHITECTURE.md`;
5. `design/data-source-matrix.md` for Plans 010–016;
6. the active plan file;
7. `DESIGN.md` / `design/IMPLEMENTATION.md` when changing presentation.

Every plan uses its own branch in the normal repository working directory. Do not create a linked worktree unless the user explicitly asks.

```text
plan:   plans/010-progressive-situm-data-integration.md
branch: plan/010-progressive-situm-data-integration
```

Do not implement a plan directly on `main`.

## Sequential dependency rule

If Plan N+1 depends on Plan N, Plan N must be complete, reviewed, and integrated into `main` before Plan N+1 starts.

Normal flow:

```text
finish plan branch
-> validate + push
-> user reviews
-> user explicitly authorizes PR/integration
-> dependency lands in main
-> sync main
-> create next plan branch from updated main
```

Do not silently stack plans or branch from stale main.

## Historical plans

Plans marked complete/closed are implementation history, not current instructions.

- Do not resurrect deleted paths, old environment-variable names, superseded architecture, or old UI behavior merely because a historical plan mentions it.
- Current `AGENTS.md`, `ARCHITECTURE.md`, `design/data-source-matrix.md`, durable `.agents/` decisions/state, and the active plan override historical details.
- Plans 004–009 intentionally allowed dummy UI. That does **not** authorize permanent fake Situm-domain behavior after Plan 010.

## Plan 010–016 capability rule

Starting in Plan 010, every Situm-domain UI field/control must have a truthful disposition:

```text
real web Situm capability with one owner
or
product-owned web behavior
or
native-only -> removed from web
or
unsupported/low-value/fake -> removed
```

Do not preserve a fake Situm interaction solely for prototype fidelity.

Plan 010 is allowed to prune the accepted UI where capability truthfulness requires it. Plans 011–016 must not restore pruned UI unless the user explicitly changes the product scope.

Native indoor positioning and motion-aware navigation are outside Plans 010–016.

## Situm credential rule for future plans

- New REST/domain integration must not use a public broad-permission Situm credential.
- Server data paths use private Nitro runtime configuration and existing session-protected `/api/situm/*` routes.
- Browser Viewer auth is a separate, narrowly verified boundary owned by Plan 010.
- Never create a generic unauthenticated Situm proxy.

Historical references to `NUXT_PUBLIC_SITUM_API_KEY` describe the old Viewer POC baseline; they are not authority for new backend integration.

## Architecture and documentation discipline

Follow Nuxt 4 app/server/shared boundaries in `ARCHITECTURE.md`. Do not introduce speculative services, repositories, stores, layers, generic API clients, caches, workers, or DB persistence without a concrete need.

When a phase changes setup, environment-variable names, routes, runtime boundaries, or product capability, update relevant docs in the same phase.

After each completed implementation phase:

1. update the plan checklist/status;
2. update relevant `.agents/` state/decisions/session context;
3. run required validation, including lint for code changes;
4. commit the completed phase;
5. push the plan branch;
6. stop short of a PR unless explicitly authorized.

CI and unit-test infrastructure remain intentionally deferred unless a later requirement changes that decision.
