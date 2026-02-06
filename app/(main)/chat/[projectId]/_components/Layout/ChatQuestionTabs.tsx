'use client';

import { Plus } from 'lucide-react';

interface QuestionTabItem {
  id: string;
  question: string;
}

interface ChatQuestionTabsProps {
  questions: QuestionTabItem[];
  activeQuestionId: string;
  onQuestionChange: (questionId: string) => void;
  onAddClick: () => void;
}

export function ChatQuestionTabs({
  questions,
  activeQuestionId,
  onQuestionChange,
  onAddClick,
}: ChatQuestionTabsProps) {
  return (
    <div className="flex items-center gap-2">
      {questions.map((question, index) => {
        const isActive = question.id === activeQuestionId;
        return (
          <button
            key={question.id}
            onClick={() => onQuestionChange(question.id)}
            className={`h-10 px-4.5 flex items-center justify-center rounded-3.5 border transition-colors cursor-pointer ${
              isActive
                ? 'bg-primary-20 border-primary-100 text-primary-100 font-bold hover:bg-primary-50'
                : 'bg-white border-gray-100 text-gray-300 font-normal hover:bg-gray-20'
            }`}
          >
            <span className="text-body-5-1 leading-140">Q{index + 1}</span>
          </button>
        );
      })}
      <button
        onClick={onAddClick}
        className="size-10 flex items-center justify-center border border-gray-100 rounded-3.5 hover:bg-gray-20 transition-colors shrink-0 cursor-pointer"
      >
        <Plus className="size-4.5 text-gray-300" strokeWidth={2} />
      </button>
    </div>
  );
}
