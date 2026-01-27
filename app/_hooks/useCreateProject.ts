import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createProject } from '@/app/_actions/projects';
import type { ProjectCreate } from '@/types/api';

export function useCreateProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ProjectCreate) => createProject(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['projects'] }),
  });
}
