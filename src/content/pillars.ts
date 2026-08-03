export type PillarSlug = "the-force" | "the-break" | "the-reckoning";

export type Pillar = {
  slug: PillarSlug;
  title: string;
  subtitle: string;
  exponent: string;
  description: string;
};

export const pillars: readonly Pillar[] = [
  {
    slug: "the-force",
    title: "The Force",
    subtitle: "What gets faster, cheaper, smarter",
    exponent: "Exponent of Technology",
    description:
      "AI, energy, compute, biotech, robotics. The curve under everything else.",
  },
  {
    slug: "the-break",
    title: "The Break",
    subtitle: "What cracks when the curve hits",
    exponent: "Exponent of Structure",
    description:
      "Work, money, power, education, geopolitics, institutions. The order that was, the order that is becoming.",
  },
  {
    slug: "the-reckoning",
    title: "The Reckoning",
    subtitle: "What only you can answer",
    exponent: "Exponent of the Self",
    description:
      "Meaning, faith, identity, freedom, the merge. Embrace, ignore, fight — even doing nothing is an answer.",
  },
] as const;

export function getPillar(slug: PillarSlug): Pillar {
  const p = pillars.find((x) => x.slug === slug);
  if (!p) throw new Error(`Unknown pillar: ${slug}`);
  return p;
}
