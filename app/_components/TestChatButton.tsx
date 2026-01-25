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
      // 1. 기존 프로젝트 목록 가져오기
      const projectsRes = await fetch('/api/projects');
      if (!projectsRes.ok) {
        throw new Error('프로젝트 목록을 가져올 수 없습니다');
      }
      const projects = await projectsRes.json();

      if (!projects || projects.length === 0) {
        throw new Error('사용 가능한 프로젝트가 없습니다');
      }

      // 2. 첫 번째 프로젝트의 문항 가져오기
      const projectId = projects[0].id;
      const questionsRes = await fetch(`/api/projects/${projectId}/questions`);
      if (!questionsRes.ok) {
        throw new Error('문항 목록을 가져올 수 없습니다');
      }
      const questions = await questionsRes.json();

      if (!questions || questions.length === 0) {
        throw new Error('사용 가능한 문항이 없습니다');
      }

      // 3. 첫 번째 문항의 채팅 페이지로 이동
      const questionId = questions[0].id;
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
        className="px-6 py-3 bg-primary-200 text-white text-body-3-2 rounded-xl hover:bg-primary-300 disabled:opacity-50 transition-colors cursor-pointer"
      >
        {loading ? '로딩 중...' : '🧪 테스트 채팅 시작'}
      </button>
      {error && (
        <p className="text-body-7-3 text-alert">{error}</p>
      )}
    </div>
  );
}
