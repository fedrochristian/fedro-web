import { SectionShell } from "@/components/content/SectionShell";
import { Kicker } from "@/components/content/Kicker";
import { listEssays } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";
import { PillarTag } from "@/components/content/PillarTag";
import { DifficultyTag } from "@/components/content/DifficultyTag";
import Link from "next/link";

export const metadata = pageMetadata({
  title: "Essays",
  description: "Long-form essays across The Force, The Break, and The Reckoning.",
  path: "/essays",
});

export default function EssaysIndex() {
  const all = listEssays();
  return (
    <SectionShell id="essays">
      <Kicker>Essays</Kicker>
      <h1 className="display-2" style={{ marginTop: "1rem", maxWidth: "20ch" }}>
        Long enough to actually say&nbsp;something.
      </h1>
      <p className="lede" style={{ marginTop: "1rem", maxWidth: "48ch" }}>
        Three pillars. Three difficulties. No theatre. Newest first.
      </p>

      <div style={{ marginTop: "3rem" }}>
        {all.length === 0 ? (
          <p style={{ color: "var(--text-3)" }}>
            No essays published yet. Add MDX files under <code>src/content/essays/</code>.
          </p>
        ) : (
          all.map((e) => (
            <article className="card" key={e.slug}>
              <Link href={`/essays/${e.slug}`} className="card__title">{e.title}</Link>
              <p className="card__dek">{e.dek}</p>
              <div className="card__meta">
                <PillarTag pillar={e.pillar} />
                <DifficultyTag level={e.difficulty} />
                <span>{e.readingTime} min read</span>
                <span>·</span>
                <time dateTime={e.date}>{e.date}</time>
              </div>
            </article>
          ))
        )}
      </div>
    </SectionShell>
  );
}
