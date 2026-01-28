"use client";

import { UIMessage } from "@ai-sdk/react";
import type { ChatStatus } from "ai";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import type { ChatMessageMetadata } from "@/types/chat";
import { ChatEmptyState } from "./ChatEmptyState";
import { UserMessage } from "./UserMessage";
import { AIMessage } from "./AIMessage";
import { ChatLoadingIndicator } from "./ChatLoadingIndicator";
import { ChatErrorMessage } from "./ChatErrorMessage";

interface ChatMessageListProps {
  messages: UIMessage[];
  status?: ChatStatus;
  error?: Error | null;
  getMessageMetadata?: (message: UIMessage) => ChatMessageMetadata | undefined;
  onUpdateDraft?: (chatId: string) => void;
  onRetry?: () => void;
}

function getMessageText(message: UIMessage): string {
  const textPart = message.parts.find((p) => p.type === "text");
  return textPart && "text" in textPart ? textPart.text : "";
}

export function ChatMessageList({
  messages,
  status,
  error,
  getMessageMetadata,
  onUpdateDraft,
  onRetry,
}: ChatMessageListProps) {
  if (messages.length === 0 && !error) {
    return <ChatEmptyState />;
  }

  const isWaitingForResponse = status === "submitted";
  const hasError = error && status === "error";

  return (
    <Conversation className="h-full">
      <ConversationContent className="flex flex-col gap-10 p-0">
        {messages.map((message) => {
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
              onUpdateDraft={onUpdateDraft}
            />
          );
        })}
        {isWaitingForResponse && <ChatLoadingIndicator />}
        {hasError && <ChatErrorMessage error={error} onRetry={onRetry} />}
      </ConversationContent>
      <ConversationScrollButton />
    </Conversation>
  );
}
