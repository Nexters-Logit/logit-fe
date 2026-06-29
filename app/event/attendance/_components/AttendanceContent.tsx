"use client";

import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CalendarCheck, Zap, ChevronLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { apiFetch, API_ENDPOINTS } from "@/libs/api-client";
import { useTokenBalance } from "@/app/_hooks/useTokenBalance";
import { useCurrentUser } from "@/app/_hooks/useCurrentUser";
import { getAccessToken } from "@/libs/auth";

interface AttendanceResponse {
  success: boolean;
  message: string;
  tokens_earned: number;
  new_balance: number;
}

function useAttendance() {
  return useMutation({
    mutationFn: () =>
      apiFetch<AttendanceResponse>(API_ENDPOINTS.tokensAttendance, { method: "POST" }),
  });
}

export function AttendanceContent() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const queryClient = useQueryClient();

  const { data: user } = useCurrentUser();
  const { data: tokenData, isLoading: balanceLoading } = useTokenBalance();
  const { mutate: checkIn, data: result, isPending, error, isSuccess } = useAttendance();

  useEffect(() => {
    setIsLoggedIn(!!getAccessToken());
  }, []);

  const alreadyCheckedIn =
    isSuccess === false && (error as { status?: number } | null)?.status === 409;

  const eventEnded =
    isSuccess === false && (error as { status?: number } | null)?.status === 410;

  const handleCheckIn = () => {
    if (!isLoggedIn) {
      setShowLoginModal(true);
      return;
    }
    checkIn(undefined, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["tokenBalance"] });
      },
    });
  };

  const balance = result?.new_balance ?? tokenData?.balance;

  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-10 flex items-center justify-between px-10 py-5 border-b border-gray-70 bg-white">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logos/logo-symbol-2d.svg" alt="Logit" width={24} height={24} />
          <Image src="/logos/logo-wordmark.svg" alt="Logit" width={52} height={26} />
        </Link>
        <Link
          href="/event"
          className="flex items-center gap-1 text-body-7-3 text-gray-200 hover:text-gray-400 transition-colors"
        >
          <ChevronLeft className="size-3.5" />
          이벤트 목록
        </Link>
      </header>
    <div className="max-w-160 mx-auto px-6 py-16 flex flex-col gap-12">

      {/* 히어로 */}
      <section className="text-center flex flex-col gap-4">
        <span className="inline-block self-center px-4 py-1.5 rounded-full bg-primary-50 text-body-6-1 text-primary-200">
          출석 이벤트
        </span>
        <h1 className="text-headline-1 text-gray-500">
          매일 출석하고
          <br />
          토큰을 받아요
        </h1>
        <p className="text-body-5-3 text-gray-200">
          하루에 한 번 출석하면 <span className="text-primary-100 font-medium">3토큰</span>을 드려요.
          <br />
          이벤트 풀이 소진되면 마감됩니다.
        </p>
      </section>

      {/* 현재 잔액 */}
      {isLoggedIn && (
        <section className="bg-primary-20 rounded-5 px-8 py-6 flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <span className="text-body-6-3 text-gray-200">현재 토큰 잔액</span>
            <div className="flex items-center gap-2">
              <Zap className="size-5 text-primary-300" strokeWidth={2} />
              {balanceLoading ? (
                <div className="h-8 w-20 rounded-lg bg-primary-50 animate-pulse" />
              ) : (
                <span className="text-title-1 text-primary-200 tabular-nums">
                  {balance ?? "–"} 토큰
                </span>
              )}
            </div>
          </div>
          {user?.full_name && (
            <span className="text-body-6-3 text-gray-300">{user.full_name}</span>
          )}
        </section>
      )}

      {/* 출석 카드 */}
      <section className="flex flex-col gap-4">
        <div className="bg-gray-20 rounded-5 px-8 py-10 flex flex-col items-center gap-6">
          <div className="size-20 rounded-full bg-white flex items-center justify-center shadow-chat">
            <CalendarCheck className="size-10 text-primary-200" strokeWidth={1.5} />
          </div>

          {isSuccess && result ? (
            <div className="text-center flex flex-col gap-2">
              <p className="text-title-1 text-primary-200">출석 완료!</p>
              <p className="text-body-5-3 text-gray-300">
                오늘도 로짓에 출석했어요.{" "}
                <span className="text-primary-100 font-medium">+{result.tokens_earned}토큰</span>이 지급됐어요.
              </p>
            </div>
          ) : alreadyCheckedIn ? (
            <div className="text-center flex flex-col gap-2">
              <p className="text-title-2-2 text-gray-400">오늘은 이미 출석했어요</p>
              <p className="text-body-6-3 text-gray-200">내일 다시 출석해주세요!</p>
            </div>
          ) : eventEnded ? (
            <div className="text-center flex flex-col gap-2">
              <p className="text-title-2-2 text-gray-400">이벤트가 종료됐어요</p>
              <p className="text-body-6-3 text-gray-200">준비된 토큰이 모두 소진됐어요.</p>
            </div>
          ) : (
            <div className="text-center flex flex-col gap-2">
              <p className="text-title-2-2 text-gray-400">오늘의 출석을 기록해요</p>
              <p className="text-body-6-3 text-gray-200">버튼을 눌러 3토큰을 받으세요</p>
            </div>
          )}

          {!alreadyCheckedIn && !eventEnded && !isSuccess && (
            <button
              type="button"
              onClick={handleCheckIn}
              disabled={isPending}
              className="px-10 py-3.75 rounded-3.5 bg-primary-100 text-white text-body-5-1 hover:bg-primary-200 transition-colors disabled:opacity-50"
            >
              {isPending ? "출석 중..." : "출석하기"}
            </button>
          )}
        </div>

        {/* 안내 */}
        <div className="bg-gray-20 rounded-3.5 px-5 py-4 flex flex-col gap-2">
          <p className="text-body-7-1 text-gray-300">유의사항</p>
          <ul className="flex flex-col gap-1 list-disc list-inside">
            <li className="text-body-7-3 text-gray-200">출석은 하루 1회만 가능해요</li>
            <li className="text-body-7-3 text-gray-200">이벤트 풀(30,000토큰)이 소진되면 마감돼요</li>
            <li className="text-body-7-3 text-gray-200">지급된 토큰은 취소되지 않아요</li>
          </ul>
        </div>
      </section>

      {/* 로그인 모달 */}
      {showLoginModal && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          onClick={() => setShowLoginModal(false)}
        >
          <div
            className="bg-white rounded-5 p-8 max-w-xs w-full mx-4 flex flex-col gap-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center flex flex-col gap-2">
              <p className="text-title-2-2 text-gray-500">로그인이 필요해요</p>
              <p className="text-body-6-3 text-gray-200">출석 토큰을 받으려면 먼저 로그인하세요.</p>
            </div>
            <div className="flex flex-col gap-2">
              <a
                href="/login"
                className="w-full py-3.75 rounded-3.5 bg-primary-100 text-white text-body-6-1 text-center hover:bg-primary-200 transition-colors"
              >
                로그인하러 가기
              </a>
              <button
                type="button"
                onClick={() => setShowLoginModal(false)}
                className="w-full py-3.75 rounded-3.5 border border-gray-70 text-gray-400 text-body-6-1 hover:bg-gray-50 transition-colors"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </div>
  );
}
