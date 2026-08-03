import Link from "next/link";
import { SectionShell } from "@/components/content/SectionShell";
import { ForkGlyph } from "@/components/content/ForkGlyph";

export default function NotFound() {
  return (
    <SectionShell variant="full">
      <div style={{ maxWidth: "44rem" }}>
        <p className="kicker">404</p>
        <h1 className="display-1" style={{ marginTop: "1rem" }}>
          That path doesn&apos;t&nbsp;exist.
        </h1>
        <p className="lede" style={{ marginTop: "1.5rem", color: "var(--text-2)" }}>
          Embrace, ignore, fight — but pick a real route.
        </p>
        <p style={{ display: "inline-flex", gap: "1.25rem", alignItems: "center", marginTop: "2rem" }}>
          <Link className="cta cta--primary" href="/">Home</Link>
          <Link className="cta cta--secondary" href="/essays">
            Essays <ForkGlyph />
          </Link>
        </p>
      </div>
    </SectionShell>
  );
}
