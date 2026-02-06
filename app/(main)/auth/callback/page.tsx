"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { setAuthTokens } from "@/libs/auth";

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let accessToken = searchParams.get("access_token");
    if (accessToken?.includes("&refresh_token=")) {
      accessToken = accessToken.split("&refresh_token=")[0] ?? "";
    }
    const refreshToken = searchParams.get("refresh_token");

    if (accessToken && refreshToken) {
      setAuthTokens(accessToken, refreshToken);
      router.replace("/");
      return;
    }

    setError("유효하지 않은 콜백 요청입니다.");
  }, [router, searchParams]);

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <p className="text-body-5-4 text-alert">{error}</p>
        <button
          type="button"
          onClick={() => router.replace("/")}
          className="rounded-3.5 px-4 py-2 text-body-5-2 text-primary-200 bg-primary-50 hover:bg-primary-20"
        >
          홈으로 돌아가기
        </button>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <div className="size-10 animate-spin rounded-full border-2 border-primary-100 border-t-transparent" />
      <p className="text-body-5-4 text-gray-200">로그인 처리 중...</p>
    </div>
  );
}
