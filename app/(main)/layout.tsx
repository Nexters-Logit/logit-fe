"use client";

import { useIsMobile } from "@/app/_hooks/useIsMobile";
import { usePathname } from "next/navigation";
import { Header } from "@/components/common/Header";
import { LoginModalProvider } from "@/components/common/LoginModalContext";

// mobile-accessible paths
const MOBILE_PATHS = ["/profile", "/payment", "/login", "/auth"];

function MobileBlockScreen() {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4 bg-white px-10 text-center">
      <div className="text-4xl">💻</div>
      <h1 className="text-title-2 text-gray-500">PC에서 이용해주세요</h1>
      <p className="text-body-7-3 text-gray-300">
        이 페이지는 데스크탑 환경에서만 이용할 수 있어요.
      </p>
    </div>
  );
}

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isMobile = useIsMobile();
  const pathname = usePathname();

  const isMobileAllowed = MOBILE_PATHS.some((p) => pathname.startsWith(p));

  // On mobile, block non-account pages
  if (isMobile && !isMobileAllowed) {
    return <MobileBlockScreen />;
  }

  return (
    <LoginModalProvider>
      <div className="h-screen flex flex-col overflow-hidden bg-white">
        {/* Hide header on mobile */}
        {!isMobile && <Header />}
        {children}
      </div>
    </LoginModalProvider>
  );
}
