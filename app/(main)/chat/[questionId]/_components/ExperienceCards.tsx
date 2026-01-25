'use client';

import { ExperienceCard } from './ExperienceCard';
import { useChatStore } from '../_store/useChatStore';
import { MAX_EXPERIENCE_SELECTION } from '../_constants';
import type { Experience } from '@/types/api';

interface ExperienceCardsProps {
  experiences: Experience[];
}

export function ExperienceCards({ experiences }: ExperienceCardsProps) {
  const selectedIds = useChatStore((s) => s.selectedExperienceIds);
  const toggleExperience = useChatStore((s) => s.toggleExperience);

  const canSelectMore = selectedIds.length < MAX_EXPERIENCE_SELECTION;

  if (experiences.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-3">
      {experiences.map((exp) => (
        <ExperienceCard
          key={exp.id}
          experience={exp}
          isSelected={selectedIds.includes(exp.id)}
          onToggle={() => toggleExperience(exp.id)}
          disabled={!canSelectMore}
        />
      ))}
    </div>
  );
}
