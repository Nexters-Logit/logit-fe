"use client";

import { cn } from "@/libs/utils";
import { apiFetch, API_ENDPOINTS } from "@/libs/api-client";
import { showToast } from "@/libs/toast";
import { formatPrice } from "../plans/_utils/formatPayment";
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
  onSubscribe: () => void;
  onCancel: () => void;
};

export function AccountMcpPlanCard({ plan, isActive, onSubscribe, onCancel }: Props) {
  const environments = plan.features ?? [];

  return (
    <div
      className={cn(
        "rounded-2xl border p-6",
        isActive ? "border-primary-100 bg-primary-20" : "border-gray-70 bg-white",
      )}
    >
      <h3 className="mb-5 text-title-3 text-gray-500">{plan.name}</h3>

      <div className="flex flex-col gap-3 text-body-7-3">
        <div className="flex items-baseline justify-between">
          <span className="text-gray-200">총 결제 금액</span>
          <span>
            {plan.original_price > 0 && plan.original_price > plan.price && (
              <span className="mr-1.5 text-body-8-3 text-gray-100 line-through">
                {formatPrice(plan.original_price)}
              </span>
            )}
            <strong className="text-body-5-2 text-gray-500">
              {formatPrice(plan.price)}원
            </strong>
          </span>
        </div>

        {environments.length > 0 && (
          <div className="flex items-start justify-between">
            <span className="text-gray-200">지원 환경</span>
            <div className="text-right text-gray-400">
              {environments.map((env) => (
                <p key={env}>{env}</p>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 flex flex-col gap-2">
        {isActive ? (
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
