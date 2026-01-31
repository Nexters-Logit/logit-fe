import { ReactNode } from "react";

interface ChatPageShellProps {
  chatArea: ReactNode;
  sidePanel: ReactNode;
}

export function ChatPageShell({ chatArea, sidePanel }: ChatPageShellProps) {
  return (
    <main className="flex-1 flex overflow-hidden px-7.5 py-7.5 gap-7.5 mx-auto w-360">
      {/* 왼쪽: 채팅 영역 */}
      <div className="flex-1 flex flex-col min-w-0 gap-7.5 overflow-hidden ">
        {chatArea}
      </div>

      {/* 오른쪽: 사이드 패널 */}
      <aside className="w-103.5 bg-gray-20 border border-gray-70 rounded-7.5 flex flex-col shrink-0 overflow-hidden">
        {sidePanel}
      </aside>
    </main>
  );
}
