import type { UIMessage } from 'ai';

// ============================================================================
// Chat Metadata (AI SDK 확장)
// ============================================================================

/**
 * AI SDK UIMessage에 추가되는 메타데이터
 * is_draft: true인 경우 "자기소개서 업데이트" 버튼 표시
 */
export interface ChatMessageMetadata {
  chat_id?: string;
  is_draft?: boolean;
  tokens_used?: number;
}

/**
 * 메타데이터가 확장된 UIMessage 타입
 */
export type ChatUIMessage = UIMessage & {
  metadata?: ChatMessageMetadata;
};

// ============================================================================
// SSE Event Types (백엔드 -> 프론트엔드)
// ============================================================================

export interface SSEContentEvent {
  type: 'content';
  content: string;
}

export interface SSEDoneEvent {
  type: 'done';
  chat_id: string;
  is_draft: boolean;
  tokens_used?: number;
}

export interface SSEErrorEvent {
  type: 'error';
  message: string;
}

export type SSEEvent = SSEContentEvent | SSEDoneEvent | SSEErrorEvent;

// ============================================================================
// Panel Tab State
// ============================================================================

export type PanelTab = 'EXPERIENCES' | 'DRAFT';
