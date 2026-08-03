import { manifesto } from "@/content/manifesto";
import { SectionShell } from "@/components/content/SectionShell";
import { Kicker } from "@/components/content/Kicker";
import { Reveal } from "./Reveal";
import { BackgroundImage } from "./BackgroundImage";

export function Burden() {
  const beat = manifesto.burden;
  return (
    <SectionShell
      id="burden"
      variant="full"
      background={
        <BackgroundImage
          src="/images/manifesto/burden.jpg"
          alt=""
          overlay="burden"
          position="75% 50%"
        />
      }
    >
      <div style={{ width: "100%", maxWidth: "62rem" }}>
        <Reveal>
          <Kicker>{beat.kicker}</Kicker>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="display-2" style={{ marginTop: "1.25rem" }}>
            {beat.title}
          </h2>
        </Reveal>
        <Reveal delay={0.15}>
          <p
            className="lede"
            style={{ marginTop: "1.75rem", maxWidth: "56ch", color: "var(--text-2)" }}
          >
            {beat.body}
          </p>
        </Reveal>

        {/* A soft, dim glow — gestures at "the comfort machine" without spelling it out. */}
        <Reveal delay={0.3} className="burden__glow">
          <div aria-hidden="true" style={{ marginTop: "clamp(2.5rem, 5vw, 4rem)" }}>
            <svg viewBox="0 0 600 120" width="100%" style={{ maxWidth: "44rem", height: "auto" }}>
              <defs>
                <radialGradient id="burden-glow" cx="50%" cy="100%" r="80%">
                  <stop offset="0%" stopColor="rgba(217,113,73,0.34)" />
                  <stop offset="60%" stopColor="rgba(217,113,73,0.06)" />
                  <stop offset="100%" stopColor="rgba(217,113,73,0)" />
                </radialGradient>
              </defs>
              <rect x="0" y="0" width="600" height="120" fill="url(#burden-glow)" />
              <line x1="0" y1="118" x2="600" y2="118" stroke="rgba(244,241,234,0.18)" strokeWidth="1" />
            </svg>
          </div>
        </Reveal>
      </div>
    </SectionShell>
  );
}
