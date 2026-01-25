import { useQuery } from '@tanstack/react-query';
import { getExperiences } from '../_apis/chat';
import type { Experience } from '@/types/api';

interface UseExperiencesOptions {
  initialData?: Experience[];
}

export function useExperiences(options?: UseExperiencesOptions) {
  return useQuery({
    queryKey: ['experiences'],
    queryFn: getExperiences,
    initialData: options?.initialData,
    // SSR에서 가져온 데이터가 있으면 stale로 간주하지 않음
    staleTime: options?.initialData ? 60 * 1000 : 0,
  });
}
