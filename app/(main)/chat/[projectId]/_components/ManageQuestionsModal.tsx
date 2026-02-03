"use client";

import { useState, useTransition } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { QuestionFieldItem } from "@/app/_components/QuestionFieldItem";
import { createQuestion, updateQuestion } from "@/app/_actions/projects";
import type { QuestionListItem } from "@/types/api";

interface QuestionField {
  id: string | null;
  question: string;
  max_length: number | null;
  isNew: boolean;
  isDirty: boolean;
}

interface ManageQuestionsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  questions: QuestionListItem[];
  onQuestionAdded: (newQuestionId: string) => void;
}

export function ManageQuestionsModal({
  open,
  onOpenChange,
  projectId,
  questions,
  onQuestionAdded,
}: ManageQuestionsModalProps) {
  const [isPending, startTransition] = useTransition();
  const [fields, setFields] = useState<QuestionField[]>(() =>
    questions.map((q) => ({
      id: q.id,
      question: q.question,
      max_length: q.max_length,
      isNew: false,
      isDirty: false,
    })),
  );

  const resetFields = () => {
    setFields(
      questions.map((q) => ({
        id: q.id,
        question: q.question,
        max_length: q.max_length,
        isNew: false,
        isDirty: false,
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
      { id: null, question: "", max_length: null, isNew: true, isDirty: true },
    ]);
  };

  const handleRemoveField = (index: number) => {
    setFields((prev) => prev.filter((_, i) => i !== index));
  };

  const handleQuestionChange = (index: number, value: string) => {
    setFields((prev) =>
      prev.map((f, i) =>
        i === index ? { ...f, question: value, isDirty: true } : f,
      ),
    );
  };

  const handleMaxLengthChange = (index: number, value: number | null) => {
    setFields((prev) =>
      prev.map((f, i) =>
        i === index ? { ...f, max_length: value, isDirty: true } : f,
      ),
    );
  };

  const handleSave = () => {
    startTransition(async () => {
      try {
        const dirtyFields = fields.filter((f) => f.isDirty);

        for (const field of dirtyFields) {
          if (field.isNew) {
            if (!field.question.trim()) continue;

            const result = await createQuestion(projectId, {
              question: field.question,
              max_length: field.max_length ?? null,
            });

            onQuestionAdded(result.id);
            handleClose();
            return;
          } else if (field.id) {
            await updateQuestion(projectId, field.id, {
              question: field.question,
              max_length: field.max_length ?? null,
            });
          }
        }

        handleClose();
      } catch {
        alert("문항 저장 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
      }
    });
  };

  const hasDirtyFields = fields.some((f) => f.isDirty);
  const hasNewFields = fields.some((f) => f.isNew);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="flex max-h-[90vh] flex-col overflow-hidden rounded-2xl border-0 p-0 shadow-chat sm:max-w-2xl"
        onPointerDownOutside={(e) => {
          e.preventDefault();
          handleClose();
        }}
        onEscapeKeyDown={handleClose}
      >
        <div className="shrink-0 px-8 pt-6 pb-5">
          <DialogHeader>
            <DialogTitle className="text-title-2-2 text-gray-400">
              문항 관리
            </DialogTitle>
            <DialogDescription className="text-body-7-2 text-primary-400">
              문항을 수정하거나 새 문항을 추가하세요.
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="flex-1 overflow-y-auto px-8 pb-6">
          <div className="flex flex-col gap-5">
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
              className="group w-full h-11 flex items-center justify-center bg-primary-50 rounded-3.5 hover:bg-primary-70 transition-colors cursor-pointer"
            >
              <span className="text-body-5-2 text-gray-300 group-hover:text-gray-400 transition-colors">
                + 추가하기
              </span>
            </button>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 px-8 py-5 border-t border-gray-70">
          <Button
            type="button"
            variant="secondary"
            onClick={handleClose}
            disabled={isPending}
            className="h-11 px-5 text-body-5-2"
          >
            취소
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            disabled={isPending || !hasDirtyFields}
            className="h-11 px-5 text-body-5-2 text-white"
          >
            {isPending ? "저장 중..." : hasNewFields ? "문항 추가" : "저장"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
