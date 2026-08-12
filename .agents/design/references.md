# Design References

References are used as **quality cues**, not templates to clone.

The agent should borrow specific principles and then implement them using Situm Explore's Nuxt UI stack and current information architecture.

## Primary technical reference — Nuxt UI

Use the current official Nuxt UI documentation as the first implementation reference.

Useful qualities:

- semantic color aliases rather than raw color proliferation;
- semantic text/background/border utilities;
- shared radius/container variables;
- centralized component theming through app config;
- accessible primitives powered by the library;
- responsive layout primitives.

Prefer current Nuxt UI APIs over copying React/shadcn implementations into Vue.

## Linear — product restraint and hierarchy

Borrow:

- disciplined spacing and density;
- low-noise chrome;
- strong hierarchy with small typography differences;
- secondary metadata staying secondary;
- controls appearing near the context where they matter;
- fast, direct product feel.

Do not copy:

- Linear's dark-first visual identity;
- exact colors, iconography, navigation structure, or proprietary interaction patterns;
- sidebar complexity before Situm Explore has equivalent information architecture.

## Vercel — monochrome clarity

Borrow:

- clear visual hierarchy;
- restrained neutral palette;
- crisp borders;
- deliberate whitespace;
- simple, obvious action hierarchy;
- technical information presented without decorative dashboard clutter.

Do not copy:

- exact black-and-white branding;
- marketing page hero patterns for the authenticated app;
- visual effects that do not serve the task.

## Notion — calm workspace feel

Borrow:

- calm whitespace;
- familiar, readable controls;
- content-first composition;
- low visual noise;
- progressive disclosure.

Do not copy:

- editor/document metaphors where this is a map/product workspace;
- hover-only discoverability for important actions;
- dense nested workspace navigation before it is needed.

## Stripe Dashboard — operational clarity

Borrow:

- clear state/status communication;
- strong form ergonomics;
- compact operational metadata;
- readable error/recovery copy;
- restrained use of color for meaning.

Do not copy:

- finance-specific tables, metrics, or navigation;
- extra dashboard widgets simply to resemble a SaaS admin product.

## Reference protocol for AI

When using any reference:

1. Name the exact quality being borrowed.
2. Check whether that quality solves a real problem in the current Situm Explore surface.
3. Express it through Nuxt UI semantics and existing components.
4. Adapt it to light-only mode and the project's small information architecture.
5. Do not import another framework solely to reproduce a reference.
6. Do not copy exact layouts, copywriting, brand colors, logos, or proprietary assets.
7. If references disagree, follow `design-principles.md` and choose the quieter/simpler option.

A good implementation should feel like it belongs in the same quality category as these products without looking like a clone of any one of them.
