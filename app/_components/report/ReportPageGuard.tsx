"use client";

import { useEffect, useState, type ReactNode } from "react";
import { getAccessToken } from "@/libs/auth";
import { useLoginModal } from "@/app/_components/LoginModalContext";

interface ReportPageGuardProps {
  children: ReactNode;
}

/**
 * 리포트 페이지: 로그인한 유저만 내용을 보여주고, 비로그인 시 구글 로그인 모달을 띄웁니다.
 */
export function ReportPageGuard({ children }: ReportPageGuardProps) {
  const { setLoginModalOpen } = useLoginModal();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || typeof document === "undefined") return;
    if (!getAccessToken()) {
      setLoginModalOpen(true);
    }
  }, [mounted, setLoginModalOpen]);

  if (!mounted) {
    return null;
  }

  if (!getAccessToken()) {
    return (
      <main className="w-full mx-auto p-10 pb-25 flex-1 overflow-y-auto scrollbar-hide flex items-center justify-center">
        <p className="text-body-5-4 text-gray-200">
          로그인하면 리포트를 확인할 수 있어요.
        </p>
      </main>
    );
  }

  return <>{children}</>;
}
