"use client";

import { useState, useImperativeHandle, forwardRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  EXPERIENCE_CATEGORY,
  EXPERIENCE_TYPE,
  type ExperienceCreate,
} from "@/types/api";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const experienceFormSchema = z.object({
  title: z.string().min(1, "제목을 입력해주세요"),
  start_date: z.string().min(1, "시작일을 선택해주세요"),
  end_date: z.string().min(1, "종료일을 선택해주세요"),
  experience_type: z.string().min(1, "경험 유형을 선택해주세요"),
  category: z.string().min(1, "카테고리를 선택해주세요"),
  situation: z.string().min(1, "상황을 입력해주세요"),
  task: z.string().min(1, "과제를 입력해주세요"),
  action: z.string().min(1, "행동을 입력해주세요"),
  result: z.string().min(1, "결과를 입력해주세요"),
});

type ExperienceFormValues = z.infer<typeof experienceFormSchema>;

interface NewExperienceFormProps {
  onSubmit: (data: ExperienceCreate) => void;
  onCancel: () => void;
  isPending?: boolean;
  onStepChange?: (step: 1 | 2) => void;
}

export interface NewExperienceFormRef {
  fillWithExample: (data: ExperienceCreate) => void;
}

/** ExperienceCreate의 날짜(YYYY-MM-DD)를 폼 형식(YYYY.MM.DD)으로 변환 */
function toFormDate(date: string): string {
  return date ? date.replace(/-/g, ".") : "";
}

export const NewExperienceForm = forwardRef<
  NewExperienceFormRef,
  NewExperienceFormProps
>(function NewExperienceForm(
  { onSubmit, onCancel, isPending = false, onStepChange },
  ref,
) {
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
    reset,
    formState: { errors },
  } = useForm<ExperienceFormValues>({
    resolver: zodResolver(experienceFormSchema),
    defaultValues: {
      title: "",
      start_date: "",
      end_date: "",
      experience_type: "",
      category: "",
      situation: "",
      task: "",
      action: "",
      result: "",
    },
  });

  useImperativeHandle(ref, () => ({
    fillWithExample(data: ExperienceCreate) {
      reset({
        title: data.title,
        start_date: toFormDate(data.start_date),
        end_date: toFormDate(data.end_date),
        experience_type: data.experience_type,
        category: data.category,
        situation: data.situation,
        task: data.task,
        action: data.action,
        result: data.result,
      });
    },
  }));

  const handleNext = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    goToStep(2);
  };

  const handlePrev = () => {
    goToStep(1);
  };

  const formatDateInput = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 8);
    if (digits.length <= 4) return digits;
    if (digits.length <= 6) return `${digits.slice(0, 4)}.${digits.slice(4)}`;
    return `${digits.slice(0, 4)}.${digits.slice(4, 6)}.${digits.slice(6)}`;
  };

  const normalizeDate = (date: string) =>
    date ? date.replace(/\./g, "-") : date;

  const handleFormSubmit = (data: ExperienceFormValues) => {
    onSubmit({
      ...data,
      start_date: normalizeDate(data.start_date),
      end_date: normalizeDate(data.end_date),
      experience_type:
        data.experience_type as ExperienceCreate["experience_type"],
      category: data.category as ExperienceCreate["category"],
    });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col">
      {/* 1페이지: 기본정보 */}
      {step === 1 && (
        <div className="flex flex-col gap-5">
          {/* 제목 */}
          <div className="flex flex-col gap-2">
            <label htmlFor="title" className="text-body-7-2 text-gray-400">
              경험 제목<span className="text-alert">*</span>
            </label>
            <Input
              id="title"
              placeholder="예 ) 로짓 데이터 분석을 통한 이탈율 개선"
              className="h-11 text-body-5-4"
              aria-invalid={!!errors.title}
              {...register("title")}
            />
            {errors.title && (
              <p className="text-body-9-3 text-alert">{errors.title.message}</p>
            )}
          </div>

          {/* 기간 */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between gap-3">
              <div className="flex flex-col gap-2 flex-1">
                <label className="text-body-7-2 text-gray-400">
                  시작 날짜<span className="text-alert">*</span>
                </label>

                <Controller
                  name="start_date"
                  control={control}
                  render={({ field }) => (
                    <Input
                      type="text"
                      placeholder="YYYY.MM.DD"
                      className="h-11 flex-1 text-body-5-4"
                      aria-invalid={!!errors.start_date}
                      {...field}
                      value={field.value}
                      onChange={(e) =>
                        field.onChange(formatDateInput(e.target.value))
                      }
                    />
                  )}
                />
              </div>
              <span className="text-body-5-4 text-gray-200 relative top-3">
                ~
              </span>
              <div className="flex flex-col gap-2 flex-1">
                <label className="text-body-7-2 text-gray-400">
                  종료 날짜
                  <span className="text-gray-200 text-body-7-2">(선택)</span>
                </label>

                <Controller
                  name="end_date"
                  control={control}
                  render={({ field }) => (
                    <Input
                      type="text"
                      placeholder="YYYY.MM.DD"
                      className="h-11 flex-1 text-body-5-4"
                      aria-invalid={!!errors.end_date}
                      {...field}
                      value={field.value}
                      onChange={(e) =>
                        field.onChange(formatDateInput(e.target.value))
                      }
                    />
                  )}
                />
              </div>
            </div>

            {(errors.start_date || errors.end_date) && (
              <p className="text-body-9-3 text-alert">
                {errors.start_date?.message ?? errors.end_date?.message}
              </p>
            )}
          </div>

          {/* 경험 유형 & 카테고리 */}

          <div className="flex flex-col gap-2">
            <label
              htmlFor="experience_type"
              className="text-body-7-2 text-gray-400"
            >
              경험의 종류<span className="text-alert">*</span>
            </label>
            <Controller
              name="experience_type"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger
                    id="experience_type"
                    className="h-11 w-full text-body-5-4"
                    aria-invalid={!!errors.experience_type}
                  >
                    <SelectValue placeholder="선택해주세요" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(EXPERIENCE_TYPE).map(([key, value]) => (
                      <SelectItem key={key} value={value}>
                        {value}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.experience_type && (
              <p className="text-body-9-3 text-alert">
                {errors.experience_type.message}
              </p>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="category" className="text-body-7-2 text-gray-400">
              작성하신 내용과 적합한 경험 유형을 선택해주세요
              <span className="text-alert">*</span>
            </label>
            <Controller
              name="category"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger
                    id="category"
                    className="h-11 w-full text-body-5-4"
                    aria-invalid={!!errors.category}
                  >
                    <SelectValue placeholder="선택해주세요" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(EXPERIENCE_CATEGORY).map(([key, value]) => (
                      <SelectItem key={key} value={value}>
                        {value}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.category && (
              <p className="text-body-9-3 text-alert">
                {errors.category.message}
              </p>
            )}
          </div>
        </div>
      )}

      {/* 2페이지: STAR */}
      {step === 2 && (
        <div className="flex flex-col gap-5">
          {/* 상황 */}
          <div className="flex flex-col gap-2">
            <label htmlFor="situation" className="text-body-7-2 text-gray-400">
              Situation (상황)을 입력해주세요
              <span className="text-alert">*</span>
            </label>
            <Textarea
              id="situation"
              placeholder="구체적인 상황 정보 (언제, 어디서, 누구와, 어떻게 등) 처음 보는 사람도 이해할 수 있도록 작성해주세요)"
              rows={2}
              aria-invalid={!!errors.situation}
              {...register("situation")}
            />
            {hasAttemptedStep2Submit && errors.situation && (
              <p className="text-body-9-3 text-alert">
                {errors.situation.message}
              </p>
            )}
          </div>

          {/* 과제 */}
          <div className="flex flex-col gap-2">
            <label htmlFor="task" className="text-body-7-2 text-gray-400">
              Task (과제/목표)를 입력해주세요
              <span className="text-alert">*</span>
            </label>
            <Textarea
              id="task"
              placeholder="인식한 과제와 목표에 대해 작성해주세요"
              rows={2}
              aria-invalid={!!errors.task}
              {...register("task")}
            />
            {hasAttemptedStep2Submit && errors.task && (
              <p className="text-body-9-3 text-alert">{errors.task.message}</p>
            )}
          </div>

          {/* 행동 */}
          <div className="flex flex-col gap-2">
            <label htmlFor="action" className="text-body-7-2 text-gray-400">
              Action (행동)을 입력해주세요<span className="text-alert">*</span>
            </label>
            <Textarea
              id="action"
              placeholder="과제 해결 또는 목푣 달성을 위한 구체적 행동과 이유를 작성해주세요"
              rows={2}
              aria-invalid={!!errors.action}
              {...register("action")}
            />
            {hasAttemptedStep2Submit && errors.action && (
              <p className="text-body-9-3 text-alert">
                {errors.action.message}
              </p>
            )}
          </div>

          {/* 결과 */}
          <div className="flex flex-col gap-2">
            <label htmlFor="result" className="text-body-7-2 text-gray-400">
              Result (결과)를 입력해주세요<span className="text-alert">*</span>
            </label>
            <Textarea
              id="result"
              placeholder="경험(행동)의 결과와 그로 인해 배운 점과 아쉬운 점 등을 작성해주세요"
              rows={2}
              aria-invalid={!!errors.result}
              {...register("result")}
            />
            {hasAttemptedStep2Submit && errors.result && (
              <p className="text-body-9-3 text-alert">
                {errors.result.message}
              </p>
            )}
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
              onClick={handlePrev}
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
              onClick={handleNext}
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
              {isPending ? "등록 중..." : "경험 등록하기"}
            </Button>
          )}
        </div>
      </div>
    </form>
  );
});
