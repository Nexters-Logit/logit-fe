"use client";

import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useCurrentUser } from "@/app/_hooks/useCurrentUser";
import { useTokenBalance } from "@/app/_hooks/useTokenBalance";
import { useSessionTokenGain } from "@/app/_hooks/useSessionTokenGain";
import { useLoginModal } from "@/components/common/LoginModalContext";
import { getAccessToken, clearAuthTokens } from "@/libs/auth";
import { apiFetch, API_ENDPOINTS } from "@/libs/api-client";
import { showToast } from "@/libs/toast";
import { cn } from "@/libs/utils";
import { useSubscriptionStatus } from "../plans/_hooks/useSubscriptionStatus";
import { usePaymentHistory } from "../plans/_hooks/usePaymentHistory";
import { usePlans } from "../plans/_hooks/usePlans";
import { formatDate } from "../plans/_utils/formatPayment";
import { CancelConfirmDialog } from "../plans/_components/CancelConfirmDialog";
import { MobileCancelDialog } from "@/components/common/MobileCancelDialog";
import { AccountLogitPlanCard } from "./AccountLogitPlanCard";
import { AccountMcpPlanCard } from "./AccountMcpPlanCard";
import { AccountPaymentRow } from "./AccountPaymentRow";
import { AccountPaymentDialog } from "./AccountPaymentDialog";
import type { PlanData, SubscriptionType } from "@/types/api";

type BillingTab = "monthly" | "mcp";

export function AccountPageWeb() {
  const { setLoginModalOpen } = useLoginModal();
  const hasToken = !!getAccessToken();
  const { data: user, isLoading } = useCurrentUser();

  const { data: subscriptionStatus } = useSubscriptionStatus();
  const { data: paymentHistory = [] } = usePaymentHistory();
  const { data: plansData = [] } = usePlans();
  const { data: tokenBalance } = useTokenBalance();
  const { data: sessionTokenGain = 0 } = useSessionTokenGain();
  const queryClient = useQueryClient();

  const [tab, setTab] = useState<BillingTab>("monthly");
  const [paymentTarget, setPaymentTarget] = useState<PlanData | null>(null);
  const [cancelTarget, setCancelTarget] = useState<SubscriptionType | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isCanceling, setIsCanceling] = useState(false);

  useEffect(() => {
    if (!hasToken) {
      setLoginModalOpen(true);
    }
  }, [hasToken, setLoginModalOpen]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem("payment_complete") !== "true") return;
    sessionStorage.removeItem("payment_complete");
    showToast.success("결제가 완료되었어요! 잠시 후 구독이 활성화됩니다.");
    queryClient.invalidateQueries({ queryKey: ["subscriptionStatus"] });
    queryClient.invalidateQueries({ queryKey: ["paymentHistory"] });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!hasToken) {
    return (
      <main className="flex flex-1 items-center justify-center px-10">
        <p className="text-body-5-4 text-gray-200">
          로그인하면 계정 관리를 이용할 수 있어요.
        </p>
      </main>
    );
  }

  if (isLoading) {
    return (
      <main className="flex-1 overflow-y-auto px-10 py-14">
        <div className="mx-auto w-full max-w-230 animate-pulse">
          <div className="mb-6 h-10 w-64 rounded-lg bg-gray-50" />
          <div className="grid grid-cols-3 gap-5">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-52 rounded-2xl bg-gray-50" />
            ))}
          </div>
        </div>
      </main>
    );
  }

  const logitStatus = subscriptionStatus?.logit;
  const mcpStatus = subscriptionStatus?.mcp;
  const activeLogitPlanKey = logitStatus?.is_active ? logitStatus.plan : null;
  const activeMcpPlanKey = mcpStatus?.is_active ? mcpStatus.plan : null;

  const logitPlansFromDB = plansData.filter((p) => p.subscription_type === "logit");
  const mcpPlansFromDB = plansData.filter((p) => p.subscription_type === "mcp");

  const monthlyTokens = tokenBalance?.monthly_tokens ?? 0;
  const usedTokens = Math.max(0, monthlyTokens - (tokenBalance?.balance ?? 0));
  const tokenUsagePercent =
    monthlyTokens > 0 ? Math.min(100, Math.round((usedTokens / monthlyTokens) * 100)) : 0;

  const activeStatus = tab === "monthly" ? logitStatus : mcpStatus;
  const periodDisplay =
    activeStatus?.is_active && activeStatus.started_at && activeStatus.expires_at
      ? `${formatDate(activeStatus.started_at)} ~ ${formatDate(activeStatus.expires_at)}`
      : null;

  const handleCancelConfirm = async () => {
    if (!cancelTarget) return;
    setIsCanceling(true);
    try {
      await apiFetch(API_ENDPOINTS.paymentCancel(cancelTarget), { method: "DELETE" });
      showToast.success("구독 취소가 예약되었습니다.");
      await queryClient.invalidateQueries({ queryKey: ["subscriptionStatus"] });
      setCancelTarget(null);
    } catch (e) {
      showToast.error(e instanceof Error ? e.message : "구독 취소에 실패했습니다.");
    } finally {
      setIsCanceling(false);
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      await apiFetch(API_ENDPOINTS.usersMe, { method: "DELETE" });
      showToast.success("계정이 삭제되었어요.");
      queryClient.clear();
      clearAuthTokens();
      window.location.href = "/";
    } catch {
      showToast.error("계정 삭제에 실패했어요. 잠시 후 다시 시도해 주세요.");
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  return (
    <main className="flex-1 overflow-y-auto px-10 py-10 scrollbar-hide">
      <div className="mx-auto max-w-230">
        {/* Title + tab switcher */}
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h1 className="text-headline-1 text-gray-500">
              {tab === "monthly" ? "Logit 요금제" : "MCP 요금제"}
            </h1>
            {periodDisplay && (
              <p className="mt-1.5 flex items-center gap-1 text-gray-300">
                <span className="text-body-3-2">이용 가능 기간 |</span>
                <span className="text-body-1-2">{periodDisplay}</span>
              </p>
            )}
          </div>
          <div className="flex rounded-7.5 bg-gray-50 p-1">
            <button
              type="button"
              onClick={() => setTab("monthly")}
              className={cn(
                "rounded-7.5 px-6 py-2.5 text-body-4 transition-colors",
                tab === "monthly"
                  ? "bg-primary-100 text-white"
                  : "text-gray-300 hover:text-gray-400",
              )}
            >
              월별 결제
            </button>
            <button
              type="button"
              onClick={() => setTab("mcp")}
              className={cn(
                "rounded-7.5 px-6 py-2.5 text-body-4 transition-colors",
                tab === "mcp"
                  ? "bg-primary-100 text-white"
                  : "text-gray-300 hover:text-gray-400",
              )}
            >
              MCP 결제
            </button>
          </div>
        </div>

        {/* Plan cards */}
        {tab === "monthly" ? (
          <div className="flex gap-5">
            <div className="flex-1">
              <AccountLogitPlanCard
                name="Free"
                price={0}
                isActive={!activeLogitPlanKey}
                isAutoRenew={true}
                expiresAt={null}
                isFree
                tokenAllowance="50토큰"
                hasActivePaidPlan={!!activeLogitPlanKey}
                onSubscribe={() => {}}
                onCancel={() => setCancelTarget("logit")}
              />
            </div>
            {logitPlansFromDB.map((plan) => {
              const isActive = activeLogitPlanKey === plan.plan_key;
              return (
                <div key={plan.id} className="flex-1">
                  <AccountLogitPlanCard
                    name={plan.name}
                    price={plan.price}
                    originalPrice={
                      plan.original_price > 0 && plan.original_price > plan.price
                        ? plan.original_price
                        : undefined
                    }
                    tokenAllowance={`${plan.monthly_tokens.toLocaleString()}토큰`}
                    isActive={isActive}
                    isAutoRenew={isActive ? (logitStatus?.is_auto_renew ?? true) : true}
                    expiresAt={isActive ? (logitStatus?.expires_at ?? null) : null}
                    hasActivePaidPlan={!!activeLogitPlanKey}
                    onSubscribe={() => setPaymentTarget(plan)}
                    onCancel={() => setCancelTarget("logit")}
                  />
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex gap-5">
            {mcpPlansFromDB.map((plan) => {
              const isActive = activeMcpPlanKey === plan.plan_key;
              return (
                <div key={plan.id} className="flex-1">
                  <AccountMcpPlanCard
                    plan={plan}
                    isActive={isActive}
                    isAutoRenew={isActive ? (mcpStatus?.is_auto_renew ?? true) : true}
                    expiresAt={isActive ? (mcpStatus?.expires_at ?? null) : null}
                    onSubscribe={() => setPaymentTarget(plan)}
                    onCancel={() => setCancelTarget("mcp")}
                  />
                </div>
              );
            })}
          </div>
        )}

        {/* Token usage */}
        <section className="mt-14">
          <div className="mb-2 flex items-baseline justify-between">
            <div className="flex items-center gap-1.5">
              <h2 className="text-headline-1 text-gray-500">토큰 사용량</h2>
              {sessionTokenGain > 0 && (
                <span className="rounded-full bg-primary-100 px-2 py-0.5 text-body-8-1 text-white">
                  +{sessionTokenGain}
                </span>
              )}
            </div>
            <p className="text-title-3 text-gray-500 tabular-nums">
              {usedTokens.toLocaleString()}
              <span className="text-body-3-2 text-gray-300"> / {monthlyTokens.toLocaleString()}</span>
            </p>
          </div>
          <p className="mb-4 text-body-3-2 text-gray-300">
            소진하지 않은 토큰들은 이월되지 않으며, 매월 갱신됩니다.
          </p>
          <div className="relative h-9.25 w-full overflow-hidden rounded-full border border-primary-50 bg-white shadow-[inset_0_4px_4px_0_rgba(0,0,0,0.07)]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary-10 to-primary-60 transition-all"
              style={{ width: `${tokenUsagePercent}%` }}
            />
            <span className="absolute right-4 top-1/2 flex -translate-y-1/2 items-end gap-0.5 text-title-2 text-gray-200 tabular-nums">
              {tokenUsagePercent}
              <span className="text-body-5-1">%</span>
            </span>
          </div>
        </section>

        {/* Payment history */}
        <section className="mt-14">
          <h2 className="mb-4 text-headline-1 text-gray-500">결제 내역</h2>
          <div className="divide-y divide-gray-70 border-t border-gray-70">
            {paymentHistory.length > 0 ? (
              paymentHistory.map((item) => (
                <AccountPaymentRow key={item.id} item={item} />
              ))
            ) : (
              <p className="py-8 text-center text-body-7-3 text-gray-200">
                최근 6개월 동안 결제 내역이 없습니다
              </p>
            )}
          </div>
        </section>

        {/* Account management */}
        <section className="mt-14">
          <div className="mb-4 flex items-baseline justify-between">
            <h2 className="text-headline-1 text-gray-500">계정 관리</h2>
            {user?.email && (
              <span className="text-body-2 text-gray-400">{user.email}</span>
            )}
          </div>
          <div className="divide-y divide-gray-70 border-t border-gray-70">
            <a
              href="https://docs.logit.ai.kr"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center py-5 text-body-1-2 text-gray-300 transition-colors hover:text-primary-200"
            >
              가이드 페이지
            </a>
            <a
              href="https://pf.kakao.com/_Jxgxbxn"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center py-5 text-body-1-2 text-gray-300 transition-colors hover:text-primary-200"
            >
              문의하기
            </a>
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              className="flex w-full items-center py-5 text-body-1-2 text-gray-300 transition-colors hover:text-red-400"
            >
              회원탈퇴
            </button>
          </div>
        </section>
      </div>

      <AccountPaymentDialog plan={paymentTarget} onClose={() => setPaymentTarget(null)} />

      {cancelTarget && subscriptionStatus && (
        <CancelConfirmDialog
          open={cancelTarget !== null}
          subType={cancelTarget}
          expiresAt={
            cancelTarget === "logit"
              ? (subscriptionStatus.logit.expires_at ?? null)
              : (subscriptionStatus.mcp.expires_at ?? null)
          }
          onClose={() => setCancelTarget(null)}
          onConfirm={handleCancelConfirm}
          isPending={isCanceling}
        />
      )}

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
