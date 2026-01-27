import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { ProjectCreate } from '@/types/api';

async function createProject(data: ProjectCreate) {
  const response = await fetch('/api/projects', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to create project');
  return response.json();
}

export function useCreateProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createProject,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['projects'] }),
  });
}
