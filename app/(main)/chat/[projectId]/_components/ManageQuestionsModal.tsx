"use client";

import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { QuestionFieldItem } from "@/app/_components/QuestionFieldItem";
import {
  createQuestion,
  updateQuestion,
  deleteQuestion,
} from "@/app/_actions/projects";
import type { QuestionListItem } from "@/types/api";

interface QuestionField {
  id: string | null;
  question: string;
  max_length: number | null;
  isNew: boolean;
}

interface ManageQuestionsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  questions: QuestionListItem[];
  currentQuestionId: string;
  onQuestionChange: (questionId: string) => void;
}

export function ManageQuestionsModal({
  open,
  onOpenChange,
  projectId,
  questions,
  currentQuestionId,
  onQuestionChange,
}: ManageQuestionsModalProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [fields, setFields] = useState<QuestionField[]>([]);

  useEffect(() => {
    if (open) {
      setFields(
        questions.map((q) => ({
          id: q.id,
          question: q.question,
          max_length: q.max_length,
          isNew: false,
        })),
      );
    }
  }, [open, questions]);

  const resetFields = () => {
    setFields(
      questions.map((q) => ({
        id: q.id,
        question: q.question,
        max_length: q.max_length,
        isNew: false,
      })),
    );
  };

  const handleClose = () => {
    onOpenChange(false);
    resetFields();
  };

  const handleAddField = () => {
    setFields((prev) => [
      ...prev,
      { id: null, question: "", max_length: null, isNew: true },
    ]);
  };

  const handleRemoveField = (index: number) => {
    const field = fields[index];

    if (field.isNew) {
      setFields((prev) => prev.filter((_, i) => i !== index));
      return;
    }

    if (!field.id) return;

    const remainingFields = fields.filter((_, i) => i !== index);

    if (field.id === currentQuestionId) {
      const nextQuestion = remainingFields.find((f) => !f.isNew && f.id);
      if (nextQuestion?.id) {
        onQuestionChange(nextQuestion.id);
      }
    }

    handleClose();

    deleteQuestion(projectId, field.id).catch(() => {
      alert("문항 삭제 중 오류가 발생했습니다. 페이지를 새로고침합니다.");
      router.refresh();
    });
  };

  const handleQuestionChange = (index: number, value: string) => {
    setFields((prev) =>
      prev.map((f, i) => (i === index ? { ...f, question: value } : f)),
    );
  };

  const handleMaxLengthChange = (index: number, value: number | null) => {
    setFields((prev) =>
      prev.map((f, i) => (i === index ? { ...f, max_length: value } : f)),
    );
  };

  const handleSave = () => {
    const newField = fields.find((f) => f.isNew && f.question.trim());
    const changedFields = fields.filter((field) => {
      if (field.isNew || !field.id) return false;
      const original = questions.find((q) => q.id === field.id);
      return (
        original &&
        (field.question !== original.question ||
          field.max_length !== original.max_length)
      );
    });

    if (newField) {
      startTransition(async () => {
        try {
          const result = await createQuestion(projectId, {
            question: newField.question,
            max_length: newField.max_length ?? null,
          });
          onQuestionChange(result.id);
          handleClose();
        } catch {
          alert("문항 생성 중 오류가 발생했습니다.");
        }
      });
      return;
    }

    if (changedFields.length > 0) {
      handleClose();

      Promise.all(
        changedFields.map((field) =>
          updateQuestion(projectId, field.id!, {
            question: field.question,
            max_length: field.max_length ?? null,
          }),
        ),
      ).catch(() => {
        alert("문항 수정 중 오류가 발생했습니다. 페이지를 새로고침합니다.");
        router.refresh();
      });
    }
  };

  const hasChanges = (() => {
    if (fields.length !== questions.length) return true;

    return fields.some((field, index) => {
      const original = questions[index];
      if (!original) return true;
      if (field.id !== original.id) return true;
      if (field.question !== original.question) return true;
      if (field.max_length !== original.max_length) return true;
      return false;
    });
  })();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="flex max-h-[90vh] min-h-136.75 flex-col overflow-hidden rounded-5 border-0 p-0 shadow-chat sm:max-w-207"
        showCloseButton={false}
        onPointerDownOutside={(e) => {
          e.preventDefault();
          handleClose();
        }}
        onEscapeKeyDown={handleClose}
      >
        <div className="shrink-0 px-7.5 pt-7.5 pb-6">
          <DialogHeader className="flex-row items-start justify-between">
            <div className="flex flex-col gap-1.5">
              <p className="text-body-7-2 text-primary-400 font-semibold">
                문항 관리
              </p>
              <DialogTitle className="text-title-2-2 text-gray-500">
                자기소개서 문항 입력
              </DialogTitle>
              <DialogDescription className="text-body-7-2 text-primary-400">
                작성하는 자기소개서 문항을 입력해주세요
              </DialogDescription>
            </div>
            <button
              type="button"
              onClick={handleClose}
              className="shrink-0 p-1 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <Image
                src="/icons/icon-close.svg"
                alt="닫기"
                width={28}
                height={28}
              />
            </button>
          </DialogHeader>
        </div>

        <div className="flex-1 overflow-y-auto px-7.5 pb-6">
          <div className="flex flex-col gap-3">
            {fields.map((field, index) => (
              <QuestionFieldItem
                key={field.id ?? `new-${index}`}
                index={index}
                questionValue={field.question}
                maxLengthValue={field.max_length}
                onQuestionChange={(value) => handleQuestionChange(index, value)}
                onMaxLengthChange={(value) =>
                  handleMaxLengthChange(index, value)
                }
                onRemove={() => handleRemoveField(index)}
                showRemoveButton={fields.length > 1}
              />
            ))}

            <button
              type="button"
              onClick={handleAddField}
              className="group w-full h-11 flex items-center justify-center bg-primary-50 rounded-3.5 hover:bg-primary-60 transition-colors cursor-pointer"
            >
              <span className="text-body-3-2 text-gray-300 group-hover:text-gray-400 transition-colors">
                + 추가하기
              </span>
            </button>
          </div>
        </div>

        <div className="flex items-center justify-center gap-4.5 px-7.5 py-7">
          <Button
            type="button"
            variant="secondary"
            onClick={handleClose}
            disabled={isPending}
          >
            취소
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            disabled={isPending || !hasChanges}
          >
            {isPending ? "저장 중..." : "업데이트"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
