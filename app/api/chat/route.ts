import {
  getAuthToken,
  API_BASE_URL,
  API_ENDPOINTS,
} from '@/libs/api-client';
import type { SSEEvent } from '@/types/chat';

export async function POST(req: Request) {
  const { question_id, content, experience_ids } = await req.json();

  const token = getAuthToken();

  // 백엔드로 SSE 요청
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
    const error = await response.json().catch(() => ({}));
    return Response.json(
      { error: error.detail || 'Backend API error' },
      { status: response.status }
    );
  }

  if (!response.body) {
    return Response.json({ error: 'No response body' }, { status: 500 });
  }

  // 백엔드 SSE -> AI SDK 스트림 프로토콜 변환
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  // SSE 라인 버퍼 (청크가 나뉘어 올 수 있음)
  let buffer = '';

  const transformStream = new TransformStream({
    transform(chunk, controller) {
      buffer += decoder.decode(chunk, { stream: true });

      // 완전한 라인 단위로 처리
      const lines = buffer.split('\n');
      // 마지막 불완전한 라인은 버퍼에 유지
      buffer = lines.pop() || '';

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || !trimmed.startsWith('data: ')) continue;

        const jsonStr = trimmed.slice(6);
        if (!jsonStr) continue;

        let event: SSEEvent;
        try {
          event = JSON.parse(jsonStr) as SSEEvent;
        } catch (e) {
          // JSON 파싱 실패 - 로깅 후 에러 전송
          console.error('[SSE Parse Error]', jsonStr, e);
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({
                type: 'error',
                error: `SSE parse error: ${jsonStr}`,
              })}\n\n`
            )
          );
          continue;
        }

        switch (event.type) {
          case 'content':
            // AI SDK text-delta 형식으로 변환
            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({
                  type: 'text-delta',
                  textDelta: event.content,
                })}\n\n`
              )
            );
            break;

          case 'done':
            // 메타데이터를 data part로 전송
            // message.parts에서 접근: part.type === 'data-chat-metadata'
            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({
                  type: 'data-chat-metadata',
                  data: {
                    chat_id: event.chat_id,
                    is_draft: event.is_draft,
                  },
                })}\n\n`
              )
            );
            // 메시지 완료
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ type: 'finish' })}\n\n`)
            );
            break;

          case 'error':
            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({
                  type: 'error',
                  error: event.message,
                })}\n\n`
              )
            );
            break;
        }
      }
    },

    flush(controller) {
      // 스트림 종료 시 남은 버퍼 처리
      if (buffer.trim()) {
        console.warn('[SSE] Incomplete data in buffer:', buffer);
      }
    },
  });

  return new Response(response.body.pipeThrough(transformStream), {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
      'x-vercel-ai-ui-message-stream': 'v1',
    },
  });
}
