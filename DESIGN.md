# DESIGN.md

This file is the single design router for Situm Explore.

There is intentionally no `.agents/design/` layer. Do not create another parallel design source of truth.

## Canonical visual reference

The only HTML visual/interaction reference is:

`design/reference/situm-explore-interactive-prototype.html`

The user owns that file. It defines visual hierarchy, composition, density, spacing, responsive intent, and interaction presentation.

It is **not production code** and its HTML/CSS/JS must not be copied wholesale into the Nuxt application.

## Two different authorities

Visual truth and capability truth are intentionally separated.

### Visual authority

For appearance/composition, prefer:

1. user's latest explicit visual direction;
2. populated canonical HTML reference;
3. active plan;
4. `design/IMPLEMENTATION.md`;
5. agent judgment only for uncovered visual gaps.

### Capability/data authority

For whether a field/control should exist and how it is backed, prefer:

1. user's latest explicit product/scope direction;
2. current `.agents/state.md` and `.agents/memory/decisions.md`;
3. active plan;
4. `design/data-source-matrix.md`;
5. verified official Situm contract + installed SDK behavior;
6. current source/runtime behavior.

The prototype **cannot force retention of unsupported, native-only, fake, or ownerless Situm-domain behavior**.

If Plan 010 classifies a prototype control as `NATIVE-ONLY` or `REMOVE`, do not restore it for pixel fidelity.

## Evidence rule for Situm behavior

Do not infer Situm capabilities from labels, screenshots, prototype JavaScript, historical plans, or model memory.

Before a Situm-domain behavior becomes real, the active plan must have exact verified evidence for the needed endpoint/SDK method, data fields, access path, and permission/runtime boundary.

If the contract is not verified, the capability is unresolved. Do not invent it.

## Production implementation contract

Production remains:

- Nuxt 4;
- Vue;
- Nuxt UI;
- existing semantic/theme configuration;
- existing auth/PostgreSQL boundaries;
- the official Situm JS Viewer only for verified browser Viewer behavior.

Translation order:

1. reuse an existing Nuxt UI primitive when it fits;
2. configure props/variants/slots/tokens;
3. compose a small number of primitives;
4. create a small product component when real reuse/readability exists;
5. add narrow custom CSS only for a real visual gap.

Do not:

- copy prototype CSS wholesale;
- recreate a parallel `.btn/.card/.pill` design system;
- copy prototype screen-switching JavaScript;
- replace Nuxt UI with another framework;
- build abstractions merely because multiple future features might exist.

## Current product direction

- Clean minimalist SaaS.
- Light mode only.
- Premium but restrained.
- Navigation-arrow product mark.
- Responsive authenticated sidebar/drawer behavior.
- Preserve accessibility, keyboard behavior, focus visibility, and truthful loading/empty/error states.

## Post-UI roadmap boundary

Plans 004–009 historically allowed typed local fixtures to establish the product UI.

Starting with Plan 010:

- app-owned web behavior may remain app-owned;
- retained Situm-domain behavior must receive an exact real owner in Plans 011–016;
- native-only behavior must not appear as a working web capability;
- unsupported/fake/low-value Situm-domain behavior is removed;
- fixtures are transitional only and are deleted when their real owner replaces them or when the related UI is removed.

Read `design/IMPLEMENTATION.md`, `design/data-source-matrix.md`, and the active plan before changing UI or integration behavior.