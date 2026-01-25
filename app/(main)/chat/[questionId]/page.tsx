import { Suspense } from 'react';
import { getChatHistory, getExperiencesServer } from './_apis/chat';
import { ChatPageShell } from './_components/ChatPageShell';
import { ChatAreaClient } from './_components/ChatAreaClient';
import { SidePanelClient } from './_components/SidePanelClient';
import { ExperienceCards } from './_components/ExperienceCards';
import { ChatAreaSkeleton } from './_components/ChatAreaSkeleton';
import { ExperienceCardsSkeleton } from './_components/ExperienceCardsSkeleton';
import type { ChatHistoryResponse } from '@/types/api';

interface ChatPageProps {
  params: Promise<{
    questionId: string;
  }>;
}

// 채팅 히스토리 응답을 검증하고 기본값 적용
function validateChatHistory(data: ChatHistoryResponse | null) {
  return {
    projectName: data?.project_name || '프로젝트',
    questionText: data?.question || '문항을 불러오는 중...',
    chats: data?.chats || [],
    experienceIds: data?.experience_ids || [],
  };
}

// 채팅 영역 서버 컴포넌트 (async)
async function ChatAreaServer({ questionId }: { questionId: string }) {
  const rawChatHistory = await getChatHistory(questionId).catch((error) => {
    console.error('Failed to fetch chat history:', error);
    return null;
  });

  const chatHistory = validateChatHistory(rawChatHistory);
  const currentQuestion = {
    id: questionId,
    question: chatHistory.questionText,
    maxLength: 1000, // TODO: API 응답에서 가져오기
  };

  return (
    <ChatAreaClient
      questionId={questionId}
      chatHistory={chatHistory}
      currentQuestion={currentQuestion}
    />
  );
}

// 경험 카드 리스트 서버 컴포넌트 (async)
async function ExperienceCardsServer() {
  const experiences = await getExperiencesServer().catch((error) => {
    console.error('Failed to fetch experiences:', error);
    return [];
  });

  return <ExperienceCards experiences={experiences} />;
}

export default async function ChatPage({ params }: ChatPageProps) {
  const { questionId } = await params;

  return (
    <ChatPageShell
      chatArea={
        <Suspense fallback={<ChatAreaSkeleton />}>
          <ChatAreaServer questionId={questionId} />
        </Suspense>
      }
      sidePanel={
        <SidePanelClient
          experienceCards={
            <Suspense fallback={<ExperienceCardsSkeleton />}>
              <ExperienceCardsServer />
            </Suspense>
          }
        />
      }
    />
  );
}
