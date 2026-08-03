"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  as?: "div" | "section" | "article" | "header" | "p" | "span" | "li" | "ul";
  className?: string;
  /** Stagger delay in seconds. */
  delay?: number;
  /** Intersection threshold (0..1). Default 0.15. */
  threshold?: number;
  /** Once revealed, stay revealed. Default true. */
  once?: boolean;
};

/**
 * Adds `.is-in` to the wrapped element when it enters the viewport.
 * `.reveal` CSS (in globals.css) handles fade/translate and reduced-motion fallback.
 */
export function Reveal({
  children,
  as: Tag = "div",
  className,
  delay = 0,
  threshold = 0.15,
  once = true,
}: Props) {
  const ref = useRef<HTMLElement | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setInView(false);
        }
      },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [once, threshold]);

  const cls = ["reveal", inView ? "is-in" : "", className].filter(Boolean).join(" ");
  const style = delay ? { transitionDelay: `${delay}s` } : undefined;

  // @ts-expect-error -- dynamic tag works at runtime
  return <Tag ref={ref} className={cls} style={style}>{children}</Tag>;
}
