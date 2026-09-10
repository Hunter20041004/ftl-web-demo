# Architecture Audit — NCCU FinTech Innovation Lab

Baseline commit: `fa033f0f33f3c93d7bcccd6066228031cc26ab4e`

## Current architecture

The current site is a fully static multi-page site with no build step. The public pages are:

- `index.html`
- `about.html`
- `projects.html`
- `insights.html`
- `resources.html`
- `events.html`
- `contact.html`

Shared implementation lives primarily in:

- `assets/ftl.css` — design tokens, typography, layout, components, responsive rules and animation states.
- `assets/ftl.js` — SVG icon sprite, shared navigation/footer rendering, bilingual DOM translation, mobile menu, scroll reveal, filters and form behavior.
- `assets/mobius.js` — document-level Möbius visual renderer and its scroll/responsive behavior.

The legacy repository intentionally has no framework, package manager workflow or compile step.

## Technical debt and migration risks

### 1. Runtime-generated shared layout

The header and footer are assembled with `innerHTML` inside `ftl.js`. This avoids duplicated HTML today but couples layout, navigation data, language behavior and DOM mutation into one global script.

### 2. Direct DOM behavior

Shared behavior relies on `querySelector`, `querySelectorAll`, `classList`, `dataset`, global event listeners and direct style mutation. These are valid in a static site but become hard to reason about inside a React application unless isolated or migrated.

### 3. Large global stylesheet

`ftl.css` is intentionally the single visual source of truth today. This preserves consistency, but it also creates selector coupling and makes it difficult to know which styles belong to which feature. Rewriting it during the HTML-to-React migration would create unnecessary visual-regression risk.

### 4. Visual renderer is globally coupled to document geometry

`mobius.js` measures page sections and renders at document scope. This should remain a page-level visual system, but its implementation needs a component boundary so a future SVG/Canvas/WebGL renderer can be replaced without touching content sections.

### 5. Content and presentation are intertwined

Repeated content such as events, partners and weekly stories is authored directly in HTML. Some of this should become typed data after visual parity is achieved, but not all static copy needs to become JSON.

### 6. No build/test gate

There is currently no TypeScript, lint, CI build or automated regression check. Because the site is visually sensitive, architecture migration needs an explicit parity gate rather than relying on a successful build alone.

## Target architecture

The migration target is Next.js App Router + React + TypeScript, with Tailwind installed but introduced only after pixel parity. Motion is available for later animation cleanup; it is not a requirement for every transition.

The first Next.js milestone deliberately keeps the existing HTML/CSS/JS behavior through a compatibility bridge. That allows the framework, routing, static export and CI to be validated before visual code is rewritten.

Target responsibilities:

- `src/app` — route composition and metadata
- `src/components/layout` — React navigation/footer after parity bridge is stable
- `src/components/visual/MobiusVisual.tsx` — global visual boundary
- `src/components/legacy` — temporary bridge only
- `src/data` — repeated mutable content only
- `src/hooks` / `src/lib` — browser behavior and reusable logic
- `public/assets` — generated copy of legacy static assets during migration

## Migration strategy

1. Freeze baseline.
2. Add Next.js/TypeScript/static-export foundation without deleting legacy files.
3. Serve every route through a compatibility bridge using the existing markup, CSS and runtime.
4. Add CI and visual/behavior smoke checks.
5. Migrate shared layout to React.
6. Migrate page markup to TSX one route at a time while retaining legacy class names.
7. Migrate behavior from `ftl.js` to React/hooks.
8. Isolate the existing Möbius renderer behind `MobiusVisual` before changing its appearance.
9. Only after parity: design-token cleanup, pragmatic Tailwind adoption and animation architecture cleanup.
10. Visual redesign happens after the architecture is stable, not during parity migration.

## Deployment constraint

Production currently lives on GitHub Pages under `/ftl-web-demo/`. The refactor therefore uses static export and a configurable `NEXT_PUBLIC_BASE_PATH`. Server-only runtime features are intentionally excluded.
