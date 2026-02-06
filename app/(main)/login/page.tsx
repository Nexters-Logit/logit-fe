"use client";

import Image from "next/image";
import { API_BASE_URL } from "@/libs/api-client";

export default function LoginPage() {
  const handleGoogleLogin = () => {
    window.location.href = `${API_BASE_URL}/api/v1/auth/google`;
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-0 px-7.5 py-16">
      <div className="flex flex-col items-center gap-12 max-w-90 w-full">
        {/* 로고 */}
        <div className="flex flex-col items-center gap-6">
          <Image
            src="/logos/logo-symbol-2d.svg"
            alt="Logit"
            width={80}
            height={80}
            priority
          />
          <div className="flex flex-col items-center gap-2">
            <h1 className="text-title-2 text-gray-400">Logit</h1>
            <p className="text-body-5-4 text-gray-200 text-center">
              경험을 기록하고, 자기소개서를 쉽게 작성하세요
            </p>
          </div>
        </div>

        {/* Google 로그인 버튼 */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="flex items-center justify-center gap-3 w-full h-14 rounded-3.5 bg-white border border-gray-70 hover:bg-gray-20 transition-colors text-body-5-2 text-gray-400 shadow-chat"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" className="shrink-0">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Google로 로그인
        </button>
      </div>
    </div>
  );
}
