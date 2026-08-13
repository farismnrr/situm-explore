# Plans

Plans are executable implementation checklists for Codex.

## Mandatory execution workflow

Before executing or continuing plan work, read:

1. `AGENTS.md`;
2. `.agents/README.md`;
3. `.agents/state.md`;
4. `.agents/memory/decisions.md` when roadmap/product boundaries matter;
5. `.agents/protocols/git-workflow.md`;
6. `ARCHITECTURE.md`;
7. `design/data-source-matrix.md` when Situm/product capability scope matters;
8. the active/follow-up plan;
9. `DESIGN.md` / `design/IMPLEMENTATION.md` for presentation changes.

Historical plans are evidence only. Current state/contracts override stale plan wording.

## Branch rule

- one plan = one dedicated plan branch;
- never implement directly on `main`;
- reuse an existing valid plan branch instead of recreating/resetting it;
- no force-push/destructive history rewrite as normal workflow;
- no PR/merge unless explicitly authorized.

## Dependency modes

### Normal mode

A dependent plan starts from updated `main` only after its dependency has been reviewed and integrated.

### Explicit stacked mode

Stacking is allowed only when the user explicitly authorizes it and current `.agents/state.md`/durable context records that decision.

In stacked mode:

```text
complete Plan N
-> validate + update plan/.agents
-> commit + push Plan N
-> take Plan N final HEAD
-> create/continue the next plan from that HEAD
```

Do not branch a stacked dependent plan from stale `main` and do not merge/cherry-pick merely to simulate the stack.

## Current roadmap state

Plans 010–016 already completed their explicit stacked implementation pass.

The active closeout/hardening follow-up is:

`plans/016a-situm-credential-split-runtime-verification.md`

Branch:

`plan/016a-situm-credential-split-runtime-verification`

Plan 016A continues the cumulative Plan 016 lineage. It owns only credential split, environment-contract cleanup, runtime verification of already implemented Situm paths, and evidence capture for unresolved REST domains.

Do **not** replay Plans 010–016. Do **not** execute the old `plans/017-situm-credential-split-runtime-verification.md` draft; that naming was superseded by Plan 016A. Plan 017 remains available for future substantive feature scope.

Current outcome before 016A is intentionally mixed:

- implemented where exact evidence existed;
- skipped/unresolved where exact contract/runtime evidence was insufficient;
- no fake fallback behavior;
- no native positioning scope added to web;
- no PR/merge performed.

Read `.agents/state.md` for exact completed/skipped/unresolved items and pending runtime smoke.

## Capability evidence gate

For Situm behavior: **no evidence, no implementation**.

Official endpoint/SDK existence alone is not enough when the UI requires specific filters, fields, permissions, or error semantics. Verify the exact contract actually consumed.

If material evidence is missing, keep the feature unresolved/absent rather than inventing it.

Do not treat lack of an `@situm/sdk-js` wrapper as proof the Situm REST API lacks a capability; server-side Nitro integrations may use exact official REST endpoints when verified and appropriate.

## Architecture/security

Follow `ARCHITECTURE.md` and keep implementation small:

- browser Viewer credential is separate from private Nitro credentials;
- current/future Nitro reads use the private read-only credential;
- write credential remains private and unused unless an approved mutation requires it;
- protected product `/api/situm/*` routes require the app session;
- no generic unauthenticated Situm proxy;
- no speculative services/repositories/stores/caches/workers;
- browser Viewer behavior stays owned by the single Viewer integration;
- native handset positioning/navigation stays outside the Nuxt web roadmap.

## Phase completion

A phase is only complete when applicable checks are truthfully recorded:

1. plan checklist/status updated;
2. `.agents` persistence updated;
3. required validation run;
4. phase committed and pushed;
5. unresolved/manual-smoke items remain visibly unchecked or explicitly marked pending.

Do not call a roadmap production/runtime-verified while required live API/Viewer smoke is still unavailable.

CI and a standalone unit-test runner remain deferred unless a later requirement changes that decision.
