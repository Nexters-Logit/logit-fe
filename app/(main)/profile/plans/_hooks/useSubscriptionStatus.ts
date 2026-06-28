import { useQuery } from "@tanstack/react-query";
import { apiFetch, API_ENDPOINTS } from "@/libs/api-client";
import type { SubscriptionStatusResponse } from "@/types/api";

export function useSubscriptionStatus() {
  return useQuery({
    queryKey: ["subscriptionStatus"],
    queryFn: () =>
      apiFetch<SubscriptionStatusResponse>(API_ENDPOINTS.subscriptionStatus),
  });
}
