"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { NewExperienceForm } from "./NewExperienceForm";
import { useUpdateExperience } from "@/app/_hooks/useUpdateExperience";
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="flex max-h-[90vh] flex-col overflow-hidden rounded-2xl border-0 p-0 shadow-chat sm:max-w-2xl"
        showCloseButton={false}
        onPointerDownOutside={(e) => {
          e.preventDefault();
          handleClose();
        }}
        onEscapeKeyDown={handleClose}
      >
        <div className="shrink-0 px-8 pt-6 pb-7 gap-1.5">
          <DialogHeader>
            <p className="text-body-7-2 text-primary-400 font-semibold">
              {step}/2
            </p>
            <DialogTitle className="text-title-2-2 text-gray-400">
              {title}
            </DialogTitle>
            <DialogDescription className="text-body-7-2 text-primary-400">
              {description}
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="flex-1 overflow-y-auto px-8 pb-6">
          <NewExperienceForm
            onSubmit={handleSubmit}
            onCancel={handleClose}
            isPending={updateExperience.isPending}
            onStepChange={setStep}
            mode="edit"
            initialData={experience}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
