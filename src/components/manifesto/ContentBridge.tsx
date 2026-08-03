import Link from "next/link";
import { manifesto } from "@/content/manifesto";
import { SectionShell } from "@/components/content/SectionShell";
import { Kicker } from "@/components/content/Kicker";
import { pillars } from "@/content/pillars";
import { Reveal } from "./Reveal";
import { ForkGlyph } from "@/components/content/ForkGlyph";

export function ContentBridge() {
  const beat = manifesto.bridge;
  return (
    <SectionShell id="bridge">
      <Reveal>
        <Kicker>{beat.kicker}</Kicker>
      </Reveal>
      <Reveal delay={0.05}>
        <h2 className="display-2" style={{ marginTop: "1.25rem", maxWidth: "22ch" }}>
          {beat.title}
        </h2>
      </Reveal>
      <Reveal delay={0.12}>
        <p className="lede" style={{ marginTop: "1.25rem", maxWidth: "44ch", color: "var(--text-2)" }}>
          {beat.body}
        </p>
      </Reveal>

      <div className="bridge-grid" style={{ marginTop: "clamp(2.5rem, 5vw, 4rem)" }}>
        {pillars.map((p, i) => (
          <Reveal key={p.slug} delay={0.2 + i * 0.08} className="bridge-card">
            <Link href={`/pillars/${p.slug}`} className="bridge-card__link" aria-label={`Read ${p.title}`}>
              <span className="kicker">{p.exponent}</span>
              <span
                className="bridge-card__title"
                style={{
                  fontFamily: "var(--font-display-src), serif",
                  fontSize: "clamp(1.75rem, 2.4vw, 2.25rem)",
                  lineHeight: 1.1,
                  letterSpacing: "-0.015em",
                  color: "var(--fg)",
                  marginTop: "0.6rem",
                  display: "block",
                }}
              >
                {p.title}
              </span>
              <span style={{ marginTop: "0.5rem", color: "var(--text-2)", display: "block" }}>{p.subtitle}</span>
              <span className="bridge-card__cue">
                Read <ForkGlyph />
              </span>
            </Link>
          </Reveal>
        ))}
      </div>

      <style>{`
        .bridge-grid {
          display: grid;
          gap: 0;
          grid-template-columns: 1fr;
        }
        @media (min-width: 880px) {
          .bridge-grid { grid-template-columns: repeat(3, 1fr); }
        }
        .bridge-card__link {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          padding: 1.75rem 0 1.75rem;
          border-top: 1px solid var(--border);
          transition: padding var(--dur-base) var(--ease-out);
        }
        .bridge-card:last-child .bridge-card__link { border-bottom: 1px solid var(--border); }
        @media (min-width: 880px) {
          .bridge-card { border-right: 1px solid var(--border); }
          .bridge-card:last-child { border-right: 0; }
          .bridge-card__link { padding: 1.75rem 1.5rem; border-top: none; }
          .bridge-card:last-child .bridge-card__link { border-bottom: none; }
        }
        .bridge-card__cue {
          margin-top: auto;
          padding-top: 1.5rem;
          font-size: var(--text-sm);
          color: var(--text-3);
          display: inline-flex;
          align-items: center;
          gap: 0.45em;
          transition: color var(--dur-fast) var(--ease-out);
        }
        .bridge-card__link:hover .bridge-card__title { color: var(--fork); }
        .bridge-card__link:hover .bridge-card__cue { color: var(--fg); }
      `}</style>
    </SectionShell>
  );
}
