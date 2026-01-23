import { useQuery } from '@tanstack/react-query';
import { getExperiences } from '../_apis/chat';

export function useExperiences() {
  return useQuery({
    queryKey: ['experiences'],
    queryFn: getExperiences,
  });
}
