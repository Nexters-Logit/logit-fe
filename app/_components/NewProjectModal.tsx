"use client";

import { useState } from "react";
import { NewProjectForm } from "./NewProjectForm";
import { useCreateProject } from "@/app/_hooks/useCreateProject";
import { StepFormModal } from "@/components/common/StepFormModal";
import { showToast } from "@/libs/toast";
import type { ProjectCreate } from "@/types/api";

const STEP_TITLES = {
  1: {
    title: "자기소개서 작성",
    description: "지원하는 기업의 정보를 알려주세요.",
  },
  2: {
    title: "자기소개서 문항 입력",
    description: "작성하는 자기소개서 문항을 입력해주세요",
  },
} as const;

interface NewProjectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NewProjectModal({ open, onOpenChange }: NewProjectModalProps) {
  const createProject = useCreateProject();
  const [step, setStep] = useState<1 | 2>(1);
  const { title, description } = STEP_TITLES[step];

  const handleClose = () => {
    onOpenChange(false);
    setStep(1);
  };

  const handleSubmit = (data: ProjectCreate) => {
    createProject.mutate(data, {
      onSuccess: () => {
        showToast.success("프로젝트가 생성되었습니다.");
        handleClose();
      },
      onError: () => {
        showToast.error("생성 중 오류가 발생했습니다.");
      },
    });
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
    >
      <NewProjectForm
        onSubmit={handleSubmit}
        isPending={createProject.isPending}
        onStepChange={setStep}
      />
    </StepFormModal>
  );
}
