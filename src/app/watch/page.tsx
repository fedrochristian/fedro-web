import { SectionShell } from "@/components/content/SectionShell";
import { Kicker } from "@/components/content/Kicker";
import { pillars } from "@/content/pillars";
import { videosByPillar } from "@/content/videos";
import { CTALink } from "@/components/content/CTAButton";
import { pageMetadata } from "@/lib/metadata";
import { site } from "@/content/site";

export const metadata = pageMetadata({
  title: "Watch",
  description: "Video by pillar — The Force, The Break, The Reckoning.",
  path: "/watch",
});

export default function WatchPage() {
  return (
    <SectionShell id="watch">
      <Kicker>Watch</Kicker>
      <h1 className="display-2" style={{ marginTop: "1rem", maxWidth: "20ch" }}>
        The reckoning, on&nbsp;screen.
      </h1>
      <p className="lede" style={{ marginTop: "1rem", maxWidth: "48ch" }}>
        Lazy-loaded YouTube hub. Embeds are wired in Step 6.
      </p>

      <div style={{ marginTop: "3rem", display: "grid", gap: "var(--space-7)" }}>
        {pillars.map((p) => {
          const list = videosByPillar(p.slug);
          return (
            <section key={p.slug}>
              <h2 className="h2">{p.title}</h2>
              <p style={{ color: "var(--text-2)", marginTop: "0.4rem", maxWidth: "44ch" }}>
                {p.description}
              </p>
              {list.length === 0 ? (
                <p style={{ color: "var(--text-3)", marginTop: "1rem" }}>
                  No videos in this pillar yet.
                </p>
              ) : (
                <ul style={{ marginTop: "1rem" }}>
                  {list.map((v) => (
                    <li key={v.youtubeId} className="card">
                      <span className="card__title">{v.title}</span>
                      <span className="card__dek">{v.description}</span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          );
        })}
      </div>

      <div style={{ marginTop: "var(--space-8)" }}>
        <CTALink href={site.socials.youtube} external variant="primary">
          Follow on YouTube
        </CTALink>
      </div>
    </SectionShell>
  );
}
