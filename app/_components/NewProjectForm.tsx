"use client";

import { useState } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { ProjectCreate, QuestionCreate } from "@/types/api";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const projectFormSchema = z.object({
  company: z.string().min(1, "회사명을 입력해주세요"),
  job_position: z.string().min(1, "직무를 입력해주세요"),
  recruit_notice: z.string().min(1, "채용 공고를 입력해주세요"),
  company_talent: z.string().optional(),
  due_date: z.string().optional(),
  questions: z.array(
    z.object({
      question: z.string(),
      max_length: z.union([z.number(), z.nan()]).optional().nullable(),
    }),
  ),
});

type ProjectFormValues = z.infer<typeof projectFormSchema>;

interface NewProjectFormProps {
  onSubmit: (data: ProjectCreate) => void;
  onCancel: () => void;
  isPending?: boolean;
  onStepChange?: (step: 1 | 2) => void;
}

export function NewProjectForm({
  onSubmit,
  onCancel,
  isPending = false,
  onStepChange,
}: NewProjectFormProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [hasAttemptedStep2Submit, setHasAttemptedStep2Submit] = useState(false);

  const goToStep = (newStep: 1 | 2) => {
    setStep(newStep);
    onStepChange?.(newStep);
  };

  const {
    register,
    handleSubmit,
    control,
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

  const { fields, append, remove } = useFieldArray({
    control,
    name: "questions",
  });

  const handleFormSubmit = (data: ProjectFormValues) => {
    if (step === 1) {
      goToStep(2);
      return;
    }

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

      questions: questions.length > 0 ? questions : undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col">
      {/* 1페이지: 기본정보 */}
      {step === 1 && (
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label htmlFor="company" className="text-body-7-2 text-gray-400">
              회사명<span className="text-alert">*</span>
            </label>
            <Input
              id="company"
              placeholder="예 ) 주식회사 로짓 컴퍼니"
              className="h-11 text-body-5-4"
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
            <label
              htmlFor="job_position"
              className="text-body-7-2 text-gray-400"
            >
              직무<span className="text-alert">*</span>
            </label>
            <Input
              id="job_position"
              placeholder="예 ) 프론트엔드 개발자"
              className="h-11 text-body-5-4"
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
            <label
              htmlFor="recruit_notice"
              className="text-body-7-2 text-gray-400"
            >
              채용 공고<span className="text-alert">*</span>
            </label>
            <Textarea
              id="recruit_notice"
              placeholder="해당 직무의 주요 업무, 자격 요건, 우대 사항 등을 모두 복사해서 붙여 넣어주세요."
              rows={4}
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
            <label
              htmlFor="company_talent"
              className="text-body-7-2 text-gray-400"
            >
              기업의 인재상을 입력해주세요
            </label>
            <Input
              id="ideal_candidate_profile"
              placeholder="공식 홈페이지의 '인재상'이나 '핵심 가치' 를 입력해주세요."
              className="h-11 text-body-5-4"
              {...register("company_talent")}
            />
          </div>
        </div>
      )}

      {/* 2페이지: 문항 */}
      {step === 2 && (
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            {fields.map((field, index) => (
              <div key={field.id} className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-body-7-2 text-gray-200 shrink-0">
                    문항 {index + 1}
                  </span>
                  {fields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="text-body-9-3 text-alert hover:underline"
                    >
                      삭제
                    </button>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    placeholder={`${index + 1}번 문항`}
                    className="text-body-5-4"
                    {...register(`questions.${index}.question`)}
                  />
                  <Input
                    type="number"
                    placeholder="글자수"
                    className="text-body-5-4 w-28"
                    {...register(`questions.${index}.max_length`, {
                      valueAsNumber: true,
                    })}
                  />
                </div>
              </div>
            ))}

            <Button
              type="button"
              variant="tertiary"
              className="w-full text-gray-200"
              onClick={() => append({ question: "", max_length: null })}
            >
              + 추가하기
            </Button>
          </div>
        </div>
      )}

      {/* 버튼 영역 */}
      <div className="-mx-8 flex items-center justify-center px-8 py-5 gap-4 mt-3">
        <div>
          {step === 2 && (
            <Button
              type="button"
              variant="secondary"
              onClick={() => goToStep(1)}
              disabled={isPending}
              className="h-11 gap-2 px-5 text-body-5-2 text-primary-200"
            >
              이전으로
            </Button>
          )}
        </div>
        <div>
          {step === 1 ? (
            <Button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                goToStep(2);
              }}
              className="h-11 gap-2 px-5 text-body-5-2 text-white"
            >
              다음으로
            </Button>
          ) : (
            <Button
              type="submit"
              disabled={isPending}
              onClick={() => setHasAttemptedStep2Submit(true)}
              className="h-11 px-6 text-body-5-2 text-white"
            >
              {isPending ? "생성 중..." : "프로젝트 생성"}
            </Button>
          )}
        </div>
      </div>
    </form>
  );
}
