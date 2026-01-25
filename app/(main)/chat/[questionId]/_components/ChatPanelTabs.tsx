'use client';

import { List, FileText } from 'lucide-react';
import type { PanelTab } from '@/types/chat';

interface ChatPanelTabsProps {
  activeTab: PanelTab;
  onTabChange: (tab: PanelTab) => void;
}

export function ChatPanelTabs({ activeTab, onTabChange }: ChatPanelTabsProps) {
  return (
    <div className="flex items-center gap-9 px-7 pt-10 shrink-0">
      <button
        onClick={() => onTabChange('EXPERIENCES')}
        className={`flex items-center gap-1 transition-colors cursor-pointer ${
          activeTab === 'EXPERIENCES'
            ? 'text-gray-400'
            : 'text-gray-100 hover:text-gray-200'
        }`}
      >
        <List className="w-6 h-6" />
        <span className="text-body-1">경험 목록</span>
      </button>
      <button
        onClick={() => onTabChange('DRAFT')}
        className={`flex items-center gap-1 transition-colors cursor-pointer ${
          activeTab === 'DRAFT'
            ? 'text-gray-400'
            : 'text-gray-100 hover:text-gray-200'
        }`}
      >
        <FileText className="w-6 h-6" />
        <span className="text-body-1">자기소개서</span>
      </button>
    </div>
  );
}
