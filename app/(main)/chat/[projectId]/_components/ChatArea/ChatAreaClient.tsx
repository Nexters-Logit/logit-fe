"use client";

import { useEffect } from "react";
import { ChatMessageList } from "../ChatMessage/ChatMessageList";
import { ChatInput } from "../ChatInput/ChatInput";
import { InitialActionButton } from "../ChatInput/InitialActionButton";
import { useChatStore } from "../../_store/useChatStore";
import { useProjectContext } from "../../_context";
import {
  useChatStream,
  useUpdateAnswer,
  useDraftContent,
  useSyncChatStore,
  useChatHistoryPagination,
} from "../../_hooks";
import {
  convertToUIMessages,
  extractDraftMetadata,
  getMessageContent,
} from "../../_utils";
import type { ChatHistoryItem } from "@/types/api";

// ============================================================================
// Types
// ============================================================================

interface ChatHistory {
  projectName: string;
  questionText: string;
  chats: ChatHistoryItem[];
  experienceIds: string[];
  hasMore?: boolean;
  nextCursor: string | null;
}

interface ChatAreaClientProps {
  questionId: string;
  chatHistory: ChatHistory;
}

// ============================================================================
// Component
// ============================================================================

export function ChatAreaClient({
  questionId,
  chatHistory,
}: ChatAreaClientProps) {
  // Context (layout에서 fetch한 데이터)
  const { questions } = useProjectContext();

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
        setActivePanelTab("DRAFT");
      }
    },
  });

  // 채팅 히스토리 페이지네이션
  const pagination = useChatHistoryPagination({
    questionId,
    initialHasMore: chatHistory.hasMore,
    initialCursor: chatHistory.nextCursor,
    messages: chat.messages,
    setMessages: chat.setMessages,
  });

  // Draft Content (스트리밍 우선, 서버 데이터 fallback)
  const serverDraftContent = chatHistory.chats.findLast(
    (c) => c.is_draft,
  )?.content;
  const draftContent = useDraftContent({
    messages: chat.messages,
    getMessageMetadata: chat.getMessageMetadata,
    serverDraftContent,
  });

  // Generate Draft Handler
  const handleGenerateDraft = () => {
    if (selectedExperienceIds.length === 0) return;
    chat.sendMessage("선택한 경험을 바탕으로 자기소개서 초안을 작성해줘.");
    setActivePanelTab("DRAFT");
  };

  // Store 동기화
  useSyncChatStore({
    draftContent,
    generateDraft: handleGenerateDraft,
    initialExperienceIds: chatHistory.experienceIds,
  });

  // maxLength 동기화 (렌더 중 setState 방지)
  const currentQuestion = questions.find((q) => q.id === questionId);
  const maxLength = currentQuestion?.max_length ?? 1000;

  useEffect(() => {
    setMaxLength(maxLength);
  }, [maxLength, setMaxLength]);

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
      {/* 채팅 메시지 영역 */}
      <div className="flex-1 min-h-0 overflow-hidden">
        <ChatMessageList
          messages={chat.messages}
          status={chat.status}
          error={chat.error}
          getMessageMetadata={chat.getMessageMetadata}
          onUpdateDraft={handleUpdateDraftFromMessage}
          onRetry={chat.retry}
          pagination={pagination}
        />
      </div>

      {/* 입력 영역 */}
      <div className="shrink-0">
        {chat.messages.length > 0 ? (
          <ChatInput
            onSubmit={chat.sendMessage}
            status={chat.status}
            onStop={chat.stop}
          />
        ) : (
          <InitialActionButton />
        )}
      </div>
    </>
  );
}
