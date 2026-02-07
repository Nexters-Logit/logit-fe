import type { ChatHistoryResponse } from '@/types/api';

/**
 * 채팅 히스토리 응답을 검증하고 기본값 적용
 */
export function validateChatHistory(data: ChatHistoryResponse | null) {
  return {
    projectName: data?.project_name || '프로젝트',
    questionText: data?.question || '문항을 불러오는 중...',
    answer: data?.answer ?? null,
    chats: data?.chats || [],
    experienceIds: data?.experience_ids || [],
    hasMore: data?.has_more,
    nextCursor: data?.next_cursor ?? null,
  };
}
