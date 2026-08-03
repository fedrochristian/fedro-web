import { manifesto } from "@/content/manifesto";
import { SectionShell } from "@/components/content/SectionShell";
import { Kicker } from "@/components/content/Kicker";
import { Reveal } from "./Reveal";
import { BackgroundImage } from "./BackgroundImage";

export function AtYourDoor() {
  const beat = manifesto.atYourDoor;
  return (
    <SectionShell
      id="at-your-door"
      variant="full"
      background={
        <BackgroundImage
          src="/images/manifesto/personal-arrival.jpg"
          alt=""
          overlay="personal"
          position="70% 40%"
        />
      }
    >
      <div className="atd__grid">
        <div>
          <Reveal>
            <Kicker>{beat.kicker}</Kicker>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="display-2" style={{ marginTop: "1.25rem", maxWidth: "18ch" }}>
              {beat.title}
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="lede" style={{ marginTop: "1.5rem", maxWidth: "48ch" }}>
              {beat.body}
            </p>
          </Reveal>
        </div>

        <ul
          aria-label="What it asks of you"
          style={{
            display: "grid",
            gap: "0.4rem",
            maxWidth: "32ch",
            marginTop: "clamp(1rem, 2vw, 2rem)",
            borderLeft: "1px solid var(--border-strong)",
            paddingLeft: "1.25rem",
          }}
        >
          {beat.stakes.map((stake, i) => (
            <Reveal key={stake} as="li" delay={0.2 + i * 0.07}>
              <span
                style={{
                  fontFamily: "var(--font-display-src), serif",
                  fontSize: "clamp(1.5rem, 2.4vw, 2rem)",
                  lineHeight: 1.18,
                  color: "var(--fg)",
                  letterSpacing: "-0.01em",
                }}
              >
                {stake}.
              </span>
            </Reveal>
          ))}
        </ul>
      </div>

      <style>{`
        .atd__grid {
          width: 100%;
          display: grid;
          gap: clamp(2rem, 4vw, 3.5rem);
          grid-template-columns: 1fr;
        }
        @media (min-width: 880px) {
          .atd__grid {
            grid-template-columns: 1.2fr 1fr;
            align-items: end;
          }
        }
      `}</style>
    </SectionShell>
  );
}
