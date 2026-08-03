/**
 * Signature scale/vertigo visual: a curve that is flat for nearly all of
 * recorded human time, then turns vertical at the right edge. A single
 * silhouette stands at the foot. Required by PRD §7.1 design rules.
 *
 * The curve is drawn as two layered paths — the flat-and-rising line and
 * a softer underlay that fades into the background. Stroke draw-in is
 * triggered when the parent `.reveal` element gains `.is-in`.
 */
export function ExponentialCurve() {
  return (
    <figure
      aria-labelledby="curve-caption"
      style={{
        position: "relative",
        width: "100%",
        maxWidth: "min(82vw, 1080px)",
        margin: "0 auto",
      }}
    >
      <svg
        viewBox="0 0 1080 540"
        width="100%"
        role="img"
        aria-label="A curve flat for three hundred thousand years, then turning sharply upward."
        style={{ display: "block" }}
      >
        <defs>
          <linearGradient id="curve-stroke" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0%" stopColor="rgba(244,241,234,0.18)" />
            <stop offset="60%" stopColor="rgba(244,241,234,0.55)" />
            <stop offset="100%" stopColor="var(--fork)" />
          </linearGradient>
          <linearGradient id="curve-underlay" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0%" stopColor="rgba(244,241,234,0)" />
            <stop offset="100%" stopColor="rgba(217,113,73,0.18)" />
          </linearGradient>
        </defs>

        {/* Horizon */}
        <line
          x1="0" y1="460" x2="1080" y2="460"
          stroke="rgba(244,241,234,0.10)"
          strokeWidth="1"
          strokeDasharray="2 6"
        />

        {/* Time labels */}
        <text x="40" y="495" fill="rgba(244,241,234,0.32)" fontSize="11" letterSpacing="0.14em" fontFamily="var(--font-reading-src), sans-serif" style={{ textTransform: "uppercase" }}>
          300,000 years ago
        </text>
        <text x="1040" y="495" textAnchor="end" fill="rgba(244,241,234,0.32)" fontSize="11" letterSpacing="0.14em" fontFamily="var(--font-reading-src), sans-serif" style={{ textTransform: "uppercase" }}>
          Now
        </text>

        {/* Underlay (filled area) */}
        <path
          d="M 40 460
             L 880 458
             C 940 458 980 440 1010 380
             C 1030 320 1040 220 1050 80
             L 1050 460 Z"
          fill="url(#curve-underlay)"
          opacity="0.5"
        />

        {/* The curve */}
        <path
          className="curve-stroke"
          d="M 40 460
             L 880 458
             C 940 458 980 440 1010 380
             C 1030 320 1040 220 1050 80"
          fill="none"
          stroke="url(#curve-stroke)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          pathLength={1}
        />

        {/* Single human silhouette at the foot */}
        <g transform="translate(70 440)" fill="rgba(244,241,234,0.85)" aria-hidden="true">
          <circle cx="0" cy="-14" r="3.6" />
          <path d="M -3 -10 L -3 4 L 0 4 L 0 -2 L 3 4 L 6 4 L 6 -10 Z" opacity="0.9" />
        </g>

        {/* The hinge point — small mark where flat becomes vertical */}
        <circle cx="888" cy="458" r="3.2" fill="var(--fork)" />
        <text
          x="888"
          y="438"
          textAnchor="middle"
          fill="rgba(244,241,234,0.65)"
          fontSize="11"
          letterSpacing="0.14em"
          fontFamily="var(--font-reading-src), sans-serif"
          style={{ textTransform: "uppercase" }}
        >
          The tipping point
        </text>
      </svg>
      <figcaption id="curve-caption" className="sr-only">
        A flat line for three hundred thousand years. Then a sharp turn upward.
      </figcaption>

      <style>{`
        .curve-stroke {
          stroke-dasharray: 1;
          stroke-dashoffset: 1;
          transition: stroke-dashoffset 1600ms var(--ease-out, cubic-bezier(0.22, 1, 0.36, 1));
        }
        .reveal.is-in .curve-stroke { stroke-dashoffset: 0; }
        @media (prefers-reduced-motion: reduce) {
          .curve-stroke { stroke-dashoffset: 0; transition: none; }
        }
      `}</style>
    </figure>
  );
}
