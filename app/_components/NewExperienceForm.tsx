"use client";

import { useState, useImperativeHandle, forwardRef, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Image from "next/image";
import {
  EXPERIENCE_CATEGORY,
  EXPERIENCE_TYPE,
  FORMAT_TYPE,
  type ExperienceCreate,
  type Experience,
} from "@/types/api";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { formatDateInput } from "@/libs/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EXPERIENCE_TYPE_ICON } from "@/app/_constants/experienceTypes";

/** 폼 내부용 (드롭다운 value). API의 format_type과 매핑: 자유형식 → FREE */
const EXPERIENCE_FORMAT = {
  STAR: FORMAT_TYPE.STAR,
  PSI: FORMAT_TYPE.PSI,
  FREE: FORMAT_TYPE.FREE, // "FREE"
} as const;

const experienceFormSchema = z
  .object({
    title: z.string().min(1, "제목을 입력해주세요"),
    start_date: z.string().min(1, "시작일을 선택해주세요"),
    end_date: z.string(),
    experience_type: z.string().min(1, "경험 유형을 선택해주세요"),
    category: z.string(), // UI 삭제로 선택 불가 → 제출 시 기본값 적용
    experience_format: z.string().min(1, "경험정리방법을 선택해주세요"),
    situation: z.string(),
    task: z.string(),
    action: z.string(),
    result: z.string(),
    problem: z.string(),
    solution: z.string(),
    insight: z.string(),
    content: z.string(),
  })
  .superRefine((data, ctx) => {
    const minLen = 50;
    const msg = "50자 이상 입력해주세요";

    if (data.experience_format === EXPERIENCE_FORMAT.STAR) {
      for (const field of ["situation", "task", "action", "result"] as const) {
        if (data[field].trim().length < minLen) {
          ctx.addIssue({ code: z.ZodIssueCode.custom, message: msg, path: [field] });
        }
      }
    } else if (data.experience_format === EXPERIENCE_FORMAT.PSI) {
      for (const field of ["problem", "solution", "insight"] as const) {
        if (data[field].trim().length < minLen) {
          ctx.addIssue({ code: z.ZodIssueCode.custom, message: msg, path: [field] });
        }
      }
    } else if (data.experience_format === EXPERIENCE_FORMAT.FREE) {
      if (data.content.trim().length < 1) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "내용을 입력해주세요", path: ["content"] });
      }
    }
  });

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
      const format = initialData.format_type ?? EXPERIENCE_FORMAT.STAR;
      return {
        title: initialData.title,
        start_date: toFormDate(initialData.start_date || ""),
        end_date: toFormDate(initialData.end_date || ""),
        experience_type: initialData.experience_type,
        category: initialData.category,
        experience_format: format,
        situation: initialData.situation ?? "",
        task: initialData.task ?? "",
        action: initialData.action ?? "",
        result: initialData.result ?? "",
        problem: initialData.problem ?? "",
        solution: initialData.solution ?? "",
        insight: initialData.insight ?? "",
        content: initialData.content ?? "",
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
      insight: "",
      content: "",
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
      const format = initialData.format_type ?? EXPERIENCE_FORMAT.STAR;
      reset({
        title: initialData.title,
        start_date: toFormDate(initialData.start_date || ""),
        end_date: toFormDate(initialData.end_date || ""),
        experience_type: initialData.experience_type,
        category: initialData.category,
        experience_format: format,
        situation: initialData.situation ?? "",
        task: initialData.task ?? "",
        action: initialData.action ?? "",
        result: initialData.result ?? "",
        problem: initialData.problem ?? "",
        solution: initialData.solution ?? "",
        insight: initialData.insight ?? "",
        content: initialData.content ?? "",
      });
    }
  }, [mode, initialData, reset]);

  useImperativeHandle(ref, () => ({
    fillWithExample(data: ExperienceCreate) {
      const format = data.format_type ?? EXPERIENCE_FORMAT.STAR;
      reset({
        title: data.title,
        start_date: toFormDate(data.start_date),
        end_date: toFormDate(data.end_date),
        experience_type: data.experience_type,
        category: data.category,
        experience_format: format,
        situation: data.situation ?? "",
        task: data.task ?? "",
        action: data.action ?? "",
        result: data.result ?? "",
        problem: data.problem ?? "",
        solution: data.solution ?? "",
        insight: data.insight ?? "",
        content: data.content ?? "",
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

  const normalizeDate = (date: string) =>
    date ? date.replace(/\./g, "-") : date;

  const defaultCategory = Object.values(
    EXPERIENCE_CATEGORY,
  )[0] as ExperienceCreate["category"];

  const buildCreatePayload = (data: ExperienceFormValues): ExperienceCreate => {
    const category: ExperienceCreate["category"] =
      (data.category?.trim() as ExperienceCreate["category"]) ||
      defaultCategory;
    const base = {
      title: data.title,
      start_date: normalizeDate(data.start_date),
      end_date: normalizeDate(data.end_date),
      experience_type:
        data.experience_type as ExperienceCreate["experience_type"],
      format_type: data.experience_format as ExperienceCreate["format_type"],
      category,
    };
    if (data.experience_format === EXPERIENCE_FORMAT.STAR) {
      return {
        ...base,
        situation: data.situation,
        task: data.task,
        action: data.action,
        result: data.result,
      };
    }
    if (data.experience_format === EXPERIENCE_FORMAT.PSI) {
      return {
        ...base,
        problem: data.problem,
        solution: data.solution,
        insight: data.insight,
      };
    }
    return {
      ...base,
      content: data.content,
    };
  };

  const handleFormSubmit = (data: ExperienceFormValues) => {
    onSubmit(buildCreatePayload(data));
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
                          <Image
                            src={EXPERIENCE_TYPE_ICON[value]}
                            alt=""
                            width={24}
                            height={24}
                            className="shrink-0"
                          />
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
                  {hasAttemptedStep2Submit && errors.problem && (
                    <p className="text-body-9-3 text-alert">
                      {errors.problem.message}
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
                  {hasAttemptedStep2Submit && errors.solution && (
                    <p className="text-body-9-3 text-alert">
                      {errors.solution.message}
                    </p>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="insight"
                    className="text-body-7-2 text-gray-400"
                  >
                    Insight (인사이트)를 입력해주세요
                    <span className="text-alert">*</span>
                  </label>
                  <Textarea
                    id="insight"
                    placeholder="해결 과정을 통해 얻은 결과와 성과, 배운 점을 작성해주세요"
                    rows={2}
                    aria-invalid={!!errors.insight}
                    {...register("insight")}
                  />
                  {hasAttemptedStep2Submit && errors.insight && (
                    <p className="text-body-9-3 text-alert">
                      {errors.insight.message}
                    </p>
                  )}
                </div>
              </>
            )}

            {/* 자유형식: 단일 텍스트 영역 */}
            {experienceFormat === EXPERIENCE_FORMAT.FREE && (
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="content"
                  className="text-body-7-2 text-gray-400"
                >
                  경험을 자유 형식으로 작성해주세요
                  <span className="text-alert">*</span>
                </label>
                <Textarea
                  id="content"
                  placeholder="경험한 내용을 자유롭게 작성해주세요. 상황, 본인의 역할, 결과와 배운 점 등을 포함하면 좋습니다."
                  rows={8}
                  className="min-h-44"
                  aria-invalid={!!errors.content}
                  {...register("content")}
                />
                {hasAttemptedStep2Submit && errors.content && (
                  <p className="text-body-9-3 text-alert">
                    {errors.content.message}
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
