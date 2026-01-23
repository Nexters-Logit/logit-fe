'use client';

import type { Experience } from '@/types/api';

// 태그 문자열 파싱 (JSON 배열 또는 쉼표 구분)
function parseTags(tags: string): string[] {
  if (!tags) return [];
  try {
    const parsed = JSON.parse(tags);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return tags.split(',').map((t) => t.trim()).filter(Boolean);
  }
}

// 카테고리별 아이콘 배경색
const CATEGORY_COLORS: Record<string, string> = {
  '고객 가치 지향': 'bg-icon-1',
  '기술적 전문성': 'bg-icon-2',
  '협력적 소통': 'bg-icon-3',
  '주도적 실행력': 'bg-icon-4',
  '논리적 분석력': 'bg-icon-5',
  '창의적 문제해결': 'bg-icon-6',
  '유연한 적응력': 'bg-icon-7',
  '끈기있는 책임감': 'bg-icon-8',
};

interface ExperienceCardProps {
  experience: Experience;
  isSelected: boolean;
  onToggle: () => void;
  disabled?: boolean;
}

export function ExperienceCard({
  experience,
  isSelected,
  onToggle,
  disabled,
}: ExperienceCardProps) {
  const categoryColor = CATEGORY_COLORS[experience.category] || 'bg-gray-100';

  return (
    <button
      onClick={onToggle}
      disabled={disabled && !isSelected}
      className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
        isSelected
          ? 'border-primary-200 bg-primary-20'
          : 'border-gray-70 hover:border-gray-100'
      } ${disabled && !isSelected ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <div className="flex items-start gap-3">
        {/* 카테고리 아이콘 */}
        <div
          className={`w-10 h-10 rounded-lg ${categoryColor} flex items-center justify-center shrink-0`}
        >
          <span className="text-white text-body-7-3">
            {experience.category.charAt(0)}
          </span>
        </div>

        <div className="flex-1 min-w-0">
          {/* 제목 */}
          <h4 className="text-body-3-3 text-gray-400 truncate">
            {experience.title}
          </h4>

          {/* 카테고리 + 날짜 */}
          <div className="flex items-center gap-2 mt-1">
            <span className="text-body-7-3 text-gray-200">
              {experience.category}
            </span>
            <span className="text-gray-100">•</span>
            <span className="text-body-7-3 text-gray-200">
              {experience.date}
            </span>
          </div>

          {/* 태그 */}
          {experience.tags && (
            <div className="flex flex-wrap gap-1 mt-2">
              {parseTags(experience.tags).slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 bg-gray-50 text-gray-300 text-body-9-3 rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* 선택 체크 */}
        <div
          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
            isSelected
              ? 'border-primary-200 bg-primary-200'
              : 'border-gray-100'
          }`}
        >
          {isSelected && (
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              className="text-white"
            >
              <path
                d="M2 6L5 9L10 3"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </div>
      </div>
    </button>
  );
}
