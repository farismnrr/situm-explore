# AGENTS.md

This repository is a persistent self-improvement agent workspace for Codex.

Keep this file short. It is a router, not the knowledge base.

## Source of truth

Before doing work, read `.agents/README.md` and follow the instructions it links to.

At minimum, every conversation must load:

1. `.agents/identity.md`
2. `.agents/state.md`
3. `.agents/protocols/chat-lifecycle.md`
4. Any relevant files under `.agents/memory/`, `.agents/knowledge/`, and `.agents/reflections/`

## Mandatory chat closeout

Before finishing every conversation, run the persistence pass in `.agents/protocols/persistence.md`.

Every conversation must leave a concise entry in `.agents/sessions/YYYY-MM-DD.md`. Durable stores should be updated only when the conversation actually changes them.

In particular:

- update memory when durable user facts, preferences, goals, or decisions change;
- update knowledge when reusable concepts, references, or frameworks are learned;
- update reflections when a reusable lesson about agent behavior or process is learned;
- update `.agents/state.md` when current focus, open loops, or next actions change.

Prefer revising existing entries over adding duplicates.

## Boundaries

- Do not store passwords, API keys, access tokens, credentials, or unnecessary sensitive information.
- Mark inference as inference; do not rewrite guesses as user-stated facts.
- Do not treat session logs as permanent truth when a newer durable memory contradicts them.
- Do not implement the product/application layer unless the user explicitly asks for it.
- Keep agent infrastructure Markdown-first and simple until complexity is justified.
