# STATUS — FTL Website

## Stable product baseline
The original first-version public site remains on `main` at baseline commit `fa033f0f33f3c93d7bcccd6066228031cc26ab4e`.

## Modern architecture
- Next.js 16 static export: available.
- React 19 / TypeScript 5.9: available.
- Seven public React routes: available.
- Shared site chrome and interactions: available.
- GitHub Pages base-path support: available.
- Playwright route QA: available.
- Tailwind 4 utilities: available.
- shadcn-compatible primitive foundation: available for future admin UI.

## Current task
`rebuild/v1-on-new-architecture` ports the first-version visual experience onto the modern architecture while refining one explicitly approved global decorative system.

## Current visual system
- Product decision on 2026-09-11: the Möbius concept is retired.
- Do not reintroduce `MobiusVisual`, `mobius-continuity.css`, or the legacy Möbius runtime into the Next homepage.
- Homepage replacement: sparse Transaction Network scenes at Hero, Events, Contact and Partners.
- Visual goal: relationship topology between people / institutions / data / transactions; restrained, financial and editorial rather than crypto or star-field.
- `assets/mobius.js` remains only as a historical V1 reference asset and is not part of the current Next runtime.

## Visual rule
For layout, content hierarchy, section composition and brand balance, `main` V1 is authoritative. Later V2/V3/V4/V5 redesign branches are not visual references. The Transaction Network decision above is the explicit exception to the old Möbius treatment.

## Deployment
A dedicated preview will be published before any merge decision. `main` must not be changed during parity reconstruction.
