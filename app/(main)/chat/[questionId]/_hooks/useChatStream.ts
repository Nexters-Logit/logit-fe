'use client';

import { useRef, useCallback } from 'react';
import { useChat, UIMessage } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import type { ChatMessageMetadata } from '@/types/chat';

interface UseChatStreamOptions {
  questionId: string;
  experienceIds: string[];
  initialMessages?: UIMessage[];
  onFinish?: (message: UIMessage) => void;
}

export function useChatStream({
  questionId,
  experienceIds,
  initialMessages,
  onFinish,
}: UseChatStreamOptions) {
  const lastMessageRef = useRef<string | null>(null);

  const { messages, sendMessage, status, error, stop } = useChat({
    id: `chat-${questionId}`,
    messages: initialMessages,
    transport: new DefaultChatTransport({
      api: '/api/chat',
      body: {
        question_id: questionId,
        experience_ids: experienceIds.length > 0 ? experienceIds : null,
      },
    }),
    onFinish: ({ message }) => onFinish?.(message),
  });

  const send = useCallback((text: string) => {
    lastMessageRef.current = text;
    sendMessage({ text });
  }, [sendMessage]);

  const retry = useCallback(() => {
    if (lastMessageRef.current) {
      sendMessage({ text: lastMessageRef.current });
    }
  }, [sendMessage]);

  const getMessageMetadata = (message: UIMessage): ChatMessageMetadata | undefined => {
    const dataPart = message.parts.find((p) => p.type === 'data-chat-metadata');
    if (dataPart && 'data' in dataPart) {
      return dataPart.data as ChatMessageMetadata;
    }
    return undefined;
  };

  return {
    messages,
    sendMessage: send,
    status,
    error,
    stop,
    retry,
    getMessageMetadata,
  };
}
