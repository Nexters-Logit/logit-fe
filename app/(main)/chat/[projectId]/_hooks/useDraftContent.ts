'use client';

import { UIMessage } from '@ai-sdk/react';
import { getMessageContent } from '../_utils';
import type { ChatMessageMetadata } from '@/types/chat';

interface UseDraftContentOptions {
  messages: UIMessage[];
  getMessageMetadata: (message: UIMessage) => ChatMessageMetadata | undefined;
  serverDraftContent?: string;
}

/**
 * 스트리밍 메시지와 서버 데이터에서 최신 draft content를 추출하는 훅
 * 스트리밍 메시지 우선, 없으면 서버 데이터 사용
 */
export function useDraftContent({
  messages,
  getMessageMetadata,
  serverDraftContent,
}: UseDraftContentOptions): string | null {
  // 스트리밍 메시지에서 최신 draft content 추출
  for (let i = messages.length - 1; i >= 0; i--) {
    const message = messages[i];
    if (message.role !== 'assistant') continue;

    const metadata = getMessageMetadata(message);
    if (metadata?.is_draft) {
      return getMessageContent(message);
    }
  }

  return serverDraftContent || null;
}
