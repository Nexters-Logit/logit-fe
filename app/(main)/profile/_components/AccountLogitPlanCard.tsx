"use client";

import { cn } from "@/libs/utils";
import { formatPrice, formatDateKorean } from "../plans/_utils/formatPayment";

type Props = {
  name: string;
  price: number;
  originalPrice?: number;
  draftLimit: string;
  chatLimit: string;
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
  draftLimit,
  chatLimit,
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

  return (
    <div
      className={cn(
        "flex flex-col rounded-2xl border p-6",
        isActive ? "border-primary-100 bg-primary-20" : "border-gray-70 bg-white",
      )}
    >
      <h3 className="mb-5 text-title-3 text-gray-500">{name}</h3>

      <div className="flex flex-col gap-3 text-body-7-3">
        <div className="flex items-baseline justify-between">
          <span className="text-gray-200">총 결제 금액</span>
          <span>
            {originalPrice !== undefined && originalPrice > price && (
              <span className="mr-1.5 text-body-8-3 text-gray-100 line-through">
                {formatPrice(originalPrice)}
              </span>
            )}
            <strong className="text-body-5-2 text-gray-500">
              {formatPrice(price)}원
            </strong>
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-200">초안 생성</span>
          <span className="text-gray-400">{draftLimit}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-200">채팅</span>
          <span className="text-gray-400">{chatLimit}</span>
        </div>
      </div>

      {isCancelPending && expiresAt && (
        <p className="mt-4 text-body-9-3 text-red-400">
          ⓘ {formatDateKorean(expiresAt)}에 이용 종료 예정입니다.
        </p>
      )}

      <div className="mt-6">
        {showFreeDefault ? (
          <div className="flex h-10 items-center justify-center rounded-xl bg-gray-50 text-body-7-2 text-gray-200">
            무료로 이용 중
          </div>
        ) : isCancelPending ? (
          <button
            type="button"
            onClick={onSubscribe}
            className="h-10 w-full rounded-xl border border-primary-100 text-body-7-2 text-primary-200 transition-colors hover:bg-primary-20"
          >
            재구독
          </button>
        ) : isActive ? (
          <button
            type="button"
            onClick={onCancel}
            className="h-10 w-full rounded-xl bg-primary-100 text-body-7-2 text-white transition-colors hover:bg-primary-200"
          >
            구독 취소 하기
          </button>
        ) : (
          <button
            type="button"
            onClick={onSubscribe}
            className="h-10 w-full rounded-xl border border-primary-100 text-body-7-2 text-primary-200 transition-colors hover:bg-primary-20"
          >
            구독 하기
          </button>
        )}
      </div>
    </div>
  );
}
