# HANDOFF — First Version on New Architecture

## Current round
Rebuild the original FTL first-version website on the modern application architecture without redesigning it.

## Visual source of truth
- Repository: `Hunter20041004/ftl-web-demo`
- Original branch: `main`
- Original baseline commit: `fa033f0f33f3c93d7bcccd6066228031cc26ab4e`
- The original `assets/ftl.css` and `assets/mobius.js` are the visual/animation contract for this round.

## What must stay visually faithful
- Original hero hierarchy, material, gradient, pane/stats composition and CTA count.
- Original Weekly feature + side-card composition.
- Original three-item Mission composition.
- Original Events cards.
- Original saturated blue Contact slab and its thin luminous Möbius treatment.
- Original horizontal Partners marquee.
- Original white / ice-blue / deep-blue / cyan brand balance.
- Original responsive behavior unless a real bug prevents use.

## Architecture being used
- Next.js 16 static export.
- React 19 + TypeScript 5.9.
- Seven React routes.
- Shared React navigation/footer/runtime interactions.
- GitHub Pages basePath support.
- Tailwind 4 utilities are available without Preflight on the public site so they cannot silently alter V1.
- shadcn-compatible primitive dependencies are installed for future admin-console work; public V1 does not use them to restyle the site.

## Current branch
`rebuild/v1-on-new-architecture`

## Completion gate
1. Original V1 parity acceptance test passes.
2. TypeScript passes.
3. ESLint passes.
4. Static Next export passes.
5. Multi-viewport Playwright QA passes.
6. Desktop and mobile screenshots are compared against original V1.
7. Dedicated live preview is opened and checked.
8. `main` remains unchanged until product approval.
