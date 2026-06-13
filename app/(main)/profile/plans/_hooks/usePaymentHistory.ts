import { useQuery } from "@tanstack/react-query";
import { apiFetch, API_ENDPOINTS } from "@/libs/api-client";
import type { PaymentHistoryItem } from "@/types/api";

export function usePaymentHistory() {
  return useQuery({
    queryKey: ["paymentHistory"],
    queryFn: () =>
      apiFetch<PaymentHistoryItem[]>(API_ENDPOINTS.paymentHistory),
  });
}
