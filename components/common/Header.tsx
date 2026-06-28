import Image from "next/image";
import Link from "next/link";
import { Settings } from "lucide-react";
import { UserMenu } from "./UserMenu";
import { NavLink } from "./NavLink";

export function Header() {
  return (
    <header className="flex w-full items-center justify-between px-7.5 py-3.75">
      <Link href="/" className="flex items-center gap-2">
        <Image src="/logos/logo-symbol-2d.svg" alt="Logit" width={24} height={24} />
        <Image src="/logos/logo-wordmark.svg" alt="Logit" width={52} height={26} />
      </Link>
      <nav className="flex items-center gap-7">
        <NavLink
          href="/"
          icon={<Image src="/icons/home.svg" alt="" width={26} height={26} aria-hidden="true" />}
          label="홈"
        />
        <NavLink
          href="/report"
          icon={<Image src="/icons/report.svg" alt="" width={26} height={26} aria-hidden="true" />}
          label="리포트"
        />
        <NavLink
          href="/profile"
          icon={<Settings className="size-6.5 text-primary-400" strokeWidth={1.5} aria-hidden="true" />}
          label="계정관리"
        />
        <UserMenu />
      </nav>
    </header>
  );
}
