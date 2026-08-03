import Link from "next/link";
import { site } from "@/content/site";
import { MobileNav } from "./MobileNav";

export function Header() {
  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link href="/" aria-label={`${site.name} home`} className="site-header__brand">
          <Wordmark />
        </Link>
        <nav className="site-header__nav" aria-label="Primary">
          {site.nav.map((item) => (
            <Link key={item.href} href={item.href} className="site-header__link">
              {item.label}
            </Link>
          ))}
          <a
            href={site.followHref}
            target="_blank"
            rel="noopener noreferrer"
            className="site-header__link"
          >
            Follow
          </a>
        </nav>
        <MobileNav />
      </div>
    </header>
  );
}

/** Wordmark: severe, set in display face. The "3X" carries the brand. */
function Wordmark() {
  return (
    <span
      style={{
        fontFamily: "var(--font-display)",
        fontWeight: 500,
        fontSize: "1.0625rem",
        letterSpacing: "-0.01em",
        color: "var(--fg)",
      }}
    >
      3X<span style={{ color: "var(--text-3)", marginLeft: "0.4em" }}>Media</span>
    </span>
  );
}
