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

The UI roadmap through Plan 009B and the Situm roadmap Plans 010–016A are integrated. PRs #10 and #11 also integrated the user's final manual UI/mobile refinement pass into `main`.

The next roadmap is prepared on `roadmap/017-020-next-features` and the user explicitly authorized stacked execution:

```text
Plan 017 — Situm Analytics & Reports with local ClickHouse
-> Plan 018 — Groups & Alarms read-only
-> Plan 019 — Realtime Viewer overlay & conditional trajectory
-> Plan 020 — Static directions
```

Plan 017 is next active/ready. Plans 018–020 are queued.

The abandoned `chore/ui-refine-login-map-feedback` branch is superseded by the UI work already integrated into `main` and must not be used as a base.

Read `.agents/state.md` for the exact branch chain, worker-only phase execution requirement, current completed/unresolved truth, and the final two-key Situm credential contract.

## No-hallucination external integration rule

For Situm behavior, model memory is not evidence.

Before implementation, verify the exact current contract from official Situm documentation/source and the installed SDK version where relevant.

Do not invent endpoint paths, SDK/Viewer methods, payload/event fields, permissions/auth behavior, web/native availability, browser/server ownership, or fake fallback values.

If exact evidence is incomplete, keep the capability `UNRESOLVED`/absent instead of guessing.

## Architecture boundary

Use the current Nuxt 4 structure under `app/`, `server/`, and optional `shared/`.

Prefer KISS. Do not introduce speculative services, repositories, stores, event buses, generic API clients, caches, background workers, or parallel design systems.

Situm uses exactly two credential boundaries unless a future concrete requirement changes that decision:

- `NUXT_PUBLIC_SITUM_API_KEY` for the browser Viewer;
- `NUXT_SITUM_API_KEY` for private Nitro Situm operations.

Protected server Situm routes require the application session. Native indoor positioning/bluedot and movement-aware handset navigation remain outside the Nuxt web roadmap.

Plan 017 adds ClickHouse only as a server-side analytics store using the user's existing local ClickHouse instance. PostgreSQL/Drizzle remains the relational application store. Do not provision a second ClickHouse server or expose ClickHouse credentials to the browser.

## Git workflow

- one plan = one dedicated plan branch;
- never implement directly on `main`;
- no linked worktrees unless explicitly requested;
- complete phases with plan/state updates, validation, commit, and push;
- never merge without explicit user authorization;
- PR creation/review is user-gated;
- dependent plans normally start after integration into updated `main`;
- **exception currently active:** the user explicitly authorized stacked Plans 017→020; each next branch starts from the previous plan's final validated/pushed HEAD;
- do not create a PR or merge during the 017→020 run;
- implementation for each phase must be delegated specifically to the configured `worker` subagent; if that worker profile cannot be spawned, stop rather than substituting another agent/model.

Start Plan 017 from the final HEAD of `roadmap/017-020-next-features`.

## Mandatory closeout

Before finishing a conversation, follow `.agents/protocols/persistence.md`.

Update current state/session evidence and revise durable memory/knowledge/decisions only when something durable changed.

Never persist credentials, API keys, JWTs, passwords, ClickHouse credentials, or unnecessary sensitive payloads.
