"use client";

import { useEffect, useRef } from "react";
import { track } from "@/lib/analytics";

/**
 * Fires the four PRD-required manifesto scroll-depth events
 * exactly once per page load: 25, 50, 75, 100.
 * Throttled to one read per animation frame.
 */
export function ScrollDepth() {
  const fired = useRef<Set<25 | 50 | 75 | 100>>(new Set());

  useEffect(() => {
    let scheduled = false;
    const onScroll = () => {
      if (scheduled) return;
      scheduled = true;
      requestAnimationFrame(() => {
        scheduled = false;
        const doc = document.documentElement;
        const max = doc.scrollHeight - window.innerHeight;
        if (max <= 0) return;
        const depth = Math.min(100, Math.max(0, (window.scrollY / max) * 100));
        ([25, 50, 75, 100] as const).forEach((mark) => {
          if (depth >= mark && !fired.current.has(mark)) {
            fired.current.add(mark);
            track({ name: "manifesto_scroll_depth", depth: mark });
          }
        });
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return null;
}
