import { create } from 'zustand';
import type { PanelTab } from '@/types/chat';
import type { Experience } from '@/types/api';
import { MAX_EXPERIENCE_SELECTION } from '../_constants';

interface ChatStore {
  // 경험 목록
  experiences: Experience[];
  setExperiences: (experiences: Experience[]) => void;

  // 경험 선택 (최대 3개)
  selectedExperienceIds: string[];
  setSelectedExperienceIds: (ids: string[]) => void;
  selectExperience: (id: string) => void;
  deselectExperience: (id: string) => void;
  toggleExperience: (id: string) => void;
  clearSelection: () => void;

  // 패널 탭 상태
  activePanelTab: PanelTab;
  setActivePanelTab: (tab: PanelTab) => void;

  // 자기소개서 초안
  draftContent: string | null;
  setDraftContent: (content: string | null) => void;

  // 초안 생성 핸들러 (외부에서 주입)
  generateDraft: (() => void) | null;
  setGenerateDraft: (handler: () => void) => void;

  // 문항 최대 글자수
  maxLength: number;
  setMaxLength: (length: number) => void;
}

export const useChatStore = create<ChatStore>((set, get) => ({
  // 경험 목록
  experiences: [],
  setExperiences: (experiences) => set({ experiences }),

  // 경험 선택 상태
  selectedExperienceIds: [],

  setSelectedExperienceIds: (ids) =>
    set({ selectedExperienceIds: ids.slice(0, MAX_EXPERIENCE_SELECTION) }),

  selectExperience: (id) =>
    set((state) => {
      if (state.selectedExperienceIds.length >= MAX_EXPERIENCE_SELECTION) {
        return state;
      }
      if (state.selectedExperienceIds.includes(id)) {
        return state;
      }
      return {
        selectedExperienceIds: [...state.selectedExperienceIds, id],
      };
    }),

  deselectExperience: (id) =>
    set((state) => ({
      selectedExperienceIds: state.selectedExperienceIds.filter(
        (existingId) => existingId !== id
      ),
    })),

  toggleExperience: (id) => {
    const state = get();
    if (state.selectedExperienceIds.includes(id)) {
      state.deselectExperience(id);
    } else {
      state.selectExperience(id);
    }
  },

  clearSelection: () => set({ selectedExperienceIds: [] }),

  // 패널 탭 상태
  activePanelTab: 'EXPERIENCES',
  setActivePanelTab: (tab) => set({ activePanelTab: tab }),

  // 자기소개서 초안
  draftContent: null,
  setDraftContent: (content) => set({ draftContent: content }),

  // 초안 생성 핸들러
  generateDraft: null,
  setGenerateDraft: (handler) => set({ generateDraft: handler }),

  // 문항 최대 글자수
  maxLength: 1000,
  setMaxLength: (length) => set({ maxLength: length }),
}));
