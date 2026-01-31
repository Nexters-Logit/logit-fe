'use client';

import { ReactNode } from 'react';

interface ExperienceListShellProps {
  children: ReactNode;
}

export function ExperienceListShell({ children }: ExperienceListShellProps) {
  return (
    <div className="flex-1 flex flex-col gap-5 pt-5 pb-8 overflow-hidden">
      <p className="text-body-5-5 text-gray-400 opacity-60 px-7">
        반영할 경험카드를 선택하세요 (최대 3개)
      </p>

      <div className="flex-1 flex flex-col gap-7 overflow-y-auto px-7">
        <button className="w-full h-15 flex items-center justify-center bg-primary-50 rounded-3.5 hover:bg-primary-70 transition-colors shrink-0 cursor-pointer">
          <span className="text-body-3-2 text-gray-300">+추가하기</span>
        </button>

        {children}
      </div>
    </div>
  );
}
