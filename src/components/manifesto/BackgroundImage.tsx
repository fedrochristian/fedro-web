type Overlay = "cosmic" | "personal" | "burden" | "fade";

type Props = {
  src: string;
  alt: string;
  overlay?: Overlay;
  /** Eager-load when above the fold; otherwise lazy. Default lazy. */
  priority?: boolean;
  /** Object-position fine-tuning ("50% 50%" by default). */
  position?: string;
};

const OVERLAYS: Record<Overlay, string> = {
  // Bottom-heavy: lets the cosmic field breathe up top, dims at the foot.
  cosmic:
    "linear-gradient(180deg, rgba(5,5,5,0.55) 0%, rgba(5,5,5,0.30) 35%, rgba(5,5,5,0.55) 65%, rgba(5,5,5,0.90) 100%)",
  // Left-anchored: type lives on the left, image breathes on the right.
  personal:
    "linear-gradient(90deg, rgba(5,5,5,0.92) 0%, rgba(5,5,5,0.72) 30%, rgba(5,5,5,0.35) 55%, rgba(5,5,5,0.10) 80%), linear-gradient(180deg, rgba(5,5,5,0.0) 60%, rgba(5,5,5,0.85) 100%)",
  // Doorway: warm halo stays, type sits on left.
  burden:
    "linear-gradient(90deg, rgba(5,5,5,0.95) 0%, rgba(5,5,5,0.78) 35%, rgba(5,5,5,0.42) 60%, rgba(5,5,5,0.18) 85%), linear-gradient(180deg, rgba(5,5,5,0.0) 55%, rgba(5,5,5,0.90) 100%)",
  // Generic full-bleed dim with bottom fade into the next section.
  fade:
    "linear-gradient(180deg, rgba(5,5,5,0.6) 0%, rgba(5,5,5,0.4) 50%, rgba(5,5,5,0.95) 100%)",
};

/**
 * Full-bleed background image with a typed dark-overlay gradient.
 * Sits behind a SectionShell — the section needs `position: relative`
 * and content needs to be z-stacked above (handled by SectionShell's
 * `.container` z-index).
 *
 * Reduced-motion safe: no animation. Just a layered <img> + overlay.
 */
export function BackgroundImage({
  src,
  alt,
  overlay = "fade",
  priority = false,
  position = "50% 50%",
}: Props) {
  return (
    <div
      aria-hidden={alt ? undefined : true}
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        zIndex: 0,
        pointerEvents: "none",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: position,
          display: "block",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: OVERLAYS[overlay],
        }}
      />
    </div>
  );
}
