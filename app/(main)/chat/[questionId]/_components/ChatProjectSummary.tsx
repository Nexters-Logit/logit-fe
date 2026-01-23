interface ChatProjectSummaryProps {
  company: string;
  jobPosition: string;
  dueDate?: string | null;
}

export function ChatProjectSummary({
  company,
  jobPosition,
  dueDate,
}: ChatProjectSummaryProps) {
  return (
    <div className="px-7.5 py-4 border-b border-gray-70">
      <div className="flex items-center gap-3">
        <h1 className="text-title-3 text-gray-400">{company}</h1>
        <span className="text-body-5-5 text-gray-200">{jobPosition}</span>
        {dueDate && (
          <>
            <span className="text-gray-100">•</span>
            <span className="text-body-7-3 text-gray-200">
              마감 {dueDate}
            </span>
          </>
        )}
      </div>
    </div>
  );
}
