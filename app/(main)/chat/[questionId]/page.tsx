import { Suspense } from 'react';
import { ChatPageShell } from './_components/ChatPageShell';
import { ChatAreaServer } from './_components/ChatAreaServer';
import { ExperienceCardsServer } from './_components/ExperienceCardsServer';
import { SidePanelClient } from './_components/SidePanelClient';
import { ChatAreaSkeleton } from './_components/ChatAreaSkeleton';
import { ExperienceCardsSkeleton } from './_components/ExperienceCardsSkeleton';

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
