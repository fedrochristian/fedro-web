/** Approximate reading time in minutes. Standard 230 wpm. */
export function readingTime(markdown: string, wpm = 230): number {
  const words = markdown.trim().split(/\s+/u).filter(Boolean).length;
  return Math.max(1, Math.round(words / wpm));
}
