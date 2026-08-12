# DESIGN.md

This file is the design router for Situm Explore.

The product direction is **clean minimalist SaaS, light mode only**.

Before changing UI, UX, layout, styling, interaction states, or component composition, read:

1. `.agents/design/README.md`
2. `.agents/design/design-principles.md`
3. `.agents/design/ui-guide.md`
4. `.agents/design/references.md`
5. the active plan under `plans/`

## Non-negotiables

- Use Nuxt UI as the component and semantic-token foundation.
- Light mode only until the user explicitly changes that decision.
- Prefer typography, spacing, hierarchy, and restrained surfaces over decoration.
- Preserve accessibility, keyboard behavior, focus visibility, and clear feedback states.
- Do not build a second design system on top of Nuxt UI.
- Do not copy reference products pixel-for-pixel; extract useful principles and adapt them to Situm Explore.
- Avoid gradients, glassmorphism, neon effects, excessive animation, decorative dashboards, and unnecessary navigation chrome.
- Do not add product features while executing a visual-refresh plan unless the active plan explicitly includes them.

When a visual decision is not covered, choose the simpler option and keep it consistent with the existing system.
