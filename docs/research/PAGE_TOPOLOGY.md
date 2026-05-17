# Page Topology — ozgur.design (single page, ~8250px @1440)

Native scroll. `<html>` bg `#0a0a0a`. One scroll container (window). Z-layers: side-nav z-20, scroll-progress z-30, scroll-to-top z-30, header relative (in flow).

## Fixed / overlay elements (outside section flow)
1. **ScrollProgress** — `position:fixed; top:0; left:0; right:0; height:2px; background:#fff; transform-origin:left; transform:scaleX(progress); z-index:30`.
2. **WayfindingNav** — `position:fixed; right:clamp(.75rem,1.6vw,1.5rem); top:50%; translateY(-50%); z-20`. Vertical list of 11 links (Intro, Selected, Archived, Beginnings, Trajectory, Approach, Tinkering, Takes, Tools, Colophon, Contact). Each link 134×31px, mono 11px, color --muted; active = --fg. Right 1px rule line. Active tick grows 6px→18px + `wf-pulse` 2.8s. Hover shows backdrop-blur label badge. List `transform` slides (.36s) to keep active item vertically centered. **Hidden < md (mobile/tablet).**
3. **ScrollToTop** — `position:fixed; bottom/right:clamp(1rem,2.5vw,1.75rem); 36×36; border:1px var(--rule); border-radius:2px; backdrop-blur(10px); bg color-mix(--bg 82%)`. Hidden (opacity:0, translateY(10px)) until scrolled down → `.is-visible`. Hover → color --fg, border --rule-strong.

## Header (relative top bar, `.frame`, `.rule-b`)
Logo `ozg.svg` (links `/`) · Primary nav center: **Projects**(/#selected) **About**(/#beginnings) **Contact**(/#contact), each with small SVG icon · Right: avatar button (`oz.jpg`) "Social links" → dropdown menu of 8 socials (ozgur.ca, ozg.fyi, LinkedIn, Bluesky, Medium, Mastodon, Peerlist, GitHub), opens on hover/focus. Some header items hidden until hero animation completes (`header-intro-item`, hero-pending gate).

## Sections (flow order, top → bottom)
| # | id | Component | Label | Big numeral | Interaction model |
|---|----|-----------|-------|-------------|-------------------|
| 1 | `#intro` | HeroSection | `00 / MMXXVI` | — | static + hero intro reveal + word-focus hover blur |
| 2 | `#selected` | SelectedWork | `01 / Recently` | — | scroll-reveal; per-row SVG thumb carousel (auto) + glitch on hover |
| 3 | `#archived` | ArchivedList | `02 / Previously` | — | scroll-reveal; rows `cursor:not-allowed`, strike-through + `¯\_(ツ)_/¯` on hover |
| 4 | `#beginnings` | TextSection | `03 / Background` | 03 | scroll-reveal + numeral parallax |
| 5 | `#trajectory` | TextSection | `04 / Career` | 04 | scroll-reveal + numeral parallax |
| 6 | `#approach` | TextSection | `05 / Method` | 05 | scroll-reveal + numeral parallax |
| 7 | `#tinkering` | TinkeringGrid | `06 / Projects` | 06 | scroll-reveal; 24-card grid, hover bg; "Cooking" placeholder spinner+dots |
| 8 | `#takes` | TakesList | `07 / Writing` | — | scroll-reveal; 4 article rows, arrow-on-hover; "All takes →" link |
| 9 | `#tools` | TextSection | `08 / Stack` | 08 | scroll-reveal + numeral parallax |
| 10 | `#colophon` | TextSection | `09 / Craft` | 09 | scroll-reveal + numeral parallax |
| 11 | `#contact` | ContactSection | `10 / Reach` | 10 | scroll-reveal; 8 social icon buttons |

Sections 4,5,6,7,9,10,11 use `.section-indexed` wrapper (giant outlined numeral watermark, see BEHAVIORS). 2,3,8 do not. Most sections separated by `.rule-t` hairline.

## Footer (`<footer>`, `.frame`, `.rule-t`)
Line: `MMXIV–MMXXVI. Memento vivere.` · footer nav (Projects/About/Contact w/ icons) · `Handmade à Tiohtiá:ke / Montréal.`

## Shared layout grammar (every content section, desktop ≥768px)
`.frame.grid-12`: **left gutter** `md:col-span-2` = mono label `NN / Word`; **main** `md:col-span-10` heading, body copy constrained `md:col-span-7/8` (max-w ~`xl`/`2xl`). Big section numeral absolutely positioned right (`right:4vw`, vertically centered). Mobile <768px: single column, label directly above heading at edge padding, numeral centered-behind at low opacity, side-nav hidden.

## Content (verbatim) — see RESEARCH_CONTENT.md for full text dump
- **Hero H1:** "Designer refining the interplay between tools, interfaces & experience." + meta: Who/Oz Gultekin · What/Product Experience Design · Where/Montreal, Canada (Remote) · How/Momentum+Craft · When/Available
- **Selected** (6, →`/projects/<slug>`): Improving estate plan clarity·Self-serve estate tech | Increasing member engagement·Personal finance fintech | Building a cohesive design system·Retail ops SaaS | Pulling the perk forward·Telecom loyalty rewards | Clarifying network selection·Crypto withdrawal flows | Forming privacy-first analytics·B2B SaaS analytics. Header note: "Password required".
- **Archived** (3, non-link): Streamlining the booking flow·Nordic flag carrier | Empowering store associates·Omnichannel SaaS | Audience-driven live events·Interactive broadcasting.
- **Tinkering** (24): Cooking(placeholder)·Something's in the works | FC St. Pauli Love·Fanzine for the club, history and culture | Astromade Studio | GrandGuard | Griddy Up | Scranton DVD | (Anti) Capitailism Rot Com | Faviconry | Aipocalypse Now | Blogroll | Montreal Best | Hex or Not | Tiloji | Rizzle | Shartup | Colour Love | NNN Global | Chroma Census | Hex Appeal | HAIL 9000 | Continental Drift | Plot Twist | Our Hue & Native Land | Death & Taxes Canada (full descriptions + hrefs in content dump).
- **Takes** (4, →`/takes/<slug>`): Mar 15 2026 · How AI Prompts Are Replacing Wireframes In Design · design | Nov 11 2025 · Why Senior Product Designers Say No More Often · product | Jun 17 2025 · How AI Summaries Are Killing Visual Hierarchy · craft | Feb 04 2025 · Which UI Patterns Will Not Survive Conversational AI · design.
- Beginnings/Trajectory/Approach/Tools/Colophon/Contact body copy: in content dump.
