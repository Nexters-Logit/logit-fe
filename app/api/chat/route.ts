import {
  getAuthToken,
  API_BASE_URL,
  API_ENDPOINTS,
} from '@/libs/api-client';
import { createUIMessageStream, createUIMessageStreamResponse } from 'ai';
import type { SSEEvent } from '@/types/chat';

// SSE 라인을 이벤트로 파싱
function parseSSELine(line: string): SSEEvent | null {
  const trimmed = line.trim();
  if (!trimmed || !trimmed.startsWith('data: ')) return null;

  const jsonStr = trimmed.slice(6);
  if (!jsonStr) return null;

  try {
    return JSON.parse(jsonStr) as SSEEvent;
  } catch {
    return null;
  }
}

// SSE 스트림을 이벤트로 변환하는 async generator
async function* parseSSEStream(
  reader: ReadableStreamDefaultReader<Uint8Array>
): AsyncGenerator<SSEEvent> {
  const decoder = new TextDecoder();
  let buffer = '';

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        const event = parseSSELine(line);
        if (event) yield event;
      }
    }

    // 마지막 불완전한 라인 처리
    if (buffer.trim()) {
      const event = parseSSELine(buffer);
      if (event) yield event;
    }
  } finally {
    reader.releaseLock();
  }
}

// 요청 본문에서 메시지 content 추출
function extractContent(body: Record<string, unknown>): string | null {
  if (typeof body.content === 'string') {
    return body.content;
  }

  const messages = body.messages;
  if (!Array.isArray(messages)) return null;

  const lastUserMessage = messages
    .filter((m): m is { role: string; parts: { type: string; text?: string }[] } =>
      m?.role === 'user'
    )
    .pop();

  if (!lastUserMessage?.parts) return null;

  const textPart = lastUserMessage.parts.find((p) => p.type === 'text');
  return textPart?.text || null;
}

export async function POST(req: Request) {
  const body = await req.json();
  const content = extractContent(body);

  if (!content) {
    return Response.json(
      { error: 'No message content provided' },
      { status: 400 }
    );
  }

  const { question_id, experience_ids } = body;
  const token = getAuthToken();

  // 백엔드 SSE 요청
  const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.chats}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      Accept: 'text/event-stream',
    },
    body: JSON.stringify({
      question_id,
      content,
      experience_ids: experience_ids || null,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    return Response.json(
      { error: errorText || 'Backend API error' },
      { status: response.status }
    );
  }

  if (!response.body) {
    return Response.json({ error: 'No response body' }, { status: 500 });
  }

  const reader = response.body.getReader();

  const stream = createUIMessageStream({
    execute: async ({ writer }) => {
      const textId = `text_${Date.now()}`;
      let hasStartedText = false;

      for await (const event of parseSSEStream(reader)) {
        switch (event.type) {
          case 'content':
            if (!hasStartedText) {
              hasStartedText = true;
              writer.write({ type: 'text-start', id: textId });
            }
            writer.write({ type: 'text-delta', id: textId, delta: event.content });
            break;

          case 'done':
            if (hasStartedText) {
              writer.write({ type: 'text-end', id: textId });
            }
            writer.write({
              type: 'data-chat-metadata',
              data: { chat_id: event.chat_id, is_draft: event.is_draft },
            });
            break;

          case 'error':
            throw new Error(event.message);
        }
      }
    },
    onError: (error) => {
      console.error('[Chat API] Stream error:', error);
      return error instanceof Error ? error.message : 'Unknown error';
    },
  });

  return createUIMessageStreamResponse({ stream });
}
