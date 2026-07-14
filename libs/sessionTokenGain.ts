import type { QueryClient } from "@tanstack/react-query";

const SESSION_TOKEN_GAIN_KEY = "session_token_gain";

export const sessionTokenGainQueryKey = ["sessionTokenGain"] as const;

export function getSessionTokenGain(): number {
  if (typeof window === "undefined") return 0;
  const raw = sessionStorage.getItem(SESSION_TOKEN_GAIN_KEY);
  const parsed = raw ? Number(raw) : 0;
  return Number.isFinite(parsed) ? parsed : 0;
}

export function addSessionTokenGain(amount: number, queryClient: QueryClient): number {
  if (amount <= 0) return getSessionTokenGain();

  const total = getSessionTokenGain() + amount;
  sessionStorage.setItem(SESSION_TOKEN_GAIN_KEY, String(total));
  queryClient.setQueryData(sessionTokenGainQueryKey, total);
  return total;
}
