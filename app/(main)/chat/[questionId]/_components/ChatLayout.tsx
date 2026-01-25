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
    <div className="h-screen bg-white flex flex-col overflow-hidden">
      {header}

      <main className="flex-1 flex overflow-hidden px-7.5 py-7.5 gap-7.5">
        {/* 왼쪽: 채팅 영역 */}
        <div className="flex-1 flex flex-col min-w-0 gap-7.5 overflow-hidden">
          {/* 프로젝트 정보 + 문항 탭 */}
          <div className="flex flex-col gap-5 shrink-0">
            {projectSummary}
            {questionTabs}
          </div>

          {/* 채팅 메시지 영역 - Conversation 컴포넌트가 스크롤 관리 */}
          <div className="flex-1 min-h-0 overflow-hidden">{chatArea}</div>

          {/* 입력창 */}
          <div className="shrink-0">{inputArea}</div>
        </div>

        {/* 오른쪽: 사이드 패널 */}
        <aside className="w-103.5 bg-gray-20 border border-gray-70 rounded-7.5 flex flex-col shrink-0 overflow-hidden">
          {sidePanel}
        </aside>
      </main>
    </div>
  );
}
