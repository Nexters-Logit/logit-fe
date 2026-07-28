"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useCurrentUser } from "@/app/_hooks/useCurrentUser";
import { getAccessToken, logout, clearAuthTokens } from "@/libs/auth";
import { apiFetch, API_ENDPOINTS } from "@/libs/api-client";
import { showToast } from "@/libs/toast";
import { useSubscriptionStatus } from "../plans/_hooks/useSubscriptionStatus";
import { usePaymentHistory } from "../plans/_hooks/usePaymentHistory";
import {
  formatDate,
  formatPrice,
  PLAN_DISPLAY_NAME,
} from "../plans/_utils/formatPayment";
import { MobileCancelDialog } from "@/components/common/MobileCancelDialog";
import { MobileLoginScreen } from "./MobileLoginScreen";

function formatKoreanDate(iso: string | null): string {
  if (!iso) return "-";
  const d = new Date(iso);
  return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`;
}

export function ProfilePageMobile() {
  const hasToken = !!getAccessToken();
  const { data: user } = useCurrentUser();
  const { data: subscriptionStatus } = useSubscriptionStatus();
  const { data: paymentHistory } = usePaymentHistory();
  const mockPaymentHistory = [
    {
      id: "mock-1",
      subscription_type: "logit",
      plan: "pro",
      amount: 19900,
      pay_state: 1,
      pay_state_label: "결제완료",
      paid_at: "2025-07-01T09:00:00.000Z",
      created_at: "2025-07-01T09:00:00.000Z",
      card_name: "신한카드",
      card_number: "1234",
      receipt_url: null,
      subscription_started_at: "2025-07-01T00:00:00.000Z",
      subscription_expires_at: "2025-07-31T23:59:59.000Z",
    },
    {
      id: "mock-2",
      subscription_type: "mcp",
      plan: "basic",
      amount: 9900,
      pay_state: 1,
      pay_state_label: "결제완료",
      paid_at: "2025-06-01T09:00:00.000Z",
      created_at: "2025-06-01T09:00:00.000Z",
      card_name: "카카오뱅크",
      card_number: "5678",
      receipt_url: null,
      subscription_started_at: "2025-06-01T00:00:00.000Z",
      subscription_expires_at: "2025-06-30T23:59:59.000Z",
    },
    {
      id: "mock-3",
      subscription_type: "logit",
      plan: "lite",
      amount: 9900,
      pay_state: 1,
      pay_state_label: "결제완료",
      paid_at: "2025-05-01T09:00:00.000Z",
      created_at: "2025-05-01T09:00:00.000Z",
      card_name: null,
      card_number: null,
      receipt_url: null,
      subscription_started_at: "2025-05-01T00:00:00.000Z",
      subscription_expires_at: "2025-05-31T23:59:59.000Z",
    },
  ];
  const queryClient = useQueryClient();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
    } catch {
      setIsLoggingOut(false);
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      await apiFetch(API_ENDPOINTS.usersMe, { method: "DELETE" });
      showToast.success("계정이 삭제되었어요.");
      queryClient.clear();
      clearAuthTokens();
      window.location.href = "/profile";
    } catch {
      showToast.error("계정 삭제에 실패했어요. 잠시 후 다시 시도해 주세요.");
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  if (!hasToken) return <MobileLoginScreen />;

  const logitStatus = subscriptionStatus?.logit;
  const activePlan = logitStatus?.is_active ? logitStatus : null;
  const latestPayment = mockPaymentHistory?.[0];

  const cardInfo =
    latestPayment?.card_name
      ? `${latestPayment.card_name}${latestPayment.card_number ? ` ${latestPayment.card_number}` : ""}`
      : null;

  return (
    <main className="flex-1 overflow-y-auto bg-white px-5 py-8 scrollbar-hide">
      <h1 className="mb-6 text-title-2 text-gray-500">계정</h1>

      <section className="mb-8">
        <h2 className="mb-3 text-body-5-2 text-gray-400">요금제 정보</h2>
        <div className="overflow-hidden rounded-2xl border border-gray-70">
          <div className="px-5 py-5">
            {activePlan ? (
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-body-5-2 text-gray-500">
                    {PLAN_DISPLAY_NAME[activePlan.plan ?? ""] ?? activePlan.plan}
                    {activePlan.amount != null && (
                      <span className="ml-1 font-normal text-gray-300">
                        / {formatPrice(activePlan.amount)}원
                      </span>
                    )}
                  </p>
                  {activePlan.next_payment_date && (
                    <p className="mt-1.5 text-body-8-3 text-gray-300">
                      다음 결제일 : {formatKoreanDate(activePlan.next_payment_date)}
                    </p>
                  )}
                  {cardInfo && (
                    <p className="mt-0.5 text-body-8-3 text-gray-300">
                      결제 카드 : {cardInfo}
                    </p>
                  )}
                </div>
                <span className="shrink-0 rounded-full bg-primary-100 px-2.5 py-1 text-body-9-2 text-white">
                  이용중
                </span>
              </div>
            ) : (
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-body-5-2 text-gray-500">Free</p>
                  <p className="mt-1 text-body-7-3 text-gray-200">무료 플랜</p>
                </div>
              </div>
            )}
          </div>
          <Link
            href="/profile/plans"
            className="flex items-center justify-center gap-1 border-t border-gray-70 py-3 regular_14 text-gray-300 transition-colors bg-gray-20"
          >
            요금제 더보기
            <ChevronRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="mb-3 text-body-5-2 text-gray-400">결제 내역</h2>
        {mockPaymentHistory.length > 0 ? (
          <div className="divide-y divide-gray-50">
            {mockPaymentHistory.map((item) => {
              const itemCardInfo = item.card_name
                ? `${item.card_name}${item.card_number ? ` ${item.card_number}` : ""}`
                : null;
              const period =
                item.subscription_started_at && item.subscription_expires_at
                  ? `${formatDate(item.subscription_started_at)} ~ ${formatDate(item.subscription_expires_at)}`
                  : null;

              return (
                <div key={item.id} className="py-4">
                  <div className="flex items-baseline justify-between">
                    <span className="regular_14 text-gray-400">
                      {formatDate(item.paid_at)}.
                    </span>
                    <span className="regular_14 text-gray-300">
                      {formatPrice(item.amount)}원
                    </span>
                  </div>
                  {period && (
                    <p className="mt-1 text-body-9-3 text-gray-300">
                      요금제 사용 기간 : {period}
                    </p>
                  )}
                  {itemCardInfo && (
                    <p className="mt-0.5 text-body-9-3 text-gray-300">
                      결제 카드 : {itemCardInfo}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-center text-body-7-3 text-gray-200">
            최근 6개월 동안 주문 내역이 없습니다
          </p>
        )}
      </section>

      <section>
        <div className="mb-3 flex items-baseline justify-between">
          <h2 className="text-body-5-2 text-gray-400">계정 관리</h2>
          {user?.email && (
            <span className="text-body-9-3 text-gray-200">{user.email}</span>
          )}
        </div>
        <div className="flex flex-col">
          <Link
            href="#"
            className="flex w-full items-center justify-between py-4 regular_14 text-gray-400 transition-colors hover:text-primary-200"
          >
            가이드 페이지
            <ChevronRight className="size-4 text-gray-200" aria-hidden="true" />
          </Link>
          <Link
            href="#"
            className="flex w-full items-center justify-between py-4 regular_14 text-gray-400 transition-colors hover:text-primary-200"
          >
            문의하기
            <ChevronRight className="size-4 text-gray-200" aria-hidden="true" />
          </Link>
          <button
            type="button"
            disabled={isLoggingOut}
            onClick={handleLogout}
            className="flex w-full items-center justify-between py-4 regular_14 text-gray-400 transition-colors hover:text-primary-200 disabled:opacity-50"
          >
            {isLoggingOut ? "로그아웃 중..." : "로그아웃"}
            <ChevronRight className="size-4 text-gray-200" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => setShowDeleteConfirm(true)}
            className="flex w-full items-center justify-between py-4 regular_14 text-gray-400 transition-colors hover:text-red-400"
          >
            회원탈퇴
            <ChevronRight className="size-4 text-gray-200" aria-hidden="true" />
          </button>
        </div>
      </section>

      <MobileCancelDialog
        open={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDeleteAccount}
        isPending={isDeleting}
        title="정말 탈퇴하시겠어요?"
        description="탈퇴하면 모든 데이터가 삭제되고 복구할 수 없어요."
        dismissLabel="취소"
        confirmLabel="탈퇴하기"
        confirmVariant="danger"
      />
    </main>
  );
}
