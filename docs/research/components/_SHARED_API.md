# Shared API every section builder MUST use

These already exist on `master` (built + typechecked). Import and compose them — do NOT reinvent reveal/scramble/label/layout/icons.

## Layout / animation primitives
- `import { SectionShell } from "@/components/SectionShell"`
  `<SectionShell id="beginnings" label={{num:"03",word:"Background"}} numeral="03" ruleTop main as one block>{children}</SectionShell>`
  Props: `id` (string, used as `<section id>` + scroll anchor), `label:{num,word}` (renders the mono `NN / Word` left gutter with reveal+scramble), `numeral?` (string → giant outlined `.section-index` watermark + scroll parallax; omit to skip), `ruleTop?`(default true → top hairline), `paddingClass?` (default `"pt-24 md:pt-32 pb-16 md:pb-24"`), `mainClassName?` (default `"col-span-12 md:col-span-10"`). Children render in the main column.
- `import { SplitHeading } from "@/components/SplitHeading"`
  `<SplitHeading as="h2" className="display-sm text-4xl md:text-5xl" text="Beginnings." mode="scramble" />`
  - `text` (single mask) OR `lines` (string[] — one clip mask per visual line, for the hero).
  - `mode="rise"` (default; word mask translateY reveal) | `mode="scramble"` (char scramble settle).
  - `wordFocus` (bool) adds `.word-focus` to every word (hero only).
  - `as`: h1|h2|h3. Always pass the visual class via `className`.
- `import { Reveal } from "@/components/Reveal"` — generic fade-up on scroll-in. `<Reveal as="p" delay={0.1} className="...">…</Reveal>`. `as`: div|p|li|span|section. Use for paragraphs, rows, intro lines.
- `import { ScrambleText } from "@/components/ScrambleText"` — `<ScrambleText text="…" className?/>` char scramble on scroll-in.
- `import { SectionLabel } from "@/components/SectionLabel"` — only if NOT using SectionShell (it already includes the label).

All primitives are `"use client"`, animate **once** on scroll-in, and fall back to static final state under `prefers-reduced-motion`. Sections that use them are therefore client components — start the file with `"use client";`.

## Icons / assets (auto-generated, verbatim from target)
- `import { RawSvg, TINKER_SVGS, SOCIAL_SVGS, SOCIAL_NAMES, PROJECT_CROP_SVG, GlitchFilters, type SocialName } from "@/components/icons"`
- `import { THUMB_SVGS } from "@/components/thumbnails"`
- `RawSvg`: `<RawSvg svg={STRING} className="tinker-icon" />` → renders `<span class="…" aria-hidden dangerouslySetInnerHTML>`. The CSS classes (`.tinker-icon`, `.thumb`, etc.) are global; pass them to RawSvg so the span is the styled box exactly like the original DOM (`<span class="tinker-icon"><svg/></span>`). For thumbnails: `<RawSvg svg={THUMB_SVGS[i]} className="thumb" />`.
- `TINKER_SVGS[iconIndex]`, `SOCIAL_SVGS[name as SocialName]`, `THUMB_SVGS[thumbIndex]`.

## Content (verbatim — import, never hardcode)
`import { ... } from "@/lib/content"` — `HERO_HEADING, HERO_META, SELECTED_PROJECTS, ARCHIVED_ENTRIES, TINKER_ITEMS, TAKES, TAKES_INTRO, TEXT_SECTIONS, CONTACT_LINES, CONTACT_CLOSING, SOCIALS`. Types in `@/types/content`.

## Global CSS classes available (in globals.css — do not redefine)
`.frame .grid-12 .display .display-sm .label .label-fg .mono-sm .text-body .text-muted .rule-t .rule-b .rule-y .section-indexed .section-index .split-line-mask .split-line .split-word .word-focus .thumb .thumb-page .chrome-* .phone-* .bg-dim .project-link .project-crop .project-glitch-0|1|2 .archive-entry .archive-note-text .archive-sad .take-link .take-arrow .tinker-grid .tinker-card .tinker-icon .tinker-text .tinker-name .tinker-desc .tinker-placeholder .tinker-dots .reduced-motion-notice` plus all Tailwind v4 utilities. Colors via `var(--fg) var(--text) var(--muted) var(--bg) var(--rule) var(--color-oz-pink)` or Tailwind `text-[var(--fg)]`.

## Rules
- Target file path is given per spec. Create ONLY that file (+ sub-components in same file or same `sections/` folder if noted). Do not edit globals.css, content.ts, icons.tsx, page.tsx, or other sections.
- Use exact verbatim text from `@/lib/content` (already verbatim from the live site).
- Match the reference screenshot in `docs/design-references/` for spacing/scale/color.
- Finish only when `npx tsc --noEmit` passes (ignore any pre-existing `.next/types` "Duplicate identifier" noise — that's an environment artifact, not your code).
- 2-space indent, named exports, TypeScript strict, no `any`, no inline styles except dynamic transforms.
