# HANDOFF — First Version on New Architecture

## Current round
Rebuild the original FTL first-version website on the modern application architecture without redesigning its content structure or section language.

## Visual source of truth
- Repository: `Hunter20041004/ftl-web-demo`
- Original branch: `main`
- Original baseline commit: `fa033f0f33f3c93d7bcccd6066228031cc26ab4e`
- The original `assets/ftl.css` remains the public-site visual contract for layout, typography, cards, sections and brand balance.
- Product decision on 2026-09-11: retire the global Möbius visual concept. Do not restore it from `assets/mobius.js`, older branches, or prior handoff notes.
- Its replacement is the Transaction Network visual system in `src/components/visual/TransactionNetworkVisual.tsx` + `assets/transaction-network.css`.

## Transaction Network visual rule
- The concept represents relationships between people, institutions, data and transactions — not crypto, blockchain, or a generic node constellation.
- Use a small number of deliberate nodes and curved connections; never fill the viewport with particles.
- Four homepage anchor scenes are intentional: Hero, Events, Contact and Partners.
- Hero forms the first relationship graph mostly on the right side.
- Events introduces more participating endpoints while staying quieter than the content.
- Contact converges toward a hub and switches to cooler cyan reflections on the saturated blue slab.
- Partners resolves into a restrained horizontal relationship chain behind the marquee.
- Only one or two links per scene should visibly carry a transaction pulse.
- Keep the network behind content, semi-hidden at scene edges, and free of neon beams, star-field noise, dashboard framing, or crypto aesthetics.

## What must stay visually faithful
- Original hero hierarchy, material, gradient, pane/stats composition and CTA count.
- Original Weekly feature + side-card composition.
- Original three-item Mission composition.
- Original Events cards.
- Original saturated blue Contact slab; its decorative background is now Transaction Network rather than Möbius.
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
1. Original V1 parity acceptance test passes for content structure, with the approved Transaction Network exception.
2. Transaction Network visual acceptance test passes.
3. TypeScript passes.
4. ESLint passes.
5. Static Next export passes.
6. Multi-viewport Playwright QA passes.
7. Desktop and mobile screenshots are reviewed.
8. Dedicated live preview is opened and checked.
9. `main` remains unchanged until product approval.
