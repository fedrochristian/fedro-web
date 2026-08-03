import type { ReactNode } from "react";

type Props = {
  id?: string;
  /** `tight` reduces vertical padding; `full` forces 100vh + centers content. */
  variant?: "default" | "tight" | "full";
  as?: "section" | "article" | "header";
  className?: string;
  /**
   * Optional background slot — rendered absolutely behind the container.
   * Use with `<BackgroundImage>` from `@/components/manifesto/BackgroundImage`.
   */
  background?: ReactNode;
  children: React.ReactNode;
};

export function SectionShell({
  id,
  variant = "default",
  as: Tag = "section",
  className,
  background,
  children,
}: Props) {
  const cls = [
    "section",
    variant === "tight" && "section--tight",
    variant === "full" && "section--full",
    background && "section--has-bg",
    className,
  ]
    .filter(Boolean)
    .join(" ");
  return (
    <Tag id={id} className={cls}>
      {background}
      <div className="container">{children}</div>
    </Tag>
  );
}
