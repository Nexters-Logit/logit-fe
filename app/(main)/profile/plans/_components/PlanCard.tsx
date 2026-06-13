"use client";

import { Check, ChevronRight } from "lucide-react";
import { cn } from "@/libs/utils";
import { formatPrice } from "../_utils/formatPayment";

export type SubscriptionPlan = "basic" | "lite" | "pro";
export type SubscriptionType = "mcp" | "logit";

export type Plan = {
  id: SubscriptionPlan;
  subscriptionType: SubscriptionType;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  period: string;
  badge?: string;
  features: string[];
  isFree?: boolean;
};

export function PlanCard({
  plan,
  recommended = false,
  onSelect,
}: {
  plan: Plan;
  recommended?: boolean;
  onSelect: (plan: Plan) => void;
}) {
  return (
    <article
      className={cn(
        "relative flex min-h-110 flex-col overflow-hidden rounded-3xl border bg-white p-7 text-left shadow-card transition-all",
        recommended
          ? "border-primary-100 ring-1 ring-primary-100"
          : "border-gray-70",
      )}
    >
      {plan.badge && (
        <span
          className={cn(
            "absolute right-5 top-5 rounded-full px-3 py-1 text-body-9-2",
            recommended
              ? "bg-primary-200 text-white"
              : "bg-primary-50 text-primary-200",
          )}
        >
          {plan.badge}
        </span>
      )}

      <div className="pr-28">
        <h3 className="text-title-3 text-gray-500">{plan.name}</h3>
        <p className="mt-2 min-h-12 text-body-7-3 text-gray-200">
          {plan.description}
        </p>
      </div>

      <div className="mt-7 min-h-15">
        {plan.originalPrice && (
          <p className="mb-0.5 text-body-7-3 text-gray-100 line-through">
            월 {formatPrice(plan.originalPrice)}원
          </p>
        )}
        <div className="flex items-end gap-1">
          <strong className="text-headline-1 text-gray-500">
            {formatPrice(plan.price)}원
          </strong>
          {!plan.isFree && (
            <span className="pb-1 text-body-7-3 text-gray-200">
              / {plan.period}
            </span>
          )}
        </div>
      </div>

      <div className="my-6 h-px bg-gray-50" />

      <ul className="flex flex-1 flex-col gap-3.5">
        {plan.features.map((feature) => (
          <li
            key={feature}
            className="flex items-start gap-2.5 text-body-7-3 text-gray-300"
          >
            <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-primary-20 text-primary-200">
              <Check className="size-3" strokeWidth={3} />
            </span>
            {feature}
          </li>
        ))}
      </ul>

      {plan.isFree ? (
        <div className="mt-8 flex h-12 w-full items-center justify-center rounded-3.5 bg-gray-50 text-body-5-2 text-gray-200">
          무료로 이용 중
        </div>
      ) : (
        <button
          type="button"
          onClick={() => onSelect(plan)}
          className={cn(
            "mt-8 flex h-12 w-full cursor-pointer items-center justify-center gap-1 rounded-3.5 text-body-5-2 transition-colors",
            recommended
              ? "bg-primary-100 text-white hover:bg-primary-200"
              : "bg-primary-20 text-primary-200 hover:bg-primary-50",
          )}
        >
          이 요금제 선택
          <ChevronRight className="size-4" aria-hidden="true" />
        </button>
      )}
    </article>
  );
}
