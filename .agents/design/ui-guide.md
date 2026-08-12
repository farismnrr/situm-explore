# UI Guide

This guide translates the design principles into implementation choices for the current Nuxt UI application.

## Foundation

Use Nuxt UI's semantic design system rather than hard-coding a parallel palette. Prefer semantic utilities/tokens such as primary, neutral, default/elevated backgrounds, highlighted/muted text, and default borders.

Use `app.config.ts` and shared CSS variables/theme configuration for global visual decisions when appropriate. Keep per-component overrides local only when they are genuinely component-specific.

### Baseline direction

Until a brand system exists:

- neutral family: zinc/gray-like neutral;
- primary accent: one restrained blue-like accent;
- page: light neutral/off-white or semantic default background;
- surfaces: white/default/elevated;
- body text: high-contrast neutral;
- secondary text: semantic muted/dimmed;
- border: subtle neutral semantic border;
- success/warning/error: semantic status colors only.

Do not introduce multiple brand accent colors without a product requirement.

## Shape and elevation

- Default radius should feel modern but not bubbly; roughly medium rounding is preferred.
- Avoid making every container a floating card.
- Prefer border-only surfaces for most grouped content.
- Use subtle shadow only when a floating/elevated relationship needs to be communicated.
- Avoid excessive pills. Use pills/badges for compact status/category information, not ordinary text or every button.

## Spacing

Use a small repeated spacing vocabulary instead of arbitrary values.

Typical rhythm:

- tight inline gap: 1–2 spacing steps;
- control/group gap: 3–4;
- section internal padding: 4–6;
- major vertical section spacing: 6–10;
- page horizontal padding: compact on mobile, larger on desktop.

Whitespace should separate concepts before borders are added.

## Typography

- Prefer the current/system sans stack unless adding a font solves a specific brand/readability requirement.
- Page titles should be compact SaaS titles, not marketing hero typography.
- Use a small number of text sizes.
- Use font weight and semantic muted/highlighted text tones for hierarchy.
- Avoid all-caps labels except where a tiny technical/status label clearly benefits.
- Keep line lengths readable on explanatory copy.

## Icons

- Use one icon family consistently through Nuxt UI/Iconify, preferably Lucide-style icons already aligned with Nuxt UI defaults.
- Icons support recognition; they do not replace labels for ambiguous actions.
- Do not decorate every heading or card with an icon.

## Application shell

Current information architecture does not justify a sidebar.

Preferred authenticated shell:

- light full-page background;
- compact top bar with product identity at left;
- account identity/logout action at right;
- responsive centered content canvas below;
- map gets the largest visual area.

Add persistent sidebar navigation only when multiple real application destinations exist.

## Login page

Goal: focused authentication, not a marketing landing page.

Preferred composition:

- full-height or near-full-height light background;
- narrow centered auth surface;
- small product identity/title;
- short useful supporting line at most;
- explicit form labels using `UFormField` or current equivalent;
- email and password inputs;
- one full-width primary sign-in action;
- inline error feedback near the form;
- loading/disabled state while submitting;
- if already authenticated, provide one obvious continue-to-app action.

Avoid split-screen stock imagery, testimonials, giant logos, pricing/marketing content, or decorative illustration in this phase.

## Dashboard page

Goal: make the Situm experience dominant and operational state secondary.

Preferred hierarchy:

1. top bar / product orientation;
2. compact page header with concise title/description if useful;
3. Situm viewer as the primary large surface;
4. application/database status as compact secondary information;
5. account action remains in the shell rather than inside content cards.

Do not create fake analytics cards or metrics just to fill a dashboard.

## Situm viewer surface

- Give the viewer substantially more height than the original foundation placeholder on desktop.
- Use a responsive minimum height that still works on small screens.
- Keep viewer container clipping/radius consistent with the global system.
- Loading should use a calm skeleton/progress/message without shifting the whole layout unexpectedly.
- Error should appear in-context and preserve enough surrounding layout for orientation.
- Ready state should remove temporary loading UI cleanly.
- Do not overlay custom controls on top of Situm unless a real product requirement needs them.

## Status and feedback

Use semantic status treatments consistently:

- loading: skeleton/spinner + concise text only where text adds meaning;
- success/connected: subtle positive status, not a giant green panel;
- warning: reserved for actionable caution;
- error: clear message plus recovery action when one exists;
- empty: explain what is missing and what action is possible.

Technical details should be secondary. Avoid surfacing raw implementation language to normal users unless the screen is explicitly developer-facing.

## Buttons

- One primary action per local context when possible.
- Use neutral/outline/ghost for secondary actions.
- Destructive actions need explicit destructive semantics.
- Icon-only buttons require accessible labels/tooltips.
- Avoid oversized buttons on desktop; maintain touch-friendly targets on mobile.

## Forms

- Use visible labels rather than placeholder-only fields.
- Errors should identify the affected field or form clearly.
- Preserve entered values after recoverable errors where safe.
- Disable or mark submit loading during submission to prevent duplicate action.
- Browser autofill/password manager behavior should remain functional.

## Responsive behavior

At minimum review these widths conceptually:

- mobile phone;
- tablet/small laptop;
- desktop.

Rules:

- stack content before it becomes cramped;
- allow header actions to wrap or simplify;
- maintain page padding rather than running content to screen edges;
- ensure map/viewer remains usable and not collapsed to a tiny card;
- no accidental horizontal scrolling;
- avoid desktop-only fixed widths for auth or main content.

## Accessibility checklist

Before closing a UI phase:

- keyboard navigation reaches all actions in a sensible order;
- focus style is visible;
- inputs have labels;
- icon-only actions have accessible names;
- semantic status is not communicated by color alone;
- contrast is readable in light mode;
- responsive zoom does not hide required actions;
- motion is minimal and not required to understand state.

## Avoid list

Do not introduce without explicit justification:

- gradients;
- glassmorphism/backdrop-blur decoration;
- dark mode/theme toggle;
- dashboard sidebar before real navigation exists;
- fake KPI cards;
- decorative charts;
- giant page titles;
- excessive rounded pills;
- large drop shadows;
- multiple competing accent colors;
- animations on routine navigation/content;
- custom primitives that duplicate Nuxt UI components.
