'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import StatusEmpty from '@/components/StatusEmpty';
import { getQuestions } from '@/app/_actions/projects';
import type { ProjectListItem } from '@/types/api';

// 날짜 포맷 유틸리티
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}.${month}.${day}`;
}

function ProjectRow({
  project,
  onClick,
  isLoading,
}: {
  project: ProjectListItem;
  onClick: () => void;
  isLoading: boolean;
}) {
  const title = `${project.company} ${project.job_position} 자기소개서`;
  const date = formatDate(project.updated_at);

  return (
    <div
      onClick={onClick}
      className={`flex items-center justify-between py-3.5 border-b border-gray-70 w-full cursor-pointer hover:bg-gray-20 transition-colors ${
        isLoading ? 'opacity-50' : ''
      }`}
    >
      <div className="flex items-center gap-6">
        <div className="w-1.25 h-8 bg-primary-70 rounded-lg" />
        <span className="text-body-5-5 text-primary-600">{title}</span>
      </div>
      <span className="text-body-5-5 text-primary-600">
        {isLoading ? '이동 중...' : date}
      </span>
    </div>
  );
}

interface ProjectListProps {
  projects: ProjectListItem[];
}

export function ProjectList({ projects }: ProjectListProps) {
  const router = useRouter();
  const [loadingProjectId, setLoadingProjectId] = useState<string | null>(null);

  const handleProjectClick = async (projectId: string) => {
    try {
      setLoadingProjectId(projectId);
      const questions = await getQuestions(projectId);

      if (questions.length === 0) {
        alert('이 프로젝트에 문항이 없습니다.');
        return;
      }

      // 첫 번째 문항의 채팅 페이지로 이동
      router.push(`/chat/${questions[0].id}`);
    } catch (error) {
      console.error('Failed to navigate to chat:', error);
      alert('채팅 페이지로 이동할 수 없습니다.');
    } finally {
      setLoadingProjectId(null);
    }
  };

  if (projects.length === 0) {
    return (
      <div className="mt-5 flex justify-center py-10">
        <StatusEmpty message="생성된 프로젝트가 없어요" />
      </div>
    );
  }

  return (
    <div className="mt-5">
      {projects.map((project) => (
        <ProjectRow
          key={project.id}
          project={project}
          onClick={() => handleProjectClick(project.id)}
          isLoading={loadingProjectId === project.id}
        />
      ))}
    </div>
  );
}

export function ProjectListSkeleton() {
  return (
    <div className="mt-5 flex justify-center py-10">
      <span className="text-body-5-5 text-gray-300">불러오는 중...</span>
    </div>
  );
}
