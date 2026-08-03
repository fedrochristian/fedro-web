import type { MetadataRoute } from "next";
import { site } from "@/content/site";
import { pillars } from "@/content/pillars";
import { listEssays } from "@/lib/content";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = site.url.replace(/\/$/, "");
  const now = new Date();

  const staticRoutes = ["", "/essays", "/watch", "/about", "/legal"];
  const staticEntries = staticRoutes.map((p) => ({
    url: `${base}${p || "/"}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: p === "" ? 1 : 0.7,
  }));

  const pillarEntries = pillars.map((p) => ({
    url: `${base}/pillars/${p.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const essayEntries = listEssays().map((e) => ({
    url: `${base}/essays/${e.slug}`,
    lastModified: new Date(e.date),
    changeFrequency: "yearly" as const,
    priority: 0.8,
  }));

  return [...staticEntries, ...pillarEntries, ...essayEntries];
}
