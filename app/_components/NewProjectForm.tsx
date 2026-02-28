"use client";

import { useState, useImperativeHandle, type Ref } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Image from "next/image";
import type { ProjectCreate, QuestionCreate } from "@/types/api";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { DateInput } from "@/components/common/DateInput";
import { QuestionFieldItem } from "./QuestionFieldItem";

const projectFormSchema = z.object({
  company: z.string().min(1, "회사명을 입력해주세요"),
  job_position: z.string().min(1, "직무를 입력해주세요"),
  recruit_notice: z.string().min(1, "채용 공고를 입력해주세요"),
  company_talent: z.string().optional(),
  due_date: z.string().optional(),
  questions: z
    .array(
      z.object({
        question: z.string(),
        max_length: z.union([z.number(), z.nan()]).optional().nullable(),
      }),
    )
    .refine((questions) => questions.some((q) => q.question.trim()), {
      message: "최소 1개의 문항을 입력해주세요",
    })
    .refine(
      (questions) =>
        questions.every(
          (q) => !q.question.trim() || (q.max_length != null && !Number.isNaN(q.max_length)),
        ),
      { message: "글자수를 입력해주세요" },
    ),
});

type ProjectFormValues = z.infer<typeof projectFormSchema>;

export interface NewProjectFormRef {
  fillWithExamples: (step: 1 | 2) => void;
}

interface NewProjectFormProps {
  ref?: Ref<NewProjectFormRef>;
  onSubmit: (data: ProjectCreate) => void;
  isPending?: boolean;
  onStepChange?: (step: 1 | 2) => void;
}

export function NewProjectForm({ ref, onSubmit, isPending = false, onStepChange }: NewProjectFormProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [isOngoing, setIsOngoing] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const goToStep = (newStep: 1 | 2) => {
    setStep(newStep);
    onStepChange?.(newStep);
  };

  const {
    register,
    handleSubmit,
    control,
    trigger,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      company: "",
      job_position: "",
      recruit_notice: "",
      company_talent: "",
      due_date: "",
      questions: [{ question: "", max_length: null }],
    },
  });

  const watchedCompany = watch("company");
  const watchedJobPosition = watch("job_position");
  const watchedRecruitNotice = watch("recruit_notice");
  const watchedQuestions = watch("questions");

  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: "questions",
  });

  useImperativeHandle(ref, () => ({
    fillWithExamples(currentStep: 1 | 2) {
      if (currentStep === 1) {
        setValue("company", "주식회사 로짓 컴퍼니");
        setValue("job_position", "프론트엔드 개발자");
        setValue("recruit_notice", "[주요업무]\n- 웹 프론트엔드 개발 및 유지보수\n- UI/UX 개선 및 성능 최적화\n- RESTful API 연동 및 상태 관리\n\n[자격요건]\n- React, TypeScript 경험 2년 이상\n- HTML/CSS에 대한 깊은 이해\n\n[우대사항]\n- Next.js 경험\n- 디자인 시스템 구축 경험");
        setValue("company_talent", "도전정신, 협업 능력, 사용자 중심 사고");
        setValue("due_date", "2026.03.31");
        setIsOngoing(false);
      } else {
        replace([
          { question: "지원 동기와 입사 후 회사에서 이루고 싶은 꿈을 기술하십시오.", max_length: 500 },
          { question: "본인의 성장과정을 간략히 기술하되 현재의 자신에게 가장 큰 영향을 끼친 사건, 인물 등을 포함하여 기술하시오.", max_length: 700 },
          { question: "직무와 관련하여 본인이 갖고 있는 전문성을 구체적 경험을 바탕으로 작성하시오.", max_length: 500 },
        ]);
      }
    },
  }));

  const handleFormSubmit = (data: ProjectFormValues) => {
    const questions: QuestionCreate[] = data.questions
      .filter((q) => q.question.trim())
      .map((q) => ({
        question: q.question,
        max_length:
          q.max_length && !Number.isNaN(q.max_length) ? q.max_length : null,
      }));

    onSubmit({
      company: data.company,
      job_position: data.job_position,
      recruit_notice: data.recruit_notice,
      company_talent: data.company_talent?.trim()
        ? data.company_talent
        : undefined,
      due_date: isOngoing
        ? null
        : data.due_date
          ? data.due_date.replace(/\./g, "-")
          : null,
      questions,
    });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-1 flex-col min-h-0">
      <div className="flex-1 overflow-y-auto px-7.5 pb-6">
      {/* 1페이지: 기본정보 */}
      {step === 1 && (
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label htmlFor="company" className="text-body-7-2 text-gray-400">
                기업명<span className="text-alert">*</span>
              </label>
              <span className="text-body-8-2 text-gray-200">
                <span className="text-gray-400">{watch("company")?.length ?? 0}</span> / 100자
              </span>
            </div>
            <Input
              id="company"
              placeholder="예 ) 주식회사 로짓 컴퍼니"
              className="h-11 text-body-5-4"
              maxLength={100}
              aria-invalid={!!errors.company}
              {...register("company")}
            />
            {errors.company && (
              <p className="text-body-9-3 text-alert">
                {errors.company.message}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label
                htmlFor="job_position"
                className="text-body-7-2 text-gray-400"
              >
                직무명<span className="text-alert">*</span>
              </label>
              <span className="text-body-8-2 text-gray-200">
                <span className="text-gray-400">{watch("job_position")?.length ?? 0}</span> / 100자
              </span>
            </div>
            <Input
              id="job_position"
              placeholder="예 ) 프로덕트 디자이너"
              className="h-11 text-body-5-4"
              maxLength={100}
              aria-invalid={!!errors.job_position}
              {...register("job_position")}
            />
            {errors.job_position && (
              <p className="text-body-9-3 text-alert">
                {errors.job_position.message}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label
                htmlFor="recruit_notice"
                className="text-body-7-2 text-gray-400"
              >
                채용 공고<span className="text-alert">*</span>
              </label>
              <span className="text-body-8-2 text-gray-200">
                <span className="text-gray-400">{watch("recruit_notice")?.length ?? 0}</span> / 3000자
              </span>
            </div>
            <Textarea
              id="recruit_notice"
              placeholder="해당 직무의 주요 업무, 자격 요건, 우대 사항 등을 모두 복사해서 붙여 넣어주세요."
              rows={4}
              maxLength={3000}
              className="text-body-5-4"
              aria-invalid={!!errors.recruit_notice}
              {...register("recruit_notice")}
            />
            {errors.recruit_notice && (
              <p className="text-body-9-3 text-alert">
                {errors.recruit_notice.message}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="text-body-7-2 text-gray-400">
                마감 날짜<span className="text-alert">*</span>
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsOngoing((prev) => {
                      if (!prev) setValue("due_date", "");
                      return !prev;
                    });
                  }}
                  className={`flex items-center justify-center size-7 rounded-[7px] border transition-colors ${
                    isOngoing
                      ? "bg-primary-100 border-primary-100"
                      : "bg-white border-gray-100"
                  }`}
                >
                  {isOngoing && (
                    <svg width="14" height="10" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1.5 5L5.5 9L12.5 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </button>
                <span className="text-body-7-3 text-gray-500">상시</span>
              </div>
            </div>
            <Controller
              name="due_date"
              control={control}
              render={({ field }) => (
                <DateInput
                  className="h-10 text-body-5-4"
                  disabled={isOngoing}
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  name={field.name}
                />
              )}
            />
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label
                htmlFor="company_talent"
                className="text-body-7-2 text-gray-400"
              >
                기업의 인재상을 입력해주세요
              </label>
              <span className="text-body-8-2 text-gray-200">
                <span className="text-gray-400">{watch("company_talent")?.length ?? 0}</span> / 1000자
              </span>
            </div>
            <Input
              id="ideal_candidate_profile"
              placeholder="공식 홈페이지의 '인재상'이나 '핵심 가치' 를 입력해주세요."
              className="h-11 text-body-5-4"
              maxLength={1000}
              {...register("company_talent")}
            />
          </div>
        </div>
      )}

      {/* 2페이지: 문항 */}
      {step === 2 && (
        <div className="flex flex-col gap-3">
          {fields.map((field, index) => (
            <QuestionFieldItem
              key={field.id}
              index={index}
              questionValue={watch(`questions.${index}.question`) ?? ""}
              maxLengthValue={watch(`questions.${index}.max_length`) ?? null}
              onQuestionChange={(value) => setValue(`questions.${index}.question`, value)}
              onMaxLengthChange={(value) => setValue(`questions.${index}.max_length`, value)}
              onRemove={() => remove(index)}
              showRemoveButton={fields.length > 1}
              questionError={submitted && !watch(`questions.${index}.question`)?.trim() && (watch(`questions.${index}.max_length`) != null)}
              maxLengthError={submitted && !!watch(`questions.${index}.question`)?.trim() && watch(`questions.${index}.max_length`) == null}
            />
          ))}

          <button
            type="button"
            onClick={() => append({ question: "", max_length: null })}
            className="group w-full h-11 flex items-center justify-center gap-1.5 bg-primary-20 rounded-3.5 hover:bg-primary-50 transition-colors cursor-pointer"
          >
            <Image src="/icons/icon-plus-circle.svg" alt="" width={18} height={18} />
            <span className="text-body-3-2 text-gray-300 group-hover:text-gray-400 transition-colors">
              추가하기
            </span>
          </button>
          {errors.questions?.root && (
            <p className="text-body-9-3 text-alert">
              {errors.questions.root.message}
            </p>
          )}
        </div>
      )}

      </div>

      {/* 버튼 영역 */}
      <div className="shrink-0 flex items-center justify-center h-25 px-7.5 gap-4.5">
        {step === 2 && (
          <Button
            type="button"
            variant="secondary"
            onClick={() => goToStep(1)}
            disabled={isPending}
            className="h-11 w-41.25 text-body-5-2 text-primary-200"
          >
            이전으로
          </Button>
        )}
        {step === 1 ? (
          <Button
            type="button"
            disabled={!watchedCompany || !watchedJobPosition || !watchedRecruitNotice}
            onClick={async () => {
              const valid = await trigger(["company", "job_position", "recruit_notice"]);
              if (valid) goToStep(2);
            }}
            className="h-11 w-41.25 text-body-5-2 text-white"
          >
            다음으로
          </Button>
        ) : (
          <Button
            type="submit"
            onClick={() => setSubmitted(true)}
            disabled={isPending || watchedQuestions?.some(q => !q.question?.trim()) || watchedQuestions?.some(q => q.question?.trim() && (q.max_length == null || Number.isNaN(q.max_length)))}
            className="h-11 w-41.25 text-body-5-2 text-white"
          >
            {isPending ? "생성 중..." : "프로젝트 생성"}
          </Button>
        )}
      </div>
    </form>
  );
}
