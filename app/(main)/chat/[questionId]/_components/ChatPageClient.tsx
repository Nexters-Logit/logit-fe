'use client';

import { useCallback } from 'react';
import { UIMessage } from '@ai-sdk/react';
import { Header } from '@/components/common/Header';
import { ChatLayout } from './ChatLayout';
import { ChatProjectSummary } from './ChatProjectSummary';
import { ChatQuestionTabs } from './ChatQuestionTabs';
import { ChatPanel } from './ChatPanel';
import { ChatMessageList } from './ChatMessageList';
import { ChatInput } from './ChatInput';
import { useChatStore } from '../_store/useChatStore';
import { useExperiences, useChatHistory, useChatStream } from '../_hooks';
import type { ChatHistoryItem } from '@/types/api';

// 검증된 문항 정보 타입
interface QuestionInfo {
  id: string;
  question: string;
  maxLength: number;
}

interface ChatPageClientProps {
  questionId: string;
  company: string;
  jobPosition: string;
  dueDate?: string;
  questions: QuestionInfo[];
  currentQuestion: QuestionInfo;
  initialChats: ChatHistoryItem[];
}

// ChatHistoryItem을 UIMessage로 변환
function convertToUIMessages(chats: ChatHistoryItem[]): UIMessage[] {
  return chats.map((chat) => ({
    id: chat.id,
    role: chat.role as 'user' | 'assistant',
    parts: [{ type: 'text' as const, text: chat.content }],
    createdAt: new Date(chat.created_at),
  }));
}

export function ChatPageClient({
  questionId,
  company,
  jobPosition,
  dueDate,
  questions,
  currentQuestion,
  initialChats,
}: ChatPageClientProps) {
  // Zustand store
  const {
    selectedExperienceIds,
    selectExperience,
    deselectExperience,
    activePanelTab,
    setActivePanelTab,
  } = useChatStore();

  // React Query - 경험 목록
  const { data: experiencesData } = useExperiences();
  const experiences = experiencesData || [];

  // React Query - 채팅 히스토리 (클라이언트 갱신용)
  const { data: chatHistoryData, refetch: refetchHistory } =
    useChatHistory(questionId);
  const chats = chatHistoryData?.chats || initialChats;

  // 초안 찾기
  const draftChat = chats.find((c) => c.is_draft);
  const draftContent = draftChat?.content;

  // AI SDK - 채팅 스트림
  const {
    messages,
    sendMessage,
    isLoading,
    status,
    stop,
    getMessageMetadata,
  } = useChatStream({
    questionId,
    experienceIds: selectedExperienceIds,
    initialMessages: convertToUIMessages(initialChats),
    onFinish: () => {
      // 스트리밍 완료 시 히스토리 갱신
      refetchHistory();
    },
  });

  // 초안 생성 핸들러
  const handleGenerateDraft = useCallback(() => {
    if (selectedExperienceIds.length === 0) return;

    // 선택한 경험을 바탕으로 초안 생성 요청
    sendMessage('선택한 경험을 바탕으로 자기소개서 초안을 작성해줘.');

    // 자기소개서 탭으로 전환
    setActivePanelTab('DRAFT');
  }, [selectedExperienceIds, sendMessage, setActivePanelTab]);

  // 문항 변경 핸들러
  const handleQuestionChange = (newQuestionId: string) => {
    window.location.href = `/chat/${newQuestionId}`;
  };

  // 메시지에서 자기소개서 업데이트 (chatId 기반)
  const handleUpdateDraftFromMessage = useCallback(
    (chatId: string) => {
      // Phase 7에서 useUpdateAnswer mutation으로 구현
      console.log('Update draft from message:', chatId);
      refetchHistory();
    },
    [refetchHistory]
  );

  // 사이드바에서 자기소개서 업데이트
  const handleUpdateDraft = useCallback(() => {
    if (!draftChat) return;
    // Phase 7에서 useUpdateAnswer mutation으로 구현
    console.log('Update draft:', draftChat.id);
  }, [draftChat]);

  return (
    <ChatLayout
      header={<Header />}
      projectSummary={
        <ChatProjectSummary
          company={company}
          jobPosition={jobPosition}
          dueDate={dueDate}
        />
      }
      questionTabs={
        <ChatQuestionTabs
          questions={questions}
          activeQuestionId={questionId}
          onQuestionChange={handleQuestionChange}
        />
      }
      chatArea={
        <ChatMessageList
          messages={messages}
          isLoading={isLoading}
          getMessageMetadata={getMessageMetadata}
          onUpdateDraft={handleUpdateDraftFromMessage}
        />
      }
      inputArea={
        <ChatInput
          onSubmit={sendMessage}
          status={status}
          onStop={stop}
          placeholder={`${currentQuestion.question.slice(0, 50)}...에 대해 질문하세요`}
        />
      }
      sidePanel={
        <ChatPanel
          activeTab={activePanelTab}
          onTabChange={setActivePanelTab}
          experiences={experiences}
          selectedExperienceIds={selectedExperienceIds}
          onSelectExperience={selectExperience}
          onDeselectExperience={deselectExperience}
          onGenerateDraft={handleGenerateDraft}
          draftContent={draftContent}
          maxLength={currentQuestion.maxLength}
          onUpdateDraft={draftContent ? handleUpdateDraft : undefined}
        />
      }
    />
  );
}
