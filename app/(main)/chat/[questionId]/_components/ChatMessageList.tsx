'use client';

import Image from 'next/image';
import { UIMessage } from '@ai-sdk/react';
import type { ChatStatus } from 'ai';
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from '@/components/ai-elements/conversation';
import { MessageResponse } from '@/components/ai-elements/message';
import type { ChatMessageMetadata } from '@/types/chat';

// ============================================================================
// Types
// ============================================================================

interface ChatMessageListProps {
  messages: UIMessage[];
  status?: ChatStatus;
  getMessageMetadata?: (message: UIMessage) => ChatMessageMetadata | undefined;
  onUpdateDraft?: (chatId: string) => void;
}

// ============================================================================
// Helper Functions
// ============================================================================

function getMessageText(message: UIMessage): string {
  const textPart = message.parts.find((p) => p.type === 'text');
  return textPart && 'text' in textPart ? textPart.text : '';
}

// ============================================================================
// Sub Components
// ============================================================================

function AIAvatar() {
  return (
    <div className="w-8.5 h-8.5 shrink-0">
      <Image src="/icons/ai-logo.svg" alt="AI" width={34} height={34} />
    </div>
  );
}

function EmptyState() {
  return (
    <div className="h-full flex flex-col items-center justify-center gap-7">
      <Image
        src="/icons/ai-logo.svg"
        alt=""
        width={80}
        height={80}
        className="opacity-30"
      />
      <p className="text-body-6-2 text-gray-100 text-center">
        경험을 선택하면 초안이 생성돼요
      </p>
    </div>
  );
}

function UserMessage({ content }: { content: string }) {
  return (
    <div className="flex justify-end">
      <div className="max-w-180 bg-gray-20 rounded-bl-xl rounded-br-xl rounded-tl-xl rounded-tr-sm px-6 py-2.5">
        <p className="text-body-6-1 text-gray-500">{content}</p>
      </div>
    </div>
  );
}

function AIMessage({
  content,
  isDraft,
  chatId,
  onUpdateDraft,
}: {
  content: string;
  isDraft?: boolean;
  chatId?: string;
  onUpdateDraft?: (chatId: string) => void;
}) {
  return (
    <div className="flex gap-5 items-start">
      <AIAvatar />
      <div className="flex-1 flex flex-col gap-4.5">
        <div className="py-4 text-body-6-1 text-gray-400 [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
          <MessageResponse>{content}</MessageResponse>
        </div>
        {isDraft && chatId && onUpdateDraft && (
          <button
            onClick={() => onUpdateDraft(chatId)}
            className="flex items-center gap-1.5 pl-3 pr-4 py-1.5 border border-primary-400 rounded-xl text-body-8-1 text-primary-400 hover:bg-gray-20 transition-colors w-fit cursor-pointer"
          >
            <Image src="/icons/autorenew.svg" alt="" width={16} height={16} />
            자기소개서 업데이트
          </button>
        )}
      </div>
    </div>
  );
}

function LoadingIndicator() {
  return (
    <div className="flex gap-5 items-start">
      <AIAvatar />
      <div className="flex items-center gap-1.5 py-2">
        <span className="text-body-6-1 text-gray-300">답변 작성 중</span>
        <div className="flex items-center gap-0.5">
          {[0, 0.2, 0.4].map((delay) => (
            <span
              key={delay}
              className="w-1 h-1 bg-primary-100 rounded-full animate-pulse"
              style={{ animationDelay: `${delay}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Main Component
// ============================================================================

export function ChatMessageList({
  messages,
  status,
  getMessageMetadata,
  onUpdateDraft,
}: ChatMessageListProps) {
  if (messages.length === 0) {
    return <EmptyState />;
  }

  const isWaitingForResponse = status === 'submitted';

  return (
    <Conversation className="h-full">
      <ConversationContent className="flex flex-col gap-10 p-0">
        {messages.map((message) => {
          const metadata = getMessageMetadata?.(message);
          const content = getMessageText(message);

          if (message.role === 'user') {
            return <UserMessage key={message.id} content={content} />;
          }

          return (
            <AIMessage
              key={message.id}
              content={content}
              isDraft={metadata?.is_draft}
              chatId={metadata?.chat_id}
              onUpdateDraft={onUpdateDraft}
            />
          );
        })}
        {isWaitingForResponse && <LoadingIndicator />}
      </ConversationContent>
      <ConversationScrollButton />
    </Conversation>
  );
}
