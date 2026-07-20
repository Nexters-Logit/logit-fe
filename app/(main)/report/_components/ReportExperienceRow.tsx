"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Experience } from "@/types/api";
import Image from "next/image";
import { getExperience } from "@/app/_actions/experiences";
import { showToast } from "@/libs/toast";
import { useDeleteExperience } from "@/app/_hooks/useDeleteExperience";
import { ExperienceOptionsMenu } from "./ExperienceOptionsMenu";
import { ExperienceModal } from "@/components/common/ExperienceModal";
import { DeleteExperienceDialog } from "./DeleteExperienceDialog";
import { ExperienceDetailModal } from "@/app/(main)/chat/[projectId]/_components/Experience/ExperienceDetailModal";

const CATEGORY_ICON_MAP: Record<string, string> = {
  "기술적 전문성": "/icons/category/icon-1.svg",
  "고객 가치 지향": "/icons/category/icon-2.svg",
  "협력적 소통": "/icons/category/icon-3.svg",
  "주도적 실행력": "/icons/category/icon-4.svg",
  "논리적 분석력": "/icons/category/icon-5.svg",
  "창의적 문제해결": "/icons/category/icon-6.svg",
  "유연한 적응력": "/icons/category/icon-7.svg",
  "끈기 있는 책임감": "/icons/category/icon-8.svg",
};

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
  const deleteExperience = useDeleteExperience();
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [experienceToEdit, setExperienceToEdit] = useState<Experience | null>(
    null,
  );
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);

  const tags =
    experience.tags
      ?.split(",")
      .map((tag) => tag.trim())
      .filter(Boolean) ?? [];

  const handleEdit = async () => {
    try {
      const data = await getExperience(experience.id);
      setExperienceToEdit(data);
      setDetailOpen(false);
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

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    deleteExperience.mutate(experience.id, {
      onSuccess: () => {
        setDeleteDialogOpen(false);
        router.refresh();
        showToast.success("경험이 삭제되었습니다.");
      },
      onError: () => {
        showToast.error("삭제 중 오류가 발생했습니다.");
      },
    });
  };

  return (
    <>
      <div
        role="row"
        onClick={() => {
          onClick?.();
          setDetailOpen(true);
        }}
        className="flex items-center justify-between py-3.5 border-b border-gray-70 w-full cursor-pointer hover:bg-gray-20 transition-colors"
      >
        <div className="flex items-center gap-16 flex-1 min-w-[866px]">
          {/* 파란색 바 */}
          <div className="flex items-center gap-5">
            <span
              className="w-0.5 h-6 rounded-xl shrink-0"
              style={{ backgroundColor: "#40A5FF" }}
            />
            <span className="text-body-5-5 text-primary-600 truncate shrink min-w-0 w-[260px]">
              {experience.title || "제목 없음"}
            </span>
          </div>
          <div className="flex gap-2 w-[310px]">
            {(() => {
              // 첫 번째는 category, 두 번째/세 번째는 tags를 순서대로 사용
              const displayTags = [experience.category, ...tags].slice(0, 3);

              return displayTags.map((label, index) => {
                const iconSrc = CATEGORY_ICON_MAP[label];

                return (
                  <div
                    key={`${label}-${index}`}
                    className={`flex items-center gap-1.5 px-1.5 py-1 rounded-full text-body-9-3 ${
                      index === 0
                        ? "bg-icon-bg-3 text-primary-600"
                        : "bg-gray-20 text-primary-400"
                    }`}
                  >
                    {index === 0 && iconSrc && (
                      <Image
                        src={iconSrc}
                        alt={label}
                        width={16}
                        height={16}
                      />
                    )}
                    {label}
                  </div>
                );
              });
            })()}
          </div>
          <div className="regular_16 text-gray-300">
            {experience.experience_type}
          </div>
        </div>

        <div className="flex items-center justify-between flex-1">
          <div className="shrink-0 flex flex-col gap-1">
            <span className="regular_16 text-gray-300">
              {formatDateRange(experience.start_date, experience.end_date)}
            </span>
          </div>
          {/* 우측: 경험 타입 / 기간 */}
          <div className="flex items-center justify-end gap-3">
            <ExperienceOptionsMenu
              onEdit={handleEdit}
              onDelete={handleDeleteClick}
            />
          </div>
        </div>
      </div>

      <ExperienceDetailModal
        open={detailOpen}
        onOpenChange={setDetailOpen}
        experience={experience}
        onEdit={handleEdit}
      />

      {experienceToEdit !== null ? (
        <ExperienceModal
          open={editModalOpen}
          onOpenChange={handleEditModalClose}
          mode="edit"
          experience={experienceToEdit}
          onSuccess={handleEditSuccess}
        />
      ) : null}

      <DeleteExperienceDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        experienceTitle={experience.title || "제목 없음"}
        onConfirm={handleDeleteConfirm}
        isPending={deleteExperience.isPending}
      />
    </>
  );
}
