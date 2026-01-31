"use client";

import { useParams, useRouter } from "next/navigation";
import { useProjectContext } from "../../_context";
import { ChatProjectSummary } from "./ChatProjectSummary";
import { ChatQuestionTabs } from "./ChatQuestionTabs";

export function ChatHeader() {
  const router = useRouter();
  const { questionId } = useParams<{ projectId: string; questionId: string }>();
  const { projectId, company, jobPosition, questions } = useProjectContext();

  const currentQuestion = questions.find((q) => q.id === questionId);
  const currentQuestionText = currentQuestion?.question ?? "";

  const handleQuestionChange = (newQuestionId: string) => {
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
        />
      </div>
      <h1 className="text-title-3 text-gray-400">{currentQuestionText}</h1>
    </>
  );
}
