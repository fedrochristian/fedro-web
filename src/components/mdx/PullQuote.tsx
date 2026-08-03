import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  cite?: string;
};

export function PullQuote({ children, cite }: Props) {
  return (
    <figure style={{ margin: "2.5rem 0", padding: "0", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
      <blockquote
        style={{
          margin: 0,
          padding: "2rem 0",
          fontFamily: "var(--font-display-src), serif",
          fontSize: "clamp(1.5rem, 2.6vw, 2rem)",
          lineHeight: 1.18,
          letterSpacing: "-0.012em",
          color: "var(--fg)",
          textWrap: "balance",
        }}
      >
        {children}
      </blockquote>
      {cite ? (
        <figcaption className="kicker" style={{ paddingBottom: "1rem", color: "var(--text-3)" }}>
          — {cite}
        </figcaption>
      ) : null}
    </figure>
  );
}
