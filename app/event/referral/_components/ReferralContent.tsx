"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

import { getAccessToken } from "@/libs/auth";
import { apiFetch, API_ENDPOINTS } from "@/libs/api-client";
import { showToast } from "@/libs/toast";

declare global {
  interface Window {
    Kakao?: {
      init: (key: string) => void;
      isInitialized: () => boolean;
      Share: { sendDefault: (options: object) => void };
    };
  }
}

const TOKENS_PER_REFERRAL = 10;

function burstConfetti() {
  const colors = ["#40a5ff", "#2571eb", "#c3dcff", "#fcd34d", "#f59e0b", "#ffffff"];
  const cx = window.innerWidth / 2;
  const cy = window.innerHeight * 0.38;
  Array.from({ length: 32 }).forEach(() => {
    const el = document.createElement("span");
    const size = Math.random() * 7 + 4;
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 180 + 90;
    const vx = Math.cos(angle) * speed;
    const vy = Math.sin(angle) * speed - 230;
    const duration = Math.random() * 500 + 450;
    const rot = Math.random() * 720 - 360;
    Object.assign(el.style, {
      position: "fixed", pointerEvents: "none", zIndex: "9999",
      width: `${size}px`, height: `${size}px`,
      borderRadius: Math.random() > 0.5 ? "50%" : "2px",
      background: colors[Math.floor(Math.random() * colors.length)],
      left: `${cx}px`, top: `${cy}px`,
    });
    document.body.appendChild(el);
    let t0 = 0;
    const step = (ts: number) => {
      if (!t0) t0 = ts;
      const t = Math.min((ts - t0) / duration, 1);
      el.style.transform = `translate(${vx * t}px, ${vy * t + 300 * t * t}px) rotate(${rot * t}deg)`;
      el.style.opacity = String(1 - t * t);
      if (t < 1) requestAnimationFrame(step);
      else el.remove();
    };
    requestAnimationFrame(step);
  });
}

interface ReferralStats {
  code: string;
  invited_count: number;
}

function useReferralStats() {
  return useQuery({
    queryKey: ["referralStats"],
    queryFn: () => apiFetch<ReferralStats>(API_ENDPOINTS.referralMe),
    enabled: !!getAccessToken(),
  });
}

function useApplyReferral() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (code: string) =>
      apiFetch<{ message: string }>(API_ENDPOINTS.referralApply, {
        method: "POST",
        body: JSON.stringify({ code }),
      }),
    onSuccess: () => {
      showToast.success(`초대 코드가 적용됐어요! ${TOKENS_PER_REFERRAL}토큰이 지급되었습니다.`);
      queryClient.invalidateQueries({ queryKey: ["referralStats"] });
      queryClient.invalidateQueries({ queryKey: ["tokenBalance"] });
    },
  });
}

export function ReferralContent() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [inviteCode, setInviteCode] = useState("");

  const { data: referral } = useReferralStats();
  const { mutate: applyCode, isPending, isSuccess: applySuccess, error: applyError } = useApplyReferral();

  const referralUrl = referral
    ? `${typeof window !== "undefined" ? window.location.origin : "https://app.logit.ai.kr"}/?ref=${referral.code}`
    : "";

  useEffect(() => {
    setIsLoggedIn(!!getAccessToken());
    const kakaoKey = process.env.NEXT_PUBLIC_KAKAO_JS_KEY;
    if (kakaoKey && window.Kakao && !window.Kakao.isInitialized()) {
      window.Kakao.init(kakaoKey);
    }
  }, []);

  const requireAuth = (action: () => void) => {
    if (!isLoggedIn) {
      setShowLoginModal(true);
      return;
    }
    action();
  };

  const handleCopyUrl = () =>
    requireAuth(async () => {
      await navigator.clipboard.writeText(referralUrl);
      setCopiedUrl(true);
      burstConfetti();
      setTimeout(() => setCopiedUrl(false), 2000);
    });

  const handleCopyCode = () =>
    requireAuth(async () => {
      if (!referral?.code) return;
      await navigator.clipboard.writeText(referral.code);
      setCopiedCode(true);
      burstConfetti();
      setTimeout(() => setCopiedCode(false), 2000);
    });

  const handleKakaoShare = () =>
    requireAuth(() => {
      if (!window.Kakao?.isInitialized()) return;
      window.Kakao.Share.sendDefault({
        objectType: "feed",
        content: {
          title: "로짓 친구 초대 이벤트",
          description: `지금 가입하면 두 분 모두 ${TOKENS_PER_REFERRAL}토큰을 받아요!`,
          imageUrl: `${window.location.origin}/logos/og-image.png`,
          link: { mobileWebUrl: referralUrl, webUrl: referralUrl },
        },
        buttons: [{ title: "로짓 시작하기", link: { mobileWebUrl: referralUrl, webUrl: referralUrl } }],
      });
    });

  const handleWebShare = () =>
    requireAuth(async () => {
      if (navigator.share) {
        await navigator.share({
          title: "로짓 친구 초대 이벤트",
          text: `지금 가입하면 두 분 모두 ${TOKENS_PER_REFERRAL}토큰을 받아요!`,
          url: referralUrl,
        });
      } else {
        await navigator.clipboard.writeText(referralUrl);
        setCopiedUrl(true);
        setTimeout(() => setCopiedUrl(false), 2000);
      }
    });

  const handleApplyCode = () =>
    requireAuth(() => {
      if (!inviteCode.trim()) return;
      applyCode(inviteCode.trim());
    });

  const applyErrorStatus = (applyError as { status?: number } | null)?.status;
  const totalTokensEarned = (referral?.invited_count ?? 0) * TOKENS_PER_REFERRAL;

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
    <main className="max-w-160 mx-auto px-6 py-16 flex flex-col gap-12">

      {/* 히어로 */}
      <section className="text-center">
        <p className="text-body-5-1 text-primary-100 mb-3">친구 초대 이벤트</p>
        <h1 className="text-headline-1 text-gray-500 mb-4">
          친구를 초대하고
          <br />
          함께 토큰을 받아요
        </h1>
        <p className="text-body-5-3 text-gray-200">
          초대한 친구가 로짓에 가입하면 두 분 모두{" "}
          <span className="text-primary-100 font-medium">{TOKENS_PER_REFERRAL}토큰</span>씩 드려요.
        </p>
      </section>

      {/* 혜택 */}
      <section className="flex flex-col gap-4">
        <div className="flex gap-4">
          <div className="flex-1 bg-primary-20 rounded-5 p-6 flex flex-col gap-3">
            <p className="text-body-6-3 text-gray-200">내가 받는 혜택</p>
            <p className="text-title-1 text-primary-100">+{TOKENS_PER_REFERRAL}토큰</p>
            <p className="text-body-6-3 text-gray-300">친구 1명 초대마다</p>
          </div>
          <div className="flex-1 bg-gray-20 rounded-5 p-6 flex flex-col gap-3">
            <p className="text-body-6-3 text-gray-200">친구가 받는 혜택</p>
            <p className="text-title-1 text-gray-400">+{TOKENS_PER_REFERRAL}토큰</p>
            <p className="text-body-6-3 text-gray-300">가입 즉시 지급</p>
          </div>
        </div>
        <div className="bg-primary-50 rounded-3.5 px-5 py-4">
          <p className="text-body-6-3 text-primary-200 text-center">
            💡 신규 가입자는 가입 보너스 100토큰도 함께 받아요
          </p>
        </div>
      </section>

      {/* 초대 코드 입력 */}
      <section>
        <h2 className="text-title-2-2 text-gray-500 mb-1.5">초대 코드 입력</h2>
        <p className="text-body-6-3 text-gray-200 mb-4">
          친구에게 받은 초대 코드를 입력하면 {TOKENS_PER_REFERRAL}토큰을 받아요
        </p>
        {applySuccess ? (
          <div className="bg-primary-50 rounded-3.5 px-5 py-4 text-center">
            <p className="text-body-5-1 text-primary-200">🎉 코드가 적용됐어요! {TOKENS_PER_REFERRAL}토큰이 지급됩니다.</p>
          </div>
        ) : (
          <div className="flex gap-3">
            <input
              type="text"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value)}
              onFocus={() => !isLoggedIn && setShowLoginModal(true)}
              placeholder="초대 코드를 입력하세요"
              className="flex-1 bg-gray-50 rounded-3.5 px-4 py-3.75 text-body-6-3 text-gray-400 placeholder:text-gray-100 outline-none focus:ring-1 focus:ring-primary-100"
            />
            <button
              type="button"
              onClick={handleApplyCode}
              disabled={isPending}
              className="shrink-0 px-5 py-3.75 rounded-3.5 bg-gray-400 text-white text-body-6-1 hover:bg-gray-500 transition-colors disabled:opacity-50"
            >
              {isPending ? "확인 중..." : "확인"}
            </button>
          </div>
        )}
        {applyError && (
          <p className="mt-2 text-body-7-3 text-alert">
            {applyErrorStatus === 409
              ? "이미 초대 코드를 사용했어요."
              : applyErrorStatus === 400
                ? "자신의 초대 코드는 사용할 수 없어요."
                : "유효하지 않은 초대 코드예요. 다시 확인해주세요."}
          </p>
        )}
      </section>

      {/* 내 초대 링크 + 코드 */}
      <section>
        <h2 className="text-title-2-2 text-gray-500 mb-4">내 초대 링크</h2>

        <div className="flex gap-3 mb-3">
          <div className="flex-1 bg-gray-50 rounded-3.5 px-4 py-3.75 flex items-center">
            <span className="text-body-5-1 text-gray-400 tracking-widest">
              {isLoggedIn && referral ? referral.code : "••••••••••••"}
            </span>
          </div>
          <button
            type="button"
            onClick={handleCopyCode}
            className="shrink-0 px-5 py-3.75 rounded-3.5 border border-gray-70 text-gray-400 text-body-6-1 hover:bg-gray-50 transition-colors"
          >
            {copiedCode ? "복사됨!" : "코드 복사"}
          </button>
        </div>

        <div className="flex gap-3 mb-4">
          <div className="flex-1 bg-gray-50 rounded-3.5 px-4 py-3.75 text-body-6-3 text-gray-300 truncate select-all">
            {isLoggedIn && referralUrl ? referralUrl : "로그인 후 확인할 수 있어요"}
          </div>
          <button
            type="button"
            onClick={handleCopyUrl}
            className="shrink-0 px-5 py-3.75 rounded-3.5 bg-primary-100 text-white text-body-6-1 hover:bg-primary-200 transition-colors"
          >
            {copiedUrl ? "복사됨!" : "링크 복사"}
          </button>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleKakaoShare}
            className="flex-1 flex items-center justify-center gap-2 py-3.75 rounded-3.5 bg-[#FEE500] text-[#191919] text-body-6-1 hover:brightness-95 transition-all"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path fillRule="evenodd" clipRule="evenodd" d="M10 2C5.582 2 2 4.91 2 8.5c0 2.26 1.35 4.25 3.4 5.44l-.87 3.23a.3.3 0 0 0 .44.33L9.1 15.2c.29.04.59.06.9.06 4.418 0 8-2.91 8-6.5S14.418 2 10 2Z" fill="#191919" />
            </svg>
            카카오톡 공유
          </button>
          <button
            type="button"
            onClick={handleWebShare}
            className="flex-1 flex items-center justify-center gap-2 py-3.75 rounded-3.5 border border-gray-70 text-gray-400 text-body-6-1 hover:bg-gray-50 transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M7 10a3 3 0 1 0 6 0 3 3 0 0 0-6 0ZM13.5 5.5a1.5 1.5 0 1 0 3 0 1.5 1.5 0 0 0-3 0ZM3.5 10a1.5 1.5 0 1 0 3 0 1.5 1.5 0 0 0-3 0ZM13.5 14.5a1.5 1.5 0 1 0 3 0 1.5 1.5 0 0 0-3 0Z" stroke="currentColor" strokeWidth="1.5" />
              <path d="M6.5 8.75 13 6.25M6.5 11.25l6.5 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            다른 방법으로 공유
          </button>
        </div>
      </section>

      {/* 초대 현황 */}
      <section className="bg-gray-20 rounded-5 px-8 py-6">
        <h2 className="text-title-2-2 text-gray-500 mb-5">초대 현황</h2>
        <div className="flex items-center justify-between py-4 border-b border-gray-70">
          <span className="text-body-5-3 text-gray-300">초대한 친구</span>
          <span className="text-body-5-1 text-gray-400">
            {isLoggedIn && referral ? `${referral.invited_count}명` : "—"}
          </span>
        </div>
        <div className="flex items-center justify-between py-4">
          <span className="text-body-5-3 text-gray-300">획득한 토큰</span>
          <span className="text-body-5-1 text-primary-100">
            {isLoggedIn && referral ? `+${totalTokensEarned}토큰` : "—"}
          </span>
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
              <p className="text-body-6-3 text-gray-200">
                초대 혜택을 받으려면 먼저 로그인하세요.
              </p>
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
    </main>
    </div>
  );
}
