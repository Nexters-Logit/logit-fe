"use client";

import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { cn } from "@/libs/utils";
import { apiFetch, API_ENDPOINTS } from "@/libs/api-client";
import { showToast } from "@/libs/toast";
import type { PlanData, SubscriptionType } from "@/types/api";
import { useSubscriptionStatus } from "../_hooks/useSubscriptionStatus";
import { usePlans } from "../_hooks/usePlans";
import { formatPrice } from "../_utils/formatPayment";
import { MobileCancelDialog } from "@/components/common/MobileCancelDialog";
import { MobilePaymentSheet, type MobilePlanInfo } from "./MobilePaymentSheet";


const FREE_PLAN: PlanData = {
  id: "logit:free",
  subscription_type: "logit",
  plan_key: "free",
  name: "Free",
  original_price: 0,
  price: 0,
  monthly_tokens: 50,
  description: null,
  badge: null,
  features: null,
  is_recommended: false,
  is_free: true,
  display_order: 0,
  show_on_mobile: true,
};

export function PlansPageMobile() {
  const { data: subscriptionStatus } = useSubscriptionStatus();
  const { data: allPlans = [], isError: plansError } = usePlans();
  const plans = [
    FREE_PLAN,
    ...allPlans.filter((p) => p.show_on_mobile ?? p.subscription_type === "logit"),
  ];
  const queryClient = useQueryClient();
  const [cancelTarget, setCancelTarget] = useState<SubscriptionType | null>(null);
  const [isCanceling, setIsCanceling] = useState(false);
  const [paymentPlan, setPaymentPlan] = useState<MobilePlanInfo | null>(null);

  function isActivePlan(plan: PlanData) {
    if (plan.is_free) {
      return !subscriptionStatus?.logit.is_active;
    }
    const status =
      plan.subscription_type === "logit"
        ? subscriptionStatus?.logit
        : subscriptionStatus?.mcp;
    return !!status?.is_active && status.plan === plan.plan_key;
  }

  const hasActiveSubscription =
    subscriptionStatus?.logit.is_active || subscriptionStatus?.mcp.is_active;

  const primaryActiveType: SubscriptionType | null = subscriptionStatus?.logit
    .is_active
    ? "logit"
    : subscriptionStatus?.mcp.is_active
      ? "mcp"
      : null;

  const handleCancelConfirm = async () => {
    if (!cancelTarget) return;
    setIsCanceling(true);
    try {
      await apiFetch(API_ENDPOINTS.paymentCancel(cancelTarget), {
        method: "DELETE",
      });
      showToast.success("구독이 취소되었어요.");
      await queryClient.invalidateQueries({ queryKey: ["subscriptionStatus"] });
      await queryClient.invalidateQueries({ queryKey: ["paymentHistory"] });
      setCancelTarget(null);
    } catch {
      showToast.error("구독 취소에 실패했어요.");
    } finally {
      setIsCanceling(false);
    }
  };

  function isRecommended(plan: PlanData) {
    return !hasActiveSubscription && plan.is_recommended;
  }

  if (plansError) {
    return (
      <main className="flex-1 overflow-y-auto bg-white px-5 py-8 scrollbar-hide">
        <h1 className="mb-6 self-stretch bold_18 text-gray-400">Logit 요금제</h1>
        <p className="text-center text-body-7-3 text-gray-300">
          요금제 정보를 불러오지 못했어요.
          <br />
          잠시 후 다시 시도해 주세요.
        </p>
      </main>
    );
  }

  return (
    <main className="flex-1 overflow-y-auto bg-white px-5 py-8 scrollbar-hide">
      <h1 className="mb-2 self-stretch bold_18 text-gray-400">Logit 요금제</h1>

      <div className="mb-9 self-stretch medium_14 text-gray-500">
        <p>정기결제 이용 동의 시 요금은 매월 자동으로 결제됩니다.</p>
        <p>구독은 언제든지 해지 할 수 있습니다.</p>
      </div>

      <div className={cn("flex flex-col gap-3.5", hasActiveSubscription && "mt-6")}>
        {plans.map((plan) => {
          const active = isActivePlan(plan);
          const recommended = isRecommended(plan);
          const highlighted = active || recommended;
const handleCardClick = (active || plan.is_free)
            ? undefined
            : () =>
                setPaymentPlan({
                  id: plan.plan_key,
                  subscriptionType: plan.subscription_type,
                  name: plan.name,
                  price: plan.price,
                });

          return (
            <div
              key={plan.id}
              role={active ? undefined : "button"}
              tabIndex={active ? undefined : 0}
              onClick={handleCardClick}
              onKeyDown={
                active
                  ? undefined
                  : (e) => e.key === "Enter" && handleCardClick?.()
              }
              className={cn(
                "rounded-5 border p-5 transition-all",
                highlighted ? "border-primary-100 bg-white" : "border-gray-70 bg-gray-20",
                !active && "cursor-pointer active:opacity-70",
              )}
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="medium_20 text-gray-400">
                    {plan.name}
                  </h2>

                  {plan.is_free ? (
                    <p
                      className={cn(
                        "mt-2 text-body-5-2",
                        highlighted ? "text-gray-500" : "text-gray-300",
                      )}
                    >
                      0원
                    </p>
                  ) : (
                    <div className="mt-2 flex items-baseline gap-1.5">
                      <span
                        className={cn(
                          "text-body-8-3 line-through",
                          highlighted ? "text-gray-200" : "text-gray-100",
                        )}
                      >
                        {formatPrice(plan.original_price)}원
                      </span>
                      <span
                        className={cn(
                          "text-body-5-2",
                          highlighted ? "text-gray-500" : "text-gray-300",
                        )}
                      >
                        {formatPrice(plan.price)}원
                      </span>
                    </div>
                  )}
                  <p className="mt-1.5 semibold_12 text-gray-200">
                    월 {plan.monthly_tokens.toLocaleString()}토큰 제공
                  </p>
                </div>

                {active ? (
                  <span className="shrink-0 flex items-center justify-center gap-2.5 rounded-full bg-primary-100 px-2.5 py-1 medium_10 text-white">
                    이용중
                  </span>
                ) : (
                  <span className="shrink-0 flex items-center justify-center gap-2.5 rounded-full border border-gray-300 bg-white px-2.5 py-1 medium_10 text-gray-300">
                    {plan.is_free
                      ? "변경"
                      : recommended
                        ? "추천"
                        : hasActiveSubscription
                          ? "변경"
                          : "선택"}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {hasActiveSubscription && (
        <p className="mt-10 text-center text-body-8-3 text-gray-200">
          이용 중인 요금제 해지를 원하시나요?{" "}
          <button
            type="button"
            onClick={() => primaryActiveType && setCancelTarget(primaryActiveType)}
            className="inline-flex items-center gap-0.5 font-semibold text-gray-300 underline underline-offset-2 hover:text-primary-200"
          >
            구독 취소 하러 가기
            <ChevronRight className="size-3.5" aria-hidden="true" />
          </button>
        </p>
      )}


      <MobileCancelDialog
        open={cancelTarget !== null}
        onClose={() => setCancelTarget(null)}
        onConfirm={handleCancelConfirm}
        isPending={isCanceling}
      />

      <MobilePaymentSheet
        plan={paymentPlan}
        onClose={() => setPaymentPlan(null)}
      />
    </main>
  );
}
