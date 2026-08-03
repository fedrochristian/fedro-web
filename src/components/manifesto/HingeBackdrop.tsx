"use client";

import { useEffect, useRef } from "react";

type Props = {
  /** Number of stars at desktop. Scaled down on mobile. Default 220. */
  density?: number;
  /** Position of the "hinge" pulse as fractions [x, y]. Default upper-right. */
  hinge?: [number, number];
};

/**
 * A procedural cinematic backdrop for the Hinge beat.
 *
 * Reads as a slow, near-black field of stars with one larger pulsing point
 * positioned where the exponential curve turns upward — the "hinge." No
 * video file, ~0 KB on the wire. Honors `prefers-reduced-motion` by drawing
 * a single static frame and skipping the animation loop.
 *
 * Layered under the existing overlay gradient; the gradient handles type
 * contrast so the canvas can stay subtle.
 */
export function HingeBackdrop({ density = 220, hinge = [0.82, 0.34] }: Props) {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    // --- Sizing ---
    let width = 0;
    let height = 0;
    let dpr = 1;

    function resize() {
      const parent = canvas!.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas!.width = Math.round(width * dpr);
      canvas!.height = Math.round(height * dpr);
      canvas!.style.width = `${width}px`;
      canvas!.style.height = `${height}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    // --- Star field ---
    const isMobile = window.matchMedia("(max-width: 720px)").matches;
    const starCount = isMobile ? Math.round(density * 0.55) : density;
    type Star = {
      x: number; y: number;
      r: number;          // base radius
      a: number;          // base alpha
      tw: number;         // twinkle rate
      phase: number;      // twinkle phase
    };
    let stars: Star[] = [];

    function seed() {
      stars = Array.from({ length: starCount }, () => ({
        x: Math.random(),
        y: Math.random(),
        r: Math.random() < 0.92 ? Math.random() * 0.9 + 0.25 : Math.random() * 1.6 + 0.8,
        a: Math.random() * 0.55 + 0.2,
        tw: Math.random() * 0.6 + 0.25,
        phase: Math.random() * Math.PI * 2,
      }));
    }

    // --- Render ---
    function draw(t: number) {
      if (!ctx) return;
      // Background — near-black with a very faint cool wash
      ctx.fillStyle = "#050505";
      ctx.fillRect(0, 0, width, height);

      // Stars
      for (const s of stars) {
        const tw = reduced ? 1 : 0.55 + 0.45 * Math.sin(t * 0.0009 * s.tw + s.phase);
        ctx.globalAlpha = s.a * tw;
        ctx.fillStyle = "#f4f1ea";
        ctx.beginPath();
        ctx.arc(s.x * width, s.y * height, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      // Single bright point — "the hinge"
      const hx = hinge[0] * width;
      const hy = hinge[1] * height;
      const pulse = reduced ? 1 : 0.78 + 0.22 * Math.sin(t * 0.0014);
      const haloR = 60 * pulse;
      const grad = ctx.createRadialGradient(hx, hy, 0, hx, hy, haloR);
      grad.addColorStop(0, "rgba(244, 241, 234, 0.85)");
      grad.addColorStop(0.18, "rgba(244, 241, 234, 0.28)");
      grad.addColorStop(0.55, "rgba(244, 241, 234, 0.06)");
      grad.addColorStop(1, "rgba(244, 241, 234, 0)");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(hx, hy, haloR, 0, Math.PI * 2);
      ctx.fill();

      // Bright core
      ctx.fillStyle = "#fff";
      ctx.beginPath();
      ctx.arc(hx, hy, 1.4 * pulse + 0.6, 0, Math.PI * 2);
      ctx.fill();
    }

    resize();
    seed();

    let raf = 0;
    let running = true;

    const onResize = () => {
      resize();
      seed();
      draw(performance.now());
    };

    const onVisibility = () => {
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(raf);
      } else if (!reduced) {
        running = true;
        raf = requestAnimationFrame(loop);
      }
    };

    function loop(t: number) {
      if (!running) return;
      draw(t);
      raf = requestAnimationFrame(loop);
    }

    window.addEventListener("resize", onResize, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);

    if (reduced) {
      draw(0);
    } else {
      raf = requestAnimationFrame(loop);
    }

    return () => {
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
      cancelAnimationFrame(raf);
    };
  }, [density, hinge]);

  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 0,
        background: "#050505",
        pointerEvents: "none",
      }}
    >
      <canvas
        ref={ref}
        style={{
          display: "block",
          width: "100%",
          height: "100%",
        }}
      />
      {/* Same overlay shape as the cosmic preset so type contrast is preserved */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(5,5,5,0.30) 0%, rgba(5,5,5,0.20) 35%, rgba(5,5,5,0.40) 65%, rgba(5,5,5,0.92) 100%)",
        }}
      />
    </div>
  );
}
