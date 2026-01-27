'use client';

import { useChatStore } from '../_store/useChatStore';

export function InitialActionButton() {
  const selectedIds = useChatStore((s) => s.selectedExperienceIds);
  const generateDraft = useChatStore((s) => s.generateDraft);

  const hasSelection = selectedIds.length > 0;

  return (
    <button
      onClick={() => hasSelection && generateDraft?.()}
      disabled={!hasSelection || !generateDraft}
      className={`w-full h-11 rounded-3.5 text-body-3-2 transition-colors ${
        hasSelection
          ? 'bg-primary-100 text-white hover:bg-primary-200 cursor-pointer'
          : 'bg-gray-100 text-white cursor-not-allowed'
      }`}
    >
      경험을 선택해주세요
    </button>
  );
}
