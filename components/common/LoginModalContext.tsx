"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { LoginModal } from "./LoginModal";

interface LoginModalContextValue {
  setLoginModalOpen: (open: boolean) => void;
}

const LoginModalContext = createContext<LoginModalContextValue | null>(null);

export function LoginModalProvider({ children }: { children: ReactNode }) {
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);

  useEffect(() => {
    if (typeof document === "undefined") return;
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
  }, []);

  return (
    <LoginModalContext.Provider value={{ setLoginModalOpen }}>
      {children}
      <LoginModal open={isLoginModalOpen} onOpenChange={setLoginModalOpen} />
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
