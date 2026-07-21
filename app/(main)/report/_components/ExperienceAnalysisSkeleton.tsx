function ChartCardSkeleton() {
  return (
    <div className="flex flex-col shrink-0 w-85.75 h-119.75 rounded-7.5 bg-white p-5">
      {/* 아이콘 */}
      <div className="w-8.5 h-8.5 bg-gray-50 rounded-lg animate-pulse mb-1.5" />
      {/* 제목 */}
      <div className="w-48 h-7 bg-gray-50 rounded animate-pulse mb-1.5" />
      {/* 설명 */}
      <div className="w-64 h-5 bg-gray-50 rounded animate-pulse mb-1" />
      <div className="w-64 h-5 bg-gray-50 rounded animate-pulse mb-1" />
      <div className="w-40 h-5 bg-gray-50 rounded animate-pulse" />
      {/* 차트 영역 */}
      <div className="flex justify-center items-center mb-14 mt-1">
        <div className="w-53 h-45 bg-gray-50 rounded-xl animate-pulse" />
      </div>
      {/* 범례 - 카드 하단에 위치 */}
      <div className="mt-auto grid grid-cols-3 gap-y-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-gray-50 animate-pulse" />
            <div className="w-12 h-3.5 bg-gray-50 rounded animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function ExperienceAnalysisSkeleton() {
  return (
    <section className="mb-16">
      <div className="w-48 h-7 bg-gray-50 rounded animate-pulse mb-5" />
      <div className="flex gap-4 p-5 rounded-7.5 bg-gray-20 border border-gray-70 mx-auto">
        <ChartCardSkeleton />
        <ChartCardSkeleton />
        <ChartCardSkeleton />
      </div>
    </section>
  );
}
