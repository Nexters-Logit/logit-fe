'use client';

interface DraftPanelProps {
  content?: string;
  maxLength?: number;
  onUpdate?: () => void;
}

export function DraftPanel({ content, maxLength, onUpdate }: DraftPanelProps) {
  const charCount = content?.length || 0;

  if (!content) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <p className="text-body-5-5 text-gray-200 text-center">
          아직 작성된 자기소개서가 없어요.
          <br />
          경험을 선택하고 초안을 생성해보세요!
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* 글자수 카운터 */}
      <div className="px-4 py-3 border-b border-gray-70 flex items-center justify-between">
        <span className="text-body-7-3 text-gray-300">
          {maxLength ? `${charCount} / ${maxLength}` : `${charCount}자`}
        </span>
        {onUpdate && (
          <button
            onClick={onUpdate}
            className="px-3 py-1.5 bg-primary-100 text-white text-body-7-3 rounded-lg hover:bg-primary-200 transition-colors"
          >
            답변으로 저장
          </button>
        )}
      </div>

      {/* 내용 */}
      <div className="flex-1 overflow-y-auto p-4">
        <p className="text-body-5-5 text-gray-400 whitespace-pre-wrap">
          {content}
        </p>
      </div>
    </div>
  );
}
