import { getChatHistory } from './_apis/chat';
import { ChatPageClient } from './_components/ChatPageClient';
import type { ChatHistoryResponse } from '@/types/api';

interface ChatPageProps {
  params: Promise<{
    questionId: string;
  }>;
}

// 채팅 히스토리 응답을 검증하고 기본값 적용
function validateChatHistory(
  questionId: string,
  data: ChatHistoryResponse | null
) {
  return {
    projectName: data?.project_name || '프로젝트',
    questionText: data?.question || '문항을 불러오는 중...',
    chats: data?.chats || [],
    experienceIds: data?.experience_ids || [],
  };
}

export default async function ChatPage({ params }: ChatPageProps) {
  const { questionId } = await params;

  // 서버에서 초기 데이터 페칭
  let rawChatHistory: ChatHistoryResponse | null = null;
  try {
    rawChatHistory = await getChatHistory(questionId);
  } catch (error) {
    console.error('Failed to fetch chat history:', error);
  }

  // 검증된 데이터
  const chatHistory = validateChatHistory(questionId, rawChatHistory);

  const currentQuestion = {
    id: questionId,
    question: chatHistory.questionText,
    maxLength: 1000, // TODO: API 응답에서 가져오기
  };

  // TODO: 프로젝트의 전체 문항 목록 가져오기
  const questions = [currentQuestion];

  return (
    <ChatPageClient
      questionId={questionId}
      company={chatHistory.projectName} // TODO: 별도 API에서 가져오기
      jobPosition="직무" // TODO: 별도 API에서 가져오기
      questions={questions}
      currentQuestion={currentQuestion}
      initialChats={chatHistory.chats}
    />
  );
}
