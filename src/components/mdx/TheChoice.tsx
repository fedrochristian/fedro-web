import Link from "next/link";
import { ForkGlyph } from "@/components/content/ForkGlyph";

type Props = {
  /** The closer question or framing. */
  prompt: string;
  /** Optional one-line postures for each path. */
  embrace?: string;
  ignore?: string;
  fight?: string;
};

/**
 * The signature essay closer — hands the choice back to the reader.
 * Used at the end of essays (per PRD §7.3 optional theChoice field).
 */
export function TheChoice({ prompt, embrace, ignore, fight }: Props) {
  const paths = [
    { label: "Embrace", body: embrace, accent: "var(--fg)" },
    { label: "Ignore", body: ignore, accent: "var(--text-3)" },
    { label: "Fight", body: fight, accent: "var(--fork)" },
  ];
  return (
    <section
      aria-label="The Choice"
      style={{
        margin: "3rem 0 2rem",
        padding: "2rem 0 1.5rem",
        borderTop: "1px solid var(--border-strong)",
      }}
    >
      <p
        className="kicker"
        style={{ display: "inline-flex", alignItems: "center", gap: "0.5em", color: "var(--text-2)" }}
      >
        <ForkGlyph /> The Choice
      </p>
      <p
        style={{
          marginTop: "1rem",
          fontFamily: "var(--font-display-src), serif",
          fontSize: "clamp(1.4rem, 2.4vw, 1.85rem)",
          lineHeight: 1.18,
          letterSpacing: "-0.012em",
          color: "var(--fg)",
          textWrap: "balance",
        }}
      >
        {prompt}
      </p>

      <ul
        className="the-choice__paths"
        style={{ marginTop: "1.5rem", display: "grid", gap: "0.75rem" }}
      >
        {paths.map((p) => (
          <li
            key={p.label}
            style={{
              display: "grid",
              gridTemplateColumns: "5.5rem 1fr",
              alignItems: "baseline",
              gap: "1rem",
              paddingBlock: "0.5rem",
              borderTop: "1px solid var(--border)",
            }}
          >
            <span
              className="kicker"
              style={{ color: p.accent, fontSize: "var(--text-xs)", letterSpacing: "0.14em" }}
            >
              {p.label}
            </span>
            <span style={{ color: "var(--text-2)" }}>{p.body || "—"}</span>
          </li>
        ))}
      </ul>

      <p style={{ marginTop: "1.5rem", color: "var(--text-3)", fontSize: "var(--text-sm)" }}>
        Read further:{" "}
        <Link href="/pillars/the-reckoning" style={{ color: "var(--fg)", textDecoration: "underline", textDecorationColor: "var(--border-strong)" }}>
          The Reckoning
        </Link>
      </p>
    </section>
  );
}
