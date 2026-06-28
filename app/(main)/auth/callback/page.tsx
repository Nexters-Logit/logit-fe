"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { setAuthTokens } from "@/libs/auth";
import { apiFetch, API_BASE_URL, API_ENDPOINTS } from "@/libs/api-client";
import type { UserPublic } from "@/types/api";

function AuthCallbackContent() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const code = searchParams.get("code");

    if (!code) {
      setError("유효하지 않은 콜백 요청입니다.");
      return;
    }

    const exchangeToken = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/v1/auth/token`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            code,
            platform: "web",
          }),
        });

        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.detail || `API Error: ${res.status}`);
        }

        const data: { access_token: string } = await res.json();

        setAuthTokens(data.access_token);
        await queryClient.prefetchQuery({
          queryKey: ["currentUser"],
          queryFn: () => apiFetch<UserPublic>(API_ENDPOINTS.usersMe),
        });
        const redirectTo = sessionStorage.getItem("auth_redirect") ?? "/";
        sessionStorage.removeItem("auth_redirect");
        router.replace(redirectTo);
      } catch (e) {
        setError(
          e instanceof Error
            ? e.message
            : "로그인 처리 중 오류가 발생했습니다.",
        );
      }
    };

    exchangeToken();
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

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen flex-col items-center justify-center gap-4">
          <div className="size-10 animate-spin rounded-full border-2 border-primary-100 border-t-transparent" />
          <p className="text-body-5-4 text-gray-200">로그인 처리 중...</p>
        </div>
      }
    >
      <AuthCallbackContent />
    </Suspense>
  );
}
