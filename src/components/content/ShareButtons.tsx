import { CopyLinkClient } from "./CopyLinkClient";

type Props = { url: string; title: string };

/**
 * Static share controls — no third-party scripts, no cookie banner.
 * X intent URL, mailto, and a clipboard "Copy link" handled by the client child.
 */
export function ShareButtons({ url, title }: Props) {
  const enc = encodeURIComponent;
  const xUrl = `https://x.com/intent/tweet?text=${enc(title)}&url=${enc(url)}`;
  const mailtoUrl = `mailto:?subject=${enc(title)}&body=${enc(url)}`;

  const linkStyle: React.CSSProperties = {
    color: "var(--text-2)",
    fontSize: "var(--text-sm)",
    transition: "color 160ms ease",
  };

  return (
    <nav
      aria-label="Share"
      style={{
        display: "inline-flex",
        gap: "1.25rem",
        alignItems: "center",
        paddingBlock: "1.25rem",
        borderTop: "1px solid var(--border)",
        borderBottom: "1px solid var(--border)",
        width: "100%",
      }}
    >
      <span className="kicker" style={{ color: "var(--text-3)" }}>Share</span>
      <a href={xUrl} target="_blank" rel="noopener noreferrer" style={linkStyle}>
        X
      </a>
      <a href={mailtoUrl} style={linkStyle}>
        Email
      </a>
      <CopyLinkClient url={url} />
    </nav>
  );
}
