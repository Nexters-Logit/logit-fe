export function ProjectRowSkeleton() {
  return (
    <div className="flex items-center justify-between py-3.5 border-b border-gray-70 w-full">
      <div className="flex items-center gap-6">
        <div className="w-1.25 h-8 bg-gray-50 rounded-lg animate-pulse" />
        <div className="w-48 h-5 bg-gray-50 rounded animate-pulse" />
      </div>
      <div className="w-24 h-5 bg-gray-50 rounded animate-pulse" />
    </div>
  );
}
