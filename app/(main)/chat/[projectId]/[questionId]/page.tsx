import { Suspense } from "react";
import {
  ChatPageShell,
  ChatHeader,
  ChatAreaServer,
  ChatAreaSkeleton,
  ExperienceCardsServer,
  ExperienceCardsSkeleton,
  SidePanelClient,
} from "../_components";

interface ChatPageProps {
  params: Promise<{
    projectId: string;
    questionId: string;
  }>;
}

export default async function ChatPage({ params }: ChatPageProps) {
  const { questionId } = await params;

  if (!questionId || questionId === "null") {
    throw new Error("유효하지 않은 문항입니다.");
  }

  return (
    <ChatPageShell
      header={<ChatHeader />}
      chatArea={
        <Suspense fallback={<ChatAreaSkeleton />}>
          <ChatAreaServer questionId={questionId} />
        </Suspense>
      }
      sidePanel={
        <SidePanelClient
          experienceCards={
            <Suspense fallback={<ExperienceCardsSkeleton />}>
              <ExperienceCardsServer questionId={questionId} />
            </Suspense>
          }
        />
      }
    />
  );
}
