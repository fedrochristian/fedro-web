type Props = {
  abundance: string;
  catastrophe: string;
  /** Optional label overrides. Default "Abundance" and "Catastrophe". */
  label1?: string;
  label2?: string;
};

/**
 * The "two horizons" frame — abundance vs. catastrophe shown side-by-side
 * (PRD §7.5). Mirrors the landing's Two Stories visual at the essay scale.
 *
 * Accepts plain string props for MDX reliability (JSX fragment values in
 * MDX attributes can fail to bind cleanly across compilers).
 */
export function TwoHorizons({
  abundance,
  catastrophe,
  label1 = "Abundance",
  label2 = "Catastrophe",
}: Props) {
  return (
    <section className="two-horizons" style={{ margin: "2.5rem 0" }}>
      <div className="two-horizons__grid">
        <div>
          <p className="kicker" style={{ color: "var(--text-2)" }}>{label1}</p>
          <p style={{ marginTop: "0.55rem", color: "var(--text-1)" }}>{abundance}</p>
        </div>
        <div>
          <p className="kicker" style={{ color: "var(--fork)" }}>{label2}</p>
          <p style={{ marginTop: "0.55rem", color: "var(--text-1)" }}>{catastrophe}</p>
        </div>
      </div>
      <style>{`
        .two-horizons__grid {
          display: grid;
          gap: clamp(1.5rem, 3vw, 2.5rem);
          grid-template-columns: 1fr;
          padding-block: 1.5rem;
          border-top: 1px solid var(--border);
          border-bottom: 1px solid var(--border);
          position: relative;
        }
        @media (min-width: 720px) {
          .two-horizons__grid {
            grid-template-columns: 1fr 1fr;
          }
          .two-horizons__grid::before {
            content: "";
            position: absolute;
            top: 1.5rem;
            bottom: 1.5rem;
            left: 50%;
            width: 1px;
            background: var(--border);
            transform: translateX(-50%);
          }
        }
      `}</style>
    </section>
  );
}
