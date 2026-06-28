"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useIsMobile } from "@/app/_hooks/useIsMobile";
import { apiFetch, API_ENDPOINTS } from "@/libs/api-client";
import type { SubscriptionStatusResponse } from "@/types/api";

type Step = "loading" | "success" | "timeout";

const POLL_INTERVAL = 2000;
const MAX_ATTEMPTS = 15;

export default function PaymentCompletePage() {
  const router = useRouter();
  const qc = useQueryClient();
  const isMobile = useIsMobile();
  // Lock the initial detection to prevent behavior changes on resize
  const [lockedMobile, setLockedMobile] = useState<boolean | null>(null);
  const [step, setStep] = useState<Step>("loading");
  const attempts = useRef(0);
  const didRedirect = useRef(false);
  const didStartPoll = useRef(false);

  // Lock mobile/web decision on first detection
  useEffect(() => {
    if (isMobile !== null && lockedMobile === null) {
      setLockedMobile(isMobile);
    }
  }, [isMobile, lockedMobile]);

  // Web: set sessionStorage flag and redirect to /profile
  useEffect(() => {
    if (lockedMobile !== false) return;
    if (didRedirect.current) return;
    didRedirect.current = true;
    sessionStorage.setItem("payment_complete", "true");
    router.replace("/profile");
  }, [lockedMobile, router]);

  // Mobile: poll subscription status
  useEffect(() => {
    if (lockedMobile !== true) return;
    if (didStartPoll.current) return;
    didStartPoll.current = true;

    const check = async () => {
      try {
        const status = await apiFetch<SubscriptionStatusResponse>(
          API_ENDPOINTS.subscriptionStatus,
        );
        const isActive = status.logit.is_active || status.mcp.is_active;

        if (isActive) {
          await qc.invalidateQueries({ queryKey: ["subscriptionStatus"] });
          await qc.invalidateQueries({ queryKey: ["paymentHistory"] });
          setStep("success");
          return;
        }
      } catch {
        // ignore, retry
      }

      attempts.current += 1;
      if (attempts.current >= MAX_ATTEMPTS) {
        setStep("timeout");
        return;
      }
      setTimeout(check, POLL_INTERVAL);
    };

    check();
  }, [lockedMobile, qc]);

  // Still determining web vs mobile, or web redirect pending
  if (lockedMobile === null || lockedMobile === false) {
    return (
      <main className="flex flex-1 flex-col items-center justify-center gap-6 p-10">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary-100 border-t-transparent" />
      </main>
    );
  }

  // Mobile screens
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 p-10">
      {step === "loading" && (
        <>
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary-100 border-t-transparent" />
          <div className="text-center">
            <p className="text-body-5-2 text-gray-500">결제가 완료되었어요!</p>
            <p className="mt-1.5 text-body-7-3 text-gray-300">
              구독을 활성화하는 중이에요. 잠시만 기다려 주세요.
            </p>
          </div>
        </>
      )}

      {step === "success" && (
        <>
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-20">
            <svg
              className="h-8 w-8 text-primary-100"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div className="text-center">
            <p className="text-body-5-2 text-gray-500">구독이 활성화되었어요!</p>
            <p className="mt-1.5 text-body-7-3 text-gray-300">
              이제 Logit의 모든 기능을 이용하실 수 있어요.
            </p>
          </div>
          <button
            type="button"
            onClick={() => router.replace("/profile")}
            className="mt-2 rounded-3.5 bg-primary-100 px-8 py-3 text-body-7-2 text-white transition-colors hover:bg-primary-200"
          >
            계정 페이지로 이동
          </button>
        </>
      )}

      {step === "timeout" && (
        <div className="text-center">
          <p className="text-body-5-2 text-gray-500">구독 확인이 지연되고 있어요.</p>
          <p className="mt-1.5 text-body-7-3 text-gray-300">
            잠시 후 계정 페이지에서 확인해 주세요.
          </p>
          <button
            type="button"
            onClick={() => router.replace("/profile")}
            className="mt-6 rounded-3.5 bg-primary-100 px-8 py-3 text-body-7-2 text-white transition-colors hover:bg-primary-200"
          >
            계정 페이지로 이동
          </button>
        </div>
      )}
    </main>
  );
}
