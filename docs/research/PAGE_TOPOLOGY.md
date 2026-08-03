# Terafab — Page Topology

Top-to-bottom map of https://terafab.ai/. Source artifacts:
- `terafab-index.html` — full HTML
- `terafab-styles.css` — full CSS (2730 lines)
- `terafab-main.js` — full JS (2814 lines)
- `terafab-full-desktop.png` / `terafab-full-mobile.png` — screenshots

## Build Strategy

Port the original CSS and JS verbatim. Rebuild HTML as React components mirroring the structure 1:1. This guarantees pixel-perfect output because every value is original.

## Section List (DOM order)

| # | Component | DOM id / class | Interaction model |
|---|-----------|---------------|-------------------|
| 0 | `SiteNav` | `header.nav#nav` | scroll-driven (frost + logo retract + CTA reveal) |
| 1 | `HeroSection` | `section.hero#hero` | static + canvas grid bg + sequenced reveal |
| 2 | `StatementSection` | `section.statement-sec` | reveal on scroll |
| 3 | `KardashevSection` | `section.kardashev#kardashev` | sticky scroll-pinned video sequence |
| 4 | `SunSection` | `section.scene.sun#sun` | autoplay video + Earth marker |
| 5 | `BuildersSection` | `section.block.builders#builders` | 3 cards reveal |
| 6 | `ScalingSection` | `section.block.scaling#scaling` | reveal + diagram |
| 7 | `OutputSection` | `section.block.output#output` | scroll-scrubbed video |
| 8 | `ChipsSection` | `section.block.chips#chips` | grid reveal |
| 9 | `SpaceSection` | `section.scene.space#space` | bg image + sunny SVG + compare cols |
| 10 | `MassSection` | `section.scene.mass#mass` | bg image + modal CTA |
| 11 | `SiteFooter` | `footer.footer#join` | canvas grid + CTA |
| 12 | `MassVideoModal` | `.vplayer#mass-video` | custom video player |

## Layout Container

- `--container: 1180px`
- `.container { width: 100%; max-width: 1180px; margin: 0 auto; padding: 0 var(--pad); }`
- `--pad: 48px` (desktop), reduced on mobile via media queries
- `body { overflow-x: hidden; }`

## Assets

**SVGs (`/assets/`):** favicon.svg, tesla-logo.svg, spacex-logo.svg, xai-logo.svg, grok-mark.svg, ai/Always-Sunny.svg

**Images:** og.png, scaling/Scaling_clean.png, chips/Chip_{AI5,AI6,D3,Beyond}.png, ai/Scalable_solution_desktop.jpg, mass-driver/Mass_drive_desktop.jpg, kardashev/Kardashev_{T1,T2}.png posters, sun/Sun_clean_poster.jpg, terafab/Terafab_size_comp_poster.jpg

**Videos:** kardashev/Kardashev_T1-T2.mp4, kardashev/Kardashev_T2-T3.mp4, sun/Sun_clean.mp4 (+ .mobile.mp4), terafab/Terafab_size_comp_scrub.mp4

**External:** `https://sxcontent9668.azureedge.us/cms-assets/mass-drive.mp4` (link directly, do not host)
