'use client';

import { useChatStore } from '../_store/useChatStore';

interface DraftPanelProps {
  maxLength?: number;
}

export function DraftPanel({ maxLength }: DraftPanelProps) {
  const draftContent = useChatStore((s) => s.draftContent);
  const charCount = draftContent?.length || 0;

  return (
    <div className="flex-1 flex flex-col gap-8 px-7 pt-5 pb-8 overflow-hidden">
      {/* 글자수 카운터 */}
      <div className="shrink-0">
        <span className="text-body-5-5 text-gray-400 opacity-60">
          {charCount} / {maxLength || 1000}
        </span>
      </div>

      {/* 내용 */}
      <div className="flex-1 overflow-y-auto">
        {draftContent ? (
          <p className="text-body-6-1 text-gray-400 whitespace-pre-wrap">
            {draftContent}
          </p>
        ) : (
          <p className="text-body-5-5 text-gray-200">
            아직 작성된 자기소개서가 없어요.
            <br />
            경험을 선택하고 초안을 생성해보세요!
          </p>
        )}
      </div>
    </div>
  );
}
