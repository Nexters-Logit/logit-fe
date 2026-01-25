import { UIMessage } from '@ai-sdk/react';
import type { ChatHistoryItem } from '@/types/api';
import type { ChatMessageMetadata } from '@/types/chat';

/**
 * 서버 채팅 히스토리를 AI SDK UIMessage 형식으로 변환
 */
export function convertToUIMessages(chats: ChatHistoryItem[]): UIMessage[] {
  return chats.map((chat) => ({
    id: chat.id,
    role: chat.role as 'user' | 'assistant',
    parts: [{ type: 'text' as const, text: chat.content }],
    createdAt: new Date(chat.created_at),
  }));
}

/**
 * UIMessage에서 draft 메타데이터 추출
 */
export function extractDraftMetadata(message: UIMessage): ChatMessageMetadata | null {
  const dataPart = message.parts.find((p) => p.type === 'data-chat-metadata');
  if (dataPart && 'data' in dataPart) {
    return dataPart.data as ChatMessageMetadata;
  }
  return null;
}

/**
 * UIMessage에서 텍스트 content 추출
 */
export function getMessageContent(message: UIMessage): string {
  const textPart = message.parts.find((p) => p.type === 'text');
  return textPart && 'text' in textPart ? textPart.text : '';
}
