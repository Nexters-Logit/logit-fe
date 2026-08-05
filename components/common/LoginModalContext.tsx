"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { useIsMobile } from "@/app/_hooks/useIsMobile";
import { LoginModal } from "./LoginModal";

interface LoginModalContextValue {
  setLoginModalOpen: (open: boolean) => void;
}

const LoginModalContext = createContext<LoginModalContextValue | null>(null);

export function LoginModalProvider({ children }: { children: ReactNode }) {
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (typeof document === "undefined") return;

    // 모바일이면 모달 닫고 종료 (모바일은 페이지 자체에서 처리)
    if (isMobile === true) {
      setLoginModalOpen(false);
      return;
    }

    // isMobile이 아직 확정되지 않은 경우 스킵
    if (isMobile !== false) return;

    const hasFlag = document.cookie
      .split(";")
      .map((c) => c.trim())
      .some((c) => c.startsWith("login_required="));

    if (hasFlag) {
      const justLoggedOut = document.cookie
        .split(";")
        .map((c) => c.trim())
        .some((c) => c.startsWith("just_logged_out="));
      if (justLoggedOut) {
        document.cookie = "login_required=; path=/; max-age=0";
        document.cookie = "just_logged_out=; path=/; max-age=0";
        return;
      }
      setLoginModalOpen(true);
      document.cookie = "login_required=; path=/; max-age=0";
    }
  }, [isMobile]);

  return (
    <LoginModalContext.Provider value={{ setLoginModalOpen }}>
      {children}
      {isMobile === false && (
        <LoginModal open={isLoginModalOpen} onOpenChange={setLoginModalOpen} />
      )}
    </LoginModalContext.Provider>
  );
}

export function useLoginModal(): LoginModalContextValue {
  const ctx = useContext(LoginModalContext);
  if (!ctx) {
    throw new Error("useLoginModal must be used within LoginModalProvider");
  }
  return ctx;
}
