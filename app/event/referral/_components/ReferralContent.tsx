"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import type { ReferralInfo } from "../_apis/referral";

declare global {
  interface Window {
    Kakao?: {
      init: (key: string) => void;
      isInitialized: () => boolean;
      Share: {
        sendDefault: (options: object) => void;
      };
    };
  }
}

const TOKENS_PER_REFERRAL = 10;

interface ReferralContentProps {
  referral: ReferralInfo;
}

export function ReferralContent({ referral }: ReferralContentProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const kakaoKey = process.env.NEXT_PUBLIC_KAKAO_JS_KEY;
    if (kakaoKey && window.Kakao && !window.Kakao.isInitialized()) {
      window.Kakao.init(kakaoKey);
    }
  }, []);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(referral.referral_url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleKakaoShare = () => {
    if (typeof window === "undefined" || !window.Kakao?.isInitialized()) return;
    window.Kakao.Share.sendDefault({
      objectType: "feed",
      content: {
        title: "로짓 친구 초대 이벤트",
        description: `지금 가입하면 두 분 모두 ${TOKENS_PER_REFERRAL}토큰을 받아요!`,
        imageUrl: `${window.location.origin}/logos/og-image.png`,
        link: {
          mobileWebUrl: referral.referral_url,
          webUrl: referral.referral_url,
        },
      },
      buttons: [
        {
          title: "로짓 시작하기",
          link: {
            mobileWebUrl: referral.referral_url,
            webUrl: referral.referral_url,
          },
        },
      ],
    });
  };

  const handleWebShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: "로짓 친구 초대 이벤트",
        text: `지금 가입하면 두 분 모두 ${TOKENS_PER_REFERRAL}토큰을 받아요!`,
        url: referral.referral_url,
      });
    } else {
      handleCopy();
    }
  };

  const totalTokensEarned = referral.invited_count * TOKENS_PER_REFERRAL;

  return (
    <div className="min-h-screen bg-white">
      {/* 헤더 */}
      <header className="flex items-center px-10 py-5 border-b border-gray-70">
        <Image src="/logos/logo-symbol-2d.svg" alt="Logit" width={28} height={28} />
        <Image src="/logos/logo-wordmark.svg" alt="Logit" width={56} height={28} className="ml-2" />
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

        {/* 내 초대 링크 */}
        <section>
          <h2 className="text-title-2-2 text-gray-500 mb-4">내 초대 링크</h2>
          <div className="flex gap-3 mb-4">
            <div className="flex-1 bg-gray-50 rounded-3.5 px-4 py-3.75 text-body-6-3 text-gray-300 truncate select-all">
              {referral.referral_url}
            </div>
            <button
              type="button"
              onClick={handleCopy}
              className="shrink-0 px-5 py-3.75 rounded-3.5 bg-primary-100 text-white text-body-6-1 hover:bg-primary-200 transition-colors"
            >
              {copied ? "복사됨!" : "복사"}
            </button>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleKakaoShare}
              className="flex-1 flex items-center justify-center gap-2 py-3.75 rounded-3.5 bg-[#FEE500] text-[#191919] text-body-6-1 hover:brightness-95 transition-all"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M10 2C5.582 2 2 4.91 2 8.5c0 2.26 1.35 4.25 3.4 5.44l-.87 3.23a.3.3 0 0 0 .44.33L9.1 15.2c.29.04.59.06.9.06 4.418 0 8-2.91 8-6.5S14.418 2 10 2Z"
                  fill="#191919"
                />
              </svg>
              카카오톡 공유
            </button>
            <button
              type="button"
              onClick={handleWebShare}
              className="flex-1 flex items-center justify-center gap-2 py-3.75 rounded-3.5 border border-gray-70 text-gray-400 text-body-6-1 hover:bg-gray-50 transition-colors"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  d="M7 10a3 3 0 1 0 6 0 3 3 0 0 0-6 0ZM13.5 5.5a1.5 1.5 0 1 0 3 0 1.5 1.5 0 0 0-3 0ZM3.5 10a1.5 1.5 0 1 0 3 0 1.5 1.5 0 0 0-3 0ZM13.5 14.5a1.5 1.5 0 1 0 3 0 1.5 1.5 0 0 0-3 0Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <path
                  d="M6.5 8.75 13 6.25M6.5 11.25l6.5 2.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
              다른 방법으로 공유
            </button>
          </div>
        </section>

        {/* 달성 현황 */}
        <section className="bg-gray-20 rounded-5 px-8 py-6">
          <h2 className="text-title-2-2 text-gray-500 mb-5">초대 현황</h2>
          <div className="flex items-center justify-between py-4 border-b border-gray-70">
            <span className="text-body-5-3 text-gray-300">초대한 친구</span>
            <span className="text-body-5-1 text-gray-400">{referral.invited_count}명</span>
          </div>
          <div className="flex items-center justify-between py-4">
            <span className="text-body-5-3 text-gray-300">획득한 토큰</span>
            <span className="text-body-5-1 text-primary-100">+{totalTokensEarned}토큰</span>
          </div>
        </section>
      </main>
    </div>
  );
}
