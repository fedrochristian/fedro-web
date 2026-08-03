import type { PillarSlug } from "./pillars";

export type Difficulty = "on-ramp" | "core" | "deep-end";

/**
 * Essay metadata. The MDX body lives at `src/content/essays/<slug>.mdx`
 * and is loaded by `@/lib/content` at build time.
 */
export type Essay = {
  slug: string;
  title: string;
  dek: string;
  date: string; // YYYY-MM-DD
  pillar: PillarSlug;
  difficulty: Difficulty;
  readingTime: number; // minutes
  startHere?: string;
  theChoice?: {
    prompt: string;
    embrace?: string;
    ignore?: string;
    fight?: string;
  };
  heroImage?: string;
  ogImage?: string;
  draft?: boolean;
};

/**
 * Full essay: metadata + raw MDX body source.
 */
export type EssayWithBody = Essay & { body: string };
