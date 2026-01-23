'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function TestChatButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleStartChat = async () => {
    setLoading(true);
    setError(null);

    try {
      // 1. 프로젝트 생성 (문항 포함)
      const res = await fetch('/api/test/create-project', {
        method: 'POST',
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to create project');
      }

      const { questionId } = await res.json();

      // 2. 채팅 페이지로 이동
      router.push(`/chat/${questionId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-start gap-2">
      <button
        onClick={handleStartChat}
        disabled={loading}
        className="px-6 py-3 bg-primary-200 text-white text-body-3-2 rounded-xl hover:bg-primary-300 disabled:opacity-50 transition-colors"
      >
        {loading ? '생성 중...' : '🧪 테스트 채팅 시작'}
      </button>
      {error && (
        <p className="text-body-7-3 text-alert">{error}</p>
      )}
    </div>
  );
}
