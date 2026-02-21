"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useProjectContext } from "../../_context";
import { useChatStore } from "../../_store/useChatStore";
import { ChatProjectSummary } from "./ChatProjectSummary";
import { ChatQuestionTabs } from "./ChatQuestionTabs";
import { ManageQuestionsModal } from "../ManageQuestionsModal";
import { AddQuestionModal } from "../AddQuestionModal";
import { DeleteQuestionDialog } from "../DeleteQuestionDialog";
import { deleteQuestion } from "@/app/_actions/projects";
import { showToast } from "@/libs/toast";

export function ChatHeader() {
  const router = useRouter();
  const { questionId } = useParams<{ projectId: string; questionId: string }>();
  const { projectId, company, jobPosition, dueDate, questions } =
    useProjectContext();

  const clearSelection = useChatStore((s) => s.clearSelection);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const currentQuestion = questions.find((q) => q.id === questionId);
  const currentQuestionText = currentQuestion?.question ?? "";

  const handleQuestionChange = (newQuestionId: string) => {
    clearSelection();
    router.push(`/chat/${projectId}/${newQuestionId}`);
  };

  const handleDeleteConfirm = () => {
    // TODO: 마지막 문항 삭제 시 프로젝트 삭제 or 프로젝트 목록으로 이동 등 정책 결정 필요
    const otherQuestion = questions.find((q) => q.id !== questionId);
    if (!otherQuestion) {
      setIsDeleteDialogOpen(false);
      showToast.error("마지막 문항은 삭제할 수 없습니다.");
      return;
    }

    setIsDeleteDialogOpen(false);
    handleQuestionChange(otherQuestion.id);

    deleteQuestion(projectId, questionId)
      .then(() => {
        showToast.success("문항이 삭제되었습니다.");
      })
      .catch(() => {
        showToast.error(
          "문항 삭제 중 오류가 발생했습니다. 페이지를 새로고침합니다.",
        );
        router.refresh();
      });
  };

  return (
    <>
      <div className="flex flex-col gap-5 shrink-0">
        <ChatProjectSummary
          company={company}
          jobPosition={jobPosition}
          dueDate={dueDate}
          onEdit={() => setIsEditModalOpen(true)}
          onDelete={() => setIsDeleteDialogOpen(true)}
        />
        <ChatQuestionTabs
          questions={questions}
          activeQuestionId={questionId}
          onQuestionChange={handleQuestionChange}
          onAddClick={() => setIsAddModalOpen(true)}
        />
      </div>
      <h1 className="text-title-3 text-gray-400 break-keep">
        {currentQuestionText}
      </h1>

      <ManageQuestionsModal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        projectId={projectId}
        questions={questions}
        currentQuestionId={questionId}
        onQuestionChange={handleQuestionChange}
      />

      <AddQuestionModal
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        projectId={projectId}
        onQuestionCreated={handleQuestionChange}
      />

      <DeleteQuestionDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
      />
    </>
  );
}
