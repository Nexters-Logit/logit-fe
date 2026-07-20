"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ExperienceCard } from "./ExperienceCard";
import { ExperienceDetailModal } from "./ExperienceDetailModal";
import { DeleteExperienceDialog } from "./DeleteExperienceDialog";
import { ExperienceModal } from "@/components/common/ExperienceModal";
import { useChatStore } from "../../_store/useChatStore";
import { useDeleteExperience } from "@/app/_hooks/useDeleteExperience";
import { showToast } from "@/libs/toast";
import { MAX_EXPERIENCE_SELECTION } from "../../_constants";
import type { Experience, MatchedExperience } from "@/types/api";

interface ExperienceCardsProps {
  matchedExperiences: MatchedExperience[];
}

export function ExperienceCards({ matchedExperiences }: ExperienceCardsProps) {
  const router = useRouter();
  const selectedIds = useChatStore((s) => s.selectedExperienceIds);
  const toggleExperience = useChatStore((s) => s.toggleExperience);
  const removeExperience = useChatStore((s) => s.removeExperience);
  const scrollTargetExperienceId = useChatStore((s) => s.scrollTargetExperienceId);
  const setScrollTargetExperienceId = useChatStore((s) => s.setScrollTargetExperienceId);

  const deleteExperience = useDeleteExperience();

  const [detailExperience, setDetailExperience] = useState<Experience | null>(
    null
  );
  const [editingExperience, setEditingExperience] = useState<Experience | null>(
    null
  );
  const [deletingExperience, setDeletingExperience] =
    useState<Experience | null>(null);

  // matchedExperiences에 존재하는 유효한 선택만 계산
  const matchedIds = new Set(matchedExperiences.map((me) => me.experience.id));
  const validSelectedCount = selectedIds.filter((id) => matchedIds.has(id)).length;
  const canSelectMore = validSelectedCount < MAX_EXPERIENCE_SELECTION;

  // 새 경험 생성 후 스크롤
  useEffect(() => {
    if (!scrollTargetExperienceId) return;

    const el = document.querySelector(
      `[data-experience-id="${scrollTargetExperienceId}"]`
    );
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      setScrollTargetExperienceId(null);
    }
  }, [scrollTargetExperienceId, matchedExperiences, setScrollTargetExperienceId]);

  const handleShowDetail = (experience: Experience) => {
    setDetailExperience(experience);
  };

  const handleEdit = (experience: Experience) => {
    setDetailExperience(null);
    setEditingExperience(experience);
  };

  const handleEditSuccess = () => {
    setEditingExperience(null);
    router.refresh();
  };

  const handleDeleteRequest = (experience: Experience) => {
    setDeletingExperience(experience);
  };

  const handleDeleteConfirm = () => {
    if (deletingExperience) {
      deleteExperience.mutate(deletingExperience.id, {
        onSuccess: () => {
          removeExperience(deletingExperience.id);
          setDeletingExperience(null);
          router.refresh();
          showToast.success("경험이 삭제되었습니다.");
        },
        onError: () => {
          showToast.error("삭제 중 오류가 발생했습니다.");
        },
      });
    }
  };

  if (matchedExperiences.length === 0) {
    return null;
  }

  return (
    <>
      <div className="flex flex-col gap-3 py-2">
        {matchedExperiences.map(({ experience, similarity_score }) => (
          <div key={experience.id} data-experience-id={experience.id}>
            <ExperienceCard
              experience={experience}
              similarityScore={similarity_score}
              isSelected={selectedIds.includes(experience.id)}
              onToggle={() => toggleExperience(experience.id)}
              onShowDetail={handleShowDetail}
              onEdit={handleEdit}
              onDelete={handleDeleteRequest}
              disabled={!canSelectMore}
            />
          </div>
        ))}
      </div>

      {detailExperience && (
        <ExperienceDetailModal
          open={!!detailExperience}
          onOpenChange={(open) => !open && setDetailExperience(null)}
          experience={detailExperience}
          onEdit={() => handleEdit(detailExperience)}
        />
      )}

      {editingExperience && (
        <ExperienceModal
          mode="edit"
          open={!!editingExperience}
          onOpenChange={(open) => !open && setEditingExperience(null)}
          experience={editingExperience}
          onSuccess={handleEditSuccess}
        />
      )}

      {deletingExperience && (
        <DeleteExperienceDialog
          open={!!deletingExperience}
          onOpenChange={(open) => !open && setDeletingExperience(null)}
          experienceTitle={deletingExperience.title}
          onConfirm={handleDeleteConfirm}
          isPending={deleteExperience.isPending}
        />
      )}
    </>
  );
}
