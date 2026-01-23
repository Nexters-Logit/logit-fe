'use client';

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
    <div className="px-7.5 py-3 border-b border-gray-70 flex items-center gap-2 overflow-x-auto">
      {questions.map((question, index) => {
        const isActive = question.id === activeQuestionId;
        return (
          <button
            key={question.id}
            onClick={() => onQuestionChange(question.id)}
            className={`px-4 py-2 rounded-lg text-body-5-5 whitespace-nowrap transition-colors ${
              isActive
                ? 'bg-primary-100 text-white'
                : 'bg-gray-50 text-gray-300 hover:bg-gray-70'
            }`}
          >
            문항 {index + 1}
          </button>
        );
      })}
      <button className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-300 hover:bg-gray-70 transition-colors shrink-0">
        <span className="text-lg">+</span>
      </button>
    </div>
  );
}
