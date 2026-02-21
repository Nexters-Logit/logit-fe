"use client";

import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";
import { LoginModal } from "./LoginModal";

interface LoginModalContextValue {
  setLoginModalOpen: (open: boolean) => void;
}

const LoginModalContext = createContext<LoginModalContextValue | null>(null);

export function LoginModalProvider({ children }: { children: ReactNode }) {
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);

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
