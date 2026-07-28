import { useQuery } from "@tanstack/react-query";
import { apiFetch, API_ENDPOINTS } from "@/libs/api-client";
import { getAccessToken } from "@/libs/auth";

interface TokenBalance {
  balance: number;
  plan: string;
  monthly_tokens: number;
  monthly_used: number;
  monthly_grant_amount: number;
  signup_bonus_amount: number;
  attendance_amount: number;
  referral_reward_amount: number;
  referral_reward_count: number;
}

export function useTokenBalance() {
  return useQuery({
    queryKey: ["tokenBalance"],
    queryFn: () => apiFetch<TokenBalance>(API_ENDPOINTS.tokensBalance),
    enabled: !!getAccessToken(),
    staleTime: 1000 * 30,
  });
}
