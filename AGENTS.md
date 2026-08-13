# AGENTS.md

This repository is a persistent agent workspace for Situm Explore.

Keep this file short. It is a router, not the knowledge base.

## Mandatory read order

At minimum every conversation reads:

1. `.agents/identity.md`
2. `.agents/state.md`
3. `.agents/protocols/chat-lifecycle.md`

For plan execution or repository changes also read:

4. `.agents/protocols/git-workflow.md`
5. `.agents/memory/decisions.md` when roadmap/product boundaries matter
6. `ARCHITECTURE.md`
7. `plans/README.md`
8. `design/data-source-matrix.md` when Situm/product capability scope matters
9. the active/follow-up plan, if one exists

For UI/UX/presentation work also read:

10. `DESIGN.md`
11. `design/IMPLEMENTATION.md`
12. the canonical HTML only as visual/interaction evidence

Historical plans/sessions are evidence only and must not override current state/contracts.

## Current roadmap truth

The UI roadmap through Plan 009B is historical and integrated.

Plans 010–016 completed a user-authorized **stacked implementation pass**. Do not restart them or recreate them from `main`.

The active follow-up is **Plan 016A — Situm Credential Split & Runtime Verification** on:

`plan/016a-situm-credential-split-runtime-verification`

The earlier Plan 017 credential-split draft/name is superseded and must not be executed as a separate step. Plan 017 is reserved for future substantive feature scope.

No PR or merge is authorized. Read `.agents/state.md` for exact completed/skipped/unresolved status and runtime-smoke requirements.

## No-hallucination external integration rule

For Situm behavior, model memory is not evidence.

Before implementation, verify the exact current contract from official Situm documentation/source and the installed SDK version where relevant.

Do not invent endpoint paths, SDK/Viewer methods, payload/event fields, permissions/auth behavior, web/native availability, browser/server ownership, or fake fallback values.

If exact evidence is incomplete, keep the capability `UNRESOLVED`/absent instead of guessing.

## Architecture boundary

Use the current Nuxt 4 structure under `app/`, `server/`, and optional `shared/`.

Prefer KISS. Do not introduce speculative services, repositories, stores, event buses, generic API clients, caches, background workers, or parallel design systems.

Situm REST/domain calls use private Nitro runtime credentials behind authenticated routes. The browser Viewer credential is a separate public boundary. Native indoor positioning/bluedot and movement-aware handset navigation remain outside the Nuxt web roadmap.

## Git workflow

- one plan = one dedicated plan branch;
- never implement directly on `main`;
- no linked worktrees unless explicitly requested;
- complete phases with plan/state updates, validation, commit, and push;
- never open a PR or merge without explicit user authorization;
- dependent plans normally start after integration into updated `main`;
- **exception:** when `.agents/state.md` / durable decisions record explicit stacked execution, the next plan must branch from the completed previous plan HEAD instead of `main`.

Plan 016A is an explicitly authorized post-stack follow-up continuing the cumulative Plan 016 lineage.

## Mandatory closeout

Before finishing a conversation, follow `.agents/protocols/persistence.md`.

Update current state/session evidence and revise durable memory/knowledge/decisions only when something durable changed.

Never persist credentials, API keys, JWTs, passwords, or unnecessary sensitive payloads.
