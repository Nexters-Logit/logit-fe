"use client";

import Image from "next/image";
import { API_BASE_URL } from "@/libs/api-client";

export function MobileLoginScreen() {
  const handleGoogleLogin = () => {
    sessionStorage.setItem("auth_redirect", "/profile");
    window.location.href = `${API_BASE_URL}/api/v1/auth/google`;
  };

  const handleAppleLogin = () => {
    sessionStorage.setItem("auth_redirect", "/profile");
    window.location.href = `${API_BASE_URL}/api/v1/auth/apple`;
  };

  return (
    <main className="flex min-h-dvh flex-col items-center justify-between px-7.5 py-16">
      <div className="flex flex-1 flex-col items-center justify-center gap-10 w-full">
        <div className="flex flex-col items-center gap-4">
          <Image
            src="/icons/logo_symbol_3d.webp"
            alt="Logit"
            width={80}
            height={80}
            priority
          />
          <div className="flex flex-col items-center gap-2">
            <Image
              src="/logos/logo-wordmark.svg"
              alt="logit."
              width={64}
              height={32}
            />
            <p className="text-body-5-4 text-gray-200">자소서가 쉬워지는 곳</p>
          </div>
        </div>

        <div className="flex w-full flex-col gap-3">
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="flex h-14 w-full items-center justify-center gap-3 rounded-3.5 border border-gray-70 bg-white text-body-5-2 text-gray-400 shadow-chat transition-colors hover:bg-gray-20"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" className="shrink-0">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Google로 시작하기
          </button>
          <button
            type="button"
            onClick={handleAppleLogin}
            className="flex h-14 w-full items-center justify-center gap-3 rounded-3.5 border border-gray-70 bg-white text-body-5-2 text-gray-400 shadow-chat transition-colors hover:bg-gray-20"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" className="shrink-0">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
            </svg>
            Apple로 시작하기
          </button>
        </div>
      </div>

      <p className="text-center text-body-9-3 text-gray-200">
        계속하면{" "}
        <a href="https://docs.logit.ai.kr/policys/tos" target="_blank" rel="noopener noreferrer" className="underline">
          이용약관
        </a>
        {" · "}
        <a href="https://docs.logit.ai.kr/policys/privacy-policy" target="_blank" rel="noopener noreferrer" className="underline">
          개인정보 처리방침
        </a>
        에 동의합니다.
      </p>
    </main>
  );
}
