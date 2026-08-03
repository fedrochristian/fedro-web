import Link from "next/link";
import { ForkGlyph } from "@/components/content/ForkGlyph";
import { pillars } from "@/content/pillars";
import { site } from "@/content/site";
import { imageCredits } from "@/content/credits";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="site-footer__grid">
          <div className="site-footer__col">
            <p
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "var(--text-h3)",
                lineHeight: "var(--lh-headline)",
                color: "var(--fg)",
                maxWidth: "28ch",
                marginBottom: "var(--space-4)",
              }}
            >
              {site.thesis}
            </p>
            <p style={{ color: "var(--text-3)", display: "inline-flex", alignItems: "center", gap: "0.5em" }}>
              Embrace <ForkGlyph ariaLabel="fork" /> Ignore <span aria-hidden>·</span> Fight
            </p>
          </div>

          <div className="site-footer__col">
            <h4>Read</h4>
            <Link href="/essays">Essays</Link>
            {pillars.map((p) => (
              <Link key={p.slug} href={`/pillars/${p.slug}`}>{p.title}</Link>
            ))}
          </div>

          <div className="site-footer__col">
            <h4>Watch</h4>
            <Link href="/watch">All videos</Link>
            <a href={site.socials.youtube} target="_blank" rel="noopener noreferrer">YouTube</a>
          </div>

          <div className="site-footer__col">
            <h4>Follow</h4>
            <a href={site.socials.youtube} target="_blank" rel="noopener noreferrer">YouTube</a>
            <a href={site.socials.x} target="_blank" rel="noopener noreferrer">X</a>
            <a href={site.socials.rss}>RSS</a>
          </div>
        </div>

        <div className="site-footer__legal">
          <span>&copy; {new Date().getFullYear()} {site.name}.</span>
          <span style={{ display: "inline-flex", gap: "1rem", flexWrap: "wrap" }}>
            <Link href="/legal">Legal</Link>
            <a href={site.socials.rss}>RSS</a>
          </span>
        </div>

        {imageCredits.length > 0 ? (
          <p
            style={{
              marginTop: "var(--space-4)",
              fontSize: "var(--text-xs)",
              color: "var(--text-3)",
              lineHeight: 1.5,
            }}
          >
            Images:{" "}
            {imageCredits.map((c, i) => (
              <span key={c.file}>
                {i > 0 ? " · " : ""}
                {c.authorHref ? (
                  <a
                    href={c.authorHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "var(--text-2)" }}
                  >
                    {c.author}
                  </a>
                ) : (
                  c.author
                )}
                {" "}
                <span style={{ color: "var(--text-3)" }}>({c.source})</span>
              </span>
            ))}
          </p>
        ) : null}
      </div>
    </footer>
  );
}
