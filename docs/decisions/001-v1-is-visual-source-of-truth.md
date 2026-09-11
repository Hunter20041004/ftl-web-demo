# ADR-001 — V1 is the visual source of truth

## Decision
For the current rebuild, the original public site on `main@fa033f0f33f3c93d7bcccd6066228031cc26ab4e` is the authoritative visual specification.

## Why
Later redesign attempts changed brand tone and visual grammar beyond what the product owner wanted. The product goal is now to separate architecture modernization from visual redesign.

## Consequences
- Modernize implementation without changing the look intentionally.
- Keep the original `assets/ftl.css` and `assets/mobius.js` as compatibility contracts during parity work.
- Tailwind/shadcn are architecture tools for new/future UI, especially the management console; they do not determine the public-site appearance.
- Any future redesign starts only after this parity baseline is approved.
