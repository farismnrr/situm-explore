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
8. `design/data-source-matrix.md` for Plans 010–016
9. active plan

For UI/UX/presentation work also read:

10. `DESIGN.md`
11. `design/IMPLEMENTATION.md`
12. the canonical HTML only as visual/interaction evidence

Historical plans/sessions are evidence only and must not override current state/contracts.

## Current roadmap boundary

The UI roadmap through Plan 009B is historical, manually accepted, and integrated.

Plan 010 is the current bridge into backend/Situm work. It may prune previously accepted UI when a control is native-only, unsupported, fake, misleading, or has no credible product owner.

For Plans 010–016, every Situm-domain capability must end as one of:

```text
WEB / SITUM
WEB / PRODUCT
NATIVE-ONLY
REMOVE
UNRESOLVED
```

A prototype control is not proof that Situm supports that behavior on web.

## No-hallucination external integration rule

For Situm behavior, model memory is not evidence.

Before implementation, verify the exact current contract from official Situm documentation/source and the installed SDK version where relevant.

Do not invent:

- endpoint paths;
- SDK/Viewer method names;
- payload/event fields;
- permissions/auth behavior;
- web-vs-native availability;
- browser-vs-server ownership;
- fake fallback values.

If exact evidence is incomplete, mark the capability `UNRESOLVED` and stop that capability instead of guessing.

## Architecture boundary

Use the current Nuxt 4 structure already present under `app/`, `server/`, and optional `shared/`.

Do not repeat historical directory migrations.

Prefer KISS. Do not introduce speculative services, repositories, stores, event buses, generic API clients, caches, workers, or parallel design systems.

Future Situm REST/domain calls use private Nitro runtime credentials behind authenticated routes. The historical public Viewer POC key is not authority for new REST integrations.

Native indoor positioning/bluedot and movement-aware handset navigation are outside the current Nuxt web roadmap.

## Git workflow

- one plan = one dedicated plan branch;
- do not implement directly on `main`;
- do not use linked worktrees unless explicitly requested;
- complete phases with plan/state updates, validation, commit, and push;
- do not open a PR or merge without explicit user authorization;
- dependent plans start only after their dependency is integrated into updated `main`.

## Mandatory closeout

Before finishing a conversation, follow `.agents/protocols/persistence.md`.

Update current state/session evidence and only revise durable memory/knowledge/decisions when something durable actually changed.

Never persist credentials, API keys, JWTs, passwords, or unnecessary sensitive payloads.