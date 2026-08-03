import { manifesto } from "@/content/manifesto";
import { SectionShell } from "@/components/content/SectionShell";
import { Kicker } from "@/components/content/Kicker";
import { Reveal } from "./Reveal";
import { ExponentialCurve } from "./ExponentialCurve";
import { HingeBackdrop } from "./HingeBackdrop";

export function Hinge() {
  const beat = manifesto.hinge;
  return (
    <SectionShell
      id="hinge"
      variant="full"
      background={<HingeBackdrop />}
    >
      <div style={{ width: "100%" }}>
        <Reveal>
          <Kicker>{beat.kicker}</Kicker>
        </Reveal>
        <Reveal delay={0.05}>
          <h1 className="display-1" style={{ marginTop: "1.25rem", maxWidth: "18ch" }}>
            {beat.title}
          </h1>
        </Reveal>
        <div style={{ marginTop: "1.75rem", maxWidth: "52ch", display: "grid", gap: "0.9rem" }}>
          {beat.body.map((p, i) => (
            <Reveal key={i} delay={0.15 + i * 0.08} as="p">
              <span className="lede" style={{ display: "block" }}>{p}</span>
            </Reveal>
          ))}
        </div>
        <Reveal delay={0.35} className="curve-wrap" threshold={0.05}>
          <div style={{ marginTop: "clamp(3rem, 6vw, 5.5rem)" }}>
            <ExponentialCurve />
          </div>
        </Reveal>
      </div>
    </SectionShell>
  );
}
