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

For any plan execution or repository implementation work, also read and follow:

5. `.agents/protocols/git-workflow.md`

For any UI, UX, styling, layout, component-composition, or visual-design work, also read:

6. `DESIGN.md`
7. `.agents/design/README.md` and the design guides it routes to

The Git workflow protocol is mandatory. Every plan uses its own dedicated branch in the normal repository working directory. Linked Git worktrees are not required. Completed phases must be persisted, validated, committed, and pushed without opening a PR unless the user explicitly asks for one.

The design guidance is mandatory for UI work. Prefer the repository's design principles and Nuxt UI semantic system over ad-hoc styling or copying a reference product literally.

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
- Keep architecture simple until requirements justify complexity.
- Do not implement plans directly on `main`.
- Do not create pull requests for plan branches without explicit user authorization.
