"use client";

import { useState } from "react";
import { NewExperienceForm } from "./NewExperienceForm";
import { useUpdateExperience } from "@/app/_hooks/useUpdateExperience";
import { StepFormModal } from "@/components/common/StepFormModal";
import type { Experience, ExperienceCreate } from "@/types/api";

const STEP_TITLES = {
  1: {
    title: "경험 수정",
    description: "수정할 경험의 정보를 입력해주세요.",
  },
  2: {
    title: "STAR 기반 경험 정리",
    description: "답변의 완성도를 위해 최소 50자 이상 입력해 주세요.",
  },
} as const;

interface EditExperienceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  experience: Experience;
  onSuccess?: () => void;
}

export function EditExperienceModal({
  open,
  onOpenChange,
  experience,
  onSuccess,
}: EditExperienceModalProps) {
  const updateExperience = useUpdateExperience();
  const [step, setStep] = useState<1 | 2>(1);
  const { title, description } = STEP_TITLES[step];

  const handleClose = () => {
    onOpenChange(false);
    setStep(1);
  };

  const handleSubmit = (data: ExperienceCreate) => {
    updateExperience.mutate(
      {
        id: experience.id,
        data: {
          title: data.title,
          start_date: data.start_date,
          end_date: data.end_date,
          experience_type: data.experience_type,
          situation: data.situation,
          task: data.task,
          action: data.action,
          result: data.result,
          category: data.category,
        },
      },
      {
        onSuccess: () => {
          alert("경험이 수정되었습니다.");
          handleClose();
          onSuccess?.();
        },
        onError: () => {
          alert("수정 중 오류가 발생했습니다.");
        },
      }
    );
  };

  return (
    <StepFormModal
      open={open}
      onOpenChange={onOpenChange}
      onClose={handleClose}
      step={step}
      totalSteps={2}
      title={title}
      description={description}
      showCloseButton={false}
    >
      <NewExperienceForm
        onSubmit={handleSubmit}
        isPending={updateExperience.isPending}
        onStepChange={setStep}
        mode="edit"
        initialData={experience}
      />
    </StepFormModal>
  );
}
