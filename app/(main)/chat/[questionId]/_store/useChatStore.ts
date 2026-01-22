import { create } from 'zustand';
import type { PanelTab } from '@/types/chat';

const MAX_SELECTION = 3;

interface ChatStore {
  // 경험 선택 (최대 3개)
  selectedExperienceIds: string[];
  selectExperience: (id: string) => void;
  deselectExperience: (id: string) => void;
  clearSelection: () => void;

  // 패널 탭 상태
  activePanelTab: PanelTab;
  setActivePanelTab: (tab: PanelTab) => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  // 경험 선택 상태
  selectedExperienceIds: [],

  selectExperience: (id) =>
    set((state) => {
      if (state.selectedExperienceIds.length >= MAX_SELECTION) {
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

  clearSelection: () =>
    set({
      selectedExperienceIds: [],
    }),

  // 패널 탭 상태
  activePanelTab: 'EXPERIENCES',

  setActivePanelTab: (tab) =>
    set({
      activePanelTab: tab,
    }),
}));
