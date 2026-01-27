import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { ExperienceCreate } from '@/types/api';

async function createExperience(data: ExperienceCreate) {
  const response = await fetch('/api/experiences', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to create experience');
  return response.json();
}

export function useCreateExperience() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createExperience,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['experiences'] }),
  });
}
