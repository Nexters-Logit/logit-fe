'use client';

import { useCallback } from 'react';
import { ChatProjectSummary } from './ChatProjectSummary';
import { ChatQuestionTabs } from './ChatQuestionTabs';
import { ChatMessageList } from './ChatMessageList';
import { ChatInput } from './ChatInput';
import { useChatStore } from '../_store/useChatStore';
import {
  useChatStream,
  useUpdateAnswer,
  useDraftContent,
  useSyncChatStore,
} from '../_hooks';
import { convertToUIMessages, extractDraftMetadata, getMessageContent } from '../_utils';
import type { ChatHistoryItem } from '@/types/api';

// ============================================================================
// Types
// ============================================================================

interface ChatHistory {
  projectName: string;
  questionText: string;
  chats: ChatHistoryItem[];
  experienceIds: string[];
}

interface QuestionInfo {
  id: string;
  question: string;
  maxLength: number;
}

interface ChatAreaClientProps {
  questionId: string;
  chatHistory: ChatHistory;
  currentQuestion: QuestionInfo;
}

// ============================================================================
// Component
// ============================================================================

export function ChatAreaClient({
  questionId,
  chatHistory,
  currentQuestion,
}: ChatAreaClientProps) {
  // Store
  const selectedExperienceIds = useChatStore((s) => s.selectedExperienceIds);
  const setActivePanelTab = useChatStore((s) => s.setActivePanelTab);
  const setMaxLength = useChatStore((s) => s.setMaxLength);

  // Mutations
  const updateAnswerMutation = useUpdateAnswer();

  // Chat Stream
  const chat = useChatStream({
    questionId,
    experienceIds: selectedExperienceIds,
    initialMessages: convertToUIMessages(chatHistory.chats),
    onFinish: (message) => {
      const metadata = extractDraftMetadata(message);
      if (metadata?.is_draft) {
        setActivePanelTab('DRAFT');
      }
    },
  });

  // Draft Content (스트리밍 우선, 서버 데이터 fallback)
  const serverDraftContent = chatHistory.chats.findLast((c) => c.is_draft)?.content;
  const draftContent = useDraftContent({
    messages: chat.messages,
    getMessageMetadata: chat.getMessageMetadata,
    serverDraftContent,
  });

  // Generate Draft Handler
  const handleGenerateDraft = useCallback(() => {
    if (selectedExperienceIds.length === 0) return;
    chat.sendMessage('선택한 경험을 바탕으로 자기소개서 초안을 작성해줘.');
    setActivePanelTab('DRAFT');
  }, [selectedExperienceIds, chat, setActivePanelTab]);

  // Store 동기화
  useSyncChatStore({
    draftContent,
    generateDraft: handleGenerateDraft,
  });

  // maxLength 동기화
  setMaxLength(currentQuestion.maxLength);

  // Handlers
  const questions = [currentQuestion];

  const handleQuestionChange = (newQuestionId: string) => {
    window.location.href = `/chat/${newQuestionId}`;
  };

  const handleUpdateDraftFromMessage = (chatId: string) => {
    const message = chat.messages.find((m) => {
      const metadata = chat.getMessageMetadata(m);
      return metadata?.chat_id === chatId;
    });
    if (!message) return;

    const content = getMessageContent(message);
    if (content) {
      updateAnswerMutation.mutate({ chatId, content });
    }
  };

  return (
    <>
      {/* 프로젝트 정보 + 문항 탭 */}
      <div className="flex flex-col gap-5 shrink-0">
        <ChatProjectSummary
          company={chatHistory.projectName}
          jobPosition="직무" // TODO: API에서 가져오기
        />
        <ChatQuestionTabs
          questions={questions}
          activeQuestionId={questionId}
          onQuestionChange={handleQuestionChange}
        />
      </div>

      {/* 채팅 메시지 영역 */}
      <div className="flex-1 min-h-0 overflow-hidden">
        <ChatMessageList
          messages={chat.messages}
          status={chat.status}
          getMessageMetadata={chat.getMessageMetadata}
          onUpdateDraft={handleUpdateDraftFromMessage}
        />
      </div>

      {/* 입력창 */}
      <div className="shrink-0">
        <ChatInput onSubmit={chat.sendMessage} status={chat.status} onStop={chat.stop} />
      </div>
    </>
  );
}
