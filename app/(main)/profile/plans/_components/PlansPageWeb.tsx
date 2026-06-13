"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Bot,
  ChevronRight,
  Gift,
  Sparkles,
  X,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { apiFetch, API_ENDPOINTS } from "@/libs/api-client";
import { showToast } from "@/libs/toast";
import { useUserMe } from "@/app/_hooks/useUserMe";
import { useSubscriptionStatus } from "../_hooks/useSubscriptionStatus";
import { usePaymentHistory } from "../_hooks/usePaymentHistory";
import { usePlans } from "../_hooks/usePlans";
import { PlanCard, type Plan } from "./PlanCard";
import { TermsCheckbox } from "./TermsCheckbox";
import { SubscriptionStatusSection } from "./SubscriptionStatusSection";
import { PaymentHistorySection } from "./PaymentHistorySection";
import { formatPrice } from "../_utils/formatPayment";
import type { PlanData } from "@/types/api";

const FREE_PLAN: Plan = {
  id: "basic",
  subscriptionType: "logit",
  name: "Free",
  description: "Logit의 핵심 기능을 무료로 시작해 보세요",
  price: 0,
  period: "무료",
  badge: "기본 제공",
  isFree: true,
  features: [
    "무료 초안 생성 3회",
    "AI 채팅 15회",
    "친구 초대 후 가입 시 초안 1회 추가",
  ],
};

function planDataToPlan(p: PlanData): Plan {
  return {
    id: p.plan_key as Plan["id"],
    subscriptionType: p.subscription_type,
    name: p.name,
    description: p.description ?? "",
    price: p.price,
    originalPrice: p.original_price > 0 ? p.original_price : undefined,
    period: "월",
    badge: p.badge ?? undefined,
    features: p.features ?? [],
  };
}

const TERMS = [
  { id: "service", label: "서비스 이용약관 동의", required: true },
  { id: "privacy", label: "개인정보 수집 및 이용 동의", required: true },
  { id: "payment", label: "정기결제 및 환불 정책 동의", required: true },
  { id: "marketing", label: "혜택 및 이벤트 알림 수신 동의", required: false },
] as const;

type TermId = (typeof TERMS)[number]["id"];

export function PlansPageWeb() {
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [checkedTerms, setCheckedTerms] = useState<Set<TermId>>(new Set());
  const [phone, setPhone] = useState("");
  const [isPaymentPending, setIsPaymentPending] = useState(false);

  const { data: user } = useUserMe();
  const { data: subscriptionStatus } = useSubscriptionStatus();
  const { data: paymentHistory } = usePaymentHistory();
  const { data: plansData = [] } = usePlans();

  const logitPlans: Plan[] = [
    FREE_PLAN,
    ...plansData
      .filter((p) => p.subscription_type === "logit")
      .map(planDataToPlan),
  ];
  const mcpPlan = plansData.find((p) => p.subscription_type === "mcp");
  const mcpPlanCard = mcpPlan ? planDataToPlan(mcpPlan) : null;
  const hasPrefilledPhone = useRef(false);

  useEffect(() => {
    if (user?.phone && !hasPrefilledPhone.current) {
      hasPrefilledPhone.current = true;
      const digits = user.phone.replace(/\D/g, "");
      if (digits.length <= 3) {
        setPhone(digits);
      } else if (digits.length <= 7) {
        setPhone(`${digits.slice(0, 3)}-${digits.slice(3)}`);
      } else {
        setPhone(
          `${digits.slice(0, 3)}-${digits.slice(3, digits.length - 4)}-${digits.slice(-4)}`,
        );
      }
    }
  }, [user?.phone]);

  const requiredTermIds = TERMS.filter((term) => term.required).map(
    (term) => term.id,
  );
  const allRequiredChecked = requiredTermIds.every((id) =>
    checkedTerms.has(id),
  );
  const allChecked = TERMS.every((term) => checkedTerms.has(term.id));
  const normalizedPhone = phone.replace(/\D/g, "");
  const isPhoneValid =
    normalizedPhone.length === 10 || normalizedPhone.length === 11;

  const toggleTerm = (id: TermId) => {
    setCheckedTerms((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    setCheckedTerms(
      allChecked ? new Set() : new Set(TERMS.map((term) => term.id)),
    );
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setSelectedPlan(null);
      setCheckedTerms(new Set());
      setPhone("");
      setIsPaymentPending(false);
    }
  };

  const handlePhoneChange = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 11);
    if (digits.length <= 3) {
      setPhone(digits);
    } else if (digits.length <= 7) {
      setPhone(`${digits.slice(0, 3)}-${digits.slice(3)}`);
    } else {
      setPhone(
        `${digits.slice(0, 3)}-${digits.slice(3, digits.length - 4)}-${digits.slice(-4)}`,
      );
    }
  };

  const handlePayment = async () => {
    if (!selectedPlan || !allRequiredChecked || isPaymentPending) return;

    if (!isPhoneValid) {
      showToast.error("휴대폰 번호를 확인해 주세요.");
      return;
    }

    setIsPaymentPending(true);

    try {
      const { payurl } = await apiFetch<{ payurl: string; rebill_no: string }>(
        API_ENDPOINTS.paymentInitiate,
        {
          method: "POST",
          body: JSON.stringify({
            subscription_type: selectedPlan.subscriptionType,
            plan: selectedPlan.id,
            phone: normalizedPhone,
          }),
        },
      );

      window.location.assign(payurl);
    } catch {
      showToast.error("결제를 시작하지 못했습니다. 잠시 후 다시 시도해 주세요.");
      setIsPaymentPending(false);
    }
  };

  return (
    <main className="flex-1 overflow-y-auto bg-gray-20 px-5 py-10 scrollbar-hide md:px-10 md:py-14">
      <div className="mx-auto w-full max-w-280">
        <Link
          href="/profile"
          className="mb-8 inline-flex items-center gap-1.5 text-body-7-2 text-gray-300 transition-colors hover:text-primary-200"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          프로필로 돌아가기
        </Link>

        {subscriptionStatus && (
          <SubscriptionStatusSection
            logit={subscriptionStatus.logit}
            mcp={subscriptionStatus.mcp}
            paymentHistory={paymentHistory ?? []}
          />
        )}

        <div className="mb-10">
          <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-primary-50 px-3 py-1.5 text-body-9-2 text-primary-200">
            <Sparkles className="size-3.5" aria-hidden="true" />
            나에게 맞는 플랜 선택
          </div>
          <h1 className="text-title-1 text-gray-500">요금제를 선택해 주세요</h1>
          <p className="mt-2 text-body-5-4 text-gray-200">
            모든 요금제는 언제든 해지할 수 있어요.
          </p>
        </div>

        <section aria-labelledby="logit-plans-title">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary-50 text-primary-200">
              <Sparkles className="size-5" aria-hidden="true" />
            </div>
            <div>
              <h2 id="logit-plans-title" className="text-title-4 text-gray-500">
                Logit 구독
              </h2>
              <p className="mt-0.5 text-body-8-2 text-gray-200">
                초안 생성과 AI 채팅 사용량을 선택하세요.
              </p>
            </div>
          </div>

          <div className="grid gap-5 lg:grid-cols-3">
            {logitPlans.map((plan) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                recommended={plansData.find((p) => p.plan_key === plan.id)?.is_recommended ?? false}
                onSelect={setSelectedPlan}
              />
            ))}
          </div>

          <div className="mt-5 flex items-start gap-3 rounded-2xl border border-primary-50 bg-primary-20 px-5 py-4">
            <Gift className="mt-0.5 size-5 shrink-0 text-primary-200" />
            <div>
              <p className="text-body-7-2 text-gray-400">친구 초대 혜택</p>
              <p className="mt-1 text-body-8-2 text-gray-200">
                초대한 친구가 회원가입을 완료할 때마다 무료 초안 생성
                1회를 추가로 드려요.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-14" aria-labelledby="mcp-plan-title">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary-50 text-primary-200">
              <Bot className="size-5" aria-hidden="true" />
            </div>
            <div>
              <h2 id="mcp-plan-title" className="text-title-4 text-gray-500">
                MCP 구독
              </h2>
              <p className="mt-0.5 text-body-8-2 text-gray-200">
                Logit의 경험 데이터를 사용하는 AI 도구와 연결하세요.
              </p>
            </div>
          </div>

          {mcpPlanCard && (
            <div className="max-w-90">
              <PlanCard plan={mcpPlanCard} onSelect={setSelectedPlan} />
            </div>
          )}
        </section>

        <p className="mt-8 text-center text-body-9-3 text-gray-200">
          표시된 금액은 부가세가 포함된 최종 결제 금액입니다.
        </p>

        {paymentHistory && paymentHistory.length > 0 && (
          <PaymentHistorySection items={paymentHistory} />
        )}
      </div>

      <Dialog open={!!selectedPlan} onOpenChange={handleOpenChange}>
        <DialogContent
          showCloseButton={false}
          className="fixed inset-x-0 bottom-0 top-auto left-0 z-50 w-full max-w-none translate-x-0 translate-y-0 gap-0 rounded-b-none rounded-t-3xl border-0 bg-white p-0 shadow-sheet sm:left-1/2 sm:max-w-160 sm:-translate-x-1/2"
        >
          <div className="mx-auto mt-3 h-1 w-10 rounded-full bg-gray-70" />
          <div className="flex items-start justify-between px-6 pb-5 pt-5 md:px-8">
            <div>
              <DialogTitle className="text-title-3 text-gray-500">
                약관 동의
              </DialogTitle>
              <DialogDescription className="mt-1.5 text-body-7-3 text-gray-200">
                결제를 위해 아래 약관에 동의해 주세요.
              </DialogDescription>
            </div>
            <button
              type="button"
              onClick={() => handleOpenChange(false)}
              className="rounded-lg p-1 text-gray-300 transition-colors hover:bg-gray-20"
              aria-label="약관 동의 닫기"
            >
              <X className="size-6" />
            </button>
          </div>

          {selectedPlan && (
            <div className="mx-6 flex items-center justify-between rounded-2xl bg-primary-20 px-5 py-4 md:mx-8">
              <div>
                <p className="text-body-7-2 text-primary-200">
                  {selectedPlan.subscriptionType === "mcp"
                    ? "MCP 구독"
                    : "Logit 구독"}{" "}
                  · {selectedPlan.name}
                </p>
                <p className="mt-1 text-body-9-3 text-gray-200">
                  매 {selectedPlan.period} 자동 결제
                </p>
              </div>
              <div className="text-right">
                {selectedPlan.originalPrice && (
                  <p className="text-body-9-3 text-gray-100 line-through">
                    {formatPrice(selectedPlan.originalPrice)}원
                  </p>
                )}
                <p className="text-body-3-1 text-gray-500">
                  {formatPrice(selectedPlan.price)}원
                </p>
              </div>
            </div>
          )}

          <div className="px-6 py-5 md:px-8">
            <div className="mb-5">
              <label
                htmlFor="payment-phone"
                className="mb-2 block text-body-7-2 text-gray-400"
              >
                결제 알림을 받을 휴대폰 번호
              </label>
              <Input
                id="payment-phone"
                type="tel"
                inputMode="numeric"
                autoComplete="tel"
                value={phone}
                onChange={(event) => handlePhoneChange(event.target.value)}
                placeholder="010-1234-5678"
                className="h-12 rounded-xl bg-white text-body-5-4"
                aria-invalid={phone.length > 0 && !isPhoneValid}
              />
              {user?.phone && (
                <p className="mt-1.5 text-body-9-3 text-gray-200">
                  저장된 번호가 자동 입력되었어요. 변경하시면 새 번호로 저장됩니다.
                </p>
              )}
            </div>

            <div className="border-b border-gray-70 pb-5">
              <TermsCheckbox
                checked={allChecked}
                onChange={toggleAll}
                label="전체 동의"
                description="선택 약관을 포함한 모든 약관에 동의합니다."
              />
            </div>

            <div className="flex flex-col gap-4 py-5">
              {TERMS.map((term) => (
                <div key={term.id} className="flex items-center justify-between">
                  <TermsCheckbox
                    checked={checkedTerms.has(term.id)}
                    onChange={() => toggleTerm(term.id)}
                    label={
                      <>
                        <span
                          className={
                            term.required ? "text-primary-200" : "text-gray-200"
                          }
                        >
                          [{term.required ? "필수" : "선택"}]
                        </span>{" "}
                        {term.label}
                      </>
                    }
                  />
                  <button
                    type="button"
                    className="shrink-0 p-1 text-gray-100 transition-colors hover:text-gray-300"
                    aria-label={`${term.label} 자세히 보기`}
                  >
                    <ChevronRight className="size-4" />
                  </button>
                </div>
              ))}
            </div>

            <button
              type="button"
              disabled={!allRequiredChecked || isPaymentPending}
              onClick={handlePayment}
              className="h-13 w-full rounded-3.5 bg-primary-100 text-body-5-2 text-white transition-colors hover:bg-primary-200 disabled:cursor-not-allowed disabled:bg-gray-100"
            >
              {isPaymentPending
                ? "결제 페이지를 여는 중..."
                : selectedPlan
                  ? `${formatPrice(selectedPlan.price)}원 결제하기`
                  : "결제하기"}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
}
