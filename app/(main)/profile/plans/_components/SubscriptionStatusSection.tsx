"use client";

import type { PlanStatus, PaymentHistoryItem } from "@/types/api";
import { SubscriptionCard } from "./SubscriptionCard";

export function SubscriptionStatusSection({
  logit,
  mcp,
  paymentHistory,
}: {
  logit: PlanStatus;
  mcp: PlanStatus;
  paymentHistory: PaymentHistoryItem[];
}) {
  const activeStatuses = [logit, mcp].filter((s) => s.is_active);

  if (activeStatuses.length === 0) return null;

  const latestByType = paymentHistory.reduce<Record<string, PaymentHistoryItem>>(
    (acc, item) => {
      if (!acc[item.subscription_type]) {
        acc[item.subscription_type] = item;
      }
      return acc;
    },
    {},
  );

  return (
    <section className="mb-12">
      <h2 className="mb-4 text-title-4 text-gray-500">현재 구독</h2>
      <div className="flex flex-col gap-4">
        {activeStatuses.map((status) => (
          <SubscriptionCard
            key={status.subscription_type}
            status={status}
            latestPayment={latestByType[status.subscription_type]}
          />
        ))}
      </div>
    </section>
  );
}
