import { useQuery } from '@tanstack/react-query';
import { getChatHistory } from '../_apis/chat';

export function useChatHistory(questionId: string) {
  return useQuery({
    queryKey: ['chatHistory', questionId],
    queryFn: () => getChatHistory(questionId),
    enabled: !!questionId,
  });
}
