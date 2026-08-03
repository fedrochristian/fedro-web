import type { PillarSlug } from "./pillars";

export type Video = {
  youtubeId: string;
  title: string;
  pillar: PillarSlug;
  description: string;
  publishedAt?: string;
};

/** Seed with real entries before launch. Empty in v1 foundation phase. */
export const videos: readonly Video[] = [] as const;

export function videosByPillar(pillar: PillarSlug): Video[] {
  return videos.filter((v) => v.pillar === pillar);
}
