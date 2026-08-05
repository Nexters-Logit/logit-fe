"use client";

import { cn } from "@/libs/utils";
import { formatPrice, formatDateKorean } from "../plans/_utils/formatPayment";

type Props = {
  name: string;
  price: number;
  originalPrice?: number;
  tokenAllowance: string;
  isActive: boolean;
  isAutoRenew: boolean;
  expiresAt: string | null;
  isFree?: boolean;
  hasActivePaidPlan: boolean;
  onSubscribe: () => void;
  onCancel: () => void;
};

export function AccountLogitPlanCard({
  name,
  price,
  originalPrice,
  tokenAllowance,
  isActive,
  isAutoRenew,
  expiresAt,
  isFree = false,
  hasActivePaidPlan,
  onSubscribe,
  onCancel,
}: Props) {
  const showFreeDefault = isFree && !hasActivePaidPlan;
  const isCancelPending = isActive && !isAutoRenew;
  const canResubscribe = isCancelPending && (!expiresAt || new Date(expiresAt) <= new Date());

  return (
    <div
      className={cn(
        "flex h-full flex-col rounded-5 border-2 bg-white p-4",
        isActive ? "border-primary-100" : "border-gray-70",
      )}
    >
      <h3 className="mb-1 text-title-1 text-gray-500">{name}</h3>

      <div className="flex flex-col gap-1.5">
        <div className="flex items-end justify-between">
          <span className="text-body-3-2 text-gray-500">월별 결제 금액</span>
          <span className="flex items-baseline gap-1">
            {originalPrice !== undefined && originalPrice > price && (
              <span className="text-body-4 text-gray-100 line-through">
                {formatPrice(originalPrice)}
              </span>
            )}
            <strong className="text-title-2-2 text-gray-500">
              {formatPrice(price)}
            </strong>
            <span className="text-body-3-1 text-gray-500">원</span>
          </span>
        </div>
        <div className="h-px w-full bg-gray-70" />
        <div className="flex items-center justify-between text-body-5-3 text-gray-300">
          <span>토큰 제공량</span>
          <span>{tokenAllowance}</span>
        </div>
      </div>

      {isCancelPending && expiresAt && (
        <p className="mt-4 text-body-9-3 text-red-400">
          ⓘ {formatDateKorean(expiresAt)}에 이용 종료 예정입니다.
        </p>
      )}

      <div className="mt-auto pt-5">
        {showFreeDefault ? (
          <div className="flex h-16 items-center justify-center rounded-3.5 bg-gray-50 text-body-3-2 text-gray-200">
            무료로 이용 중
          </div>
        ) : isCancelPending ? (
          canResubscribe ? (
            <button
              type="button"
              onClick={onSubscribe}
              className="h-16 w-full rounded-3.5 bg-primary-20 text-body-3-2 text-primary-200 transition-colors hover:bg-primary-50"
            >
              재구독
            </button>
          ) : (
            <div className="flex h-16 items-center justify-center rounded-3.5 bg-gray-50 text-body-8-1 text-gray-200">
              {formatDateKorean(expiresAt!)} 종료 후 재구독 가능
            </div>
          )
        ) : isActive ? (
          <button
            type="button"
            onClick={onCancel}
            className="h-16 w-full rounded-3.5 bg-primary-50 text-body-3-2 text-gray-300 transition-colors hover:bg-gray-50"
          >
            구독 취소 하기
          </button>
        ) : (
          <button
            type="button"
            onClick={onSubscribe}
            className="h-16 w-full rounded-3.5 bg-primary-20 text-body-3-2 text-primary-200 transition-colors hover:bg-primary-50"
          >
            구독 하기
          </button>
        )}
      </div>
    </div>
  );
}
