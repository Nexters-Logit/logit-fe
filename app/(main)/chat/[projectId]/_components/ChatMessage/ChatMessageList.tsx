"use client";

import { UIMessage } from "@ai-sdk/react";
import type { ChatStatus } from "ai";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { useStickToBottomContext } from "use-stick-to-bottom";
import type { ChatMessageMetadata } from "@/types/chat";
import { useInfiniteScrollUp } from "../../_hooks/useInfiniteScrollUp";
import { ChatEmptyState } from "./ChatEmptyState";
import { UserMessage } from "./UserMessage";
import { AIMessage } from "./AIMessage";
import { ChatLoadingIndicator } from "./ChatLoadingIndicator";
import { ChatErrorMessage } from "./ChatErrorMessage";
import { Loader2 } from "lucide-react";

interface Pagination {
  hasMore: boolean;
  isFetching: boolean;
  fetchMore: () => void;
}

interface ChatMessageListProps {
  messages: UIMessage[];
  status?: ChatStatus;
  error?: Error | null;
  getMessageMetadata?: (message: UIMessage) => ChatMessageMetadata | undefined;
  onUpdateDraft?: (chatId: string) => void;
  onRetry?: () => void;
  pagination: Pagination;
}

function getMessageText(message: UIMessage): string {
  const textPart = message.parts.find((p) => p.type === "text");
  return textPart && "text" in textPart ? textPart.text : "";
}

export function ChatMessageList(props: ChatMessageListProps) {
  if (props.messages.length === 0 && !props.error) {
    return <ChatEmptyState />;
  }

  return (
    <Conversation className="h-full">
      <ChatMessageListContent {...props} />
      <ConversationScrollButton />
    </Conversation>
  );
}

function ChatMessageListContent({
  messages,
  status,
  error,
  getMessageMetadata,
  onUpdateDraft,
  onRetry,
  pagination,
}: ChatMessageListProps) {
  const { scrollRef } = useStickToBottomContext();

  const { sentinelRef } = useInfiniteScrollUp({
    scrollRef,
    hasMore: pagination.hasMore,
    isLoading: pagination.isFetching,
    onLoadMore: pagination.fetchMore,
    firstItemId: messages[0]?.id ?? null,
  });

  const isWaitingForResponse = status === "submitted";
  const isStreaming = status === "streaming";
  const hasError = error && status === "error";
  const lastAIMessageIndex = messages.findLastIndex(
    (msg) => msg.role === "assistant",
  );

  return (
    <ConversationContent className="flex flex-col gap-10 p-0">
      <div ref={sentinelRef} className="h-1" />
      {pagination.isFetching && (
        <div className="flex justify-center py-4">
          <Loader2 className="size-5 text-gray-300 animate-spin" />
        </div>
      )}
      {messages.map((message, index) => {
        const metadata = getMessageMetadata?.(message);
        const content = getMessageText(message);

        if (message.role === "user") {
          return <UserMessage key={message.id} content={content} />;
        }

        return (
          <AIMessage
            key={message.id}
            content={content}
            isDraft={metadata?.is_draft}
            chatId={metadata?.chat_id}
            isStreaming={isStreaming && index === lastAIMessageIndex}
            onUpdateDraft={onUpdateDraft}
          />
        );
      })}
      {isWaitingForResponse && <ChatLoadingIndicator />}
      {hasError && <ChatErrorMessage error={error} onRetry={onRetry} />}
    </ConversationContent>
  );
}
