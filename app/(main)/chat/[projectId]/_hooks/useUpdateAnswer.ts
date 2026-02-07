import { useMutation, useQueryClient } from '@tanstack/react-query';
import { showToast } from '@/libs/toast';
import { updateAnswer } from '../_apis/chat';

export function useUpdateAnswer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (chatId: string) =>
      updateAnswer(chatId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chatHistory'] });
      showToast.success('자기소개서가 업데이트되었습니다.');
    },
    onError: () => {
      showToast.error('자기소개서 업데이트에 실패했습니다.');
    },
  });
}
