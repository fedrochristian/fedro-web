import { notFound } from "next/navigation";
import { SectionShell } from "@/components/content/SectionShell";
import { Kicker } from "@/components/content/Kicker";
import { pillars, getPillar, type PillarSlug } from "@/content/pillars";
import { essaysByPillar } from "@/lib/content";
import { videosByPillar } from "@/content/videos";
import { DifficultyTag } from "@/components/content/DifficultyTag";
import { pageMetadata } from "@/lib/metadata";
import Link from "next/link";

type RouteParams = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return pillars.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: RouteParams) {
  const { slug } = await params;
  const p = pillars.find((x) => x.slug === slug);
  if (!p) return pageMetadata({ title: "Pillar", description: "", path: `/pillars/${slug}` });
  return pageMetadata({
    title: `${p.title} — ${p.exponent}`,
    description: p.description,
    path: `/pillars/${slug}`,
  });
}

export default async function PillarPage({ params }: RouteParams) {
  const { slug } = await params;
  if (!pillars.some((p) => p.slug === slug)) notFound();
  const pillar = getPillar(slug as PillarSlug);
  const essays = essaysByPillar(pillar.slug);
  const videos = videosByPillar(pillar.slug);

  return (
    <>
      <SectionShell as="header">
        <Kicker>{pillar.exponent}</Kicker>
        <h1 className="display-2" style={{ marginTop: "1rem", maxWidth: "20ch" }}>
          {pillar.title}.
        </h1>
        <p className="lede" style={{ marginTop: "1.25rem", maxWidth: "44ch" }}>
          {pillar.description}
        </p>
      </SectionShell>

      <SectionShell variant="tight">
        <h2 className="h2">Essays</h2>
        <div style={{ marginTop: "1.5rem" }}>
          {essays.length === 0 ? (
            <p style={{ color: "var(--text-3)" }}>None published in this pillar yet.</p>
          ) : (
            essays.map((e) => (
              <Link className="card" key={e.slug} href={`/essays/${e.slug}`}>
                <span className="card__title">{e.title}</span>
                <span className="card__dek">{e.dek}</span>
                <span className="card__meta">
                  <DifficultyTag level={e.difficulty} />
                  <span>{e.readingTime} min</span>
                </span>
              </Link>
            ))
          )}
        </div>
      </SectionShell>

      <SectionShell variant="tight">
        <h2 className="h2">Watch</h2>
        <div style={{ marginTop: "1.5rem" }}>
          {videos.length === 0 ? (
            <p style={{ color: "var(--text-3)" }}>No videos in this pillar yet.</p>
          ) : (
            videos.map((v) => (
              <div className="card" key={v.youtubeId}>
                <span className="card__title">{v.title}</span>
                <span className="card__dek">{v.description}</span>
              </div>
            ))
          )}
        </div>
      </SectionShell>
    </>
  );
}
