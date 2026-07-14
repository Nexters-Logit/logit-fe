"use client";

import type { PaymentHistoryItem } from "@/types/api";
import { formatDate, formatPrice } from "../plans/_utils/formatPayment";

export function AccountPaymentRow({ item }: { item: PaymentHistoryItem }) {
  const period =
    item.subscription_started_at && item.subscription_expires_at
      ? `${formatDate(item.subscription_started_at)} ~ ${formatDate(item.subscription_expires_at)}`
      : null;
  const cardInfo = item.card_name
    ? `${item.card_name}${item.card_number ? ` ${item.card_number}` : ""}`
    : null;

  const inner = (
    <>
      <div>
        <p className="text-body-5-3 text-primary-500">결제일 : {formatDate(item.paid_at)}</p>
        <p className="mt-1 flex items-end gap-1">
          <span className="text-title-3 text-primary-600">{formatPrice(item.amount)}</span>
          <span className="text-body-5-3 text-primary-500">원</span>
        </p>
      </div>
      {(period || cardInfo) && (
        <div className="text-right">
          {period && (
            <p className="flex items-end justify-end gap-1 text-gray-300">
              <span className="text-body-1-2">{period}</span>
              <span className="text-body-3-2">| 이용기간</span>
            </p>
          )}
          {cardInfo && (
            <p className="mt-0.5 flex items-end justify-end gap-1 text-gray-200">
              <span className="text-body-5-4">{cardInfo}</span>
              <span className="text-body-3-2">| 결제카드</span>
            </p>
          )}
        </div>
      )}
    </>
  );

  if (item.receipt_url) {
    return (
      <a
        href={item.receipt_url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-start justify-between py-5 transition-opacity hover:opacity-70"
      >
        {inner}
      </a>
    );
  }

  return (
    <div className="flex items-start justify-between py-5">
      {inner}
    </div>
  );
}
