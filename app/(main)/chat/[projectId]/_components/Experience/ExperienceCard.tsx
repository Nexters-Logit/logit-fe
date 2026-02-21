"use client";

import type { Experience } from "@/types/api";
import { parseTags } from "../../_utils";
import { CategoryTag } from "./CategoryTag";
import { HashtagBadge } from "./HashtagBadge";
import { ExperienceOptionsMenu } from "./ExperienceOptionsMenu";

interface ExperienceCardProps {
  experience: Experience;
  similarityScore: number;
  isSelected: boolean;
  onToggle: () => void;
  onShowDetail: (experience: Experience) => void;
  onEdit: (experience: Experience) => void;
  onDelete: (experience: Experience) => void;
  disabled?: boolean;
}

export function ExperienceCard({
  experience,
  similarityScore,
  isSelected,
  onToggle,
  onShowDetail,
  onEdit,
  onDelete,
  disabled,
}: ExperienceCardProps) {
  const tags = parseTags(experience.tags || "");
  const scorePercent = Math.round(similarityScore * 100);
  const isDisabled = disabled && !isSelected;

  const cardStyles = [
    "relative w-full px-4.5 py-3.5 rounded-3.5 text-left transition-all",
    isSelected
      ? "bg-primary-10 border-2 border-primary-100"
      : "bg-white border-2 border-gray-70",
    isDisabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer",
  ].join(" ");

  const handleCardClick = () => {
    if (!isDisabled) {
      onToggle();
    }
  };

  return (
    <div className={cardStyles} onClick={handleCardClick}>
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-body-8-1 text-primary-200">
            공고 매칭 점수: {scorePercent}점
          </span>
          <div className="shrink-0" onClick={(e) => e.stopPropagation()}>
            <ExperienceOptionsMenu
              onShowDetail={() => onShowDetail(experience)}
              onEdit={() => onEdit(experience)}
              onDelete={() => onDelete(experience)}
            />
          </div>
        </div>
        <h4 className="text-body-4 text-primary-500 truncate">
          {experience.title}
        </h4>
        <div className="flex items-center gap-1.5 flex-wrap">
          <CategoryTag category={experience.category} />
          {tags.slice(0, 2).map((tag) => (
            <HashtagBadge key={tag} tag={tag} highlighted={isSelected} />
          ))}
        </div>
      </div>
    </div>
  );
}
