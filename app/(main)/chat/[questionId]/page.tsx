import { Header } from '@/components/common/Header';

interface ChatPageProps {
  params: Promise<{
    questionId: string;
  }>;
}

export default async function ChatPage({ params }: ChatPageProps) {
  const { questionId } = await params;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

      <main className="flex-1 flex">
        {/* 왼쪽: 채팅 영역 */}
        <div className="flex-1 flex flex-col">
          {/* 프로젝트 정보 */}
          <div className="px-7.5 py-4 border-b border-gray-70">
            <p className="text-body-7-3 text-gray-200">
              Question ID: {questionId}
            </p>
          </div>

          {/* 채팅 메시지 영역 (Phase 6에서 구현) */}
          <div className="flex-1 p-7.5">
            <p className="text-body-5-5 text-gray-300">
              채팅 영역 - Phase 6에서 구현 예정
            </p>
          </div>

          {/* 입력창 (Phase 6에서 구현) */}
          <div className="p-7.5 border-t border-gray-70">
            <p className="text-body-5-5 text-gray-300">
              입력창 - Phase 6에서 구현 예정
            </p>
          </div>
        </div>

        {/* 오른쪽: 사이드 패널 */}
        <aside className="w-80 border-l border-gray-70 flex flex-col">
          {/* 패널 탭 (Phase 5에서 구현) */}
          <div className="p-4 border-b border-gray-70">
            <p className="text-body-5-5 text-gray-300">
              패널 탭 - Phase 5에서 구현 예정
            </p>
          </div>

          {/* 패널 콘텐츠 */}
          <div className="flex-1 p-4">
            <p className="text-body-5-5 text-gray-300">
              경험 목록 / 자기소개서 - Phase 5에서 구현 예정
            </p>
          </div>
        </aside>
      </main>
    </div>
  );
}
