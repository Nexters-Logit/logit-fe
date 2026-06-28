import { useQuery } from "@tanstack/react-query";
import { API_BASE_URL, API_ENDPOINTS } from "@/libs/api-client";
import type { PlanData } from "@/types/api";

export function usePlans() {
  return useQuery({
    queryKey: ["plans"],
    queryFn: async () => {
      const r = await fetch(`${API_BASE_URL}${API_ENDPOINTS.plans}`);
      if (!r.ok) throw new Error("요금제 정보를 불러오지 못했어요.");
      return r.json() as Promise<PlanData[]>;
    },
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 60 * 24,
    retry: 2,
  });
}
