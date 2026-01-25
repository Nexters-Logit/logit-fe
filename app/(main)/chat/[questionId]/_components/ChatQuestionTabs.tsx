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
}

export function ChatQuestionTabs({
  questions,
  activeQuestionId,
  onQuestionChange,
}: ChatQuestionTabsProps) {
  return (
    <div className="flex items-center gap-8">
      {questions.map((question, index) => {
        const isActive = question.id === activeQuestionId;
        return (
          <button
            key={question.id}
            onClick={() => onQuestionChange(question.id)}
            className={`flex flex-col items-center gap-3 h-12 justify-end transition-colors cursor-pointer ${
              isActive ? 'text-primary-100' : 'text-gray-400'
            }`}
          >
            <span className="text-body-3-3">Q{index + 1}</span>
            <div
              className={`h-0.5 w-full transition-colors ${
                isActive ? 'bg-primary-100' : 'bg-transparent'
              }`}
            />
          </button>
        );
      })}
      <button className="flex items-center justify-center text-gray-300 hover:text-gray-400 transition-colors shrink-0 cursor-pointer">
        <Plus className="w-4.5 h-4.5" strokeWidth={2} />
      </button>
    </div>
  );
}
