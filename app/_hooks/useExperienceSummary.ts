import { useQuery } from "@tanstack/react-query";
import { getExperienceSummary } from "@/app/_actions/report";
import { getAccessToken } from "@/libs/auth";

export function useExperienceSummary() {
  return useQuery({
    queryKey: ["experienceSummary"],
    queryFn: getExperienceSummary,
    enabled: !!getAccessToken(),
  });
}

