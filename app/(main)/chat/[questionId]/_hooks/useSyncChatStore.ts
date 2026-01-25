'use client';

import { useEffect } from 'react';
import { useChatStore } from '../_store/useChatStore';
import type { Experience } from '@/types/api';

interface UseSyncChatStoreOptions {
  experiences?: Experience[];
  draftContent?: string | null;
  generateDraft?: () => void;
}

/**
 * React Query 데이터와 Zustand 스토어를 동기화하는 훅
 * 각 필드는 optional - 전달된 필드만 동기화됨
 */
export function useSyncChatStore({
  experiences,
  draftContent,
  generateDraft,
}: UseSyncChatStoreOptions) {
  const setExperiences = useChatStore((s) => s.setExperiences);
  const setDraftContent = useChatStore((s) => s.setDraftContent);
  const setGenerateDraft = useChatStore((s) => s.setGenerateDraft);

  useEffect(() => {
    if (experiences !== undefined) {
      setExperiences(experiences);
    }
  }, [experiences, setExperiences]);

  useEffect(() => {
    if (draftContent !== undefined) {
      setDraftContent(draftContent);
    }
  }, [draftContent, setDraftContent]);

  useEffect(() => {
    if (generateDraft !== undefined) {
      setGenerateDraft(generateDraft);
    }
  }, [generateDraft, setGenerateDraft]);
}
