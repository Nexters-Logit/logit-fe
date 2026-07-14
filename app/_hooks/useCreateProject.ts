import { useMutation } from '@tanstack/react-query';
import { createProject } from '@/app/_actions/projects';
import type { ProjectCreate } from '@/types/api';

export function useCreateProject() {
  return useMutation({
    mutationFn: (data: ProjectCreate) => createProject(data),
  });
}
