import Link from "next/link";
import { ForkGlyph } from "./ForkGlyph";

type Variant = "primary" | "secondary" | "ghost";

type CommonProps = {
  children: React.ReactNode;
  variant?: Variant;
  withFork?: boolean;
  className?: string;
};

type LinkProps = CommonProps & {
  href: string;
  external?: boolean;
};

type ButtonProps = CommonProps & {
  onClick?: () => void;
  type?: "button" | "submit";
};

function classes(variant: Variant, extra?: string) {
  return ["cta", `cta--${variant}`, extra].filter(Boolean).join(" ");
}

export function CTALink({
  href,
  external,
  children,
  variant = "primary",
  withFork,
  className,
}: LinkProps) {
  const cls = classes(variant, className);
  const target = external ? "_blank" : undefined;
  const rel = external ? "noopener noreferrer" : undefined;
  const inner = (
    <>
      {children}
      {withFork ? <ForkGlyph /> : null}
    </>
  );
  return external ? (
    <a className={cls} href={href} target={target} rel={rel}>
      {inner}
    </a>
  ) : (
    <Link className={cls} href={href}>
      {inner}
    </Link>
  );
}

export function CTAButton({
  onClick,
  type = "button",
  children,
  variant = "primary",
  withFork,
  className,
}: ButtonProps) {
  return (
    <button className={classes(variant, className)} type={type} onClick={onClick}>
      {children}
      {withFork ? <ForkGlyph /> : null}
    </button>
  );
}
