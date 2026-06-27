import Link from "next/link";
import type { ReactNode } from "react";

type Props = {
  href: string;
  icon: ReactNode;
  label: string;
};

export function NavLink({ href, icon, label }: Props) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-gray-20"
    >
      {icon}
      <span className="text-body-3-3 text-primary-400">{label}</span>
    </Link>
  );
}
