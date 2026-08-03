import type { Difficulty } from "@/content/essays";

const LABEL: Record<Difficulty, string> = {
  "on-ramp": "On-ramp",
  core: "Core",
  "deep-end": "Deep end",
};

export function DifficultyTag({ level }: { level: Difficulty }) {
  return (
    <span className="tag tag--difficulty" data-level={level}>
      {LABEL[level]}
    </span>
  );
}
