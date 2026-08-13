# Plans

Plans are executable implementation checklists for Codex.

## Mandatory execution workflow

Before executing any plan in this directory, read:

1. root `AGENTS.md`;
2. `.agents/README.md`;
3. `.agents/state.md`;
4. `.agents/memory/decisions.md` when roadmap/product boundaries matter;
5. `.agents/protocols/git-workflow.md`;
6. root `ARCHITECTURE.md`;
7. `design/data-source-matrix.md` for Plans 010–016;
8. active plan;
9. `DESIGN.md` / `design/IMPLEMENTATION.md` when presentation changes.

Every plan uses its own branch in the normal repository working directory. Do not implement directly on `main` and do not create a linked worktree unless the user explicitly asks.

## Sequential dependency rule

If Plan N+1 depends on Plan N, Plan N must be complete, reviewed, and integrated into `main` before Plan N+1 starts from updated `main`.

```text
finish plan branch
-> validate + push
-> user reviews
-> user explicitly authorizes integration
-> dependency lands in main
-> sync main
-> create next plan branch
```

Do not silently stack plans, cherry-pick around dependencies, or branch from stale `main`.

## Current vs historical authority

Plans marked complete/closed are implementation history, not current instructions.

Do not resurrect:

- deleted paths/routes;
- old environment-variable contracts;
- superseded UI behavior;
- old credential assumptions;
- old architecture migrations.

For Plans 010–016, current authority is:

1. user's latest explicit instruction;
2. `.agents/state.md` + durable decisions;
3. `ARCHITECTURE.md`;
4. `design/data-source-matrix.md`;
5. active plan;
6. `DESIGN.md` / `design/IMPLEMENTATION.md` for presentation;
7. current source/runtime behavior;
8. historical plans only as evidence.

Plans 004–009 intentionally allowed dummy UI. That does **not** authorize permanent fake Situm-domain behavior after Plan 010.

## Plan 010–016 capability rule

Starting in Plan 010, every Situm-domain UI field/control must end in exactly one disposition:

```text
WEB / SITUM      -> exact verified real owner
WEB / PRODUCT    -> app-owned behavior
NATIVE-ONLY      -> absent from web
REMOVE           -> unsupported/fake/low-value, absent from product
UNRESOLVED       -> not implementable until evidence exists
```

Do not preserve fake behavior solely for prototype fidelity.

Plan 010 may prune the accepted UI where capability truthfulness requires it. Plans 011–016 must not restore pruned UI unless the user explicitly changes scope.

## External evidence gate — no evidence, no implementation

For Situm behavior, model memory, prototype labels, old fixtures, and historical plans are **not sufficient evidence**.

Before coding a retained Situm capability, verify the exact current contract from official Situm documentation/source and the installed SDK version where relevant.

Required evidence:

- exact REST endpoint or Viewer/SDK method;
- web vs native availability;
- browser Viewer vs authenticated Nitro ownership;
- authentication/permission requirement;
- request parameters actually used;
- response/event fields actually consumed;
- read vs write semantics;
- error/empty/stale behavior relevant to the UI.

If any material part is uncertain:

1. mark the item `UNRESOLVED` in Plan 010/capability matrix;
2. do not invent a likely method/field;
3. do not implement a fake success fallback;
4. do not broaden the architecture to compensate;
5. resolve evidence first or remove the capability if it is not worth the POC.

Later Plans 011–016 may implement only capabilities that left Plan 010 with exact evidence and one owner.

## Situm credential rule

- New REST/domain integrations must not use a public broad-permission Situm credential.
- Server data paths use private Nitro runtime configuration and session-protected product API routes.
- Browser Viewer auth is a separate boundary frozen by Plan 010 after exact verification.
- Never create a generic unauthenticated Situm proxy.
- Historical `NUXT_PUBLIC_SITUM_API_KEY` references describe the legacy Viewer POC baseline only.

## Architecture discipline

Follow Nuxt 4 app/server/shared ownership in `ARCHITECTURE.md`.

Do not introduce speculative:

- services/repositories;
- global stores/event buses;
- generic API clients;
- caches/background workers;
- DB persistence for external Situm data;
- generic Viewer command dispatchers.

Use the smallest real owner required by current behavior.

## Documentation discipline

When a phase changes any of these, update the relevant current authority in the same phase:

- route/screen availability;
- capability classification;
- environment-variable/runtimeConfig contract;
- browser/server/native boundary;
- external endpoint/method mapping;
- architecture/runtime behavior.

Do not knowingly leave current docs contradicting implementation.

## Phase completion

After each completed implementation phase:

1. update plan checklist/status;
2. update `.agents/state.md`;
3. update durable decisions only if they changed;
4. update current session note;
5. run required validation;
6. commit completed phase;
7. push plan branch;
8. stop short of PR/integration unless explicitly authorized.

CI and a standalone unit-test runner remain deferred unless a later requirement changes that decision.