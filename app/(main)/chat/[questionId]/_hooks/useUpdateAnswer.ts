import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateAnswer } from '../_apis/chat';

export function useUpdateAnswer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ chatId, content }: { chatId: string; content: string }) =>
      updateAnswer(chatId, content),
    onSuccess: (_, variables) => {
      // 채팅 히스토리 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['chatHistory'] });
    },
  });
}
