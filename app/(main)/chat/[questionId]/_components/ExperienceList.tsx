'use client';

import type { Experience } from '@/types/api';
import { ExperienceCard } from './ExperienceCard';

const MAX_SELECTION = 3;

interface ExperienceListProps {
  experiences: Experience[];
  selectedIds: string[];
  onSelect: (id: string) => void;
  onDeselect: (id: string) => void;
  onGenerateDraft: () => void;
  isLoading?: boolean;
}

export function ExperienceList({
  experiences,
  selectedIds,
  onSelect,
  onDeselect,
  onGenerateDraft,
  isLoading,
}: ExperienceListProps) {
  const canSelectMore = selectedIds.length < MAX_SELECTION;
  const hasSelection = selectedIds.length > 0;

  const handleToggle = (id: string) => {
    if (selectedIds.includes(id)) {
      onDeselect(id);
    } else if (canSelectMore) {
      onSelect(id);
    }
  };

  if (experiences.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <p className="text-body-5-5 text-gray-200 mb-4">
          등록된 경험이 없어요
        </p>
        <button className="px-4 py-2 bg-primary-100 text-white text-body-5-5 rounded-lg hover:bg-primary-200 transition-colors">
          + 경험 추가하기
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* 선택 상태 헤더 */}
      <div className="px-4 py-3 border-b border-gray-70 flex items-center justify-between">
        <span className="text-body-5-5 text-gray-300">
          {selectedIds.length}/{MAX_SELECTION} 선택됨
        </span>
        {hasSelection && (
          <button
            onClick={onGenerateDraft}
            disabled={isLoading}
            className="px-4 py-2 bg-primary-200 text-white text-body-5-5 rounded-lg hover:bg-primary-300 disabled:opacity-50 transition-colors"
          >
            {isLoading ? '생성 중...' : '초안 생성하기'}
          </button>
        )}
      </div>

      {/* 경험 목록 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {experiences.map((experience) => (
          <ExperienceCard
            key={experience.id}
            experience={experience}
            isSelected={selectedIds.includes(experience.id)}
            onToggle={() => handleToggle(experience.id)}
            disabled={!canSelectMore}
          />
        ))}
      </div>
    </div>
  );
}
