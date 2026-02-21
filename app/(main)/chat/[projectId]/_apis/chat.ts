import { apiFetch, API_ENDPOINTS } from "@/libs/api-client";
import type {
  ChatHistoryResponse,
  MatchedExperience,
  MatchedExperienceResponse,
} from "@/types/api";

export const CHAT_HISTORY_PAGE_SIZE = 10;

export interface GetChatHistoryParams {
  cursor?: string;
  size?: number;
}

/**
 * 채팅 히스토리 조회
 */
export async function getChatHistory(
  questionId: string,
  params?: GetChatHistoryParams,
): Promise<ChatHistoryResponse> {
  return apiFetch<ChatHistoryResponse>(
    API_ENDPOINTS.chatHistory(questionId, params),
  );
}

/**
 * 문항과 매칭되는 경험 목록 조회 (서버용)
 */
export async function getMatchedExperiences(
  questionId: string,
): Promise<MatchedExperience[]> {
  const data = await apiFetch<MatchedExperienceResponse>(
    API_ENDPOINTS.matchQuestion(questionId),
  );
  return data.experiences;
}

