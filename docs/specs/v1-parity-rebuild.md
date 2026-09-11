# V1 Parity Rebuild Spec

## Objective
Reproduce the original first-version FTL website inside the current Next/React/TypeScript architecture. This is a migration, not a redesign, except for the explicitly approved replacement of the global Möbius decoration with the Transaction Network system.

## Source of truth
- Visual and product baseline: `main@fa033f0f33f3c93d7bcccd6066228031cc26ab4e`.
- Brand/style source: `assets/ftl.css` from that baseline.
- Original static HTML pages remain reference material for structure and copy.
- Historical Möbius source: `assets/mobius.js`; reference only, not current Next runtime.
- Current decorative visual system: `src/components/visual/TransactionNetworkVisual.tsx` + `assets/transaction-network.css`.

## Locked acceptance rules

### V1-01 — No redesign interpretation
Do not import visual decisions from V2/V3/V4/V5. If the rebuilt output differs from V1, V1 wins unless the difference is the approved Transaction Network replacement or fixes a demonstrated usability/platform bug.

### V1-02 — Palette and material
Preserve V1's white/light surfaces, ice-blue atmosphere, deep navy structure, blue/cyan highlights, and saturated blue Contact slab. Do not replace these with a new editorial, neutral, glass, or dark-theme system.

### V1-03 — Hero
Preserve the V1 hierarchy: eyebrow → large two-line brand title → subtitle → description → two CTAs; preserve the right-side question pane, stat pane, and founding endorsement. The Transaction Network may appear as a restrained background relationship graph, primarily on the right side.

### V1-04 — Weekly
Preserve the featured story + two secondary stories composition and V1 card material/hierarchy.

### V1-05 — Mission
Preserve the three numbered principles and original section rhythm.

### V1-06 — Events
Preserve the three event-card composition and original information hierarchy. A quiet Transaction Network scene may sit behind the section without changing card hierarchy.

### V1-07 — Contact
Preserve the blue Contact slab, white typography, LINE Bot + Email actions, and social/channel pane. The old Möbius treatment is retired; use the Transaction Network contact scene with cool cyan links/nodes behind content.

### V1-08 — Partners
Preserve the horizontal continuous marquee instead of replacing it with a grid or static ledger. A restrained horizontal Transaction Network chain may sit behind the marquee.

### V1-09 — Animation and interaction
Preserve language switching, mobile navigation, reveal/motion behavior, count-up behavior, and marquee behavior. Transaction Network motion is limited to sparse transaction pulses on one or two links per scene; do not add floating-node or star-field motion.

### V1-10 — Responsive fidelity
At 1440×900, 1280×800, 1024×768 and 390×844, the page must remain readable, preserve the V1 visual hierarchy, and have no horizontal overflow.

## Transaction Network acceptance
- No `.mob`, `.mob-bg`, `.mob-fg`, or legacy Möbius runtime may render on the Next homepage.
- Four scenes: Hero, Events, Contact, Partners.
- Each scene uses only a small deliberate set of nodes and links.
- No crypto/star-field look, no dense particle system, no neon beams, and no dashboard framing.
- Connections remain behind content and fade toward scene edges.
- Contact keeps the same visual grammar but shifts edges and node cores toward cyan for contrast on deep blue.

## Architecture constraints
- Next.js 16 static export.
- React 19.
- TypeScript 5.9.
- GitHub Pages basePath safe.
- Demo remains noindex/nofollow.
- Tailwind is available for future/new UI but does not override the public V1 brand stylesheet.
- shadcn-compatible primitives may exist for the future admin console but must not be used to visually reinterpret V1 during parity work.

## Verification evidence
Completion requires successful typecheck, lint, static build, Playwright route QA, parity assertions, desktop/mobile screenshot review, and a live preview check.
