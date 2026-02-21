import { useMutation } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { updateQuestion } from "@/app/_actions/projects";
import { showToast } from "@/libs/toast";

interface UseSaveAnswerOptions {
  onSuccess?: () => void;
}

export function useSaveAnswer({ onSuccess }: UseSaveAnswerOptions = {}) {
  const { projectId, questionId } = useParams<{
    projectId: string;
    questionId: string;
  }>();

  return useMutation({
    mutationFn: (answer: string) =>
      updateQuestion(projectId, questionId, { answer }),
    onSuccess: () => {
      showToast.success("자기소개서가 저장되었습니다.");
      onSuccess?.();
    },
    onError: () => {
      showToast.error("자기소개서 저장에 실패했습니다.");
    },
  });
}
