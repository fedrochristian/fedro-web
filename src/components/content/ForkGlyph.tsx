type Props = {
  /** Render size as `em` so it scales with surrounding text. Default 1em. */
  size?: number | string;
  className?: string;
  ariaLabel?: string;
};

/**
 * The fork — signature motif. Three paths diverging from a single trunk:
 * Embrace (up-left), Ignore (straight), Fight (down-left).
 * Used in nav hover, footer, pillar cards, section dividers.
 */
export function ForkGlyph({ size = "1em", className, ariaLabel }: Props) {
  return (
    <svg
      className={`fork-glyph ${className ?? ""}`.trim()}
      viewBox="0 0 24 24"
      width={size}
      height={size}
      role={ariaLabel ? "img" : undefined}
      aria-label={ariaLabel}
      aria-hidden={ariaLabel ? undefined : true}
    >
      {/* Trunk in from right */}
      <path d="M22 12 H13" />
      {/* Three diverging paths */}
      <path d="M13 12 L4 4" />
      <path d="M13 12 L2 12" />
      <path d="M13 12 L4 20" />
    </svg>
  );
}
