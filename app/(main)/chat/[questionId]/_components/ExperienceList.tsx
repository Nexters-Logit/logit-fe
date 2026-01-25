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
    selectedIds.includes(id) ? onDeselect(id) : canSelectMore && onSelect(id);
  };

  return (
    <div className="flex-1 flex flex-col gap-5 pt-5 pb-8 overflow-hidden">
      <p className="text-body-5-5 text-gray-400 opacity-60 px-7">
        반영할 경험카드를 선택하세요 (최대 3개)
      </p>

      <div className="flex-1 flex flex-col gap-7 overflow-y-auto px-7">
        <button className="w-full h-15 flex items-center justify-center bg-primary-50 rounded-3.5 hover:bg-primary-70 transition-colors shrink-0 cursor-pointer">
          <span className="text-body-3-2 text-gray-300">+추가하기</span>
        </button>

        {experiences.length > 0 && (
          <div className="flex flex-col gap-3">
            {experiences.map((exp) => (
              <ExperienceCard
                key={exp.id}
                experience={exp}
                isSelected={selectedIds.includes(exp.id)}
                onToggle={() => handleToggle(exp.id)}
                disabled={!canSelectMore}
              />
            ))}
          </div>
        )}
      </div>

      {hasSelection && (
        <div className="px-7 shrink-0">
          <button
            onClick={onGenerateDraft}
            disabled={isLoading}
            className="w-full h-15 flex items-center justify-center bg-primary-200 text-white text-body-3-2 rounded-3.5 hover:bg-primary-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors"
          >
            {isLoading ? '생성 중...' : '초안 생성하기'}
          </button>
        </div>
      )}
    </div>
  );
}
