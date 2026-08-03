type Props = {
  id: string;
  title: string;
};

/**
 * Privacy-friendly lazy YouTube embed: ships only the poster + a play affordance
 * until clicked. On click the user navigates to YouTube directly (outbound),
 * which avoids loading the YouTube player iframe in the article view.
 *
 * For a true in-place expand-on-click iframe, switch to a small client component;
 * the static link form is fastest and the Watch hub holds the player-style cards.
 */
export function YouTubeEmbed({ id, title }: Props) {
  const url = `https://www.youtube.com/watch?v=${id}`;
  const poster = `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`;
  return (
    <figure style={{ margin: "2.25rem 0" }}>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Watch on YouTube: ${title}`}
        style={{
          position: "relative",
          display: "block",
          aspectRatio: "16 / 9",
          borderRadius: "var(--radius)",
          overflow: "hidden",
          border: "1px solid var(--border)",
          background: "var(--bg-2)",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={poster}
          alt={title}
          loading="lazy"
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />
        <span
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            display: "grid",
            placeItems: "center",
            background:
              "radial-gradient(closest-side at 50% 50%, rgba(0,0,0,0.35), rgba(0,0,0,0) 70%)",
          }}
        >
          <span
            style={{
              width: 64,
              height: 64,
              borderRadius: "999px",
              background: "rgba(244,241,234,0.92)",
              color: "var(--bg)",
              display: "grid",
              placeItems: "center",
            }}
          >
            <svg viewBox="0 0 24 24" width={24} height={24} aria-hidden="true">
              <path d="M8 6.2v11.6L18.2 12 8 6.2z" fill="currentColor" />
            </svg>
          </span>
        </span>
      </a>
      <figcaption className="kicker" style={{ marginTop: "0.7rem", color: "var(--text-3)" }}>
        Video — {title}
      </figcaption>
    </figure>
  );
}
