import { useQuery } from "@tanstack/react-query";
import { apiFetch, API_ENDPOINTS } from "@/libs/api-client";
import { getAccessToken } from "@/libs/auth";
import type { UserPublic } from "@/types/api";

export function useCurrentUser() {
  return useQuery({
    queryKey: ["currentUser"],
    queryFn: () => apiFetch<UserPublic>(API_ENDPOINTS.usersMe),
    enabled: !!getAccessToken(),
  });
}
