# DESIGN.md

This file is the current design router for Situm Explore.

It separates **visual authority** from **product/capability authority** so historical prototypes cannot override current backend/security truth.

## Canonical visual references

The approved shared web/product visual reference remains:

`design/reference/situm-explore-interactive-prototype.html`

The approved native/responsive companion reference is:

`design/reference/situm-explore-native-responsive-prototype.html`

Use the shared reference for:

- hierarchy and composition;
- density and spacing;
- typography and surface treatment;
- shared tenant brand/tokens;
- web interaction presentation.

Use the native reference for Plans 029–033 when implementing native-facing UI/UX, with Plan 033 as the final reference-reconciliation pass before full E2E:

- mobile-first information hierarchy and end-user wording;
- Map and Realtime screen composition;
- location-permission, denied, stale/freshness and safe fallback presentation;
- phone bottom navigation, tablet/POS rail, and wide-screen expanded-navigation intent;
- responsive behavior across phone, tablet, Android POS/kiosk and TV/wide displays;
- Lucide-style icon language and the same light, cool-neutral Situm Explore surface system used by web.

The native app is still the same Situm Explore tenant/product. Do not invent a parallel native design system, unrelated color palette, typography, spacing scale, icon family, or product vocabulary merely because the runtime is React Native.

The native reference is visual/interaction authority, **not capability or data-contract evidence**. If a reference interaction cannot be supported truthfully by the installed Situm SDK/current backend contract, keep the visual intent where possible but implement only the evidenced capability and record the deviation in the active plan. Never fake SDK behavior, identity, online/offline state, position freshness, route data or permissions to match the prototype.

Do not copy either reference HTML/CSS/JS wholesale into production.

## Authority order

### Visual decisions

1. user's latest explicit visual direction;
2. applicable canonical HTML reference (shared web/product, then native for native-facing UI);
3. active plan;
4. `design/IMPLEMENTATION.md`;
5. agent judgment only for uncovered gaps.

### Product/capability decisions

1. user's latest explicit product direction;
2. `.agents/state.md` + active durable decisions;
3. active roadmap/plan;
4. `ARCHITECTURE.md`;
5. `design/data-source-matrix.md`;
6. verified official Situm contract + installed SDK behavior;
7. current source/runtime behavior;
8. historical plans/prototype behavior.

Current `ARCHITECTURE.md`, this file, `design/IMPLEMENTATION.md`, and `design/data-source-matrix.md` are reconciled for Plans 021–025. Historical Plan 010-era design wording is evidence only.

## Product direction

- Clean minimalist SaaS.
- Light mode.
- Premium but restrained.
- Responsive authenticated shell/sidebar/drawer.
- Accessible keyboard/focus behavior.
- Truthful loading, empty, forbidden, and error states.
- No fake product success to preserve a visual prototype.

## Plans 021–025 UI direction

The backend refactor is not a redesign, but it adds real product surfaces that the UI must support.

Approved additions/changes:

- real `/register` experience;
- database-backed login/session identity;
- private workspace create/rename/delete/switch flow;
- workspace Situm configuration form/status;
- clear explanation that configuration requires separate verified Read & Write primary and Read-only Viewer credentials;
- read-only action guidance and safe forbidden feedback;
- correlation/reference ID presentation for unexpected failures when useful;
- Google sign-in affordance may be wired, but real provider runtime acceptance remains manual/user-owned for now.

Do not add workspace invite/member/team UI in this roadmap.

## Auth UX

Email/password registration/login must be real product behavior, not a dummy screen.

Use:

- generic invalid-credential feedback for login;
- clear duplicate-account/validation feedback without leaking unnecessary account existence detail;
- accessible form labels/errors/focus;
- loading/disabled states for submission;
- safe redirect/session behavior after successful auth.

Do not expose password hashes, provider tokens, session internals, or server diagnostics in UI.

## Workspace UX

A workspace is a private app-owned container for one user's Situm configuration/context.

UX must make clear:

- one user may own many workspaces;
- workspace membership/invites do not exist in this roadmap;
- different workspaces may point to different Situm accounts;
- switching workspace changes the active product context;
- stored Situm API-key values are write-only after submission and are not rendered back to the user.

Deletion must use appropriate confirmation because it removes app-owned workspace configuration/state. Do not imply it deletes the external Situm organization/account.

## Situm permission UX

Product modes are:

- Primary credential — required Situm `Read & Write` capability, verified server-side at save time;
- Viewer credential — required Situm `Only Read` capability, verified server-side and used only for the browser Viewer;
- Situm account/organization ID — derived server-side from the authenticated primary credential; never entered manually.

The app should explain the expected Situm key type at configuration time.

Rules:

- read-only workspaces keep supported read scenarios available;
- known mutation controls should be disabled/guarded with clear guidance when local workspace mode is view-only;
- backend authorization remains authoritative;
- upstream forbidden results become safe product feedback/toasts, never raw Situm messages;
- unsupported/intermediate Situm permission states receive configuration guidance rather than being treated as full write.

Do not fabricate successful edits for a read-only workspace.

## Error / support UX

Expected validation/auth/forbidden/not-found/conflict errors should use clear product language.

Unexpected/internal failures should use a generic safe message. A correlation/reference ID may be shown for support lookup when Plan 023 provides one.

Never render:

- stack traces;
- raw SQL/DB errors;
- raw upstream bodies;
- SDK internals;
- credential/token values;
- internal telemetry metadata not intended for users.

## Viewer design boundary

`SitumViewer.vue` remains the single Viewer lifecycle owner.

Pages/components may expose controls around the Viewer but should not instantiate independent Viewer clients or obtain the raw Viewer object.

Workspace switching must eventually update Viewer/account/building context truthfully. Loading/re-authentication states should be visible rather than showing stale cartography as if it belonged to the new workspace.

## Web/native boundary

Do not represent these as working web features:

- sensor-generated handset blue dot;
- browser indoor positioning engine;
- live handset turn-by-turn navigation;
- movement-aware rerouting.

Realtime monitoring of positions produced elsewhere and verified static directions remain valid web operations features.

## Capability evidence rule

For any Situm-domain field/action, **no evidence = no implementation**.

Before a new behavior becomes real, verify exact endpoint/SDK method, installed compatibility, owner/runtime, permission semantics, consumed data, and failure behavior.

Prototype labels and old plans are not evidence.

## Production implementation

Production remains Nuxt 4 + Vue + Nuxt UI.

Translation order:

1. reuse Nuxt UI primitive;
2. configure props/variants/slots/tokens;
3. compose primitives;
4. create a small semantic product component when responsibility/reuse is real;
5. add narrow custom CSS only for a genuine visual gap.

Do not build a parallel design system or broad generic component factory.

Read `design/IMPLEMENTATION.md`, `design/data-source-matrix.md`, and the active plan before UI changes.
