import { useQuery } from "@tanstack/react-query";
import { API_BASE_URL, API_ENDPOINTS } from "@/libs/api-client";
import type { BannerData } from "@/types/api";

export function useBanners() {
  return useQuery({
    queryKey: ["banners"],
    queryFn: async () => {
      const r = await fetch(`${API_BASE_URL}${API_ENDPOINTS.banners}`);
      if (!r.ok) throw new Error("배너 정보를 불러오지 못했어요.");
      return r.json() as Promise<BannerData[]>;
    },
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 60 * 24,
  });
}
