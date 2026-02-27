import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteExperience } from "@/app/_actions/experiences";

export function useDeleteExperience() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteExperience(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["experiences"] });
      queryClient.invalidateQueries({ queryKey: ["experienceSummary"] });
    },
  });
}
