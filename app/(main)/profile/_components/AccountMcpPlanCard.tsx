"use client";

import { cn } from "@/libs/utils";
import { apiFetch, API_ENDPOINTS } from "@/libs/api-client";
import { showToast } from "@/libs/toast";
import { formatPrice, formatDateKorean } from "../plans/_utils/formatPayment";
import type { PlanData } from "@/types/api";

async function copyMcpToken() {
  try {
    const data = await apiFetch<{ token: string }>(API_ENDPOINTS.mcpToken);
    await navigator.clipboard.writeText(data.token);
    showToast.success("MCP 토큰이 복사되었습니다");
  } catch {
    showToast.error("MCP 토큰 복사에 실패했습니다");
  }
}

type Props = {
  plan: PlanData;
  isActive: boolean;
  isAutoRenew: boolean;
  expiresAt: string | null;
  onSubscribe: () => void;
  onCancel: () => void;
};

const SUPPORTED_ENVIRONMENTS = ["Gemini", "Claude"];

export function AccountMcpPlanCard({ plan, isActive, isAutoRenew, expiresAt, onSubscribe, onCancel }: Props) {
  const isCancelPending = isActive && !isAutoRenew;
  const canResubscribe = isCancelPending && (!expiresAt || new Date(expiresAt) <= new Date());

  return (
    <div
      className={cn(
        "flex flex-col rounded-5 border-2 bg-white p-4",
        isActive ? "border-primary-100" : "border-gray-70",
      )}
    >
      <div className="mb-1 flex items-start justify-between gap-2">
        <h3 className="text-title-1 text-gray-500">{plan.name}</h3>
        {plan.badge && (
          <span className="shrink-0 rounded-full bg-primary-100 px-2.5 py-1 text-body-9-2 text-white">
            {plan.badge}
          </span>
        )}
      </div>

      {plan.description && (
        <p className="mb-4 text-body-8-3 text-gray-200">{plan.description}</p>
      )}

      <div className="flex flex-col gap-1.5">
        <div className="flex items-end justify-between">
          <span className="text-body-3-2 text-gray-500">총 결제 금액</span>
          <span className="flex items-end gap-1">
            {plan.original_price > 0 && plan.original_price > plan.price && (
              <span className="text-body-4 text-gray-100 line-through">
                {formatPrice(plan.original_price)}
              </span>
            )}
            <strong className="text-title-2-2 text-gray-500" style={{ lineHeight: "1.2" }}>{formatPrice(plan.price)}</strong>
            <span className="text-body-3-1 text-gray-500">원</span>
          </span>
        </div>
        <div className="h-px w-full bg-gray-70" />
        <div className="flex items-start justify-between text-body-5-3 text-gray-300">
          <span>지원 환경</span>
          <span className="flex flex-col items-end">
            {SUPPORTED_ENVIRONMENTS.map((env) => (
              <span key={env}>{env}</span>
            ))}
          </span>
        </div>
      </div>

      {isCancelPending && expiresAt && (
        <p className="mt-4 text-body-9-3 text-red-400">
          ⓘ {formatDateKorean(expiresAt)}에 이용 종료 예정입니다.
        </p>
      )}

      <div className="mt-5 flex flex-col gap-2">
        {isActive && !isCancelPending ? (
          <>
            <button
              type="button"
              onClick={() => copyMcpToken()}
              className="h-16 w-full rounded-3.5 bg-primary-100 text-body-3-2 text-white transition-colors hover:bg-primary-200"
            >
              MCP 토큰 복사하기
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="py-1 text-center text-body-8-3 text-gray-200 transition-colors hover:text-gray-400"
            >
              구독 취소 하기
            </button>
          </>
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
        ) : (
          <button
            type="button"
            onClick={onSubscribe}
            className="h-16 w-full rounded-3.5 bg-primary-20 text-body-3-2 text-primary-200 transition-colors hover:bg-primary-50"
          >
            구독 하기
          </button>
        )}
        <a
          href="https://docs.logit.ai.kr/mcp"
          target="_blank"
          rel="noopener noreferrer"
          className="text-center text-body-8-3 text-gray-200 underline transition-colors hover:text-primary-200"
        >
          MCP 사용방법 보러가기 &gt;
        </a>
      </div>

    </div>
  );
}
