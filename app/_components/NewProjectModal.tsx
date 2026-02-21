"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { NewProjectForm, type NewProjectFormRef } from "./NewProjectForm";
import { useCreateProject } from "@/app/_hooks/useCreateProject";
import { getQuestions } from "@/app/_actions/projects";
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
  const router = useRouter();
  const createProject = useCreateProject();
  const [step, setStep] = useState<1 | 2>(1);
  const formRef = useRef<NewProjectFormRef>(null);
  const { title, description } = STEP_TITLES[step];

  const handleClose = () => {
    onOpenChange(false);
    setStep(1);
  };

  const handleSubmit = (data: ProjectCreate) => {
    createProject.mutate(data, {
      onSuccess: async (result) => {
        showToast.success("프로젝트가 생성되었습니다.");
        handleClose();

        const questions = await getQuestions(result.id);
        if (questions.length > 0) {
          router.push(`/chat/${result.id}/${questions[0].id}`);
        } else {
          throw new Error("생성된 문항을 찾을 수 없습니다.");
        }
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
      headerExtra={
        <button
          type="button"
          onClick={() => formRef.current?.fillWithExamples(step)}
          className="rounded-lg px-3.5 py-0.5 text-body-7-3 text-primary-400 border border-gray-70 bg-gray-20 cursor-pointer hover:bg-gray-70 transition-colors"
        >
          예시 불러오기
        </button>
      }
    >
      <NewProjectForm
        ref={formRef}
        onSubmit={handleSubmit}
        isPending={createProject.isPending}
        onStepChange={setStep}
      />
    </StepFormModal>
  );
}
