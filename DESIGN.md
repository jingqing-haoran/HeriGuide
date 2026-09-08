# HeriGuide — Design System (recorded from the built demo)

> Recorded after build from the shipped surfaces; owns durable visual decisions for the HeriGuide demo.

## Own world

“Atlas of Memory” — a museum-grade cultural travel product whose interface behaves like a
carefully printed atlas: warm mineral paper, ink, one cinnabar wayfinding accent, gold used only
for honour and landmarks. Heritage is the content; the UI is the docent.

## Palette

| Token | Value | Role |
| --- | --- | --- |
| `paper-warm` | `#FAF6EF` | main app/UI ground |
| `paper` | `#F5F0E7` | alternate section ground |
| `paper-deep` | `#ECE4D6` | wells, media fallback, image mats |
| `ink` | `#211C15` | primary text, dark buttons, dark map ground |
| `ink-soft` | `#57503F` | secondary text |
| `clay` | `#A92E1F` | CTA, active, markers, badge, small emphasis (cinnabar) |
| `gold` | `#A4752F` | honour badges, volunteer recognition, quiet landmark cues |
| `night` | `#191512` | immersive sections and audio/map panels |

Red is never a page fill: it is route, marker, call-to-action and emphasis.

## Type

- Display: Newsreader Variable (self-hosted) + Noto Serif SC fallback. Used at 1.0–1.08 line
  height, tight negative tracking, weights 400–600.
- UI/body: Instrument Sans Variable (self-hosted) + Noto Sans SC fallback.
- Micro-labels: uppercase, 0.12–0.24em tracking, 0.62–0.8rem.

## Geometry & motion

- Radius scale 6 / 10 / 14 / 18 / 24; buttons and pills full-round; large cards 14–20.
- Elevation: hairline borders + offset soft shadows; no hard shadows, no glass-as-decoration.
- Motion is restrained: fade-up entrance (600ms, `cubic-bezier(.22,1,.36,1)`), card hover lift,
  button scale 0.98, bottom sheet spring (user-required), map-marker pulse ring. Reduced motion
  disables all non-essential movement.

## Component language

- **Photo cards** never rely on the photo alone: layered paper mat, gradient scrim only over
  imagery for type legibility, status pill and language dots on top.
- **Function cards** are icon + title + one-line proof, and each of the four differs materially
  (translator snippet, map strip, audio chip row, avatar stack).
- **Editorial body type** uses generous measure and display headlines with one Chinese gloss line,
  not replicated icon grids.
- **Mobile chrome**: five-tab bottom bar with 56px targets, safe-area aware, max 460px shell.

## Copy stance

Every screen carries the public-interest and international-dissemination thesis in at least one
explicit moment — hero line, translation gloss, community intro or honour rule. Demo content is
labelled `DemoTag` wherever a visitor could mistake it for verified production material.

## States covered

Loading skeletons (Explore), empty state with reset (Explore), error/guidance (Translate),
success/toast states (save, like, share, route, copy), disabled buttons, offline hint in place
detail, and 4-language selector sheet.
