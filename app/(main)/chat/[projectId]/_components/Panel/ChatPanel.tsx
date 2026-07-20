'use client';

import { useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { ChatPanelTabs } from './ChatPanelTabs';
import { ExperienceListShell } from '../Experience/ExperienceListShell';
import { DraftPanel } from './DraftPanel';
import { useChatStore } from '../../_store/useChatStore';
import { ExperienceModal } from '@/components/common/ExperienceModal';

interface ChatPanelProps {
  maxLength?: number;
  experienceCards?: ReactNode;
}

export function ChatPanel({ maxLength, experienceCards }: ChatPanelProps) {
  const router = useRouter();
  const activeTab = useChatStore((s) => s.activePanelTab);
  const storeMaxLength = useChatStore((s) => s.maxLength);
  const setScrollTargetExperienceId = useChatStore((s) => s.setScrollTargetExperienceId);
  const [isExperienceModalOpen, setIsExperienceModalOpen] = useState(false);

  const effectiveMaxLength = maxLength ?? storeMaxLength;

  const handleExperienceCreated = (createdId?: string) => {
    router.refresh();
    if (createdId) {
      setScrollTargetExperienceId(createdId);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
      <ChatPanelTabs />

      {activeTab === 'EXPERIENCES' ? (
        <ExperienceListShell onAddClick={() => setIsExperienceModalOpen(true)}>
          {experienceCards}
        </ExperienceListShell>
      ) : (
        <DraftPanel maxLength={effectiveMaxLength} />
      )}

      <ExperienceModal
        open={isExperienceModalOpen}
        onOpenChange={setIsExperienceModalOpen}
        onSuccess={handleExperienceCreated}
      />
    </div>
  );
}
