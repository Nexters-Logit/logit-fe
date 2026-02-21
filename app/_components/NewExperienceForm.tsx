"use client";

import { useState, useImperativeHandle, forwardRef, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Image from "next/image";
import {
  EXPERIENCE_CATEGORY,
  EXPERIENCE_TYPE,
  type ExperienceCreate,
  type Experience,
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
import { getCategoryConfig } from "@/app/(main)/chat/[projectId]/_constants";

const EXPERIENCE_FORMAT = {
  STAR: "STAR",
  PSI: "PSI",
  FREE: "자유형식",
} as const;

const experienceFormSchema = z
  .object({
    title: z.string().min(1, "제목을 입력해주세요"),
    start_date: z.string().min(1, "시작일을 선택해주세요"),
    end_date: z.string(),
    experience_type: z.string().min(1, "경험 유형을 선택해주세요"),
    category: z.string().min(1, "카테고리를 선택해주세요"),
    experience_format: z.string().min(1, "경험정리방법을 선택해주세요"),
    situation: z.string(),
    task: z.string(),
    action: z.string(),
    result: z.string(),
    problem: z.string(),
    solution: z.string(),
    impact: z.string(),
    free_content: z.string(),
  })
  .refine(
    (data) => {
      const minLen = 50;
      if (data.experience_format === EXPERIENCE_FORMAT.STAR) {
        return (
          data.situation.trim().length >= minLen &&
          data.task.trim().length >= minLen &&
          data.action.trim().length >= minLen &&
          data.result.trim().length >= minLen
        );
      }
      if (data.experience_format === EXPERIENCE_FORMAT.PSI) {
        return (
          data.problem.trim().length >= minLen &&
          data.solution.trim().length >= minLen &&
          data.impact.trim().length >= minLen
        );
      }
      if (data.experience_format === EXPERIENCE_FORMAT.FREE) {
        return data.free_content.trim().length >= minLen;
      }
      return true;
    },
    {
      message: "모든 텍스트 필드는 50자 이상 입력해주세요",
      path: ["situation"],
    },
  );

type ExperienceFormValues = z.infer<typeof experienceFormSchema>;

interface NewExperienceFormProps {
  onSubmit: (data: ExperienceCreate) => void;
  isPending?: boolean;
  onStepChange?: (step: 1 | 2) => void;
  mode?: "create" | "edit";
  initialData?: Experience;
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
  { onSubmit, isPending = false, onStepChange, mode = "create", initialData },
  ref,
) {
  const [step, setStep] = useState<1 | 2>(1);
  const [hasAttemptedStep1Next, setHasAttemptedStep1Next] = useState(false);
  const [hasAttemptedStep2Submit, setHasAttemptedStep2Submit] = useState(false);

  const goToStep = (newStep: 1 | 2) => {
    setStep(newStep);
    onStepChange?.(newStep);
  };

  const getDefaultValues = (): ExperienceFormValues => {
    if (initialData) {
      return {
        title: initialData.title,
        start_date: toFormDate(initialData.start_date || ""),
        end_date: toFormDate(initialData.end_date || ""),
        experience_type: initialData.experience_type,
        category: initialData.category,
        experience_format: EXPERIENCE_FORMAT.STAR,
        situation: initialData.situation,
        task: initialData.task,
        action: initialData.action,
        result: initialData.result,
        problem: "",
        solution: "",
        impact: "",
        free_content: "",
      };
    }
    return {
      title: "",
      start_date: "",
      end_date: "",
      experience_type: "",
      category: "",
      experience_format: EXPERIENCE_FORMAT.STAR,
      situation: "",
      task: "",
      action: "",
      result: "",
      problem: "",
      solution: "",
      impact: "",
      free_content: "",
    };
  };

  const {
    register,
    handleSubmit,
    control,
    reset,
    trigger,
    watch,
    formState: { errors },
  } = useForm<ExperienceFormValues>({
    resolver: zodResolver(experienceFormSchema),
    defaultValues: getDefaultValues(),
  });

  const experienceFormat = watch("experience_format");

  // edit 모드에서 initialData가 변경되면 폼을 reset
  useEffect(() => {
    if (mode === "edit" && initialData) {
      reset({
        title: initialData.title,
        start_date: toFormDate(initialData.start_date || ""),
        end_date: toFormDate(initialData.end_date || ""),
        experience_type: initialData.experience_type,
        category: initialData.category,
        experience_format: EXPERIENCE_FORMAT.STAR,
        situation: initialData.situation,
        task: initialData.task,
        action: initialData.action,
        result: initialData.result,
        problem: "",
        solution: "",
        impact: "",
        free_content: "",
      });
    }
  }, [mode, initialData, reset]);

  useImperativeHandle(ref, () => ({
    fillWithExample(data: ExperienceCreate) {
      reset({
        title: data.title,
        start_date: toFormDate(data.start_date),
        end_date: toFormDate(data.end_date),
        experience_type: data.experience_type,
        category: data.category,
        experience_format: EXPERIENCE_FORMAT.STAR,
        situation: data.situation,
        task: data.task,
        action: data.action,
        result: data.result,
        problem: "",
        solution: "",
        impact: "",
        free_content: "",
      });
    },
  }));

  const handleNext = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setHasAttemptedStep1Next(true);

    // Step 1의 필수 필드 검증
    const isValid = await trigger(["title", "start_date", "experience_type"]);
    if (isValid) {
      goToStep(2);
    }
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

  const buildStarPayload = (data: ExperienceFormValues): ExperienceCreate => ({
    title: data.title,
    start_date: normalizeDate(data.start_date),
    end_date: normalizeDate(data.end_date),
    experience_type:
      data.experience_type as ExperienceCreate["experience_type"],
    category: data.category as ExperienceCreate["category"],
    situation: data.situation,
    task: data.task,
    action: data.action,
    result: data.result,
  });

  const handleFormSubmit = (data: ExperienceFormValues) => {
    const { experience_format: format } = data;
    if (format === EXPERIENCE_FORMAT.STAR) {
      onSubmit(buildStarPayload(data));
      return;
    }
    if (format === EXPERIENCE_FORMAT.PSI) {
      onSubmit({
        ...buildStarPayload(data),
        situation: data.problem,
        task: data.solution,
        action: data.solution,
        result: data.impact,
      });
      return;
    }
    if (format === EXPERIENCE_FORMAT.FREE) {
      onSubmit({
        ...buildStarPayload(data),
        situation: data.free_content,
        task: "-",
        action: "-",
        result: "-",
      });
      return;
    }
    onSubmit(buildStarPayload(data));
  };

  const onValidationError = (errors: unknown) => {
    console.error("Form validation errors:", errors);
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit, onValidationError)}
      className="flex flex-1 flex-col min-h-0"
    >
      <div className="flex-1 overflow-y-auto px-8 pb-6">
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
              {hasAttemptedStep1Next && errors.title && (
                <p className="text-body-7-3 text-alert">
                  필수 입력 항목입니다.
                </p>
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

              {hasAttemptedStep1Next && errors.start_date && (
                <p className="text-body-7-3 text-alert">
                  필수 입력 항목입니다.
                </p>
              )}
            </div>

            {/* 경험 유형 & 카테고리 */}

            <div className="flex flex-col gap-2">
              <label
                htmlFor="experience_type"
                className="text-body-7-2 text-gray-400"
              >
                활동 종류<span className="text-alert">*</span>
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
              {hasAttemptedStep1Next && errors.experience_type && (
                <p className="text-body-7-3 text-alert">
                  필수 입력 항목입니다.
                </p>
              )}
            </div>
            {/* 카테고리 정책 변경으로 인한 삭제 */}
            {/* <div className="flex flex-col gap-2">
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
                      {Object.entries(EXPERIENCE_CATEGORY).map(
                        ([key, value]) => {
                          const config = getCategoryConfig(value);
                          return (
                            <SelectItem key={key} value={value}>
                              <Image
                                src={config.icon}
                                alt=""
                                width={18}
                                height={18}
                                className="shrink-0"
                              />
                              {value}
                            </SelectItem>
                          );
                        },
                      )}
                    </SelectContent>
                  </Select>
                )}
              />
              {hasAttemptedStep1Next && errors.category && (
                <p className="text-body-7-3 text-alert">
                  필수 입력 항목입니다.
                </p>
              )}
            </div> */}
          </div>
        )}

        {/* 2페이지: STAR */}
        {step === 2 && (
          <div className="flex flex-col gap-5">
            {/* 경험정리방법 */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="experience_format"
                className="text-body-7-2 text-gray-400"
              >
                경험정리방법
              </label>
              <Controller
                name="experience_format"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger
                      id="experience_format"
                      className="h-11 text-body-5-4"
                    >
                      <SelectValue placeholder="선택해주세요" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={EXPERIENCE_FORMAT.STAR}>
                        STAR
                      </SelectItem>
                      <SelectItem value={EXPERIENCE_FORMAT.PSI}>PSI</SelectItem>
                      <SelectItem value={EXPERIENCE_FORMAT.FREE}>
                        자유형식
                      </SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            {/* STAR: 기존 4개 필드 */}
            {experienceFormat === EXPERIENCE_FORMAT.STAR && (
              <>
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="situation"
                    className="text-body-7-2 text-gray-400"
                  >
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
                    <p className="text-body-9-3 text-alert">
                      {errors.task.message}
                    </p>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="action"
                    className="text-body-7-2 text-gray-400"
                  >
                    Action (행동)을 입력해주세요
                    <span className="text-alert">*</span>
                  </label>
                  <Textarea
                    id="action"
                    placeholder="과제 해결 또는 목표 달성을 위한 구체적 행동과 이유를 작성해주세요"
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
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="result"
                    className="text-body-7-2 text-gray-400"
                  >
                    Result (결과)를 입력해주세요
                    <span className="text-alert">*</span>
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
              </>
            )}

            {/* PSI: 문제 / 해결 / 성과 */}
            {experienceFormat === EXPERIENCE_FORMAT.PSI && (
              <>
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="problem"
                    className="text-body-7-2 text-gray-400"
                  >
                    Problem (문제)을 입력해주세요
                    <span className="text-alert">*</span>
                  </label>
                  <Textarea
                    id="problem"
                    placeholder="직면한 문제나 도전 상황을 구체적으로 작성해주세요"
                    rows={2}
                    aria-invalid={!!errors.problem}
                    {...register("problem")}
                  />
                  {hasAttemptedStep2Submit && errors.situation && (
                    <p className="text-body-9-3 text-alert">
                      필수 입력 항목을 채워주세요
                    </p>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="solution"
                    className="text-body-7-2 text-gray-400"
                  >
                    Solution (해결)을 입력해주세요
                    <span className="text-alert">*</span>
                  </label>
                  <Textarea
                    id="solution"
                    placeholder="문제 해결을 위해 취한 행동과 방법을 작성해주세요"
                    rows={2}
                    aria-invalid={!!errors.solution}
                    {...register("solution")}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="impact"
                    className="text-body-7-2 text-gray-400"
                  >
                    Impact (성과)를 입력해주세요
                    <span className="text-alert">*</span>
                  </label>
                  <Textarea
                    id="impact"
                    placeholder="해결 과정을 통해 얻은 결과와 성과, 배운 점을 작성해주세요"
                    rows={2}
                    aria-invalid={!!errors.impact}
                    {...register("impact")}
                  />
                </div>
              </>
            )}

            {/* 자유형식: 단일 텍스트 영역 */}
            {experienceFormat === EXPERIENCE_FORMAT.FREE && (
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="free_content"
                  className="text-body-7-2 text-gray-400"
                >
                  경험을 자유 형식으로 작성해주세요
                  <span className="text-alert">*</span>
                </label>
                <Textarea
                  id="free_content"
                  placeholder="경험한 내용을 자유롭게 작성해주세요. 상황, 본인의 역할, 결과와 배운 점 등을 포함하면 좋습니다."
                  rows={8}
                  className="min-h-44 resize-y"
                  aria-invalid={!!errors.free_content}
                  {...register("free_content")}
                />
                {hasAttemptedStep2Submit && errors.situation && (
                  <p className="text-body-9-3 text-alert">
                    필수 입력 항목을 채워주세요
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* 버튼 영역 */}
      <div className="shrink-0 flex items-center justify-center px-8 py-5 gap-4">
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
              {isPending
                ? mode === "edit"
                  ? "수정 중..."
                  : "등록 중..."
                : mode === "edit"
                  ? "경험 수정하기"
                  : "경험 등록하기"}
            </Button>
          )}
        </div>
      </div>
    </form>
  );
});
