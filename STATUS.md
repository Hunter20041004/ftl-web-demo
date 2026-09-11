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
`rebuild/v1-on-new-architecture` ports the first-version visual experience onto the modern architecture with no intentional redesign.

## Visual rule
For this task, `main` V1 is authoritative. Later V2/V3/V4/V5 redesign branches are not visual references.

## Deployment
A dedicated preview will be published before any merge decision. `main` must not be changed during parity reconstruction.
