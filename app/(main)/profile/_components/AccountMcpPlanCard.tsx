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

export function AccountMcpPlanCard({ plan, isActive, isAutoRenew, expiresAt, onSubscribe, onCancel }: Props) {
  const isCancelPending = isActive && !isAutoRenew;
  const environments = plan.features ?? [];

  return (
    <div
      className={cn(
        "flex flex-col rounded-2xl border p-6",
        isActive ? "border-primary-100 bg-primary-20" : "border-gray-70 bg-white",
      )}
    >
      <div className="mb-2 flex items-start justify-between gap-2">
        <h3 className="text-title-3 text-gray-500">{plan.name}</h3>
        {plan.badge && (
          <span className="shrink-0 rounded-full bg-primary-100 px-2.5 py-1 text-body-9-2 text-white">
            {plan.badge}
          </span>
        )}
      </div>

      {plan.description && (
        <p className="mb-5 text-body-8-3 text-gray-200">{plan.description}</p>
      )}

      <div className="flex items-baseline gap-1.5">
        {plan.original_price > 0 && plan.original_price > plan.price && (
          <span className="text-body-8-3 text-gray-100 line-through">
            {formatPrice(plan.original_price)}원
          </span>
        )}
        <strong className="text-title-2 text-gray-500">{formatPrice(plan.price)}원</strong>
        <span className="text-body-8-3 text-gray-200">/ 월</span>
      </div>

      {environments.length > 0 && (
        <div className="mt-4 flex flex-col gap-1.5">
          <p className="text-body-8-3 text-gray-300">지원 환경</p>
          <ul className="flex flex-col gap-1">
            {environments.map((env) => (
              <li key={env} className="text-body-8-3 text-gray-400">
                · {env}
              </li>
            ))}
          </ul>
        </div>
      )}

      {isCancelPending && expiresAt && (
        <p className="mt-4 text-body-9-3 text-red-400">
          ⓘ {formatDateKorean(expiresAt)}에 이용 종료 예정입니다.
        </p>
      )}

      <div className="mt-auto flex flex-col gap-2 pt-6">
        {isActive && !isCancelPending ? (
          <>
            <button
              type="button"
              onClick={() => copyMcpToken()}
              className="h-12 w-full rounded-xl bg-primary-100 text-body-7-2 text-white transition-colors hover:bg-primary-200"
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
          <button
            type="button"
            onClick={onSubscribe}
            className="h-12 w-full rounded-xl border border-primary-100 text-body-7-2 text-primary-200 transition-colors hover:bg-primary-20"
          >
            재구독
          </button>
        ) : (
          <button
            type="button"
            onClick={onSubscribe}
            className="h-12 w-full rounded-xl border border-primary-100 text-body-7-2 text-primary-200 transition-colors hover:bg-primary-20"
          >
            구독 하기
          </button>
        )}
        <a
          href="https://docs.logit.ai.kr/mcp"
          target="_blank"
          rel="noopener noreferrer"
          className="text-center text-body-8-3 text-gray-200 transition-colors hover:text-primary-200"
        >
          MCP 사용방법 보러가기 &gt;
        </a>
      </div>
    </div>
  );
}
