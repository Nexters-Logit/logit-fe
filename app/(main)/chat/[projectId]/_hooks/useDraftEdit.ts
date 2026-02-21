import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { useChatStore } from "../_store/useChatStore";
import { useSaveAnswer } from "./useSaveAnswer";

export function useDraftEdit() {
  const { questionId } = useParams<{
    projectId: string;
    questionId: string;
  }>();

  const draftContent = useChatStore((s) => s.draftContent);
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setIsEditing(false);
  }, [questionId]);

  useEffect(() => {
    if (isEditing) {
      textareaRef.current?.focus();
    }
  }, [isEditing]);

  const saveAnswer = useSaveAnswer({
    onSuccess: () => {
      useChatStore.getState().setDraftContent(editValue);
      setIsEditing(false);
    },
  });

  const startEdit = () => {
    setEditValue(draftContent || "");
    setIsEditing(true);
  };

  const save = () => {
    saveAnswer.mutate(editValue);
  };

  const displayContent = isEditing ? editValue : draftContent;

  return {
    isEditing,
    editValue,
    setEditValue,
    textareaRef,
    startEdit,
    save,
    isSaving: saveAnswer.isPending,
    draftContent,
    displayContent,
  };
}
