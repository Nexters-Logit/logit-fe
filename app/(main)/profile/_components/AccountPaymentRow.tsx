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

  return (
    <div className="flex items-start justify-between py-5">
      <div>
        <p className="text-body-8-3 text-gray-200">결제일 : {formatDate(item.paid_at)}</p>
        <p className="mt-1 text-body-5-2 text-gray-500">{formatPrice(item.amount)}원</p>
      </div>
      {(period || cardInfo) && (
        <div className="text-right">
          {period && (
            <p className="text-body-8-3 text-gray-200">{period} | 이용기간</p>
          )}
          {cardInfo && (
            <p className="mt-0.5 text-body-8-3 text-gray-200">{cardInfo} | 결제카드</p>
          )}
        </div>
      )}
    </div>
  );
}
