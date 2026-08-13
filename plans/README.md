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
8. the active/follow-up plan, if one exists;
9. `DESIGN.md` / `design/IMPLEMENTATION.md` for presentation changes.

Historical plans are evidence only. Current state/contracts override stale plan wording.

## Branch rule

- one plan = one dedicated plan branch;
- never implement directly on `main`;
- reuse an existing valid plan branch instead of recreating/resetting it;
- no force-push/destructive history rewrite as normal workflow;
- PR creation/review is user-gated;
- merge remains explicitly user-gated.

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

Plans 010–016 completed their explicit stacked implementation pass. Plan 016A then completed the credential/config/runtime hardening closeout on the same cumulative lineage.

Cumulative review branch:

`plan/016a-situm-credential-split-runtime-verification`

Plan 016A is **complete**. Do not replay Plans 010–016 or Plan 016A. Do not execute the old `plans/017-situm-credential-split-runtime-verification.md` draft; that naming was superseded. Plan 017 remains available only for genuinely new substantive feature scope after the current lineage is reviewed/integrated.

Current outcome:

- implemented where exact evidence existed;
- runtime-smoked for the implemented Situm server read paths using configured credentials;
- skipped/unresolved where exact implementation contracts remain insufficient;
- no fake fallback behavior;
- no native positioning scope added to web;
- cumulative branch ready for user-gated PR review/integration.

Read `.agents/state.md` for the exact completed/skipped/unresolved items and next integration action.

## Capability evidence gate

For Situm behavior: **no evidence, no implementation**.

Official endpoint/SDK existence alone is not enough when the UI requires specific filters, fields, permissions, or error semantics. Verify the exact contract actually consumed.

If material evidence is missing, keep the feature unresolved/absent rather than inventing it.

Do not treat lack of an `@situm/sdk-js` wrapper as proof the Situm REST API lacks a capability; server-side Nitro integrations may use exact official REST endpoints when verified and appropriate.

## Architecture/security

Follow `ARCHITECTURE.md` and keep implementation small.

The final Situm credential model intentionally uses exactly two keys:

- `NUXT_PUBLIC_SITUM_API_KEY` — browser Viewer only;
- `NUXT_SITUM_API_KEY` — single private Nitro credential for all server-side Situm operations.

Additional rules:

- do not introduce separate private read/write keys without a concrete future requirement;
- protected product `/api/situm/*` routes require the app session;
- no generic unauthenticated Situm proxy;
- private credentials never enter browser/public runtime config, logs, docs, or error payloads;
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

Plan 016A satisfies its closeout requirements, including live runtime smoke for implemented Situm server read paths.

CI and a standalone unit-test runner remain deferred unless a later requirement changes that decision.
