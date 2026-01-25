import { apiFetch, API_ENDPOINTS } from '@/libs/api-client';
import type { ChatHistoryResponse, Experience, ExperienceListResponse } from '@/types/api';

/**
 * 채팅 히스토리 조회
 */
export async function getChatHistory(
  questionId: string
): Promise<ChatHistoryResponse> {
  return apiFetch<ChatHistoryResponse>(API_ENDPOINTS.chatHistory(questionId));
}

/**
 * 경험 목록 조회 (서버용 - 직접 API 호출)
 */
export async function getExperiencesServer(): Promise<Experience[]> {
  const data = await apiFetch<ExperienceListResponse>(API_ENDPOINTS.experiences);
  return data.experiences;
}

/**
 * 경험 목록 조회 (클라이언트용 - 프록시 API 사용)
 */
export async function getExperiences(): Promise<Experience[]> {
  const response = await fetch('/api/experiences');
  if (!response.ok) {
    throw new Error('Failed to fetch experiences');
  }
  const data: ExperienceListResponse = await response.json();
  return data.experiences;
}

/**
 * 답변 업데이트 (초안 → 답변 저장)
 */
export async function updateAnswer(
  chatId: string,
  content: string
): Promise<void> {
  return apiFetch<void>(API_ENDPOINTS.updateAnswer(chatId), {
    method: 'PATCH',
    body: JSON.stringify({ content }),
  });
}
