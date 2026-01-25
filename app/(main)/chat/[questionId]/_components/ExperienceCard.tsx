'use client';

import Image from 'next/image';
import type { Experience } from '@/types/api';
import { getCategoryConfig } from '../_constants';
import { parseTags } from '../_utils';

// ============================================================================
// Sub Components
// ============================================================================

function CategoryTag({ category }: { category: string }) {
  const config = getCategoryConfig(category);

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
