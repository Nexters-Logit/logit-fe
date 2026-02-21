"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { createQuestion } from "@/app/_actions/projects";
import { showToast } from "@/libs/toast";

interface AddQuestionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  onQuestionCreated: (questionId: string) => void;
}

export function AddQuestionModal({
  open,
  onOpenChange,
  projectId,
  onQuestionCreated,
}: AddQuestionModalProps) {
  const [isPending, startTransition] = useTransition();
  const [question, setQuestion] = useState("");
  const [maxLength, setMaxLength] = useState("");

  const handleClose = () => {
    onOpenChange(false);
    setQuestion("");
    setMaxLength("");
  };

  const handleSubmit = () => {
    if (!question.trim()) return;

    startTransition(async () => {
      try {
        const result = await createQuestion(projectId, {
          question: question.trim(),
          max_length: maxLength ? Number(maxLength) : null,
        });
        onQuestionCreated(result.id);
        handleClose();
        showToast.success("문항이 추가되었습니다.");
      } catch {
        showToast.error("문항 생성 중 오류가 발생했습니다.");
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-207 rounded-5 p-0 border-0 shadow-chat"
        showCloseButton={false}
        onPointerDownOutside={(e) => {
          e.preventDefault();
          handleClose();
        }}
        onEscapeKeyDown={handleClose}
      >
        <div className="px-7.5 pt-7.5 pb-6">
          <DialogHeader className="flex-row items-start justify-between">
            <DialogTitle className="text-title-2-2 text-gray-500">
              새 문항 추가
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

        <div className="flex flex-col gap-5 px-7.5 pb-6">
          <div className="flex flex-col gap-2">
            <label className="text-body-7-2 text-primary-500 font-semibold">
              문항내용
            </label>
            <Textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="예) 지원동기를 입력해주세요"
              className="h-16 text-body-5-1 text-gray-500 resize-none"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-body-7-2 text-primary-500 font-semibold">
              글자 수 제한
            </label>
            <Input
              type="number"
              value={maxLength}
              onChange={(e) => setMaxLength(e.target.value)}
              placeholder="글자수를 입력해주세요"
              className="h-10 text-body-5-1 text-gray-500"
            />
          </div>
        </div>

        <div className="flex justify-center px-7.5 pb-7.5">
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={isPending || !question.trim()}
            className="w-41.25"
          >
            {isPending ? "추가 중..." : "문항 추가"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
