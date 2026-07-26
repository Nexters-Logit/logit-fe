"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

interface MobileNavHeaderProps {
  backHref?: string;
}

export function MobileNavHeader({ backHref }: MobileNavHeaderProps) {
  const router = useRouter();

  function handleBack() {
    if (backHref) {
      router.push(backHref);
    } else {
      router.back();
    }
  }

  return (
    <header className="relative flex w-full h-13.5 items-center justify-between pl-1.5 bg-primary-20">
      <button
        type="button"
        onClick={handleBack}
        className="flex size-11 items-center justify-center p-2.5"
        aria-label="뒤로가기"
      >
        <Image src="/icons/icNavigateLeft.svg" alt="뒤로가기" width={24} height={24} />
      </button>
      <div className="absolute left-1/2 -translate-x-1/2 top-3.875 bottom-3.625 flex items-start justify-center gap-2">
        <Image src="/logos/logo-symbol-mobile.svg" alt="" width={21} height={21} className="size-5.25 shrink-0" />
        <Image src="/logos/logo-wordmark-mobile.svg" alt="Logit" width={47} height={24} className="w-11.75 h-6" />
      </div>
      <div className="size-11" />
    </header>
  );
}
