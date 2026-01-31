'use client';

import { ReactNode } from 'react';
import { ChatPanelTabs } from './ChatPanelTabs';
import { ExperienceListShell } from '../Experience/ExperienceListShell';
import { DraftPanel } from './DraftPanel';
import { useChatStore } from '../../_store/useChatStore';

interface ChatPanelProps {
  maxLength?: number;
  experienceCards?: ReactNode;
}

export function ChatPanel({ maxLength, experienceCards }: ChatPanelProps) {
  const activeTab = useChatStore((s) => s.activePanelTab);
  const storeMaxLength = useChatStore((s) => s.maxLength);

  const effectiveMaxLength = maxLength ?? storeMaxLength;

  return (
    <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
      <ChatPanelTabs />

      {activeTab === 'EXPERIENCES' ? (
        <ExperienceListShell>{experienceCards}</ExperienceListShell>
      ) : (
        <DraftPanel maxLength={effectiveMaxLength} />
      )}
    </div>
  );
}
