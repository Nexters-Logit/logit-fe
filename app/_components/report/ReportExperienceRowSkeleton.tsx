export function ReportExperienceRowSkeleton() {
  return (
    <div className="flex items-center justify-between py-3.5 border-b border-gray-70 w-full">
      <div className="flex items-center gap-6">
        <div className="w-40 h-5 bg-gray-50 rounded animate-pulse shrink-0" />
        <div className="w-20 h-5 bg-gray-50 rounded animate-pulse shrink-0" />
        <div className="w-28 h-5 bg-gray-50 rounded animate-pulse shrink-0" />
      </div>
      <div className="w-24 h-5 bg-gray-50 rounded animate-pulse shrink-0" />
    </div>
  );
}
