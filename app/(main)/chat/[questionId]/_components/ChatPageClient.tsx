'use client';

import { UIMessage } from '@ai-sdk/react';
import { Header } from '@/components/common/Header';
import { ChatLayout } from './ChatLayout';
import { ChatProjectSummary } from './ChatProjectSummary';
import { ChatQuestionTabs } from './ChatQuestionTabs';
import { ChatPanel } from './ChatPanel';
import { ChatMessageList } from './ChatMessageList';
import { ChatInput } from './ChatInput';
import { useChatStore } from '../_store/useChatStore';
import {
  useExperiences,
  useChatHistory,
  useChatStream,
  useUpdateAnswer,
} from '../_hooks';
import type { ChatHistoryItem } from '@/types/api';

// ============================================================================
// Types
// ============================================================================

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

// ============================================================================
// Helpers
// ============================================================================

function convertToUIMessages(chats: ChatHistoryItem[]): UIMessage[] {
  return chats.map((chat) => ({
    id: chat.id,
    role: chat.role as 'user' | 'assistant',
    parts: [{ type: 'text' as const, text: chat.content }],
    createdAt: new Date(chat.created_at),
  }));
}

function extractDraftMetadata(message: UIMessage): { is_draft?: boolean } | null {
  const dataPart = message.parts.find((p) => p.type === 'data-chat-metadata');
  if (dataPart && 'data' in dataPart) {
    return dataPart.data as { is_draft?: boolean };
  }
  return null;
}

function getMessageContent(message: UIMessage): string {
  const textPart = message.parts.find((p) => p.type === 'text');
  return textPart && 'text' in textPart ? textPart.text : '';
}

// ============================================================================
// Main Component
// ============================================================================

export function ChatPageClient({
  questionId,
  company,
  jobPosition,
  dueDate,
  questions,
  currentQuestion,
  initialChats,
}: ChatPageClientProps) {
  // Store
  const store = useChatStore();

  // Data Fetching
  const { data: experiencesData } = useExperiences();
  const { data: chatHistoryData, refetch: refetchHistory } = useChatHistory(questionId);
  const updateAnswerMutation = useUpdateAnswer();

  // Derived State
  const experiences = experiencesData || [];
  const chats = chatHistoryData?.chats || initialChats;
  const draftChat = chats.find((c) => c.is_draft);

  // Chat Stream
  const chat = useChatStream({
    questionId,
    experienceIds: store.selectedExperienceIds,
    initialMessages: convertToUIMessages(initialChats),
    onFinish: (message) => {
      refetchHistory();
      const metadata = extractDraftMetadata(message);
      if (metadata?.is_draft) {
        store.setActivePanelTab('DRAFT');
      }
    },
  });

  // Handlers
  const handleGenerateDraft = () => {
    if (store.selectedExperienceIds.length === 0) return;
    chat.sendMessage('선택한 경험을 바탕으로 자기소개서 초안을 작성해줘.');
    store.setActivePanelTab('DRAFT');
  };

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
      updateAnswerMutation.mutate({ chatId, content }, { onSuccess: () => refetchHistory() });
    }
  };

  const handleUpdateDraft = () => {
    if (!draftChat) return;
    updateAnswerMutation.mutate(
      { chatId: draftChat.id, content: draftChat.content },
      { onSuccess: () => refetchHistory() }
    );
  };

  // Render
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
          messages={chat.messages}
          status={chat.status}
          getMessageMetadata={chat.getMessageMetadata}
          onUpdateDraft={handleUpdateDraftFromMessage}
        />
      }
      inputArea={
        <ChatInput
          onSubmit={chat.sendMessage}
          status={chat.status}
          onStop={chat.stop}
        />
      }
      sidePanel={
        <ChatPanel
          activeTab={store.activePanelTab}
          onTabChange={store.setActivePanelTab}
          experiences={experiences}
          selectedExperienceIds={store.selectedExperienceIds}
          onSelectExperience={store.selectExperience}
          onDeselectExperience={store.deselectExperience}
          onGenerateDraft={handleGenerateDraft}
          draftContent={draftChat?.content}
          maxLength={currentQuestion.maxLength}
          onUpdateDraft={draftChat?.content ? handleUpdateDraft : undefined}
        />
      }
    />
  );
}
