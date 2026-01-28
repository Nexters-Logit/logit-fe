"use client";

import { ExperienceCard } from "./ExperienceCard";
import { useChatStore } from "../../_store/useChatStore";
import { MAX_EXPERIENCE_SELECTION } from "../../_constants";
import type { MatchedExperience } from "@/types/api";

interface ExperienceCardsProps {
  matchedExperiences: MatchedExperience[];
}

export function ExperienceCards({ matchedExperiences }: ExperienceCardsProps) {
  const selectedIds = useChatStore((s) => s.selectedExperienceIds);
  const toggleExperience = useChatStore((s) => s.toggleExperience);

  const canSelectMore = selectedIds.length < MAX_EXPERIENCE_SELECTION;

  if (matchedExperiences.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-3 py-2">
      {matchedExperiences.map(({ experience, similarity_score }) => (
        <ExperienceCard
          key={experience.id}
          experience={experience}
          similarityScore={similarity_score}
          isSelected={selectedIds.includes(experience.id)}
          onToggle={() => toggleExperience(experience.id)}
          disabled={!canSelectMore}
        />
      ))}
    </div>
  );
}
