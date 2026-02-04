"use client";

import type { Experience } from "@/types/api";
import { parseTags } from "../../_utils";
import { CategoryTag } from "./CategoryTag";
import { HashtagBadge } from "./HashtagBadge";
import { ExperienceOptionsMenu } from "./ExperienceOptionsMenu";

function CheckIcon({ selected }: { selected: boolean }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" fill={selected ? "#0066FF" : "#E1E4ED"} />
      <path d="M8 12L11 15L16 9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

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
    "relative w-full px-6 py-5 rounded-3.5 text-left transition-all border-2",
    isSelected
      ? "bg-primary-10 border-primary-100"
      : "bg-white border-transparent hover:border-gray-80",
    isDisabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer",
  ].join(" ");

  const handleCardClick = () => {
    if (!isDisabled) {
      onShowDetail(experience);
    }
  };

  const handleToggleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isDisabled) {
      onToggle();
    }
  };

  return (
    <div className={cardStyles} onClick={handleCardClick}>
      <div className="flex flex-col gap-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <span className="text-body-8-1 text-primary-200 shrink-0">
              {scorePercent}점
            </span>
            <h4 className="text-body-4 text-primary-500 truncate">
              {experience.title}
            </h4>
          </div>
          <div className="shrink-0" onClick={(e) => e.stopPropagation()}>
            <ExperienceOptionsMenu
              onEdit={() => onEdit(experience)}
              onDelete={() => onDelete(experience)}
            />
          </div>
        </div>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 flex-wrap flex-1">
            <CategoryTag category={experience.category} />
            {tags.slice(0, 2).map((tag) => (
              <HashtagBadge key={tag} tag={tag} highlighted={isSelected} />
            ))}
          </div>
          <button
            type="button"
            onClick={handleToggleClick}
            disabled={isDisabled}
            className="shrink-0 p-0.5 cursor-pointer disabled:cursor-not-allowed"
            aria-label={isSelected ? "선택됨" : "선택하기"}
          >
            <CheckIcon selected={isSelected} />
          </button>
        </div>
      </div>
    </div>
  );
}
