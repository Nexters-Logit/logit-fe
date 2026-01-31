"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { NewProjectForm } from "./NewProjectForm";
import { useCreateProject } from "@/app/_hooks/useCreateProject";
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
        alert("프로젝트가 생성되었습니다.");
        handleClose();
      },
      onError: () => {
        alert("생성 중 오류가 발생했습니다.");
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="flex max-h-[90vh] flex-col overflow-hidden rounded-2xl border-0 p-0 shadow-chat sm:max-w-2xl"
        onPointerDownOutside={(e) => {
          e.preventDefault();
          handleClose();
        }}
        onEscapeKeyDown={handleClose}
      >
        {/* 헤더 */}
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

        {/* 컨텐츠 */}
        <div className="flex-1 overflow-y-auto px-8 pb-6">
          <NewProjectForm
            onSubmit={handleSubmit}
            onCancel={handleClose}
            isPending={createProject.isPending}
            onStepChange={setStep}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
