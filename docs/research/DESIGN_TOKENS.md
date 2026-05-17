# Design Tokens — ozgur.design

Static Astro + Tailwind v4 site. Dark, editorial, minimal. Native scroll (no Lenis). Motion library for animation.

## Colors (CSS custom properties — replicate verbatim)
```
--bg:              #0a0a0a   /* page background */
--fg:              #ffffff   /* headings, active text */
--text:            #a0a0a0   /* body paragraphs (.text-body) */
--text-secondary:  #b0b0b0
--muted:           #878787   /* labels, descriptions, ticks (.text-muted) */
--surface:         #111111   /* card hover bg */
--surface-raised:  #191919
--surface-highest: #282828
--rule:            #ffffff14  /* hairline divider (~8% white) */
--rule-strong:     #ffffff2e  /* ~18% white */
--color-oz-pink:   #ff96ff   /* accent — link/thumb hover only */
--color-neutral-800: oklch(26.9% 0 0)
```
Thumbnail SVG base ink color: `#5e5e5e` (hover → `--color-oz-pink`).

## Fonts (self-hosted — download from site)
- **Geist Variable** (sans) — weight axis 100–900, `font-display:block`. Files: `/fonts/e3b0a1.woff2`, `/fonts/e3b0a2.woff2` (latin + latin-ext subsets, woff2-variations). Used for headings + UI. Stack: `"Geist Variable", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif`
- **Cartograph CF** (mono) — weights 400/600/700. Files: `/fonts/f7a2c1.otf` (400), `/fonts/f7a2c3.otf` (600), `/fonts/f7a2c2.otf` (700). Stack: `"Cartograph CF", ui-mono, SFMono-Regular, Menlo, Consolas, monospace`. Used for labels, meta, dates, categories. `font-feature-settings:"ss01"`.

(Geist is available via npm `geist`/Google; Cartograph CF is commercial → self-host the downloaded files via `next/font/local`.)

## Type scale (CSS vars)
```
--text-display: clamp(2.75rem, 7vw, 6rem)   line-height .9   (hero H1, .display)
--text-4xl:     clamp(2.5rem, 4vw, 3.5rem)  (Selected/Archived H2, display-sm md:text-5xl)
--text-5xl:     clamp(3rem, 6vw, 5rem)      line-height 1
--text-7xl:     4.5rem
--text-2xl:     1.75rem
--text-3xl:     2.25rem (lh 1.2)
--text-xl:      1.375rem
--text-lg:      1.125rem
--text-base:    1rem (lh 1.5)
--text-mono-md: 1.0625rem
--text-mono-sm: .875rem
--text-mono-xs: .8125rem   (.label)
```
- `.display`  : font-sans, weight 500, letter-spacing -.035em, line-height .9, color --fg
- `.display-sm`: font-sans, weight 500, letter-spacing -.025em, line-height .95, color --fg
- `.label`    : font-mono, --text-mono-xs, letter-spacing .08em, UPPERCASE, color --muted, ss01
- `.mono-sm`  : font-mono, --text-mono-sm, UPPERCASE, letter-spacing .08em, ss01
- `.text-body`: color --text  ·  `.text-muted`: color --muted

## Layout system
```
--container-site: 76rem                       /* max content width = 1216px */
--edge:           clamp(1.25rem, 4vw, 2.5rem) /* horizontal page padding */
--grid-gutter:    clamp(1rem, 2vw, 1.5rem)
.frame   { width:100%; max-width:76rem; padding-inline:var(--edge); margin-inline:auto }
.grid-12 { display:grid; grid-template-columns:repeat(12,minmax(0,1fr)); gap:var(--grid-gutter) }
```
Standard content row: `.frame.grid-12` → left label `col-span-12 md:col-span-2`, main `col-span-12 md:col-span-10` (heading) / `md:col-span-7..8` (body copy). Mobile: everything `col-span-12` (single column, label stacked above heading).

## Rules (dividers)
`.rule-t` / `.rule-b` / `.rule-y` → `:before`(top) / `:after`(bottom) pseudo, `height:1px; background:var(--rule); transform:scaleX(var(--rule-scale)); transform-origin:0`. `--rule-scale` animates 0→1 (rule "draws" left→right on reveal). Default 1.

## Spacing rhythm
Section vertical padding pattern: `pt-24 md:pt-32 pb-6` on header rows; section bodies `py-16 md:py-24`. Tailwind spacing unit `--spacing:.25rem`. Meta row `py-5`.

## Iconography
All icons are inline SVG (no icon font, ~62 SVGs total): nav glyphs, 8 social glyphs, ~23 tinkering glyphs, 6 project wireframe thumbnails, arrows/carets. Extract every unique SVG to `src/components/icons.tsx`.

## Assets
- `/assets/logo/ozg.svg` — wordmark logo
- `/assets/images/oz.jpg` — avatar (social toggle)
- `/favicon.svg`, `/favicon.ico`, `/favicon-16x16.png`, `/favicon-32x32.png`, `/android-chrome-192x192.png`, `/android-chrome-512x512.png`, `/apple-touch-icon.png`, `/og.png`
- Fonts: see above.
