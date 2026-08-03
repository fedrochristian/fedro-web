"use client";

import { useState } from "react";

export function CopyLinkClient({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(url);
          setCopied(true);
          setTimeout(() => setCopied(false), 1600);
        } catch {
          // ignored — fallback is the visible URL in the address bar
        }
      }}
      style={{
        background: "transparent",
        border: 0,
        padding: 0,
        cursor: "pointer",
        color: copied ? "var(--fg)" : "var(--text-2)",
        fontSize: "var(--text-sm)",
        fontFamily: "inherit",
      }}
    >
      {copied ? "Copied" : "Copy link"}
    </button>
  );
}
