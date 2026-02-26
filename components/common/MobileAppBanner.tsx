"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";

export function MobileAppBanner() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (!isMobile) return null;

  return (
    <Dialog open>
      <DialogContent
        className="flex flex-col items-center gap-6 rounded-5 border-0 px-7.5 py-10 shadow-chat"
        showCloseButton={false}
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <div className="flex flex-col items-center gap-2">
          <Image
            src="/icons/logo_symbol_3d.webp"
            alt="Logit logo"
            width={60}
            height={60}
          />
          <Image
            src="/icons/logo_wordmark.svg"
            alt="Logit"
            width={64}
            height={32}
          />
        </div>

        <DialogTitle className="sr-only">모바일 앱 안내</DialogTitle>
        <div className="flex flex-col items-center gap-2 text-center">
          <p className="text-body-3-1 text-gray-500">
            모바일에서는 앱을 이용해주세요
          </p>
          <p className="text-body-7-3 text-gray-200">
            PC 또는 태블릿 환경에서 웹으로 이용할 수 있어요.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
