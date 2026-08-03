/**
 * Privacy-friendly analytics event hook. v1 stub — wired to whichever
 * provider is chosen (Plausible / Umami / Vercel Analytics) in Step 7.
 *
 * Required events per PRD §11.3:
 *  - manifesto_scroll_depth     ({ depth: 25 | 50 | 75 | 100 })
 *  - manifesto_cta_click        ({ target })
 *  - essay_card_click           ({ slug, pillar })
 *  - video_outbound_click       ({ youtubeId, pillar })
 *  - follow_outbound_click      ({ target })
 *  - article_complete           ({ slug })
 */
export type AnalyticsEvent =
  | { name: "manifesto_scroll_depth"; depth: 25 | 50 | 75 | 100 }
  | { name: "manifesto_cta_click"; target: string }
  | { name: "essay_card_click"; slug: string; pillar: string }
  | { name: "video_outbound_click"; youtubeId: string; pillar: string }
  | { name: "follow_outbound_click"; target: string }
  | { name: "article_complete"; slug: string };

export function track(event: AnalyticsEvent): void {
  if (typeof window === "undefined") return;
  // Stub: forward to chosen provider once installed.
  // e.g. window.plausible?.(event.name, { props: event });
  if (process.env.NODE_ENV === "development") {
    // eslint-disable-next-line no-console
    console.debug("[analytics]", event);
  }
}
