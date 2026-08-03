import { SectionShell } from "@/components/content/SectionShell";
import { Kicker } from "@/components/content/Kicker";
import { site } from "@/content/site";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Legal",
  description: "Ownership, privacy, and contact placeholders for 3X Media.",
  path: "/legal",
});

export default function LegalPage() {
  return (
    <SectionShell>
      <div className="prose-container prose" style={{ padding: 0 }}>
        <Kicker>Legal</Kicker>
        <h1 className="display-2" style={{ marginTop: "1rem" }}>Legal & privacy</h1>

        <h2>Ownership</h2>
        <p>
          {site.name} is published by {site.name}. All written content is &copy;{" "}
          {new Date().getFullYear()} {site.name} unless otherwise noted.
        </p>

        <h2>Privacy</h2>
        <p>
          v1 uses privacy-friendly analytics for aggregate page and event counts only.
          No cross-site tracking. No personal identifiers stored. No cookie banner required.
        </p>

        <h2>Contact & follow</h2>
        <p>
          The site does not collect email addresses in v1. Follow updates on{" "}
          <a href={site.socials.youtube} target="_blank" rel="noopener noreferrer">YouTube</a>{" "}
          or <a href={site.socials.x} target="_blank" rel="noopener noreferrer">X</a>.
        </p>
      </div>
    </SectionShell>
  );
}
