// Single source of truth for all ozgur.design copy (verbatim).
import type {
  ArchivedEntry,
  MetaItem,
  NavItem,
  SelectedProject,
  SocialLink,
  TakeItem,
  TextSectionData,
  TinkerItem,
} from "@/types/content";

export const PRIMARY_NAV: NavItem[] = [
  { label: "Projects", href: "/#selected" },
  { label: "About", href: "/#beginnings" },
  { label: "Contact", href: "/#contact" },
];

export const SOCIALS: SocialLink[] = [
  { name: "ozgur.ca", href: "https://ozgur.ca?ref=ozgur.design" },
  { name: "ozg.fyi", href: "https://ozg.fyi?ref=ozgur.design" },
  { name: "LinkedIn", href: "https://www.linkedin.com/in/ozgurdesign/?ref=ozgur.design" },
  { name: "Bluesky", href: "https://bsky.app/profile/ozgur.ca?ref=ozgur.design" },
  { name: "Medium", href: "https://medium.com/@ozgurca?ref=ozgur.design" },
  { name: "Mastodon", href: "https://me.dm/@ozg?ref=ozgur.design" },
  { name: "Peerlist", href: "https://peerlist.io/ozgurca?ref=ozgur.design" },
  { name: "GitHub", href: "https://github.com/ozgurdesign?ref=ozgur.design" },
];

export const HERO_HEADING = "Designer refining the interplay between tools, interfaces & experience.";
export const HERO_META: MetaItem[] = [
  { key: "Who", value: "Oz Gultekin" },
  { key: "What", value: "Product Experience Design" },
  { key: "Where", value: "Montreal, Canada (Remote)" },
  { key: "How", value: "Momentum+Craft" },
  { key: "When", value: "Available" },
];

export const SELECTED_PROJECTS: SelectedProject[] = [
  { title: "Improving estate plan clarity", category: "Self-serve estate tech", href: "/projects/improving-estate-plan-clarity", thumbIndex: 0 },
  { title: "Increasing member engagement", category: "Personal finance fintech", href: "/projects/increasing-member-engagement", thumbIndex: 1 },
  { title: "Building a cohesive design system", category: "Retail ops SaaS", href: "/projects/building-a-cohesive-design-system", thumbIndex: 2 },
  { title: "Pulling the perk forward", category: "Telecom loyalty rewards", href: "/projects/pulling-the-perk-forward", thumbIndex: 3 },
  { title: "Clarifying network selection", category: "Crypto withdrawal flows", href: "/projects/clarifying-network-selection", thumbIndex: 4 },
  { title: "Forming privacy-first analytics", category: "B2B SaaS analytics", href: "/projects/launching-privacy-first-analytics", thumbIndex: 5 },
];

export const ARCHIVED_ENTRIES: ArchivedEntry[] = [
  { title: "Streamlining the booking flow", category: "Nordic flag carrier" },
  { title: "Empowering store associates", category: "Omnichannel SaaS" },
  { title: "Audience-driven live events", category: "Interactive broadcasting" },
];

export const TINKER_ITEMS: TinkerItem[] = [
  { name: "Cooking", description: "Something's in the works", placeholder: true, iconIndex: 0 },
  { name: "FC St. Pauli Love", description: "Fanzine for the club, history and culture", href: "https://fcstpauli.love?ref=ozgur.design", iconIndex: 1 },
  { name: "Astromade Studio", description: "Minimal Astro theme marketplace", href: "https://astromade.studio?ref=ozgur.design", iconIndex: 2 },
  { name: "GrandGuard", description: "Digital security for parents", href: "https://ozgur.ca/project/grandguard?ref=ozgur.design", iconIndex: 3 },
  { name: "Griddy Up", description: "Grid calculator, live preview", href: "https://ozgur.ca/projects/griddy-up?ref=ozgur.design", iconIndex: 4 },
  { name: "Scranton DVD", description: "Bouncing DVD screensaver for macOS", href: "https://ozgur.ca/projects/scranton-dvd?ref=ozgur.design", iconIndex: 5 },
  { name: "(Anti) Capitailism Rot Com", description: "Daily dispatch against AI capitalism", href: "https://ozgur.ca/projects/capitailism?ref=ozgur.design", iconIndex: 6 },
  { name: "Faviconry", description: "SVG to favicon set, in-browser", href: "https://ozgur.ca/projects/faviconry?ref=ozgur.design", iconIndex: 7 },
  { name: "Aipocalypse Now", description: "AI news, doom-scored daily", href: "https://ozgur.ca/projects/aipocalypse-now?ref=ozgur.design", iconIndex: 8 },
  { name: "Blogroll", description: "Independent blog directory by geography", href: "https://ozgur.ca/projects/blogroll?ref=ozgur.design", iconIndex: 9 },
  { name: "Montreal Best", description: "City guide, five picks per category", href: "https://ozgur.ca/projects/montreal-best?ref=ozgur.design", iconIndex: 10 },
  { name: "Hex or Not", description: "Palette swiping game", href: "https://ozgur.ca/projects/hex-or-not?ref=ozgur.design", iconIndex: 11 },
  { name: "Tiloji", description: "Browse emoji by visual similarity", href: "https://ozgur.ca/projects/tiloji?ref=ozgur.design", iconIndex: 12 },
  { name: "Rizzle", description: "Slang vocabulary test", href: "https://ozgur.ca/projects/rizzle?ref=ozgur.design", iconIndex: 13 },
  { name: "Shartup", description: "Cultcore startup satire", href: "https://ozgur.ca/projects/shartup?ref=ozgur.design", iconIndex: 14 },
  { name: "Colour Love", description: "Adopt a colour", href: "https://ozgur.ca/projects/colour-love?ref=ozgur.design", iconIndex: 15 },
  { name: "NNN Global", description: "Maps every /now page on the planet", href: "https://ozgur.ca/projects/nnn-global?ref=ozgur.design", iconIndex: 16 },
  { name: "Chroma Census", description: "Hue distribution of any image", href: "https://ozgur.ca/projects/chroma-census?ref=ozgur.design", iconIndex: 17 },
  { name: "Hex Appeal", description: "Colour palette studio", href: "https://ozgur.ca/projects/hex-appeal?ref=ozgur.design", iconIndex: 18 },
  { name: "HAIL 9000", description: "Incredibly co-operative AI", href: "https://ozgur.ca/projects/hail9000?ref=ozgur.design", iconIndex: 19 },
  { name: "Continental Drift", description: "Imperial and metric conversion", href: "https://ozgur.ca/projects/continental-drift?ref=ozgur.design", iconIndex: 20 },
  { name: "Plot Twist", description: "Conversations into charts", href: "https://ozgur.ca/projects/plot-twist?ref=ozgur.design", iconIndex: 21 },
  { name: "Our Hue & Native Land", description: "Canadian flag colour symbolism", href: "https://ozgur.ca/projects/our-hue-and-native-land?ref=ozgur.design", iconIndex: 22 },
  { name: "Death & Taxes Canada", description: "Provincial sales tax math", href: "https://ozgur.ca/projects/death-and-taxes-canada?ref=ozgur.design", iconIndex: 23 },
];

export const TAKES_INTRO =
  "Each take is written from inside the work rather than over it. None of them end on advice, because the part worth reading was usually not the resolution.";
export const TAKES: TakeItem[] = [
  { date: "Mar 15, 2026", title: "How AI Prompts Are Replacing Wireframes In Design", category: "design", href: "/takes/how-ai-prompts-are-replacing-wireframes-in-design" },
  { date: "Nov 11, 2025", title: "Why Senior Product Designers Say No More Often", category: "product", href: "/takes/why-senior-product-designers-say-no-more-often" },
  { date: "Jun 17, 2025", title: "How AI Summaries Are Killing Visual Hierarchy", category: "craft", href: "/takes/how-ai-summaries-are-killing-visual-hierarchy" },
  { date: "Feb 04, 2025", title: "Which UI Patterns Will Not Survive Conversational AI", category: "design", href: "/takes/which-ui-patterns-will-not-survive-conversational-ai" },
];

export const TEXT_SECTIONS: Record<string, TextSectionData> = {
  beginnings: {
    id: "beginnings",
    label: { num: "03", word: "Background" },
    heading: "Beginnings.",
    numeral: "03",
    paragraphs: [
      "It started with an 8-bit computer and the demo scene. That curiosity found a more deliberate path. Typography, animation, photography, then building websites from scratch when the role didn’t have a name yet.",
      "Moving between continents added a different kind of fluency. Different languages and ways of being taught me to balance feeling and form, improvisation and intention.",
    ],
  },
  trajectory: {
    id: "trajectory",
    label: { num: "04", word: "Career" },
    heading: "Trajectory.",
    numeral: "04",
    paragraphs: [
      "Read this part as the résumé. The work has stretched across eight cities in six countries. Berlin, İstanbul, Montréal, New York, Reykjavík, Salzburg, San Francisco, and Toronto. Each move reset the brief. Each city sharpened a different muscle.",
      "The industries shifted as deliberately as the geography. Sports media, marketplace e-commerce, omnichannel retail SaaS, live broadcast technology, ed-tech for college admissions, travel commerce for a national flag carrier, consumer fintech, and legaltech estate planning. Different regulations, different rituals, the same discipline. Designing the product experience end to end and carrying the complexity so the customer never has to.",
      "The teams varied just as widely. Two-person seed studios where the designer also writes the deploy script. Hundred-person scaleups stitching their first design system together. Enterprises where a single flow touches a dozen stakeholders before it ships. Working across that range, again and again, is the part that compounds.",
    ],
  },
  approach: {
    id: "approach",
    label: { num: "05", word: "Method" },
    heading: "Approach.",
    numeral: "05",
    paragraphs: [
      "Design is shared early, questioned often, and never precious. Every decision has a reason behind it, feedback is treated as a guardrail rather than a verdict, and jargon gets left at the door so the work can actually land with the people it affects. The process stays elastic enough to break its own rules when something better comes along, and consistent enough to get somewhere worth going.",
    ],
  },
  tools: {
    id: "tools",
    label: { num: "08", word: "Stack" },
    heading: "Tools.",
    numeral: "08",
    paragraphs: [
      "Being comfortable with whatever platform the work calls for, old or new, is part of the craft. From early code editors to the no-code era, the tools have changed completely, more than once. Tool-agnostic, and well practised at staying that way.",
      "That said, the current lineup includes Figma, Adobe CC, Framer, Miro, Rive, Storybook, React, Astro, Tailwind, shadcn, GSAP, Motion, SwiftUI, JavaScript, TypeScript, HTML, CSS, Git, Mixpanel, Amplitude, Hotjar, Jira, Linear, Vercel, and Cloudflare.",
    ],
  },
  colophon: {
    id: "colophon",
    label: { num: "09", word: "Craft" },
    heading: "Colophon.",
    numeral: "09",
    paragraphs: [
      "No CMS, no bloat, no ornament. This site is static HTML and CSS, authored in Markdown, built with Astro and Tailwind, deployed to Vercel. Minimal client-side JavaScript, used only for progressive enhancement. Every page is a flat file. Every design decision is a code decision.",
      "The same way Bauhaus stripped decoration to let structure speak, this site strips the stack to let the work speak. Form follows function. If a feature doesn’t serve the reader, it doesn’t ship. If a dependency doesn’t earn its weight, it gets cut. What remains is fast, legible, and mine to maintain.",
      "No drift between intent and artifact.",
    ],
  },
};

export const CONTACT_LINES = [
  "Everything lives on the personal site.",
  "Link in bio, bio in link. Just in case.",
  "Messages welcome on LinkedIn.",
  "Bluesky for scheduled posts.",
  "Medium for careless essays.",
  "Mastodon for fediverse.",
  "Peerlist for tech takes.",
  "GitHub for tinkering.",
  "Email, IYKYK.",
];
export const CONTACT_CLOSING = "Nowhere else.";

export const WAYFINDING_SECTIONS = [
  { id: "intro", label: "Intro" },
  { id: "selected", label: "Selected" },
  { id: "archived", label: "Archived" },
  { id: "beginnings", label: "Beginnings" },
  { id: "trajectory", label: "Trajectory" },
  { id: "approach", label: "Approach" },
  { id: "tinkering", label: "Tinkering" },
  { id: "takes", label: "Takes" },
  { id: "tools", label: "Tools" },
  { id: "colophon", label: "Colophon" },
  { id: "contact", label: "Contact" },
];

export const FOOTER_LINE_1 = "MMXIV–MMXXVI. Memento vivere.";
export const FOOTER_LINE_2 = "Handmade à Tiohtiá:ke / Montréal.";
