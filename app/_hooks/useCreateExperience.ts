import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createExperienceApi } from "@/api/experiences";
import type { ExperienceCreate } from "@/types/api";

export function useCreateExperience() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ExperienceCreate) => createExperienceApi(data),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["experiences"] }),
  });
}
