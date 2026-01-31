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
