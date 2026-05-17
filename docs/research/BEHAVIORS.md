# Behaviors — ozgur.design

Stack: Astro + Tailwind v4 + **Motion** (motion.dev) library. Native scroll, no Lenis. `prefers-reduced-motion` fully respected (all animations have a reduce branch → static). For the clone, reproduce with **Framer Motion (`motion`/`useInView`/`useScroll`) + CSS**; gate every animation behind a `useReducedMotion()` check.

Standard easing used everywhere: `cubic-bezier(.25,1,.5,1)` (≈ easeOutQuart). Reveal-in easing also `cubic-bezier(.22,1,.36,1)` (easeOutExpo-ish).

## 1. Hero intro sequence (`html.hero-pending` gate)
On load `<html class="hero-pending">`:
- Everything after `#intro` is `visibility:hidden; pointer-events:none`.
- Inside `#intro`: H1, label, meta rows hidden; header intro items hidden; wayfinding hidden; `--rule-scale:0` on header/intro rules (rules collapsed).
Sequence on load: label scrambles in → H1 reveals (split-line masks; each `.split-word` `translateY(130%)→0`, staggered, with `filter`/`opacity` settle) → rules "draw" (`--rule-scale` 0→1, scaleX left→right) → meta rows fade-up → `hero-pending` removed → rest of page + wayfinding become visible. Builder may simplify exact choreography but keep: split-word mask rise, label scramble, rule draw, staggered meta fade-up. Duration ≈ 1.2–1.8s total.

## 2. Scramble text (headings + labels)
Headings (`.display`/`.display-sm` without `data-no-scramble`) and `.label` words use a character-scramble effect: on first scroll into view, text shows random glyphs cycling (`data-ch` per char), resolving left→right to final text over ~`scrambleTime` (≈0.6–1s). Real text is the element's `aria-label` / source text. Implement as a small client component that, on `useInView` (once), animates each char from random A–Z/symbols to final char with a short stagger. `data-no-scramble` elements skip scramble but still split-reveal.

## 3. Split-word / split-line heading reveal
Headings wrapped: `.split-line-mask{overflow:clip; padding-bottom:.18em; margin-bottom:-.18em}` > `.split-line` > `.split-word{display:inline-block}`. Reveal: each word `transform: translateY(130%) → 0`, per-word stagger (~0.04–0.08s), easing `cubic-bezier(.22,1,.36,1)`, duration ~0.7s, triggered when heading enters viewport (once). Words preserve spaces.

## 4. Label reveal
`.label`: initial `opacity:0; transform:translateY(8px); visibility:hidden` → on inView `opacity:1; translateY(0)`, `transition:all` ~0.5s easeOut. Often combined with scramble (#2).

## 5. Paragraph / generic reveal (`data-stagger`, `data-reveal-delay`)
Body paragraphs & blocks fade-up: `opacity:0→1`, `translateY(~16px)→0`, ~0.6s easeOut, staggered by `data-stagger` when container enters viewport (once). Use a shared `<Reveal>` wrapper (Framer Motion `whileInView`, `viewport={{once:true, margin:"-10%"}}`).

## 6. Section index numeral (`.section-indexed` → `.section-index`)
Giant outlined numeral per section: `position:absolute; top:50%; right:4vw; translateY(-50%); font-sans 700; font-size:clamp(8rem,28vh,26rem); line-height:.8; letter-spacing:-.02em; color:transparent; -webkit-text-stroke:1px var(--fg); opacity:.05; z-index:0; user-select:none; pointer-events:none; will-change:transform`. Parent `position:relative; overflow:hidden`; all real children `position:relative; z-index:1`. Parallax: numeral translateY moves with scroll progress through the section (subtle, e.g. ±40–80px range mapped to section scroll via `useScroll`/`useTransform`). Hidden entirely under `prefers-reduced-motion`.

## 7. Wayfinding side-nav (fixed right, ≥768px only)
- Fixed right `clamp(.75rem,1.6vw,1.5rem)`, vertically centered, z-20. 11 links, each 134×31px, mono 11px, color `--muted`. Right edge 1px `--rule` vertical line (`:before`).
- Scroll-spy: active section link gets `.is-active` → color `--fg`; its `.wayfinding-tick` (right-anchored 1px bar) width `6px→18px`, opacity `.4→1`, `animation:wf-pulse 2.8s ease-in-out infinite` (`@keyframes wf-pulse{0%,100%{opacity:1}50%{opacity:.55}}`). Tick transitions: `width .26s cubic-bezier(.25,1,.5,1) .12s, opacity .22s … .12s`.
- The `.wayfinding-list` itself `transform`-slides (`transition:transform .36s cubic-bezier(.25,1,.5,1)`) so the active item stays vertically centered relative to viewport center (list translateY = -(activeIndex offset)).
- Hover/focus any link → show `.wayfinding-label` badge (the section name) with backdrop-blur(8px), bg `#0a0a0a8c`, fade+slide in; non-active ticks grow to 12px. Active link's label stays hidden. `.wayfinding-active-label` badge always shows current section name near nav.
- Determine active via IntersectionObserver / scroll position of section ids. **Scroll-driven, not click** (clicking a link smooth-scrolls to that `#id`).

## 8. Scroll progress bar
`.scroll-progress` fixed top, 2px, `background:var(--fg)`, `transform:scaleX(0)` → `scaleX(scrollProgress)`, `transform-origin:left`, z-30. Maps window scroll 0→1. Hidden under reduced-motion.

## 9. Scroll-to-top button
`<to-top>` fixed bottom-right, 36×36, border 1px `--rule`, radius 2px, backdrop-blur(10px), bg `color-mix(in srgb,var(--bg) 82%,transparent)`. Hidden: `opacity:0; translateY(10px); pointer-events:none`. Add `.is-visible` after scrolling past threshold (~1 viewport / when not at top) → `opacity:1; translateY(0)`. Click → smooth scroll to top. Hover → color `--fg`, border `--rule-strong`, glyph transform transition .24s. Transitions .24s `cubic-bezier(.25,1,.5,1)`.

## 10. Selected-work project rows
- Row = link to `/projects/<slug>`. Left: SVG **wireframe thumbnail** (`aspect-ratio:72/48`, ink `#5e5e5e`). Several thumb variants: plain page, browser-chrome (chrome-bar/dot/addr/rule), phone (phone-body/screen/notch), bg-dim. Thumbnails contain `.thumb-page` groups (`transform-box:fill-box`) that **auto-carousel** (cycle pages) via `data-thumb-carousel`/`data-loop` — pages translate/cycle on a timed loop. For clone: build the SVG wireframes and cycle the inner page groups (e.g. translateX swap every ~2.4s with the standard easing), pausing under reduced-motion.
- Hover/focus row: thumb `color #5e5e5e → var(--color-oz-pink)` (.22s); chrome parts → pink; a `.project-crop` corner-bracket SVG icon appears after the title (`opacity:0,translateX(-4px)→0`, then `project-crop-blink .11s steps(2)` flicker). Whole link gets `filter:url(#project-glitch-N)` (N=0/1/2 by `data-glitch-index`) — RGB-shift/chromatic-aberration glitch SVG filter. Build the 3 SVG `<filter>` defs (feOffset/feColorMatrix RGB split + turbulence displacement) once in a hidden `<svg>` and apply on hover. Reduced-motion → no glitch, no carousel.

## 11. Archived rows
Non-interactive: `cursor:not-allowed`. Title `.archive-note-text` has `text-decoration:line-through; text-decoration-color:transparent`. Hover → decoration-color `currentColor`, opacity `.45` (.2s ease-out); `.archive-sad` = mono `¯\_(ツ)_/¯` appears (`opacity:0,translateX(-4px)→ opacity:1,translateX(0) scale(1)`, .2s).

## 12. Takes rows
`.take-link`; on hover/focus a `.take-arrow` (→) after title: `opacity:0,translateX(-4px)→0`, then `take-arrow-blink .11s steps(2)` flicker. Date (mono, --muted) left, category (mono uppercase, --muted) right. `.split-line`/`rule` between rows draws on reveal.

## 13. Tinkering grid
Grid 1col → 2col ≥640px → 3col ≥1024px. First card grid-column-start offset via `--offset-sm`/`--offset-lg` (it starts indented to align). Card: flex, gap .75rem, padding .875rem 1rem, `border-top:1px var(--rule)`; hover `background:var(--surface)`; icon (20×20) `--muted → --fg` on hover; name Geist text-sm 500 --fg; desc .8125rem --muted. **Placeholder card** ("Cooking", `.tinker-placeholder`): not a link, `cursor:default`, name/desc opacity .4, icon spins (`animation:spin 1.5s linear infinite`), `.tinker-dots` 3 spans animate sequentially (`dot1/dot2/dot3` 2s) producing "." "." "." typing effect. Grid container `border-bottom:1px var(--rule)`.

## 14. Hero word-focus
`#intro h1 .split-word` may have `.word-focus` (cursor:crosshair). Hovering any focus word → `:has(.word-focus:hover) .split-word:not(.word-focus){filter:blur(4px); opacity:.55}` with `transition:filter .22s ease-out, opacity .22s ease-out`. (Which words are `.word-focus` — verify in build; treat all hero words as focus targets so any hovered word sharpens while siblings blur.)

## 15. Social dropdown (header)
Avatar button; menu opens on hover/focus-within (CSS `:has`/JS). 8 links. Closes on mouse leave / blur / Escape.

## 16. Header / rule reveal
Header is in-flow (`position:relative`), `.rule-b` bottom hairline. Header intro items + rules participate in hero-pending gate (rules draw with `--rule-scale` 0→1). After hero, header is static (does NOT shrink/stick on scroll — verify; current evidence: relative, no scroll transform).

## Responsive behavior
- **≥1024px**: 3-col tinkering; full 12-col grammar (label `col-span-2`, content `col-span-10`, body constrained ~7-8 cols); side-nav visible; numerals `right:4vw`.
- **768–1023px (tablet)**: side-nav visible (md:block); tinkering 2-col; grid largely intact, slightly tighter; headings scale via clamp.
- **<768px (mobile, 390px)**: **single column** — label sits directly above heading at `--edge` padding (no left gutter), body full-width; meta grid → 2 columns (Who/What, Where/How, When); tinkering 1-col; side-nav (`wayfinding-nav`) **hidden**; section numerals centered behind content at low opacity; scroll-to-top still present. Heading sizes shrink via existing `clamp()` (hero `clamp(2.75rem,7vw,6rem)` ≈ 44px @390).
- Breakpoints: Tailwind defaults — `sm:640px`, `md:768px`, `lg:1024px`. Tinkering grid switches at 640 & 1024; layout column-stacking at 768 (`md:`).

## Reduced-motion (must implement)
Show `.reduced-motion-notice` text in hero; disable scramble/split/parallax/glitch/carousel/scroll-progress/numeral; everything renders in final static state. Use Framer Motion `useReducedMotion()`.
