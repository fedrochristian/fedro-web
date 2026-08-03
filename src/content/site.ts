export const site = {
  name: "3X Media",
  title: "3X Media — The Reckoning",
  description:
    "Technology goes exponential. Structure changes. The self must choose. A publication for the tipping point.",
  thesis: "Technology goes exponential. Structure changes. The self must choose.",
  /** Replace before production deploy. */
  url: "https://3x.media",
  /** Social/follow targets. */
  socials: {
    youtube: "https://www.youtube.com/@fedro.christian",
    x: "https://x.com/3xmedia",
    rss: "/rss.xml",
  },
  /** Primary nav order. */
  nav: [
    { label: "Essays", href: "/essays" },
    { label: "Watch", href: "/watch" },
    { label: "About", href: "/about" },
  ] as const,
  /** "Follow" CTA target — YouTube/social outbound in v1 (per PRD §17). */
  followHref: "https://www.youtube.com/@fedro.christian",
} as const;

export type Site = typeof site;
