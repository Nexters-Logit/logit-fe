"use client";

import { useState } from "react";
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
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

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

export function NewExperienceForm({
  onSubmit,
  onCancel,
  isPending = false,
  onStepChange,
}: NewExperienceFormProps) {
  const [step, setStep] = useState<1 | 2>(1);

  const goToStep = (newStep: 1 | 2) => {
    setStep(newStep);
    onStepChange?.(newStep);
  };

  const {
    register,
    handleSubmit,
    control,
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

  const handleNext = () => {
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
                  종료 날짜<span className="text-alert">*</span>
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
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label
                htmlFor="experience_type"
                className="text-body-7-2 text-gray-400"
              >
                경험 유형
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
                카테고리
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
                      {Object.entries(EXPERIENCE_CATEGORY).map(
                        ([key, value]) => (
                          <SelectItem key={key} value={value}>
                            {value}
                          </SelectItem>
                        ),
                      )}
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
        </div>
      )}

      {/* 2페이지: STAR */}
      {step === 2 && (
        <div className="flex flex-col gap-5">
          <h3 className="text-title-4 text-gray-400">경험 상세 (STAR)</h3>

          {/* 상황 */}
          <div className="flex flex-col gap-2">
            <label htmlFor="situation" className="text-body-7-2 text-gray-400">
              상황 (Situation)
            </label>
            <Textarea
              id="situation"
              placeholder="어떤 상황이었나요?"
              rows={3}
              className="min-h-24 resize-none text-body-5-4"
              aria-invalid={!!errors.situation}
              {...register("situation")}
            />
            {errors.situation && (
              <p className="text-body-9-3 text-alert">
                {errors.situation.message}
              </p>
            )}
          </div>

          {/* 과제 */}
          <div className="flex flex-col gap-2">
            <label htmlFor="task" className="text-body-7-2 text-gray-400">
              과제 (Task)
            </label>
            <Textarea
              id="task"
              placeholder="어떤 과제가 있었나요?"
              rows={3}
              className="min-h-24 resize-none text-body-5-4"
              aria-invalid={!!errors.task}
              {...register("task")}
            />
            {errors.task && (
              <p className="text-body-9-3 text-alert">{errors.task.message}</p>
            )}
          </div>

          {/* 행동 */}
          <div className="flex flex-col gap-2">
            <label htmlFor="action" className="text-body-7-2 text-gray-400">
              행동 (Action)
            </label>
            <Textarea
              id="action"
              placeholder="어떤 행동을 취했나요?"
              rows={3}
              className="min-h-24 resize-none text-body-5-4"
              aria-invalid={!!errors.action}
              {...register("action")}
            />
            {errors.action && (
              <p className="text-body-9-3 text-alert">
                {errors.action.message}
              </p>
            )}
          </div>

          {/* 결과 */}
          <div className="flex flex-col gap-2">
            <label htmlFor="result" className="text-body-7-2 text-gray-400">
              결과 (Result)
            </label>
            <Textarea
              id="result"
              placeholder="어떤 결과를 얻었나요?"
              rows={3}
              className="min-h-24 resize-none text-body-5-4"
              aria-invalid={!!errors.result}
              {...register("result")}
            />
            {errors.result && (
              <p className="text-body-9-3 text-alert">
                {errors.result.message}
              </p>
            )}
          </div>
        </div>
      )}

      {/* 버튼 영역 */}
      <div className="-mx-8 mt-8 flex items-center justify-between border-t border-gray-70 bg-gray-20 px-8 py-5">
        <div>
          {step === 2 ? (
            <Button
              type="button"
              variant="primary"
              onClick={handlePrev}
              disabled={isPending}
              className="h-11 gap-2 px-5 text-body-5-2"
            >
              <ChevronLeftIcon className="size-4" />
              이전
            </Button>
          ) : (
            <Button
              type="button"
              variant="primary"
              onClick={onCancel}
              disabled={isPending}
              className="h-11 px-5 text-body-5-2"
            >
              취소
            </Button>
          )}
        </div>
        <div>
          {step === 1 ? (
            <Button
              type="button"
              onClick={handleNext}
              className="h-11 gap-2 px-5 text-body-5-2"
            >
              다음
              <ChevronRightIcon className="size-4" />
            </Button>
          ) : (
            <Button
              type="submit"
              disabled={isPending}
              className="h-11 px-6 text-body-5-2"
            >
              {isPending ? "등록 중..." : "등록"}
            </Button>
          )}
        </div>
      </div>
    </form>
  );
}
