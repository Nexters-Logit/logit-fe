export function ChatAreaSkeleton() {
  return (
    <>
      {/* 채팅 메시지 영역 Skeleton */}
      <div className="flex-1 min-h-0 overflow-hidden flex flex-col gap-10 py-4">
        <div className="flex gap-5">
          <div className="w-8.5 h-8.5 bg-gray-50 rounded-full animate-pulse shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-3/4 bg-gray-50 rounded animate-pulse" />
            <div className="h-4 w-1/2 bg-gray-50 rounded animate-pulse" />
          </div>
        </div>
      </div>

      {/* 입력창 Skeleton */}
      <div className="shrink-0">
        <div className="h-12 bg-gray-50 rounded-xl animate-pulse" />
      </div>
    </>
  );
}
