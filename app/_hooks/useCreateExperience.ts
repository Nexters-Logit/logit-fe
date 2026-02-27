import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createExperience } from "@/app/_actions/experiences";
import type { ExperienceCreate } from "@/types/api";

export function useCreateExperience() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ExperienceCreate) => createExperience(data),
    onSuccess: () => {
      // 경험 목록 및 리포트 상단 경험 요약 모두 최신화
      queryClient.invalidateQueries({ queryKey: ["experiences"] });
      queryClient.invalidateQueries({ queryKey: ["experienceSummary"] });
    },
  });
}
