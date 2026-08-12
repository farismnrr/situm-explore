# Design Principles

## 1. Clarity before personality

A user should understand what a screen is for, what is important, and what to do next before noticing styling.

Use visual hierarchy to answer:

- Where am I?
- What is the primary content?
- What is the primary action?
- What is the current system state?

## 2. Quiet by default

The interface should feel calm rather than busy.

Prefer:

- neutral page and surface colors;
- one restrained primary accent;
- subtle borders;
- little or no shadow unless elevation communicates something real;
- generous whitespace;
- short, direct copy.

Avoid decorative color blocks, gradients, glass effects, glowing elements, or ornamental cards.

## 3. Hierarchy comes from type and space

Use heading size/weight, text tone, grouping, and whitespace before introducing boxes or separators.

Not every piece of content needs a card. Not every section needs a heading. Not every status needs a bright badge.

## 4. One obvious primary action

Each surface should make its most important action obvious without making every control look equally important.

Use primary buttons sparingly. Secondary actions should use neutral, soft, outline, ghost, or text treatments as appropriate.

## 5. Content is the interface

For the authenticated experience, the Situm map is primary product content. Application chrome should support it rather than compete with it.

Give important content enough physical space and reduce surrounding status/admin noise.

## 6. Progressive disclosure over permanent chrome

Do not add sidebars, toolbars, menus, settings panels, or persistent controls before their navigation/actions exist.

The current application has a small information architecture, so a compact top bar and content canvas are preferred. Introduce a sidebar only when multiple persistent destinations justify it.

## 7. Consistency beats cleverness

A repeated interaction should look and behave the same everywhere.

Reuse Nuxt UI semantics, component variants, radius, spacing, icon style, and feedback patterns instead of inventing a new treatment per page.

## 8. Honest system state

Never imply success before the system knows it succeeded.

Loading, ready, empty, warning, and error states must be visually distinguishable and use accurate copy. Avoid fake progress and decorative status indicators.

## 9. Accessible is the default

Accessibility is not a later polish phase.

Maintain:

- visible keyboard focus;
- semantic labels for form controls;
- sufficient contrast;
- sensible source order;
- keyboard-operable actions;
- understandable error messages;
- touch-friendly interactive targets;
- reduced-motion-friendly behavior.

Prefer accessible Nuxt UI primitives instead of recreating common controls manually.

## 10. Responsive, not merely shrinking

On smaller screens, preserve the task and hierarchy instead of squeezing desktop composition into less width.

Let layouts stack, actions wrap, and secondary metadata move below primary content. Avoid horizontal overflow except where the content itself requires it.

## 11. Light mode is intentional

Situm Explore is light-only for the current product phase.

Do not spend complexity on dark variants, theme toggles, or dual-theme visual testing until the user requests them.

## 12. Restraint is a feature

Do not add animation, icons, cards, navigation, metrics, or labels because a SaaS dashboard is expected to have them.

Every visual element should earn its place by improving comprehension, action, feedback, or orientation.
