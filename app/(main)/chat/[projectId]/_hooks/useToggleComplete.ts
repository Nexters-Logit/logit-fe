import { useMutation } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { toggleQuestionComplete } from "@/app/_actions/projects";
import { showToast } from "@/libs/toast";

export function useToggleComplete() {
  const { projectId, questionId } = useParams<{
    projectId: string;
    questionId: string;
  }>();

  return useMutation({
    mutationFn: () => toggleQuestionComplete(projectId, questionId),
    onError: () => {
      showToast.error("작성완료 상태 변경에 실패했습니다.");
    },
  });
}
