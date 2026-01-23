'use client';

import { UIMessage } from '@ai-sdk/react';
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from '@/components/ai-elements/conversation';
import {
  Message,
  MessageContent,
  MessageResponse,
} from '@/components/ai-elements/message';
import { Button } from '@/components/ui/button';
import type { ChatMessageMetadata } from '@/types/chat';

interface ChatMessageListProps {
  messages: UIMessage[];
  isLoading?: boolean;
  getMessageMetadata?: (message: UIMessage) => ChatMessageMetadata | undefined;
  onUpdateDraft?: (chatId: string) => void;
}

export function ChatMessageList({
  messages,
  isLoading,
  getMessageMetadata,
  onUpdateDraft,
}: ChatMessageListProps) {
  // 메시지에서 텍스트 콘텐츠 추출
  const getMessageText = (message: UIMessage): string => {
    const textPart = message.parts.find((part) => part.type === 'text');
    if (textPart && 'text' in textPart) {
      return textPart.text;
    }
    return '';
  };

  if (messages.length === 0) {
    return (
      <Conversation className="flex-1">
        <ConversationEmptyState
          title="대화를 시작해보세요"
          description="경험을 선택하고 초안 생성하기 버튼을 누르거나, 직접 질문을 입력해주세요."
        />
      </Conversation>
    );
  }

  return (
    <Conversation className="flex-1">
      <ConversationContent className="p-7.5 gap-6">
        {messages.map((message) => {
          const metadata = getMessageMetadata?.(message);
          const isDraft = metadata?.is_draft;

          return (
            <Message key={message.id} from={message.role}>
              <MessageContent>
                {message.role === 'assistant' ? (
                  <MessageResponse>{getMessageText(message)}</MessageResponse>
                ) : (
                  <p>{getMessageText(message)}</p>
                )}
              </MessageContent>

              {/* 초안 메시지에 자기소개서 업데이트 버튼 표시 */}
              {isDraft && metadata?.chat_id && onUpdateDraft && (
                <div className="mt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onUpdateDraft(metadata.chat_id!)}
                    className="text-primary-200 border-primary-200 hover:bg-primary-20"
                  >
                    자기소개서 업데이트
                  </Button>
                </div>
              )}
            </Message>
          );
        })}

        {/* 로딩 인디케이터 */}
        {isLoading && (
          <Message from="assistant">
            <MessageContent>
              <div className="flex items-center gap-2 text-gray-300">
                <div className="w-2 h-2 bg-primary-200 rounded-full animate-bounce" />
                <div
                  className="w-2 h-2 bg-primary-200 rounded-full animate-bounce"
                  style={{ animationDelay: '0.1s' }}
                />
                <div
                  className="w-2 h-2 bg-primary-200 rounded-full animate-bounce"
                  style={{ animationDelay: '0.2s' }}
                />
              </div>
            </MessageContent>
          </Message>
        )}
      </ConversationContent>
      <ConversationScrollButton />
    </Conversation>
  );
}
