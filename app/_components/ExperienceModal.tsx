"use client";

import { useState, useRef } from "react";
import {
  NewExperienceForm,
  type NewExperienceFormRef,
} from "./NewExperienceForm";
import { useCreateExperience } from "@/app/_hooks/useCreateExperience";
import { useUpdateExperience } from "@/app/_hooks/useUpdateExperience";
import { StepFormModal } from "@/components/common/StepFormModal";
import { showToast } from "@/libs/toast";
import type { Experience, ExperienceCreate } from "@/types/api";

const EXAMPLE_EXPERIENCE: ExperienceCreate = {
  title: "주식회사 로짓 컴퍼니",
  start_date: "2025-01-01",
  end_date: "2026-01-01",
  experience_type: "인턴",
  category: "기술적 전문성",
  format_type: "STAR",
  situation:
    "반려동물 용품 커머스 스타트업에서 인턴으로 근무하며 신제품(자동 급식기) SNS 광고 캠페인을 집행함. 초기 광고비 200만 원을 투입했으나 클릭률(CTR)은 0.8%에 불과했고, 실제 구매로 이어지는 전환율(CVR)이 매우 낮아 예산 낭비가 우려되는 상황이었음.",
  task: "2주 안에 광고 클릭률을 1.5% 이상으로 끌어올리고, 가입 및 구매 전환율을 전주 대비 20% 개선하는 것을 목표로 잡음.",
  action:
    "데이터 분석: 기존 광고 도달 지표를 분석하여 '20대 1인 가구'보다 '3040 맞벌이 가구'에서 체류 시간이 2배 길다는 것을 포착함. 가설 설정 및 실행: 타겟을 '직장 생활로 집을 비우는 시간이 긴 3040 직장인'으로 좁히고, '분리불안 해소'와 '규칙적인 식사'를 강조한 영상 콘텐츠 3종을 A/B 테스트함. 매체 최적화: 클릭 효율이 낮은 채널의 예산을 삭감하고, 전환 단가(CPA)가 낮게 측정된 채널에 예산을 집중 재배치함.",
  result:
    "광고 클릭률 1.9% 달성(목표 대비 0.4%p 상향), 구매 전환율 전주 대비 35% 상승. 광고 수익률(ROAS) 450%를 기록하며 캠페인을 성공적으로 마무리함. 단순히 노출을 늘리는 것보다 철저한 타겟 페르소나 분석과 데이터 기반의 가설 검증이 마케팅 성패를 가른다는 점을 배웠습니다. 고객의 페인 포인트(분리불안)를 정확히 짚어낸 콘텐츠가 비즈니스 성과로 직결됨을 체감했습니다.",
};

const STEP_TITLES = {
  create: {
    1: {
      title: "경험 등록",
      description: "등록하는 경험의 정보를 알려주세요.",
    },
    2: {
      title: "경험 정리",
      description: "답변의 완성도를 위해 최소 50자 이상 입력해 주세요.",
    },
  },
  edit: {
    1: {
      title: "경험 수정",
      description: "수정할 경험의 정보를 입력해주세요.",
    },
    2: {
      title: "경험 정리",
      description: "답변의 완성도를 위해 최소 50자 이상 입력해 주세요.",
    },
  },
} as const;

type ExperienceModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
} & (
  | {
      mode?: "create";
      onSuccess?: (createdId?: string) => void;
      experience?: never;
    }
  | { mode: "edit"; onSuccess?: () => void; experience: Experience }
);

export function ExperienceModal({
  open,
  onOpenChange,
  mode = "create",
  onSuccess,
  experience,
}: ExperienceModalProps) {
  const createExperience = useCreateExperience();
  const updateExperience = useUpdateExperience();
  const formRef = useRef<NewExperienceFormRef>(null);
  const [step, setStep] = useState<1 | 2>(1);
  const { title, description } = STEP_TITLES[mode][step];

  const handleClose = () => {
    onOpenChange(false);
    setStep(1);
  };

  const handleSubmit = (data: ExperienceCreate) => {
    if (mode === "edit" && experience) {
      updateExperience.mutate(
        { id: experience.id, data },
        {
          onSuccess: () => {
            showToast.success("경험이 수정되었습니다.");
            handleClose();
            (onSuccess as (() => void) | undefined)?.();
          },
          onError: () => {
            showToast.error("수정 중 오류가 발생했습니다.");
          },
        },
      );
    } else {
      createExperience.mutate(data, {
        onSuccess: (response) => {
          showToast.success("경험이 등록되었습니다.");
          handleClose();
          (onSuccess as ((createdId?: string) => void) | undefined)?.(
            response?.id,
          );
        },
        onError: () => {
          showToast.error("등록 중 오류가 발생했습니다.");
        },
      });
    }
  };

  const isPending =
    mode === "edit" ? updateExperience.isPending : createExperience.isPending;

  return (
    <StepFormModal
      open={open}
      onOpenChange={onOpenChange}
      onClose={handleClose}
      step={step}
      totalSteps={2}
      title={title}
      description={description}
      contentClassName="h-165"
      headerExtra={
        mode === "create" ? (
          <button
            type="button"
            onClick={() => formRef.current?.fillWithExample(EXAMPLE_EXPERIENCE, step)}
            className="rounded-lg px-3.5 py-0.5 text-body-7-3 text-primary-400 border border-gray-70 bg-gray-20 cursor-pointer hover:bg-gray-70 transition-colors"
          >
            예시 불러오기
          </button>
        ) : undefined
      }
    >
      <NewExperienceForm
        ref={mode === "create" ? formRef : undefined}
        onSubmit={handleSubmit}
        isPending={isPending}
        onStepChange={setStep}
        mode={mode}
        initialData={mode === "edit" ? experience : undefined}
      />
    </StepFormModal>
  );
}
