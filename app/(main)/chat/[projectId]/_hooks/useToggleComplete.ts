import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { toggleQuestionComplete } from "@/app/_actions/projects";
import { showToast } from "@/libs/toast";

interface UseToggleCompleteOptions {
  initialCompleted: boolean;
}

export function useToggleComplete({
  initialCompleted,
}: UseToggleCompleteOptions) {
  const { projectId, questionId } = useParams<{
    projectId: string;
    questionId: string;
  }>();

  const [isCompleted, setIsCompleted] = useState(initialCompleted);

  useEffect(() => {
    setIsCompleted(initialCompleted);
  }, [initialCompleted]);

  const mutation = useMutation({
    mutationFn: () => toggleQuestionComplete(projectId, questionId),
  });

  const toggle = () => {
    setIsCompleted((prev) => !prev);
    mutation.mutate(undefined, {
      onSuccess: () => {
        showToast.success(
          !isCompleted
            ? "작성완료 처리되었습니다."
            : "작성완료가 해제되었습니다.",
        );
      },
      onError: () => {
        setIsCompleted(isCompleted);
        showToast.error("작성완료 상태 변경에 실패했습니다.");
      },
    });
  };

  return { isCompleted, toggle, isPending: mutation.isPending };
}
