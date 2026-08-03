import { manifesto } from "@/content/manifesto";
import { SectionShell } from "@/components/content/SectionShell";
import { Kicker } from "@/components/content/Kicker";
import { Reveal } from "./Reveal";

export function TwoStories() {
  const beat = manifesto.twoStories;
  return (
    <SectionShell id="two-stories" variant="full">
      <div style={{ width: "100%" }}>
        <Reveal>
          <Kicker>{beat.kicker}</Kicker>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="display-2" style={{ marginTop: "1.25rem", maxWidth: "20ch" }}>
            {beat.title}
          </h2>
        </Reveal>
        <Reveal delay={0.12}>
          <p className="lede" style={{ marginTop: "1.25rem", maxWidth: "44ch", color: "var(--text-2)" }}>
            {beat.lede}
          </p>
        </Reveal>

        <div className="two-stories__grid" style={{ marginTop: "clamp(2.5rem, 5vw, 4.5rem)" }}>
          {beat.panels.map((panel, i) => (
            <Reveal
              key={panel.label}
              delay={0.18 + i * 0.12}
              className={`two-stories__panel two-stories__panel--${i === 0 ? "a" : "b"}`}
            >
              <div className="two-stories__panel-inner">
                <span className="kicker" style={{ color: i === 0 ? "var(--text-2)" : "var(--fork)" }}>
                  {panel.label}
                </span>
                <p className="display-2" style={{ marginTop: "0.75rem", fontSize: "clamp(1.5rem, 2.6vw, 2rem)", lineHeight: 1.18 }}>
                  {panel.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      <style>{`
        .two-stories__grid {
          display: grid;
          gap: clamp(2rem, 4vw, 3rem);
          grid-template-columns: 1fr;
          align-items: stretch;
          position: relative;
        }
        .two-stories__panel-inner { padding-block: 0.5rem; }
        @media (min-width: 880px) {
          .two-stories__grid {
            grid-template-columns: 1fr 1fr;
            gap: clamp(3rem, 6vw, 5rem);
          }
          .two-stories__grid::before {
            content: "";
            position: absolute;
            left: 50%;
            top: 5%;
            bottom: 5%;
            width: 1px;
            transform: translateX(-50%);
            background: linear-gradient(to bottom, transparent, var(--border-strong) 30%, var(--border-strong) 70%, transparent);
            pointer-events: none;
          }
          .two-stories__panel--a { grid-column: 1; }
          .two-stories__panel--b { grid-column: 2; }
        }
      `}</style>
    </SectionShell>
  );
}
