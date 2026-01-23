'use client';

import { ReactNode } from 'react';

interface ChatLayoutProps {
  header: ReactNode;
  projectSummary: ReactNode;
  questionTabs: ReactNode;
  chatArea: ReactNode;
  inputArea: ReactNode;
  sidePanel: ReactNode;
}

export function ChatLayout({
  header,
  projectSummary,
  questionTabs,
  chatArea,
  inputArea,
  sidePanel,
}: ChatLayoutProps) {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {header}

      <main className="flex-1 flex overflow-hidden">
        {/* 왼쪽: 채팅 영역 */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* 프로젝트 정보 */}
          {projectSummary}

          {/* 문항 탭 */}
          {questionTabs}

          {/* 채팅 메시지 영역 */}
          <div className="flex-1 overflow-y-auto">{chatArea}</div>

          {/* 입력창 */}
          {inputArea}
        </div>

        {/* 오른쪽: 사이드 패널 */}
        <aside className="w-80 border-l border-gray-70 flex flex-col shrink-0">
          {sidePanel}
        </aside>
      </main>
    </div>
  );
}
