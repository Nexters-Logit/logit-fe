export default function ChatLoading() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header Skeleton */}
      <header className="h-16 border-b border-gray-70 flex items-center px-7.5">
        <div className="h-8 w-24 bg-gray-50 rounded animate-pulse" />
      </header>

      <main className="flex-1 flex">
        {/* 왼쪽: 채팅 영역 */}
        <div className="flex-1 flex flex-col">
          {/* 프로젝트 정보 Skeleton */}
          <div className="px-7.5 py-4 border-b border-gray-70">
            <div className="h-5 w-32 bg-gray-50 rounded animate-pulse" />
            <div className="h-4 w-48 bg-gray-50 rounded animate-pulse mt-2" />
          </div>

          {/* 문항 탭 Skeleton */}
          <div className="px-7.5 py-3 border-b border-gray-70 flex gap-2">
            <div className="h-10 w-20 bg-gray-50 rounded-lg animate-pulse" />
            <div className="h-10 w-20 bg-gray-50 rounded-lg animate-pulse" />
            <div className="h-10 w-8 bg-gray-50 rounded-lg animate-pulse" />
          </div>

          {/* 채팅 메시지 영역 Skeleton */}
          <div className="flex-1 p-7.5 space-y-6">
            {/* AI 메시지 */}
            <div className="flex gap-3">
              <div className="w-8 h-8 bg-gray-50 rounded-full animate-pulse shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-3/4 bg-gray-50 rounded animate-pulse" />
                <div className="h-4 w-1/2 bg-gray-50 rounded animate-pulse" />
              </div>
            </div>

            {/* 사용자 메시지 */}
            <div className="flex justify-end">
              <div className="h-12 w-48 bg-gray-50 rounded-lg animate-pulse" />
            </div>

            {/* AI 메시지 */}
            <div className="flex gap-3">
              <div className="w-8 h-8 bg-gray-50 rounded-full animate-pulse shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-full bg-gray-50 rounded animate-pulse" />
                <div className="h-4 w-5/6 bg-gray-50 rounded animate-pulse" />
                <div className="h-4 w-2/3 bg-gray-50 rounded animate-pulse" />
              </div>
            </div>
          </div>

          {/* 입력창 Skeleton */}
          <div className="p-7.5 border-t border-gray-70">
            <div className="h-12 bg-gray-50 rounded-xl animate-pulse" />
          </div>
        </div>

        {/* 오른쪽: 사이드 패널 Skeleton */}
        <aside className="w-80 border-l border-gray-70 flex flex-col">
          {/* 탭 Skeleton */}
          <div className="p-4 border-b border-gray-70 flex gap-2">
            <div className="h-10 flex-1 bg-gray-50 rounded-lg animate-pulse" />
            <div className="h-10 flex-1 bg-gray-50 rounded-lg animate-pulse" />
          </div>

          {/* 경험 목록 Skeleton */}
          <div className="flex-1 p-4 space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="p-4 border border-gray-70 rounded-xl animate-pulse"
              >
                <div className="flex gap-3">
                  <div className="w-10 h-10 bg-gray-50 rounded-lg shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-3/4 bg-gray-50 rounded" />
                    <div className="h-3 w-1/2 bg-gray-50 rounded" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 버튼 Skeleton */}
          <div className="p-4 border-t border-gray-70">
            <div className="h-12 bg-gray-50 rounded-xl animate-pulse" />
          </div>
        </aside>
      </main>
    </div>
  );
}
