import { SectionShell } from "@/components/content/SectionShell";
import { Kicker } from "@/components/content/Kicker";
import { pillars } from "@/content/pillars";
import { ForkGlyph } from "@/components/content/ForkGlyph";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "About",
  description: "The thesis, the three exponents, and the choice frame.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <>
      <SectionShell as="header">
        <Kicker>About</Kicker>
        <h1 className="display-2" style={{ marginTop: "1rem", maxWidth: "22ch" }}>
          Technology goes exponential. Structure changes. The self must&nbsp;choose.
        </h1>
        <p className="lede" style={{ marginTop: "1.25rem", maxWidth: "48ch" }}>
          3X Media is a publication for the tipping point. We hold the tension — abundance,
          catastrophe, and the long strange middle — rather than sell a single future.
        </p>
      </SectionShell>

      <SectionShell variant="tight">
        <h2 className="h2">The three exponents</h2>
        <div style={{ marginTop: "2rem", display: "grid", gap: "var(--space-6)" }}>
          {pillars.map((p) => (
            <article
              key={p.slug}
              style={{
                borderTop: "1px solid var(--border)",
                paddingTop: "var(--space-5)",
                display: "grid",
                gridTemplateColumns: "minmax(0, 16ch) 1fr",
                gap: "var(--space-5)",
              }}
            >
              <div>
                <p className="kicker">{p.exponent}</p>
                <h3 className="h3" style={{ marginTop: "0.5rem" }}>{p.title}</h3>
              </div>
              <div>
                <p style={{ color: "var(--text-2)" }}>{p.description}</p>
              </div>
            </article>
          ))}
        </div>
      </SectionShell>

      <SectionShell variant="tight">
        <h2 className="h2">The choice</h2>
        <p style={{ marginTop: "1.25rem", color: "var(--text-2)", maxWidth: "52ch" }}>
          The future is not a forecast you receive. It is a position you take.
        </p>
        <p
          style={{
            marginTop: "1.5rem",
            fontFamily: "var(--font-display)",
            fontSize: "var(--text-h2)",
            color: "var(--fg)",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5em",
          }}
        >
          Embrace <ForkGlyph ariaLabel="fork" /> Ignore · Fight.
        </p>
      </SectionShell>
    </>
  );
}
