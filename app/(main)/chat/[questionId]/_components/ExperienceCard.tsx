'use client';

import Image from 'next/image';
import type { Experience } from '@/types/api';

// ============================================================================
// Constants
// ============================================================================

const CATEGORY_CONFIG: Record<string, { bg: string; icon: string; label: string }> = {
  '고객 가치 지향': { bg: 'bg-icon-bg-1', icon: '/icons/category/icon-1.svg', label: '고객이해력' },
  '기술적 전문성': { bg: 'bg-icon-bg-2', icon: '/icons/category/icon-2.svg', label: '전문성' },
  '협력적 소통': { bg: 'bg-icon-bg-3', icon: '/icons/category/icon-3.svg', label: '소통력' },
  '주도적 실행력': { bg: 'bg-icon-bg-4', icon: '/icons/category/icon-4.svg', label: '실행력' },
  '논리적 분석력': { bg: 'bg-icon-bg-5', icon: '/icons/category/icon-5.svg', label: '분석력' },
  '창의적 문제해결': { bg: 'bg-icon-bg-6', icon: '/icons/category/icon-6.svg', label: '문제해결력' },
  '유연한 적응력': { bg: 'bg-icon-bg-7', icon: '/icons/category/icon-7.svg', label: '적응력' },
  '끈기있는 책임감': { bg: 'bg-icon-bg-8', icon: '/icons/category/icon-8.svg', label: '책임감' },
};

const DEFAULT_CATEGORY = CATEGORY_CONFIG['고객 가치 지향'];

// ============================================================================
// Helpers
// ============================================================================

function parseTags(tags: string): string[] {
  if (!tags) return [];
  try {
    const parsed = JSON.parse(tags);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return tags.split(',').map((t) => t.trim()).filter(Boolean);
  }
}

// ============================================================================
// Sub Components
// ============================================================================

function CategoryTag({ category }: { category: string }) {
  const config = CATEGORY_CONFIG[category] || DEFAULT_CATEGORY;

  return (
    <div className={`flex items-center gap-1.5 h-6.5 px-1.5 rounded-lg ${config.bg}`}>
      <Image src={config.icon} alt="" width={11} height={11} />
      <span className="text-body-9-3 text-primary-600">{config.label}</span>
    </div>
  );
}

function HashtagBadge({ tag, highlighted }: { tag: string; highlighted: boolean }) {
  return (
    <div className={`h-6.5 px-2 rounded-lg ${highlighted ? 'bg-primary-50' : 'bg-gray-20'}`}>
      <span className="text-body-9-3 text-gray-300">{tag}</span>
    </div>
  );
}

// ============================================================================
// Main Component
// ============================================================================

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
  const tags = parseTags(experience.tags || '');
  const isDisabled = disabled && !isSelected;

  const cardStyles = [
    'w-full h-24 px-6 py-5 rounded-3.5 border text-left transition-all',
    isSelected
      ? 'bg-primary-10 border-gray-80 ring-1 ring-primary-300'
      : 'bg-white border-gray-80 hover:border-gray-100',
    isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
  ].join(' ');

  return (
    <button onClick={onToggle} disabled={isDisabled} className={cardStyles}>
      <div className="flex flex-col gap-4">
        <div className="flex items-start justify-between gap-2">
          <h4 className="text-body-4 text-primary-500 flex-1 truncate">
            {experience.title}
          </h4>
          <span className="text-body-8-1 text-primary-200 shrink-0">98점</span>
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          <CategoryTag category={experience.category} />
          {tags.slice(0, 2).map((tag) => (
            <HashtagBadge key={tag} tag={tag} highlighted={isSelected} />
          ))}
        </div>
      </div>
    </button>
  );
}
