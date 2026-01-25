import {
  getAuthToken,
  API_BASE_URL,
  API_ENDPOINTS,
} from '@/libs/api-client';
import { createUIMessageStream, createUIMessageStreamResponse } from 'ai';
import type { SSEEvent } from '@/types/chat';

// 백엔드 SSE를 파싱하는 TransformStream
function createSSEParser(): TransformStream<Uint8Array, SSEEvent> {
  const decoder = new TextDecoder();
  let buffer = '';

  return new TransformStream({
    transform(chunk, controller) {
      buffer += decoder.decode(chunk, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed.startsWith('data: ')) {
          try {
            controller.enqueue(JSON.parse(trimmed.slice(6)));
          } catch {
            // skip invalid JSON
          }
        }
      }
    },
    flush(controller) {
      const trimmed = buffer.trim();
      if (trimmed.startsWith('data: ')) {
        try {
          controller.enqueue(JSON.parse(trimmed.slice(6)));
        } catch {
          // skip invalid JSON
        }
      }
    },
  });
}

// AI SDK messages 배열에서 마지막 사용자 메시지 추출
function extractContent(body: Record<string, unknown>): string | null {
  if (typeof body.content === 'string') return body.content;

  const messages = body.messages;
  if (!Array.isArray(messages)) return null;

  const lastUserMessage = messages.findLast(
    (m): m is { role: string; parts: { type: string; text?: string }[] } => m?.role === 'user'
  );

  return lastUserMessage?.parts?.find((p) => p.type === 'text')?.text || null;
}

export async function POST(req: Request) {
  const body = await req.json();
  const content = extractContent(body);

  if (!content) {
    return Response.json({ error: 'No message content provided' }, { status: 400 });
  }

  const { question_id, experience_ids } = body;

  const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.chats}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getAuthToken()}`,
      Accept: 'text/event-stream',
    },
    body: JSON.stringify({
      question_id,
      content,
      experience_ids: experience_ids || null,
    }),
  });

  if (!response.ok || !response.body) {
    const errorText = response.body ? await response.text() : 'No response body';
    return Response.json({ error: errorText || 'Backend API error' }, { status: response.status });
  }

  const sseStream = response.body.pipeThrough(createSSEParser());
  const reader = sseStream.getReader();

  return createUIMessageStreamResponse({
    stream: createUIMessageStream({
      execute: async ({ writer }) => {
        const textId = `text_${Date.now()}`;
        let started = false;

        while (true) {
          const { done, value: event } = await reader.read();
          if (done) break;

          if (event.type === 'content') {
            if (!started) {
              started = true;
              writer.write({ type: 'text-start', id: textId });
            }
            writer.write({ type: 'text-delta', id: textId, delta: event.content });
          } else if (event.type === 'done') {
            if (started) writer.write({ type: 'text-end', id: textId });
            writer.write({
              type: 'data-chat-metadata',
              data: { chat_id: event.chat_id, is_draft: event.is_draft },
            });
          } else if (event.type === 'error') {
            throw new Error(event.message);
          }
        }
      },
      onError: (error) => (error instanceof Error ? error.message : 'Unknown error'),
    }),
  });
}
