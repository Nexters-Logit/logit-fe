import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateExperience } from "@/app/_actions/experiences";
import type { ExperienceUpdate } from "@/types/api";

interface UpdateExperienceParams {
  id: string;
  data: ExperienceUpdate;
}

export function useUpdateExperience() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: UpdateExperienceParams) =>
      updateExperience(id, data),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["experiences"] }),
  });
}
