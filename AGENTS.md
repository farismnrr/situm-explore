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
6. `ARCHITECTURE.md`
7. `plans/README.md`

For any UI, UX, styling, layout, component-composition, or visual-design work, also read:

8. `DESIGN.md`
9. The active plan and only the root `design/` implementation documents explicitly linked by `DESIGN.md` or that plan

The Git workflow protocol is mandatory. Every plan uses its own dedicated branch in the normal repository working directory. Linked Git worktrees are not required. Completed phases must be persisted, validated, committed, and pushed without opening a PR unless the user explicitly asks for one.

## Sequential roadmap rule

Roadmap plans are executed sequentially.

If the active plan declares a dependency on a previous plan, that dependency must already be complete and integrated into `main` before creating the next plan branch from `origin/main`.

Do not silently:

- start a dependent plan from stale `main`;
- stack a new plan branch on an unmerged dependency;
- copy files manually from another plan branch.

If the dependency is complete but still awaiting user authorization for PR/integration, stop at that boundary. Stacked plan branches are allowed only when the user explicitly requests them.

The architecture contract is mandatory for implementation work. Use Nuxt 4 native app/server/shared boundaries, keep pages and API handlers focused, and prefer KISS over speculative abstractions. SOLID and DRY clarify real responsibilities/repetition; they do not justify ceremonial layers.

For UI work, the populated canonical HTML is a visual/interaction reference only. Production implementation must use the existing Nuxt/Vue/Nuxt UI stack; do not copy prototype HTML/CSS/JS as application architecture.

Plans 004–009 are UI-first/dummy-first for product domains that do not already have a working integration. The existing real auth/database/Situm Viewer lifecycle stays real, but new Situm product-domain integrations wait until the UI roadmap is complete and accepted.

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
- Do not treat session logs or historical plans as permanent truth when newer durable state/contracts contradict them.
- Keep architecture simple until requirements justify complexity.
- Do not implement plans directly on `main`.
- Do not create pull requests for plan branches without explicit user authorization.
