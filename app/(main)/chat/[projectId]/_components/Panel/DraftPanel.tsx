"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { useChatStore } from "../../_store/useChatStore";
import { useProjectContext } from "../../_context";
import { useToggleComplete, useSaveAnswer } from "../../_hooks";
import { showToast } from "@/libs/toast";
import { CompleteToggleButton } from "./CompleteToggleButton";

interface DraftPanelProps {
  maxLength?: number;
}

export function DraftPanel({ maxLength }: DraftPanelProps) {
  const { questionId } = useParams<{ projectId: string; questionId: string }>();
  const { questions } = useProjectContext();
  const draftContent = useChatStore((s) => s.draftContent);

  const currentQuestion = questions.find((q) => q.id === questionId);
  const [isCompleted, setIsCompleted] = useState(
    currentQuestion?.is_completed ?? false,
  );
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setIsCompleted(currentQuestion?.is_completed ?? false);
  }, [currentQuestion?.is_completed]);

  useEffect(() => {
    setIsEditing(false);
  }, [questionId]);

  const toggleComplete = useToggleComplete();
  const saveAnswer = useSaveAnswer({
    onSuccess: () => {
      useChatStore.getState().setDraftContent(editValue);
      setIsEditing(false);
    },
  });

  const displayContent = isEditing ? editValue : draftContent;
  const charCount = displayContent?.length || 0;

  const handleToggleComplete = () => {
    const prev = isCompleted;
    setIsCompleted(!prev);
    toggleComplete.mutate(undefined, {
      onSuccess: () => {
        showToast.success(
          !prev ? "작성완료 처리되었습니다." : "작성완료가 해제되었습니다.",
        );
      },
      onError: () => setIsCompleted(prev),
    });
  };

  const handleEdit = () => {
    setEditValue(draftContent || "");
    setIsEditing(true);
    setTimeout(() => textareaRef.current?.focus(), 0);
  };

  const handleSave = () => {
    saveAnswer.mutate(editValue);
  };

  return (
    <div className="flex-1 flex flex-col gap-8 px-7 pt-5 pb-8 overflow-hidden">
      {/* 글자수 카운터 + 완료 토글 */}
      <div className="flex items-center justify-between">
        <div className="shrink-0">
          <span className="text-body-5-5 text-gray-400 opacity-60">
            {charCount} / {maxLength || 1000}
          </span>
        </div>

        <CompleteToggleButton
          isCompleted={isCompleted}
          onClick={handleToggleComplete}
          disabled={toggleComplete.isPending}
        />
      </div>

      {/* 내용 */}
      <div className="flex-1 overflow-y-auto">
        {isEditing ? (
          <textarea
            ref={textareaRef}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            className="w-full h-full text-body-6-1 text-gray-400 whitespace-pre-wrap resize-none outline-none bg-transparent"
          />
        ) : draftContent ? (
          <p className="text-body-6-1 text-gray-400 whitespace-pre-wrap">
            {draftContent}
          </p>
        ) : (
          <p className="text-body-5-5 text-gray-200">
            아직 작성된 자기소개서가 없어요.
            <br />
            경험을 선택하고 초안을 생성해보세요!
          </p>
        )}
      </div>

      {/* 하단 버튼 */}
      {draftContent && (
        <>
          {isEditing ? (
            <button
              type="button"
              onClick={handleSave}
              disabled={saveAnswer.isPending}
              className="w-full h-11.25 flex items-center justify-center rounded-3.5 bg-primary-100 text-white text-body-5-2 cursor-pointer transition-colors hover:bg-primary-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              {saveAnswer.isPending ? "저장 중..." : "저장하기"}
            </button>
          ) : (
            <button
              type="button"
              onClick={handleEdit}
              className="w-full h-11.25 flex items-center justify-center rounded-3.5 bg-primary-60 text-primary-200 text-body-5-2 cursor-pointer transition-colors hover:bg-primary-70"
            >
              수정하기
            </button>
          )}
        </>
      )}
    </div>
  );
}
