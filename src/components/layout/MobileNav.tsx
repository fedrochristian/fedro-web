"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { site } from "@/content/site";

export function MobileNav() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        aria-expanded={open}
        aria-controls="mobile-nav-panel"
        onClick={() => setOpen((x) => !x)}
        style={{
          background: "transparent",
          border: 0,
          color: "var(--fg)",
          padding: "0.5rem",
          cursor: "pointer",
          display: "inline-flex",
        }}
        className="md:!hidden"
      >
        <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
        <svg
          viewBox="0 0 24 24"
          width={22}
          height={22}
          fill="none"
          stroke="currentColor"
          strokeWidth={1.6}
          strokeLinecap="round"
        >
          {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 8h16M4 16h16" />}
        </svg>
      </button>

      {open ? (
        <div
          id="mobile-nav-panel"
          role="dialog"
          aria-modal="true"
          aria-label="Site navigation"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 50,
            background: "var(--bg)",
            display: "flex",
            flexDirection: "column",
            padding: "var(--space-7) var(--edge)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              style={{
                background: "transparent",
                border: 0,
                color: "var(--fg)",
                padding: "0.5rem",
                cursor: "pointer",
              }}
            >
              <svg viewBox="0 0 24 24" width={24} height={24} fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>
          <nav
            aria-label="Primary mobile"
            style={{ display: "flex", flexDirection: "column", gap: "1rem", marginTop: "auto", marginBottom: "auto" }}
          >
            {site.nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "2rem",
                  color: "var(--fg)",
                }}
              >
                {item.label}
              </Link>
            ))}
            <a
              href={site.followHref}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "2rem",
                color: "var(--text-2)",
              }}
            >
              Follow
            </a>
          </nav>
        </div>
      ) : null}
    </>
  );
}
