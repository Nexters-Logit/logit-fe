'use client';

import { Header } from '@/components/common/Header';
import { ChatLayout } from './ChatLayout';
import { ChatProjectSummary } from './ChatProjectSummary';
import { ChatQuestionTabs } from './ChatQuestionTabs';
import { ChatPanel } from './ChatPanel';
import { useChatStore } from '../_store/useChatStore';
import { useExperiences, useChatHistory } from '../_hooks';
import type { ChatHistoryItem } from '@/types/api';

// 검증된 문항 정보 타입
interface QuestionInfo {
  id: string;
  question: string;
  maxLength: number;
}

interface ChatPageClientProps {
  questionId: string;
  company: string;
  jobPosition: string;
  dueDate?: string;
  questions: QuestionInfo[];
  currentQuestion: QuestionInfo;
  initialChats: ChatHistoryItem[];
}

export function ChatPageClient({
  questionId,
  company,
  jobPosition,
  dueDate,
  questions,
  currentQuestion,
  initialChats,
}: ChatPageClientProps) {
  // Zustand store
  const {
    selectedExperienceIds,
    selectExperience,
    deselectExperience,
    activePanelTab,
    setActivePanelTab,
  } = useChatStore();

  // React Query - 경험 목록
  const { data: experiencesData } = useExperiences();
  const experiences = experiencesData || [];

  // React Query - 채팅 히스토리 (클라이언트 갱신용)
  const { data: chatHistoryData } = useChatHistory(questionId);
  const chats = chatHistoryData?.chats || initialChats;

  // 초안 찾기
  const draftChat = chats.find((c) => c.is_draft);
  const draftContent = draftChat?.content;

  // 초안 생성 핸들러
  const handleGenerateDraft = () => {
    // Phase 6에서 구현 - useChat으로 메시지 전송
    console.log('Generate draft with experiences:', selectedExperienceIds);
  };

  // 문항 변경 핸들러
  const handleQuestionChange = (newQuestionId: string) => {
    window.location.href = `/chat/${newQuestionId}`;
  };

  // 답변 저장 핸들러
  const handleUpdateDraft = () => {
    if (!draftChat) return;
    // Phase 7에서 구현 - useUpdateAnswer mutation
    console.log('Update draft:', draftChat.id);
  };

  return (
    <ChatLayout
      header={<Header />}
      projectSummary={
        <ChatProjectSummary
          company={company}
          jobPosition={jobPosition}
          dueDate={dueDate}
        />
      }
      questionTabs={
        <ChatQuestionTabs
          questions={questions}
          activeQuestionId={questionId}
          onQuestionChange={handleQuestionChange}
        />
      }
      chatArea={
        <div className="p-7.5">
          <p className="text-body-5-5 text-gray-300">
            채팅 영역 - Phase 6에서 구현 예정
          </p>
          <p className="text-body-7-3 text-gray-200 mt-2">
            Question: {currentQuestion.question}
          </p>
          <p className="text-body-7-3 text-gray-200 mt-2">
            히스토리: {chats.length}개 메시지
          </p>
        </div>
      }
      inputArea={
        <div className="p-7.5 border-t border-gray-70">
          <p className="text-body-5-5 text-gray-300">
            입력창 - Phase 6에서 구현 예정
          </p>
        </div>
      }
      sidePanel={
        <ChatPanel
          activeTab={activePanelTab}
          onTabChange={setActivePanelTab}
          experiences={experiences}
          selectedExperienceIds={selectedExperienceIds}
          onSelectExperience={selectExperience}
          onDeselectExperience={deselectExperience}
          onGenerateDraft={handleGenerateDraft}
          draftContent={draftContent}
          maxLength={currentQuestion.maxLength}
          onUpdateDraft={draftContent ? handleUpdateDraft : undefined}
        />
      }
    />
  );
}
