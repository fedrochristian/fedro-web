import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

import type { Difficulty, Essay, EssayWithBody } from "@/content/essays";
import type { PillarSlug } from "@/content/pillars";
import { readingTime } from "./reading-time";

const ESSAYS_DIR = path.join(process.cwd(), "src", "content", "essays");

/**
 * Read every .mdx file in src/content/essays/ at build time, parse frontmatter
 * with gray-matter, and return typed essays. Production builds exclude drafts.
 */
function readAll(): EssayWithBody[] {
  if (!fs.existsSync(ESSAYS_DIR)) return [];

  const files = fs.readdirSync(ESSAYS_DIR).filter((f) => f.endsWith(".mdx"));

  const essays: EssayWithBody[] = files.map((file) => {
    const slug = file.replace(/\.mdx$/, "");
    const raw = fs.readFileSync(path.join(ESSAYS_DIR, file), "utf8");
    const { data, content } = matter(raw);

    const fm = data as Partial<Essay> & Record<string, unknown>;
    const required = ["title", "dek", "date", "pillar", "difficulty"] as const;
    for (const key of required) {
      if (!(key in fm)) {
        throw new Error(`Essay ${file} is missing required frontmatter: ${key}`);
      }
    }

    return {
      slug,
      title: String(fm.title),
      dek: String(fm.dek),
      date: String(fm.date),
      pillar: fm.pillar as PillarSlug,
      difficulty: fm.difficulty as Difficulty,
      readingTime: typeof fm.readingTime === "number" ? fm.readingTime : readingTime(content),
      startHere: fm.startHere ? String(fm.startHere) : undefined,
      theChoice: fm.theChoice as Essay["theChoice"] | undefined,
      heroImage: fm.heroImage ? String(fm.heroImage) : undefined,
      ogImage: fm.ogImage ? String(fm.ogImage) : undefined,
      draft: Boolean(fm.draft),
      body: content,
    };
  });

  // Newest first.
  return essays.sort((a, b) => b.date.localeCompare(a.date));
}

/** Published essays only (drafts excluded). */
export function listEssays(): Essay[] {
  return readAll()
    .filter((e) => !e.draft)
    .map(({ body: _body, ...meta }) => meta);
}

/** Full essay including MDX body. Returns undefined if missing or draft. */
export function getEssay(slug: string): EssayWithBody | undefined {
  const e = readAll().find((x) => x.slug === slug);
  if (!e || e.draft) return undefined;
  return e;
}

export function essaysByPillar(pillar: PillarSlug): Essay[] {
  return listEssays().filter((e) => e.pillar === pillar);
}

export function essaysByDifficulty(difficulty: Difficulty): Essay[] {
  return listEssays().filter((e) => e.difficulty === difficulty);
}

/** Related essays for an essay page: same pillar, excluding self. Newest first. */
export function relatedEssays(slug: string, limit = 3): Essay[] {
  const current = listEssays().find((e) => e.slug === slug);
  if (!current) return [];
  return essaysByPillar(current.pillar)
    .filter((e) => e.slug !== slug)
    .slice(0, limit);
}

/**
 * Next essay in the same pillar — the next one the reader should consume.
 * Since the list is sorted newest-first, "next to read" means the next older
 * essay. Returns null if this is the oldest in the pillar.
 */
export function nextInPillar(slug: string): Essay | null {
  const list = listEssays();
  const current = list.find((e) => e.slug === slug);
  if (!current) return null;
  const same = list.filter((e) => e.pillar === current.pillar);
  const i = same.findIndex((e) => e.slug === slug);
  if (i < 0 || i + 1 >= same.length) return null;
  return same[i + 1];
}
