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
      className={`w-full px-6 py-3.5 rounded-3.5 text-body-3-2 text-white transition-colors ${
        hasSelection
          ? 'bg-primary-100 hover:bg-primary-200 cursor-pointer'
          : 'bg-gray-100 cursor-not-allowed'
      }`}
    >
      {hasSelection ? '초안 생성하기' : '경험을 선택해주세요'}
    </button>
  );
}
