"use client";

import type { PaymentHistoryItem } from "@/types/api";
import { PaymentRow } from "./PaymentRow";

export function PaymentHistorySection({
  items,
}: {
  items: PaymentHistoryItem[];
}) {
  if (items.length === 0) return null;

  return (
    <section className="mt-14">
      <h2 className="mb-2 text-title-4 text-gray-500">결제 내역</h2>
      <p className="mb-4 text-body-8-2 text-gray-200">
        최근 결제 내역을 확인하세요.
      </p>
      <div className="rounded-2xl border border-gray-70 bg-white px-5">
        {items.map((item) => (
          <PaymentRow key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}
