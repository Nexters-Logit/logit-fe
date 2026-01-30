'use server';

import { apiFetch, API_ENDPOINTS } from '@/libs/api-client';
import type { ExperienceCreate } from '@/types/api';

/**
 * 경험 생성
 */
export async function createExperience(data: ExperienceCreate) {
  return apiFetch(API_ENDPOINTS.experiences, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function getMatchQuestion(questionId: string) {
  return apiFetch(API_ENDPOINTS.matchQuestion(questionId));
}
