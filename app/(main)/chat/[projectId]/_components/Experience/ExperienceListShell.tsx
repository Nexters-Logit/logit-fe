'use client';

import { ReactNode } from 'react';
import Image from 'next/image';

interface ExperienceListShellProps {
  children: ReactNode;
  onAddClick: () => void;
}

export function ExperienceListShell({ children, onAddClick }: ExperienceListShellProps) {
  return (
    <div className="flex-1 flex flex-col gap-5 pt-5 pb-8 overflow-hidden">
      <p className="text-body-5-5 text-gray-400 opacity-60 px-7">
        반영할 경험카드를 선택하세요 (최대 3개)
      </p>

      <div className="flex-1 flex flex-col gap-7 overflow-y-auto px-7">
        <button
          onClick={onAddClick}
          className="group w-full h-15 flex items-center justify-center gap-2 bg-primary-50 rounded-3.5 hover:bg-primary-60 transition-colors shrink-0 cursor-pointer"
        >
          <Image
            src="/icons/icon-plus-circle.svg"
            alt=""
            width={18}
            height={18}
          />
          <span className="text-body-3-2 text-gray-300 group-hover:text-gray-400 transition-colors">추가하기</span>
        </button>

        {children}
      </div>
    </div>
  );
}
