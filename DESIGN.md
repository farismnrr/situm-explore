# DESIGN.md

This file is the design router for Situm Explore.

## Golden visual reference

The primary visual and interaction source of truth is:

`design/reference/situm-explore-interactive-prototype.html`

It is the user-approved interactive prototype. For UI implementation work, **match this prototype before applying agent taste**.

Authority order when design guidance conflicts:

1. the user's latest explicit direction;
2. the approved interactive prototype;
3. the active implementation plan;
4. `design/nuxt-implementation-guide.md` and `design/data-source-matrix.md`;
5. `.agents/design/` principles/guides;
6. external inspiration;
7. agent taste.

Plan 003 is historical implementation evidence only. Its merged UI was closed because it was too far from the user's expectation. **Do not treat Plan 003's rendered result as an approved design target.**

## Product direction

- Clean minimalist SaaS.
- Light mode only.
- Premium but restrained; hierarchy comes from spacing, typography, borders, and composition rather than decoration.
- Use the navigation-arrow mark shown in the approved prototype. Do not restore the old `S` lettermark.
- The richer authenticated information architecture now justifies a compact sidebar on desktop and drawer/sidebar behavior on mobile.

## Nuxt translation rules

The prototype is a visual/interaction specification, **not production architecture to copy literally**.

- Use Nuxt 4 + Vue + Nuxt UI already installed in the repository.
- Translate repeated prototype patterns into small Vue components only when reuse is real.
- Keep Nuxt UI primitives and semantic states where they help accessibility and consistency.
- A small centralized set of project CSS variables/utilities may be used to achieve visual fidelity; do not create a second component framework.
- Keep current auth, PostgreSQL, and Situm behavior working.
- Existing real integrations must remain real.
- Surfaces without an existing backend/API implementation may use typed client-side dummy data. Do not expand backend/database scope merely to make the UI look complete.
- Never display or commit credential values.

## Non-negotiables

- The prototype wins over generic Linear/Vercel/Notion inspiration.
- Do not redesign the approved composition while implementing it.
- Do not add dark mode or a theme toggle.
- Do not replace the navigation mark with an arbitrary logo.
- Do not invent new backend endpoints, database tables, migrations, account registration, Situm write operations, or admin behavior inside the UI implementation roadmap unless a later user-approved plan explicitly asks for them.
- Preserve keyboard access, focus visibility, readable contrast, truthful loading/error/ready states, and responsive behavior.
