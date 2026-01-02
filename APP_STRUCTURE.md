# SNS Playbook App Structure

## Goals (per latest request)

- Keep **content** and **flow** identical to the PDF-based screens.
- Upgrade into a calmer, product-grade web app shell (Material/Notion/Linear-ish).
- Desktop-first; tablet-friendly; mobile vertical scroll; sidebar collapses to drawer.
- Modular components + reusable typography/input blocks.
- Clean state management + persistence.

## Route → Screen Mapping (no flow changes)

- `/` → Start screen (PDF page 2 background with Start CTA)
- `/step1` → PDF pages 1–3 (name + problem framing)
- `/step2` → PDF pages 4–6 (empathy/user profile + drawings)
- `/step3` → PDF pages 7–8 (product statement + Crazy 6)
- `/step4` → PDF page 9 (validation table)
- `/step5` → PDF pages 10–12 (prototype + final thought)
- `/print` → Print preview + backend PDF download

## Layout & Navigation

- `components/app/AppShell.tsx`
  - Desktop sidebar
  - Mobile drawer
  - Calm top bar
  - Subtle route transition (respects reduced motion)

## Reusable UI primitives

- `components/ui/Text.tsx` (Heading/Paragraph/etc.)
- `components/ui/Button.tsx`
- `components/ui/InputBlock.tsx`

## PDF-template rendering

- `components/PdfPage.tsx`
  - Renders page background image
  - Scales overlays from 768×576 coordinate space

## State & Persistence

- `context/PlaybookContext.tsx`
  - Central state store
  - Automatic persistence to localStorage (`sns.playbook.v1`)
