/**
 * Image credits — surfaced in the footer Legal block and on /legal.
 * Update when adding new background images.
 */
export type ImageCredit = {
  file: string;        // path under public/
  source: "NASA/ESA" | "Unsplash";
  author?: string;     // photographer or institution
  authorHref?: string; // profile/source page
  licenseNote?: string;
};

export const imageCredits: readonly ImageCredit[] = [
  {
    file: "/images/manifesto/personal-arrival.jpg",
    source: "Unsplash",
    author: "Tobias Rademacher",
    authorHref: "https://unsplash.com/@tobbes_rd",
  },
  {
    file: "/images/manifesto/burden.jpg",
    source: "Unsplash",
    author: "Cemrecan Yurtman",
    authorHref: "https://unsplash.com/@cmrcn_",
  },
] as const;
