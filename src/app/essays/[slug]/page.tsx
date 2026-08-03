import { notFound } from "next/navigation";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";

import { SectionShell } from "@/components/content/SectionShell";
import { PillarTag } from "@/components/content/PillarTag";
import { DifficultyTag } from "@/components/content/DifficultyTag";
import { ShareButtons } from "@/components/content/ShareButtons";
import { mdxComponents, TheChoice } from "@/components/mdx";
import {
  getEssay,
  listEssays,
  relatedEssays,
  nextInPillar,
} from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";
import { site } from "@/content/site";
import { getPillar } from "@/content/pillars";

type RouteParams = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return listEssays().map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: RouteParams) {
  const { slug } = await params;
  const essay = getEssay(slug);
  if (!essay) {
    return pageMetadata({ title: "Essay", description: "", path: `/essays/${slug}` });
  }
  return pageMetadata({
    title: essay.title,
    description: essay.dek,
    path: `/essays/${slug}`,
    type: "article",
    publishedTime: essay.date,
  });
}

export default async function EssayPage({ params }: RouteParams) {
  const { slug } = await params;
  const essay = getEssay(slug);
  if (!essay) notFound();

  const pillar = getPillar(essay.pillar);
  const related = relatedEssays(slug);
  const next = nextInPillar(slug);
  const canonical = new URL(`/essays/${slug}`, site.url).toString();

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: essay.title,
    description: essay.dek,
    datePublished: essay.date,
    author: { "@type": "Organization", name: site.name },
    publisher: { "@type": "Organization", name: site.name },
    url: canonical,
  };

  return (
    <article>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }}
      />

      {/* Header */}
      <SectionShell as="header">
        <div className="prose-container" style={{ padding: 0 }}>
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "1.5rem" }}>
            <PillarTag pillar={essay.pillar} />
            <DifficultyTag level={essay.difficulty} />
          </div>
          <h1 className="display-2">{essay.title}</h1>
          <p className="lede" style={{ marginTop: "1.25rem" }}>{essay.dek}</p>
          <p style={{ marginTop: "1.5rem", color: "var(--text-3)", fontSize: "var(--text-sm)" }}>
            <time dateTime={essay.date}>{essay.date}</time>{" "}· {essay.readingTime} min read
          </p>
        </div>
      </SectionShell>

      {/* Optional Start Here */}
      {essay.startHere ? (
        <SectionShell as="section" variant="tight">
          <div className="prose-container" style={{ padding: 0 }}>
            <aside
              style={{
                background: "var(--bg-2)",
                border: "1px solid var(--border)",
                borderLeft: "2px solid var(--fork)",
                padding: "1rem 1.25rem",
                borderRadius: "var(--radius)",
              }}
            >
              <p className="kicker" style={{ marginBottom: "0.5rem", color: "var(--fork)" }}>
                Start here
              </p>
              <p style={{ color: "var(--text-2)" }}>{essay.startHere}</p>
            </aside>
          </div>
        </SectionShell>
      ) : null}

      {/* MDX body */}
      <SectionShell as="section" variant="tight">
        <div className="prose-container prose" style={{ padding: 0 }}>
          <MDXRemote source={essay.body} components={mdxComponents} />
        </div>
      </SectionShell>

      {/* Optional The Choice closer */}
      {essay.theChoice ? (
        <SectionShell as="section" variant="tight">
          <div className="prose-container" style={{ padding: 0 }}>
            <TheChoice
              prompt={essay.theChoice.prompt}
              embrace={essay.theChoice.embrace}
              ignore={essay.theChoice.ignore}
              fight={essay.theChoice.fight}
            />
          </div>
        </SectionShell>
      ) : null}

      {/* Share */}
      <SectionShell as="section" variant="tight">
        <div className="prose-container" style={{ padding: 0 }}>
          <ShareButtons url={canonical} title={essay.title} />
        </div>
      </SectionShell>

      {/* Next in pillar */}
      {next ? (
        <SectionShell as="section" variant="tight">
          <div className="prose-container" style={{ padding: 0 }}>
            <p className="kicker" style={{ color: "var(--text-3)" }}>
              Next in {pillar.title}
            </p>
            <Link
              href={`/essays/${next.slug}`}
              style={{
                display: "block",
                marginTop: "0.75rem",
                fontFamily: "var(--font-display-src), serif",
                fontSize: "clamp(1.5rem, 2.4vw, 2rem)",
                lineHeight: 1.18,
                color: "var(--fg)",
                letterSpacing: "-0.012em",
              }}
            >
              {next.title}
            </Link>
            <p style={{ marginTop: "0.5rem", color: "var(--text-2)" }}>{next.dek}</p>
          </div>
        </SectionShell>
      ) : null}

      {/* Related */}
      {related.length > 0 ? (
        <SectionShell as="section" variant="tight">
          <h2 className="h2">Related</h2>
          <div style={{ marginTop: "1.5rem" }}>
            {related.map((r) => (
              <Link key={r.slug} className="card" href={`/essays/${r.slug}`}>
                <span className="card__title">{r.title}</span>
                <span className="card__dek">{r.dek}</span>
                <span className="card__meta">
                  <PillarTag pillar={r.pillar} asLink={false} />
                  <DifficultyTag level={r.difficulty} />
                  <span>{r.readingTime} min</span>
                </span>
              </Link>
            ))}
          </div>
        </SectionShell>
      ) : null}
    </article>
  );
}
