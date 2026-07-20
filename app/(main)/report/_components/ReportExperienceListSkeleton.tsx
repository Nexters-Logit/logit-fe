import { ReportExperienceRowSkeleton } from "./ReportExperienceRowSkeleton";

export function ReportExperienceListSkeleton() {
  return (
    <div className="mt-5">
      <div className="flex items-center justify-between py-2.5 border-b border-gray-100">
        <div className="flex gap-6">
          <div className="w-48 h-4 bg-gray-50 rounded animate-pulse" />
          <div className="w-16 h-4 bg-gray-50 rounded animate-pulse" />
          <div className="w-20 h-4 bg-gray-50 rounded animate-pulse" />
        </div>
        <div className="w-20 h-4 bg-gray-50 rounded animate-pulse" />
      </div>
      {[1, 2, 3, 4].map((i) => (
        <ReportExperienceRowSkeleton key={i} />
      ))}
    </div>
  );
}
