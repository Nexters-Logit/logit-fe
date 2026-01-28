'use client';

import { useEffect, useRef } from 'react';
import { useChatStore } from '../_store/useChatStore';
import type { Experience } from '@/types/api';

interface UseSyncChatStoreOptions {
  experiences?: Experience[];
  draftContent?: string | null;
  generateDraft?: () => void;
  initialExperienceIds?: string[];
}

/**
 * React Query 데이터와 Zustand 스토어를 동기화하는 훅
 * 각 필드는 optional - 전달된 필드만 동기화됨
 */
export function useSyncChatStore({
  experiences,
  draftContent,
  generateDraft,
  initialExperienceIds,
}: UseSyncChatStoreOptions) {
  const setExperiences = useChatStore((s) => s.setExperiences);
  const setDraftContent = useChatStore((s) => s.setDraftContent);
  const setGenerateDraft = useChatStore((s) => s.setGenerateDraft);
  const setSelectedExperienceIds = useChatStore(
    (s) => s.setSelectedExperienceIds
  );

  // 초기 experienceIds는 마운트 시 한 번만 설정
  const isInitialized = useRef(false);
  useEffect(() => {
    if (!isInitialized.current && initialExperienceIds !== undefined) {
      setSelectedExperienceIds(initialExperienceIds);
      isInitialized.current = true;
    }
  }, [initialExperienceIds, setSelectedExperienceIds]);

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
