import Image from 'next/image';
import Link from 'next/link';
import { UserMenu } from './UserMenu';

export function Header() {
  return (
    <header className="flex items-center justify-between px-7.5 py-3.75 w-full max-w-360 mx-auto">
      <Link href="/" className="flex items-center gap-2">
        <Image
          src="/logos/logo-symbol-2d.svg"
          alt="Logit"
          width={24}
          height={24}
        />
        <Image
          src="/logos/logo-wordmark.svg"
          alt="Logit"
          width={52}
          height={26}
        />
      </Link>
      <nav className="flex items-center gap-7">
        <Link
          href="/"
          className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-20"
        >
          <Image src="/icons/home.svg" alt="홈" width={26} height={26} />
          <span className="text-body-3-3 text-primary-400">홈</span>
        </Link>
        <Link
          href="#"
          className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-20"
        >
          <Image src="/icons/report.svg" alt="리포트" width={26} height={26} />
          <span className="text-body-3-3 text-primary-400">리포트</span>
        </Link>
        <UserMenu />
      </nav>
    </header>
  );
}
