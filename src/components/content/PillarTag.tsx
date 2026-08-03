import Link from "next/link";
import { getPillar, type PillarSlug } from "@/content/pillars";

type Props = { pillar: PillarSlug; asLink?: boolean };

export function PillarTag({ pillar, asLink = true }: Props) {
  const p = getPillar(pillar);
  const inner = (
    <span className={`tag tag--pillar tag--${pillar}`}>{p.title}</span>
  );
  return asLink ? <Link href={`/pillars/${pillar}`}>{inner}</Link> : inner;
}
