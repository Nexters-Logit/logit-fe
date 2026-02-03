"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useProjectContext } from "../../_context";
import { useChatStore } from "../../_store/useChatStore";
import { ChatProjectSummary } from "./ChatProjectSummary";
import { ChatQuestionTabs } from "./ChatQuestionTabs";
import { ManageQuestionsModal } from "../ManageQuestionsModal";

export function ChatHeader() {
  const router = useRouter();
  const { questionId } = useParams<{ projectId: string; questionId: string }>();
  const { projectId, company, jobPosition, questions } = useProjectContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const clearSelection = useChatStore((s) => s.clearSelection);

  const currentQuestion = questions.find((q) => q.id === questionId);
  const currentQuestionText = currentQuestion?.question ?? "";

  const handleQuestionChange = (newQuestionId: string) => {
    clearSelection();
    router.push(`/chat/${projectId}/${newQuestionId}`);
  };

  const handleQuestionAdded = (newQuestionId: string) => {
    router.push(`/chat/${projectId}/${newQuestionId}`);
  };

  return (
    <>
      <div className="flex flex-col gap-5 shrink-0">
        <ChatProjectSummary company={company} jobPosition={jobPosition} />
        <ChatQuestionTabs
          questions={questions}
          activeQuestionId={questionId}
          onQuestionChange={handleQuestionChange}
          onAddClick={() => setIsModalOpen(true)}
        />
      </div>
      <h1 className="text-title-3 text-gray-400">{currentQuestionText}</h1>

      <ManageQuestionsModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        projectId={projectId}
        questions={questions}
        onQuestionAdded={handleQuestionAdded}
      />
    </>
  );
}
