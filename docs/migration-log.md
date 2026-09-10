# Migration Log

## Baseline

- Source branch: `main`
- Baseline commit: `fa033f0f33f3c93d7bcccd6066228031cc26ab4e`
- Refactor branch: `refactor/next-architecture-chatgpt`
- Production baseline: `https://hunter20041004.github.io/ftl-web-demo/`

## Phase status

- [x] Phase 0 — Freeze source commit and architecture assumptions
- [x] Phase 1 — Architecture audit
- [x] Phase 2 — Next.js / TypeScript / Tailwind foundation
- [ ] Phase 3 — Pixel-parity compatibility bridge
- [ ] Phase 4 — Shared layout migration
- [ ] Phase 5 — Page-by-page TSX migration
- [ ] Phase 6 — Behavior migration
- [ ] Phase 7 — Möbius architectural isolation verification
- [ ] Phase 8 — Visual regression gate
- [ ] Phase 9 — Design token / Tailwind cleanup
- [ ] Phase 10 — Visual direction finalization

## Important decision

The visual redesign is paused while the architecture moves to Next.js. During parity migration, the legacy CSS and renderer remain authoritative. Once the React architecture is stable, the Möbius/component visual system will be redesigned on the new structure rather than maintaining two parallel visual implementations.
