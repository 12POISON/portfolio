# WHITEJACK5 — 1-BIT RENAISSANCE

Personal portfolio of **WHITEJACK5** (handle-only by design — the legal name appears
only in invisible metadata/JSON-LD; no name, no logo anywhere in the visible UI).

Monochrome 1-bit dithered imagery · OS-window chrome · Swiss annotations · one
liquid-chrome queen rendered in true 1-bit GLSL.

## Stack

- **Next.js 15 (App Router) + React 19 + TypeScript strict + Tailwind v4**
- **GSAP 3 + @gsap/react** — ALL narrative/scroll animation, centrally managed in
  `src/lib/animation/director.ts` (one `gsap.context`, one ticker, chapter builders,
  MOTION toggle rebuild/settle).
- **Framer Motion (`motion/react`)** — component micro-interactions ONLY
  (menu overlay, copy toast, mailto composer, easter-egg windows, back-to-top).
  Ownership rule: Framer never animates a node GSAP animates, and vice versa.
- **anime.js v4** — text micro (scramble) in `src/lib/animation/micro.ts`.
- **ogl (WebGL)** — boot dither-pixel wipe (`preloader.tsx`) + the chrome queen
  (`chrome-engine.ts`, fresnel + procedural chrome bands, final output dithered to
  true 1-bit in-shader). Canvas-2D / CSS fallbacks everywhere.
- **Lenis** — smooth scroll, desktop-only, RAF owned by the single `gsap.ticker`.

## Run it

```bash
npm install --no-audit --no-fund
npm run assets   # dithers raw/ photos → public/d/ (Bayer 8×8, 1-bit PNG+AVIF)
npm run dev      # http://localhost:3000
```

Build & verify:

```bash
npm run build
npm run typecheck
```

## Data pipeline

- `scripts/fetch-snapshot.mjs` — refresh the GitHub fallback snapshot
  (`src/data/github-snapshot.json` + `public/data/…`). The COMMITS section fetches
  live data with ISR (`revalidate: 3600`) and falls back to this snapshot with a
  `-- cached` label.
- `scripts/dither-assets.mjs` — reads `raw/`, crops the printed name band off
  `portrait-id.jpg`, applies Bayer 8×8 ordered dithering, writes 1-bit PNG+AVIF
  into `public/d/` and the exact-size manifest `src/data/asset-manifest.json`
  (CLS-safe `<img>`).

`raw/` contains personal photos and is git-ignored. Never commit it.

## Content

Single source of truth: `src/lib/content.ts` — owner data, 6 project rows with
full case studies, toolbox, certs, LOG timeline, socials, HUD annotations.

- Contact email is the professional one; **the phone number is deliberately OFF
  the public site.**
- Honesty rules baked in: RegRAG prints its real build-window status (`D2/20`),
  case pages carry LIMITS sections, no internships are invented (there are none).

## SEO / AI

- Full SSR text, JSON-LD `Person` (name lives here only), sitemap, robots,
  per-route metadata, `public/llms.txt` + `public/llms-full.txt`.
- OG image generated at `opengraph-image.tsx` (handle + tagline, no name).

## Deploy notes

- Set `NEXT_PUBLIC_SITE_URL` to the real domain for correct canonical/sitemap/OG URLs.
- Any static host works (Vercel recommended). `npm run assets` must run before the
  first build (it generates `public/d/`); outputs are committed-friendly (tiny).
- Performance targets: LCP ≤ 2.0 s (hero is pre-dithered AVIF, `fetchPriority=high`),
  CLS < 0.01 (all images carry manifest dimensions), route JS < 250 KB gzip
  (GSAP/anime/ogl/lenis are dynamic client chunks).
