"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Experience } from "@/types/api";
import Image from "next/image";
import { getExperience } from "@/app/_actions/experiences";
import { showToast } from "@/libs/toast";
import { ExperienceOptionsMenu } from "./ExperienceOptionsMenu";
import { ExperienceModal } from "../ExperienceModal";

interface ReportExperienceRowProps {
  experience: Experience;
  onClick?: () => void;
}

function formatDateRange(start: string | null, end: string | null): string {
  if (!start) return "-";
  const s = start.replace(/-/g, ".");
  if (!end) return s;
  return `${s} ~ ${end.replace(/-/g, ".")}`;
}

export function ReportExperienceRow({
  experience,
  onClick,
}: ReportExperienceRowProps) {
  const router = useRouter();
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [experienceToEdit, setExperienceToEdit] = useState<Experience | null>(
    null,
  );

  const tags =
    experience.tags
      ?.split(",")
      .map((tag) => tag.trim())
      .filter(Boolean) ?? [];

  const handleEdit = async () => {
    try {
      const data = await getExperience(experience.id);
      setExperienceToEdit(data);
      setEditModalOpen(true);
    } catch {
      showToast.error("경험 정보를 불러오는데 실패했습니다.");
    }
  };

  const handleEditModalClose = (open: boolean) => {
    setEditModalOpen(open);
    if (!open) setExperienceToEdit(null);
  };

  const handleEditSuccess = () => {
    handleEditModalClose(false);
    router.refresh();
  };

  return (
    <>
      <div
        role="row"
        onClick={onClick}
        className="flex items-center justify-between py-3.5 border-b border-gray-70 w-full cursor-pointer hover:bg-gray-20 transition-colors"
      >
      <div className="flex items-center gap-6 min-w-0 flex-1">
        {/* 제목 */}
        <span className="text-body-5-5 text-primary-600 truncate shrink min-w-0 w-64">
          {experience.title || "제목 없음"}
        </span>

        <div className="flex gap-2 w-80">
          {tags.length > 0 ? (
            tags.map((tag, index) => (
              <div
                key={tag}
                className={`flex items-center gap-1.5 px-1.5 py-1 rounded-full text-body-9-3 text-primary-600 ${
                  index === 0
                    ? "bg-icon-bg-3 text-primary-600"
                    : "bg-gray-20 text-primary-400"
                }`}
              >
                {index === 0 && (
                  <Image
                    src="/icons/icon-main-check.svg"
                    alt={tag}
                    width={12}
                    height={12}
                  />
                )}
                {tag}
              </div>
            ))
          ) : (
            <span className="text-body-9-3 text-gray-200">태그 없음</span>
          )}
        </div>
        <div className="regular_16 text-gray-300">
          {experience.experience_type}
        </div>
      </div>

      {/* 우측: 경험 타입 / 기간 */}
      <div className="shrink-0 text-right flex flex-col items-end gap-1 min-w-40">
        <span className="regular_14 text-gray-300">
          {formatDateRange(experience.start_date, experience.end_date)}
        </span>
      </div>

      <ExperienceOptionsMenu onEdit={handleEdit} />
    </div>

      {experienceToEdit !== null ? (
        <ExperienceModal
          open={editModalOpen}
          onOpenChange={handleEditModalClose}
          mode="edit"
          experience={experienceToEdit}
          onSuccess={handleEditSuccess}
        />
      ) : null}
    </>
  );
}
