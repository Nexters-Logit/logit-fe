'use client';

import type { Experience } from '@/types/api';
import type { PanelTab } from '@/types/chat';
import { ChatPanelTabs } from './ChatPanelTabs';
import { ExperienceList } from './ExperienceList';
import { DraftPanel } from './DraftPanel';

interface ChatPanelProps {
  // 탭 상태
  activeTab: PanelTab;
  onTabChange: (tab: PanelTab) => void;

  // 경험 목록
  experiences: Experience[];
  selectedExperienceIds: string[];
  onSelectExperience: (id: string) => void;
  onDeselectExperience: (id: string) => void;
  onGenerateDraft: () => void;
  isGenerating?: boolean;

  // 자기소개서 (초안)
  draftContent?: string;
  maxLength?: number;
  onUpdateDraft?: () => void;
}

export function ChatPanel({
  activeTab,
  onTabChange,
  experiences,
  selectedExperienceIds,
  onSelectExperience,
  onDeselectExperience,
  onGenerateDraft,
  isGenerating,
  draftContent,
  maxLength,
  onUpdateDraft,
}: ChatPanelProps) {
  return (
    <div className="flex-1 flex flex-col">
      <ChatPanelTabs activeTab={activeTab} onTabChange={onTabChange} />

      {activeTab === 'EXPERIENCES' ? (
        <ExperienceList
          experiences={experiences}
          selectedIds={selectedExperienceIds}
          onSelect={onSelectExperience}
          onDeselect={onDeselectExperience}
          onGenerateDraft={onGenerateDraft}
          isLoading={isGenerating}
        />
      ) : (
        <DraftPanel
          content={draftContent}
          maxLength={maxLength}
          onUpdate={onUpdateDraft}
        />
      )}
    </div>
  );
}
