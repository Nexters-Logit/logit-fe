import { getChatHistory, getProjectAndQuestionInfo } from '../_apis/chat';
import { validateChatHistory } from '../_utils';
import { ChatAreaClient } from './ChatAreaClient';

interface ChatAreaServerProps {
  questionId: string;
}

export async function ChatAreaServer({ questionId }: ChatAreaServerProps) {
  // 병렬로 데이터 가져오기
  const [rawChatHistory, projectQuestionInfo] = await Promise.all([
    getChatHistory(questionId).catch((error) => {
      console.error('Failed to fetch chat history:', error);
      return null;
    }),
    getProjectAndQuestionInfo(questionId).catch((error) => {
      console.error('Failed to fetch project/question info:', error);
      return { company: '회사', jobPosition: '직무', maxLength: null };
    }),
  ]);

  const chatHistory = validateChatHistory(rawChatHistory);

  const currentQuestion = {
    id: questionId,
    question: chatHistory.questionText,
    maxLength: projectQuestionInfo.maxLength ?? 1000,
  };

  return (
    <ChatAreaClient
      questionId={questionId}
      chatHistory={{
        ...chatHistory,
        company: projectQuestionInfo.company,
        jobPosition: projectQuestionInfo.jobPosition,
      }}
      currentQuestion={currentQuestion}
    />
  );
}
