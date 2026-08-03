import { manifesto } from "@/content/manifesto";
import { SectionShell } from "@/components/content/SectionShell";
import { Kicker } from "@/components/content/Kicker";
import { Reveal } from "./Reveal";

/** The signature visual moment — three paths visibly diverge. */
export function ForkMoment() {
  const beat = manifesto.fork;
  return (
    <SectionShell id="fork" variant="full">
      <div style={{ width: "100%" }}>
        <div style={{ textAlign: "center", maxWidth: "44rem", marginInline: "auto" }}>
          <Reveal>
            <Kicker>{beat.kicker}</Kicker>
          </Reveal>
          <Reveal delay={0.06}>
            <h2 className="display-2" style={{ marginTop: "1.25rem" }}>
              {beat.title}
            </h2>
          </Reveal>
          <Reveal delay={0.14}>
            <p className="lede" style={{ marginTop: "1.25rem", color: "var(--text-2)" }}>
              {beat.lede}
            </p>
          </Reveal>
        </div>

        {/* The diverging-paths visual: a single line that splits into three. */}
        <Reveal delay={0.2} threshold={0.1}>
          <div aria-hidden="true" style={{ marginTop: "clamp(2rem, 4vw, 3rem)", marginInline: "auto", maxWidth: "min(72rem, 92vw)" }}>
            <svg viewBox="0 0 720 160" width="100%" style={{ display: "block", height: "auto" }}>
              <defs>
                <linearGradient id="fork-line" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="rgba(244,241,234,0.45)" />
                  <stop offset="100%" stopColor="rgba(244,241,234,0.05)" />
                </linearGradient>
              </defs>
              {/* Trunk */}
              <path d="M 30 80 L 320 80" stroke="rgba(244,241,234,0.55)" strokeWidth="1.4" fill="none" strokeLinecap="round" />
              {/* Three diverging paths from a fixed pivot at (320, 80) */}
              <path d="M 320 80 Q 480 80 690 20" stroke="url(#fork-line)" strokeWidth="1.2" fill="none" strokeLinecap="round" />
              <path d="M 320 80 L 690 80"               stroke="url(#fork-line)" strokeWidth="1.2" fill="none" strokeLinecap="round" />
              <path d="M 320 80 Q 480 80 690 140" stroke="url(#fork-line)" strokeWidth="1.2" fill="none" strokeLinecap="round" />
              {/* Pivot dot */}
              <circle cx="320" cy="80" r="3.4" fill="var(--fork)" />
            </svg>
          </div>
        </Reveal>

        {/* Three paths as cards, visibly placed at the diverging ends. */}
        <div className="fork-grid" style={{ marginTop: "clamp(1rem, 2vw, 2rem)" }}>
          {beat.paths.map((path, i) => (
            <Reveal key={path.slug} delay={0.32 + i * 0.12} className="fork-card">
              <article aria-labelledby={`fork-${path.slug}`} style={{ height: "100%" }}>
                <div className="fork-card__inner">
                  <span className="kicker" style={{ color: i === 1 ? "var(--text-3)" : "var(--fg)" }}>
                    Path {i + 1}
                  </span>
                  <h3
                    id={`fork-${path.slug}`}
                    style={{
                      fontFamily: "var(--font-display-src), serif",
                      fontSize: "clamp(2rem, 3.2vw, 2.5rem)",
                      lineHeight: 1.05,
                      letterSpacing: "-0.018em",
                      marginTop: "0.6rem",
                      color: i === 0 ? "var(--fg)" : i === 1 ? "var(--text-2)" : "var(--fork)",
                    }}
                  >
                    {path.label}.
                  </h3>
                  <p style={{ marginTop: "0.75rem", color: "var(--text-2)", fontStyle: "italic" }}>
                    {path.posture}
                  </p>
                  <p style={{ marginTop: "0.85rem", color: "var(--text-2)" }}>{path.body}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>

      <style>{`
        .fork-grid {
          display: grid;
          gap: clamp(1rem, 2vw, 1.5rem);
          grid-template-columns: 1fr;
        }
        @media (min-width: 880px) {
          .fork-grid { grid-template-columns: repeat(3, 1fr); }
        }
        .fork-card {
          position: relative;
        }
        .fork-card__inner {
          height: 100%;
          padding: 1.5rem 1.5rem 1.75rem;
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          background: linear-gradient(180deg, rgba(244,241,234,0.025), rgba(244,241,234,0));
          transition: border-color var(--dur-base) var(--ease-out), transform var(--dur-base) var(--ease-out), background var(--dur-base) var(--ease-out);
        }
        .fork-card:hover .fork-card__inner {
          border-color: var(--border-strong);
          transform: translateY(-2px);
          background: linear-gradient(180deg, rgba(244,241,234,0.05), rgba(244,241,234,0));
        }
      `}</style>
    </SectionShell>
  );
}
