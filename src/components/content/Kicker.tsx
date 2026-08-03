type Props = { children: React.ReactNode; as?: "p" | "span" | "div" };

export function Kicker({ children, as: Tag = "p" }: Props) {
  return <Tag className="kicker">{children}</Tag>;
}
