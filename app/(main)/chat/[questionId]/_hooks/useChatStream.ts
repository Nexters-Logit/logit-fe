'use client';

import { useChat, UIMessage } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { useState } from 'react';
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
  const [input, setInput] = useState('');

  const { messages, sendMessage, status, error, stop } = useChat({
    messages: initialMessages,
    transport: new DefaultChatTransport({
      api: '/api/chat',
      body: {
        question_id: questionId,
        experience_ids: experienceIds.length > 0 ? experienceIds : null,
      },
    }),
    onFinish: ({ message }) => {
      onFinish?.(message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      sendMessage({ text: input });
      setInput('');
    }
  };

  const sendText = (text: string) => {
    sendMessage({ text });
  };

  // 메시지에서 메타데이터 추출 헬퍼
  const getMessageMetadata = (message: UIMessage): ChatMessageMetadata | undefined => {
    const dataPart = message.parts.find(
      (part) => part.type === 'data-chat-metadata'
    );
    if (dataPart && 'data' in dataPart) {
      return (dataPart as { type: string; data: ChatMessageMetadata }).data;
    }
    return undefined;
  };

  return {
    messages,
    input,
    setInput,
    handleSubmit,
    sendMessage: sendText,
    isLoading: status === 'streaming' || status === 'submitted',
    status,
    error,
    stop,
    getMessageMetadata,
  };
}
