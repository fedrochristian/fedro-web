import { manifesto } from "@/content/manifesto";
import { SectionShell } from "@/components/content/SectionShell";
import { Kicker } from "@/components/content/Kicker";
import { CTALink } from "@/components/content/CTAButton";
import { ForkGlyph } from "@/components/content/ForkGlyph";
import { site } from "@/content/site";
import { Reveal } from "./Reveal";

export function FinalCTA() {
  const beat = manifesto.handBack;
  return (
    <SectionShell id="hand-back" variant="full">
      <div style={{ width: "100%", maxWidth: "60rem" }}>
        <Reveal>
          <Kicker>{beat.kicker}</Kicker>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="display-2" style={{ marginTop: "1.25rem", maxWidth: "22ch" }}>
            {beat.title}
          </h2>
        </Reveal>
        <Reveal delay={0.14}>
          <p className="lede" style={{ marginTop: "1.5rem", maxWidth: "48ch", color: "var(--text-2)" }}>
            {beat.body}
          </p>
        </Reveal>
        <Reveal delay={0.24}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", marginTop: "2.5rem" }}>
            <CTALink href="/essays" variant="primary">Read the essays</CTALink>
            <CTALink href="/watch" variant="secondary">Watch</CTALink>
            <CTALink href={site.followHref} external variant="ghost">Follow</CTALink>
          </div>
        </Reveal>
        <Reveal delay={0.36}>
          <p
            style={{
              marginTop: "3.5rem",
              color: "var(--text-3)",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.6em",
              fontSize: "var(--text-sm)",
            }}
          >
            <ForkGlyph ariaLabel="The fork" />
            Embrace · Ignore · Fight.
          </p>
        </Reveal>
      </div>
    </SectionShell>
  );
}
