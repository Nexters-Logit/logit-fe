"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { API_BASE_URL, API_ENDPOINTS } from "@/libs/api-client";
import { setAuthTokens } from "@/libs/auth";

interface CallbackResponse {
  access_token: string;
  refresh_token: string;
  is_new_user?: boolean;
}

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const processCallback = async () => {
      const code = searchParams.get("code");
      if (code) {
        try {
          const res = await fetch(
            `${API_BASE_URL}${API_ENDPOINTS.authGoogleCallback(code)}`,
          );
          if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.detail || `API Error: ${res.status}`);
          }
          const data: CallbackResponse = await res.json();
          setAuthTokens(data.access_token, data.refresh_token);
          router.replace("/");
        } catch (e) {
          setError(
            e instanceof Error
              ? e.message
              : "로그인 처리 중 오류가 발생했습니다.",
          );
        }
        return;
      }

      setError("유효하지 않은 콜백 요청입니다.");
    };

    processCallback();
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
