type Props = {
  src: string;
  alt: string;
  caption?: string;
  /** Width/height in pixels — improves CLS. */
  width?: number;
  height?: number;
};

export function Figure({ src, alt, caption, width, height }: Props) {
  return (
    <figure style={{ margin: "2.25rem 0" }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading="lazy"
        style={{
          width: "100%",
          height: "auto",
          borderRadius: "var(--radius)",
          border: "1px solid var(--border)",
          background: "var(--bg-2)",
        }}
      />
      {caption ? (
        <figcaption
          style={{
            marginTop: "0.7rem",
            fontSize: "var(--text-sm)",
            color: "var(--text-3)",
            textAlign: "center",
          }}
        >
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
