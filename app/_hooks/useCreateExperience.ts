import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createExperience } from '@/app/_actions/experiences';
import type { ExperienceCreate } from '@/types/api';

export function useCreateExperience() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ExperienceCreate) => createExperience(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['experiences'] }),
  });
}
