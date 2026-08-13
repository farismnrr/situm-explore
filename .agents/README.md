# Agent Context System

`.agents/` is the persistent context layer for Situm Explore.

Root `AGENTS.md` is intentionally a router. Architecture/design truth lives in the root contracts; `.agents/` stores current state, durable decisions, operating protocols, and concise history.

## Directory map

| Path | Purpose |
| --- | --- |
| `identity.md` | Mission, behavior, and stable agent principles. |
| `state.md` | Current focus, blockers, active branch, and next action. |
| `protocols/chat-lifecycle.md` | Conversation workflow. |
| `protocols/persistence.md` | What must be persisted after a conversation. |
| `protocols/git-workflow.md` | Plan branch, validation, commit/push, and PR gates. |
| `memory/` | Durable user/project decisions and preferences. |
| `knowledge/` | Reusable verified domain knowledge. |
| `reflections/` | Reusable lessons about process/agent behavior. |
| `sessions/` | Chronological evidence; may become stale. |

Architecture/design authority intentionally lives outside `.agents/`:

- `ARCHITECTURE.md` — current application/runtime/dependency contract;
- `DESIGN.md` — visual authority router and capability-truth boundary;
- `design/IMPLEMENTATION.md` — current Nuxt UI implementation rules;
- `design/data-source-matrix.md` — current web/native/remove/data ownership matrix;
- active plan — executable scope and evidence requirements.

## Mandatory read order for implementation

1. `AGENTS.md`.
2. `.agents/identity.md`.
3. `.agents/state.md`.
4. `.agents/protocols/chat-lifecycle.md`.
5. `.agents/protocols/git-workflow.md`.
6. `.agents/memory/decisions.md` when roadmap/product boundaries matter.
7. `ARCHITECTURE.md`.
8. `plans/README.md`.
9. `design/data-source-matrix.md` for Plans 010–016.
10. active plan.
11. `DESIGN.md` and `design/IMPLEMENTATION.md` when presentation/UI is changed.

Do not load every historical plan/session blindly. Historical material is evidence, not current authority.

## Truth hierarchy

When guidance conflicts, prefer:

1. user's latest explicit instruction;
2. current durable state/decisions and current root contracts;
3. active plan + current capability/data matrix;
4. current source code/runtime behavior;
5. historical plans/session notes;
6. agent inference.

Never silently promote inference above verified/current instructions.

## Evidence rule

For external Situm behavior, memory is not evidence.

Before implementation, an agent must verify the exact current contract required by the active plan using official Situm documentation/source and the installed SDK version where relevant.

Do not invent:

- endpoint paths;
- Viewer/SDK method names;
- request/response fields;
- permission requirements;
- browser-vs-server capability;
- native-vs-web capability;
- fallback data.

If a required capability is not verified, mark it `UNRESOLVED` in Plan 010/capability mapping and do not implement it. A truthful removal or explicit blocked item is preferable to a guessed integration.

## Persistence model

Session notes answer **what happened?** and may become stale.

Durable files answer **what is still true?** They must be revised when newer decisions supersede older ones.

Before committing a completed plan phase:

1. update active plan/checklist;
2. update `.agents/state.md`;
3. update durable decisions only if the decision actually changed;
4. add/update the current session note;
5. run the phase validation;
6. commit and push the plan branch.

Never store credentials, API keys, JWTs, passwords, or sensitive response payloads.

## Current scope

The UI roadmap through Plan 009B is historical, accepted after manual correction, and integrated into `main`.

The active roadmap stage is **Plan 010 — Web Capability Pruning & Situm Integration Contract** on `plan/010-progressive-situm-data-integration`.

Plan 010 must make the product contract truthful before backend integration by:

- pruning native-only/fake/unsupported web UI;
- freezing the web/native boundary;
- freezing the browser Viewer vs private Nitro credential boundary;
- mapping every retained Situm-domain field/action to exact verified evidence and one later owner.

Plans 011–016 must not restore UI removed by Plan 010 and must not invent unsupported Situm capabilities.

Native indoor positioning/bluedot and motion-aware handset navigation are outside the current Nuxt web roadmap.