# DESIGN.md

This file is the single design router for Situm Explore.

There is intentionally no `.agents/design/` layer. Do not create another parallel design source of truth.

## Canonical visual reference

The only HTML visual/interaction reference is:

`design/reference/situm-explore-interactive-prototype.html`

The user will populate that file manually with the approved prototype.

### Placeholder guard

If the canonical HTML still contains only placeholder content such as `Hello World`, **do not implement or redesign UI from memory, prior screenshots, Plan 003, generic SaaS references, or agent taste**. Treat the visual reference as not yet available and stop UI implementation at that boundary.

Once the user replaces the placeholder, the HTML defines visual and interaction intent only.

It is **not production code** and its HTML/CSS/JS must not be copied wholesale into the Nuxt application.

## Authority order

When design guidance conflicts, prefer:

1. the user's latest explicit direction;
2. the populated canonical HTML reference;
3. the active implementation plan;
4. `design/IMPLEMENTATION.md`;
5. `design/data-source-matrix.md`;
6. agent judgment only for gaps not covered above.

Plan 003 is historical implementation evidence only. Its rendered UI was not accepted as the design target.

## Production implementation contract

Production remains:

- Nuxt 4;
- Vue;
- Nuxt UI;
- existing Nuxt UI semantic/theme configuration;
- existing auth/PostgreSQL/Situm integrations.

Translate the reference into production using this order:

1. use an existing Nuxt UI primitive when it fits;
2. configure it with props, variants, slots, semantic tokens, app config, and existing utility classes;
3. compose a few Nuxt UI primitives for more complex patterns;
4. create a small Vue component when reuse/readability is real;
5. add small centralized custom CSS only for a visual gap that Nuxt UI/Tailwind cannot express cleanly.

Do **not**:

- copy prototype CSS wholesale;
- recreate prototype classes such as `.btn`, `.card`, or `.pill` as a second design system;
- copy prototype JavaScript instead of using Vue state and Nuxt routing;
- hardcode every prototype pixel/hex value across Vue files;
- replace Nuxt UI with another component library;
- redesign the reference merely because Nuxt UI defaults differ.

## Product direction

- Clean minimalist SaaS.
- Light mode only.
- Premium but restrained.
- Navigation-arrow product mark, not an `S` lettermark.
- Authenticated desktop information architecture may use the compact sidebar represented by the populated reference; mobile should use an appropriate drawer/sheet behavior.
- Preserve accessibility, keyboard behavior, focus visibility, truthful loading/error/ready states, and responsive hierarchy.

## Data boundary

Existing real behavior stays real. Missing product domains may use typed local dummy data during UI implementation.

Do not add backend endpoints, database tables, migrations, Situm write operations, or account-registration infrastructure merely to populate UI reference screens.

Read `design/IMPLEMENTATION.md`, `design/data-source-matrix.md`, and the active plan for the exact implementation/data mapping.
