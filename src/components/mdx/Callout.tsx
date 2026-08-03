import { ForkGlyph } from "@/components/content/ForkGlyph";
import type { ReactNode } from "react";

type Tone = "default" | "warn" | "fork";

type Props = {
  children: ReactNode;
  title?: string;
  tone?: Tone;
};

const ACCENT: Record<Tone, string> = {
  default: "var(--border-strong)",
  warn: "#d2a06a",
  fork: "var(--fork)",
};

export function Callout({ children, title, tone = "default" }: Props) {
  return (
    <aside
      role="note"
      style={{
        margin: "2rem 0",
        padding: "1.1rem 1.35rem",
        background: "var(--bg-2)",
        border: "1px solid var(--border)",
        borderLeft: `2px solid ${ACCENT[tone]}`,
        borderRadius: "var(--radius)",
      }}
    >
      {title ? (
        <p
          className="kicker"
          style={{
            marginBottom: "0.4rem",
            color: tone === "fork" ? "var(--fork)" : "var(--text-3)",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.45em",
          }}
        >
          {tone === "fork" ? <ForkGlyph /> : null}
          {title}
        </p>
      ) : null}
      <div style={{ color: "var(--text-2)" }}>{children}</div>
    </aside>
  );
}
