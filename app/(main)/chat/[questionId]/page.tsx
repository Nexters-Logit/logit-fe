import { Suspense } from 'react';
import {
  ChatPageShell,
  ChatAreaServer,
  ChatAreaSkeleton,
  ExperienceCardsServer,
  ExperienceCardsSkeleton,
  SidePanelClient,
} from './_components';

interface ChatPageProps {
  params: Promise<{
    questionId: string;
  }>;
}

export default async function ChatPage({ params }: ChatPageProps) {
  const { questionId } = await params;

  return (
    <ChatPageShell
      chatArea={
        <Suspense fallback={<ChatAreaSkeleton />}>
          <ChatAreaServer questionId={questionId} />
        </Suspense>
      }
      sidePanel={
        <SidePanelClient
          experienceCards={
            <Suspense fallback={<ExperienceCardsSkeleton />}>
              <ExperienceCardsServer />
            </Suspense>
          }
        />
      }
    />
  );
}
