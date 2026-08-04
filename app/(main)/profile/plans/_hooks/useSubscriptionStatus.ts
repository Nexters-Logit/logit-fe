import { useQuery } from "@tanstack/react-query";
import { apiFetch, API_ENDPOINTS } from "@/libs/api-client";
import type { SubscriptionStatusResponse } from "@/types/api";

export function useSubscriptionStatus() {
  return useQuery({
    queryKey: ["subscriptionStatus"],
    queryFn: () =>
      apiFetch<SubscriptionStatusResponse>(API_ENDPOINTS.subscriptionStatus),
    // 구독 취소는 /profile/plans에서 하고 해지 안내 문구는 /profile에 있는 등
    // 서로 다른 화면에 걸쳐 있어, invalidateQueries만으로는 아직 마운트 전인
    // 화면에 "stale" 표시만 남고 즉시 리페치로 이어지지 않는 경우가 있었음.
    // 마운트될 때마다 무조건 새로 불러오도록 강제해 화면 전환 시 항상 최신
    // 상태를 보장한다.
    refetchOnMount: "always",
  });
}
