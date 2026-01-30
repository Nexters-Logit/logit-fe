"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { NewExperienceForm } from "./_components/NewExperienceForm";
import { useCreateExperience } from "@/app/_hooks/useCreateExperience";
import type { ExperienceCreate } from "@/types/api";

const STEP_TITLES = {
  1: {
    title: "새 경험 등록",
    description: "등록하는 경험의 정보를 알려주세요.",
  },
  2: {
    title: "경험 상세 작성",
    description: "STAR 방식으로 경험을 구체적으로 작성해주세요.",
  },
} as const;

export default function NewExperiencePage() {
  const router = useRouter();
  const createExperience = useCreateExperience();
  const [step, setStep] = useState<1 | 2>(1);
  const { title, description } = STEP_TITLES[step];

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      router.back();
    }
  };

  const handleSubmit = (data: ExperienceCreate) => {
    createExperience.mutate(data, {
      onSuccess: () => {
        alert("경험이 등록되었습니다.");
        router.back();
        router.refresh();
      },
      onError: () => {
        alert("등록 중 오류가 발생했습니다.");
      },
    });
  };

  return (
    <Dialog open onOpenChange={handleOpenChange}>
      <DialogContent
        className="flex max-h-[90vh] flex-col overflow-hidden rounded-2xl border-0 p-0 shadow-chat sm:max-w-2xl"
        onPointerDownOutside={(e) => {
          e.preventDefault();
          router.back();
        }}
        onEscapeKeyDown={() => router.back()}
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
            <div className="flex justify-between items-center">
              <DialogDescription className="text-body-7-2 text-primary-400">
                {description}
              </DialogDescription>
              <button className="rounded-lg px-3.5 py-0.5 text-body-7-3 text-primary-400 border border-gray-70 bg-gray-20 cursor-pointer">
                예시 불러오기
              </button>
            </div>
          </DialogHeader>
        </div>

        {/* 컨텐츠 */}
        <div className="flex-1 overflow-y-auto px-8 pb-6">
          <NewExperienceForm
            onSubmit={handleSubmit}
            onCancel={() => router.back()}
            isPending={createExperience.isPending}
            onStepChange={setStep}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
