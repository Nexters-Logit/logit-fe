export function ExperienceCardsSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="w-full px-6 py-5 border border-gray-70 rounded-3.5 bg-white"
        >
          <div className="flex flex-col gap-4">
            {/* 제목 + 점수 */}
            <div className="flex items-start justify-between">
              <div className="h-4.25 w-62.5 bg-gray-50 rounded animate-pulse" />
              <div className="h-4 w-8 bg-gray-50 rounded animate-pulse" />
            </div>

            {/* 태그들 */}
            <div className="flex gap-1.5">
              <div className="h-6.5 w-16 bg-gray-50 rounded-2 animate-pulse" />
              <div className="h-6.5 w-14 bg-gray-50 rounded-2 animate-pulse" />
              <div className="h-6.5 w-14 bg-gray-50 rounded-2 animate-pulse" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
