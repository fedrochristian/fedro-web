# Terafab — Behaviors

Source-of-truth: `terafab-main.js` — loaded verbatim into the clone via `<Script src="/terafab.js" />`.

## Global

- **Smooth scroll:** native CSS — `html { scroll-behavior: smooth; scroll-padding-top: 80px; }`. No Lenis.
- **`prefers-reduced-motion`** honored — JS short-circuits all animations.
- **`.js` class** added to `<html>` immediately so CSS can target JS-enabled state.

## Nav (`#nav`)

- **Frost on scroll:** JS sets `--nav-blur`/`--nav-bg`/`--nav-fade` based on `scrollY/320` with an ease-out curve.
- **CTA reveal:** IntersectionObserver on `#hero .hero__actions`. When past, `.nav--cta-visible` is added.
- **Logo retract:** When hero is past AND not at footer, `.nav--logo-retract` slides the "erafab" portion under the "T" tile, leaving only T visible.

## Hero (`#hero`)

- **Canvas grid effect** (`.hero__grid-fx`): JS animates a subtle grid pattern.
- **Sequenced entrance:** Each `.hero__line` animates with staggered delays (0.08s, 0.22s, 0.36s, 0.5s). `.hero__seq` containers fade in after lines.
- `.hero--ready` is added on mount to trigger sequence.

## `.reveal` Pattern

JS uses IntersectionObserver to add `.is-in` when elements enter viewport. CSS handles the fade/slide-up.

## Kardashev (`#kardashev`)

- `.kard-shell { min-height: 340vh; }` provides scroll runway.
- `.kard-sticky { position: sticky; top: 0; height: 100vh; }` pins viewport.
- Two videos layered (T1→T2 and T2→T3). Scrubbed by scroll progress.
- `.scale__tier.is-active` toggles based on progress.
- Videos lazy-load on approach.

## Sun (`#sun`)

- Autoplay muted looping video background.
- "You are here" hand-drawn SVG with pen-stroke mask animation.
- Sketchy circle around Earth marker.
- Earth tooltip on focus.

## Output (`#output`)

- Same sticky pattern as Kardashev.
- `.osc__vid` scrubbed by scroll progress.
- Overlay HTML labels (`.osc-cap--gf`, `.osc-cap--tf`, `.osc-compare`) fade at specific progress.

## Mass (`#mass`)

- Watch Now button (`[data-video-open="mass-video"]`) opens modal video player.
- Modal has custom chrome: play/pause/scrub/volume/fullscreen/close.

## Footer (`#join`)

- `.footer__grid-fx` — mirrored canvas grid.
- Cloudflare email-protection links — decoded by `email-decode.min.js` script.

## Breakpoints

- `@media (min-width: 981px)` — main desktop breakpoint
- Mobile-first base, multi-column layouts at 981+
