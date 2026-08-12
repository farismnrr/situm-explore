# Situm Explore

Situm Explore is a repo-native workspace for building a personal self-improvement agent with Codex.

For now, this repository intentionally contains only the agent foundation: instructions, persistent memory, reusable knowledge, reflection notes, session history, and current state. Product/application implementation is deferred until explicitly requested.

## Core idea

`AGENTS.md` stays small and acts as the entry point. It routes Codex into `.agents/`, which is the source of truth for persistent context.

On every conversation, the agent should:

1. Load the relevant persistent context before doing work.
2. Complete the user's request.
3. Run a persistence pass before finishing the turn.
4. Record a concise session note for the conversation.
5. Update memory, knowledge, reflections, decisions, and current state only when the conversation produced durable information for those stores.

This gives every chat a durable trace without turning memory files into raw transcripts.

## Structure

```text
.
├── AGENTS.md
├── README.md
└── .agents/
    ├── README.md
    ├── identity.md
    ├── state.md
    ├── protocols/
    │   ├── chat-lifecycle.md
    │   └── persistence.md
    ├── memory/
    │   ├── README.md
    │   ├── profile.md
    │   ├── preferences.md
    │   ├── goals.md
    │   └── decisions.md
    ├── knowledge/
    │   └── index.md
    ├── reflections/
    │   └── lessons.md
    └── sessions/
        ├── README.md
        └── YYYY-MM-DD.md
```

## Storage model

- **Memory**: durable facts about the user, preferences, goals, and decisions.
- **Knowledge**: reusable concepts, references, frameworks, and learned domain knowledge.
- **Reflections**: lessons about what worked, what failed, and how the agent should improve.
- **Sessions**: concise chronological conversation records. One daily file may contain multiple timestamped entries.
- **State**: the current focus, open loops, and next likely actions.

## Principles

- Keep `AGENTS.md` short; detailed operating instructions belong in `.agents/`.
- Persist signal, not transcript noise.
- Revise existing durable facts instead of duplicating them.
- Separate user-stated facts from agent inference.
- Never store secrets, credentials, tokens, or unnecessary sensitive data.
- Do not start building the application layer until explicitly requested.

## Status

**Phase 0 — Agent foundation.**

The repository currently defines how the agent should remember, learn, reflect, and carry context across conversations. No product code has been started yet.
