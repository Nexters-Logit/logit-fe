"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  CalendarDays,
  ChevronRight,
  Mail,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { useCurrentUser } from "@/app/_hooks/useCurrentUser";
import { useLoginModal } from "@/app/_components/LoginModalContext";
import { getAccessToken } from "@/libs/auth";

function formatCreatedAt(createdAt: string) {
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(createdAt));
}

function getProviderLabel(provider: string | null) {
  if (provider === "google") return "Google";
  if (provider === "apple") return "Apple";
  return "소셜 로그인";
}

export function ProfilePageWeb() {
  const { setLoginModalOpen } = useLoginModal();
  const hasToken = !!getAccessToken();
  const { data: user, isLoading, isError } = useCurrentUser();

  useEffect(() => {
    if (!hasToken) {
      setLoginModalOpen(true);
    }
  }, [hasToken, setLoginModalOpen]);

  if (!hasToken) {
    return (
      <main className="flex flex-1 items-center justify-center px-10">
        <p className="text-body-5-4 text-gray-200">
          로그인하면 프로필을 확인할 수 있어요.
        </p>
      </main>
    );
  }

  if (isLoading) {
    return (
      <main className="flex-1 overflow-y-auto px-10 py-16">
        <div className="mx-auto w-full max-w-180 animate-pulse">
          <div className="mb-8 h-11 w-32 rounded-lg bg-gray-50" />
          <div className="h-96 rounded-3xl bg-gray-20" />
        </div>
      </main>
    );
  }

  if (isError || !user) {
    return (
      <main className="flex flex-1 items-center justify-center px-10">
        <p className="text-body-5-4 text-gray-200">
          프로필 정보를 불러오지 못했어요.
        </p>
      </main>
    );
  }

  return (
    <main className="overflow-y-auto px-5 py-16 scrollbar-hide">
      <div className="mx-auto w-full max-w-180">
        <div className="text-gray-400 font-bold text-xl leading-7 mb-2">
          계정
        </div>
        <div className="flex flex-col gap-11 w-full">
          <div className="w-full">
            <div className="semibold_16 mb-2">요금제 정보</div>
            <div className="rounded-5 border border-gray-50 overflow-hidden w-full">
              <div className="p-6 pb-5">
                <div className="flex justify-between">
                  <div>요금제 명</div>
                  <div>추천</div>
                </div>
              </div>
              <Link
                href="/profile/plans"
                className="flex items-center justify-center gap-1 bg-gray-300 p-2.5 text-white transition-colors hover:bg-primary-600"
              >
                <span className="text-xs">요금제 더보기</span>
                <ChevronRight className="size-3.5" aria-hidden="true" />
              </Link>
            </div>
          </div>
          <div className="gap-3.5">
            <div className="semibold_16 mb-2">결제 내역</div>
            <div>최근 6개월 동안 주문 내역이 없습니다</div>
          </div>
          <div className="gap-3.5">
            <div className="flex justify-between items-baseline">
              <div className="semibold_16 mb-2">계정 관리</div>
              <div className="text-xs text-gray-200">{user.email}</div>
            </div>
            <div>
              <div>
                <div>로그아웃</div>
              </div>
            </div>
          </div>
        </div>

        <section className="overflow-hidden rounded-3xl border border-gray-70 bg-white">
          <div className="flex items-center gap-6 border-b border-gray-70 px-8 py-8">
            {user.profile_image_url ? (
              <Image
                src={user.profile_image_url}
                alt={`${user.full_name ?? "사용자"} 프로필`}
                width={80}
                height={80}
                className="size-20 rounded-full object-cover"
                priority
              />
            ) : (
              <div className="flex size-20 items-center justify-center rounded-full bg-primary-20">
                <UserRound className="size-9 text-primary-200" />
              </div>
            )}

            <div className="min-w-0">
              <h2 className="truncate text-title-2 text-gray-400">
                {user.full_name || "이름 미등록"}
              </h2>
              <p className="mt-1 truncate text-body-6-1 text-gray-200"></p>
            </div>
          </div>

          <dl className="divide-y divide-gray-70 px-8">
            <div className="flex items-center gap-4 py-6">
              <Mail className="size-5 text-primary-200" />
              <dt className="w-28 shrink-0 text-body-5-2 text-gray-200">
                이메일
              </dt>
              <dd className="min-w-0 truncate text-body-5-3 text-gray-400">
                {user.email}
              </dd>
            </div>

            <div className="flex items-center gap-4 py-6">
              <ShieldCheck className="size-5 text-primary-200" />
              <dt className="w-28 shrink-0 text-body-5-2 text-gray-200">
                로그인 방식
              </dt>
              <dd className="text-body-5-3 text-gray-400">
                {getProviderLabel(user.oauth_provider)}
              </dd>
            </div>

            <div className="flex items-center gap-4 py-6">
              <CalendarDays className="size-5 text-primary-200" />
              <dt className="w-28 shrink-0 text-body-5-2 text-gray-200">
                가입일
              </dt>
              <dd className="text-body-5-3 text-gray-400">
                {formatCreatedAt(user.created_at)}
              </dd>
            </div>
          </dl>
        </section>
      </div>
    </main>
  );
}
