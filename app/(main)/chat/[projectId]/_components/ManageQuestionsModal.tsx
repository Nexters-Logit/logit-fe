"use client";

import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { QuestionFieldItem } from "@/app/_components/QuestionFieldItem";
import {
  createQuestion,
  updateQuestion,
  deleteQuestion,
} from "@/app/_actions/projects";
import { showToast } from "@/libs/toast";
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
    showToast.success("문항이 삭제되었습니다.");

    deleteQuestion(projectId, field.id).catch(() => {
      showToast.error("문항 삭제 중 오류가 발생했습니다. 페이지를 새로고침합니다.");
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
          showToast.success("문항이 추가되었습니다.");
        } catch {
          showToast.error("문항 생성 중 오류가 발생했습니다.");
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
      )
        .then(() => {
          showToast.success("문항이 수정되었습니다.");
        })
        .catch(() => {
          showToast.error("문항 수정 중 오류가 발생했습니다. 페이지를 새로고침합니다.");
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
        className="flex max-h-[90vh] h-168 flex-col overflow-hidden rounded-5 border-0 p-0 shadow-chat sm:max-w-207"
        showCloseButton={false}
        onPointerDownOutside={(e) => {
          e.preventDefault();
          handleClose();
        }}
        onEscapeKeyDown={handleClose}
      >
        <div className="shrink-0 px-7.5 pt-7.5 pb-6">
          <DialogHeader className="flex-row items-start justify-between">
            <DialogTitle className="text-title-2-2 text-gray-500">
              자기소개서 문항 수정
            </DialogTitle>
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
                questionError={!field.question.trim() && field.max_length != null}
                maxLengthError={!!field.question.trim() && field.max_length == null}
              />
            ))}

            <button
              type="button"
              onClick={handleAddField}
              className="group w-full h-11 flex items-center justify-center gap-1.5 bg-primary-20 rounded-3.5 hover:bg-primary-50 transition-colors cursor-pointer"
            >
              <Image
                src="/icons/icon-plus-circle.svg"
                alt=""
                width={18}
                height={18}
              />
              <span className="text-body-3-2 text-gray-300 group-hover:text-gray-400 transition-colors">
                추가하기
              </span>
            </button>
          </div>
        </div>

        <div className="shrink-0 flex items-center justify-center h-25 px-7.5 gap-4.5">
          <Button
            type="button"
            onClick={handleSave}
            disabled={isPending || !hasChanges || fields.some(f => !f.question.trim()) || fields.some(f => f.question.trim() && f.max_length == null)}
            className="w-41.25"
          >
            {isPending ? "저장 중..." : "문항 수정"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
