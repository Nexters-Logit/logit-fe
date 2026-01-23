'use client';

import type { PanelTab } from '@/types/chat';

interface ChatPanelTabsProps {
  activeTab: PanelTab;
  onTabChange: (tab: PanelTab) => void;
}

export function ChatPanelTabs({ activeTab, onTabChange }: ChatPanelTabsProps) {
  return (
    <div className="flex border-b border-gray-70">
      <button
        onClick={() => onTabChange('EXPERIENCES')}
        className={`flex-1 py-3 text-body-3-3 text-center transition-colors ${
          activeTab === 'EXPERIENCES'
            ? 'text-primary-200 border-b-2 border-primary-200'
            : 'text-gray-200 hover:text-gray-400'
        }`}
      >
        경험 목록
      </button>
      <button
        onClick={() => onTabChange('DRAFT')}
        className={`flex-1 py-3 text-body-3-3 text-center transition-colors ${
          activeTab === 'DRAFT'
            ? 'text-primary-200 border-b-2 border-primary-200'
            : 'text-gray-200 hover:text-gray-400'
        }`}
      >
        자기소개서
      </button>
    </div>
  );
}
