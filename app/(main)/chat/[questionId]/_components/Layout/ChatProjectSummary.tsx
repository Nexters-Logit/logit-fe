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
  // 회사명_직무 형식으로 표시
  const title = jobPosition ? `${company}_${jobPosition}` : company;

  return (
    <div className="flex items-center justify-between">
      <h1 className="text-title-1 text-gray-400 font-bold">{title}</h1>
      {dueDate && (
        <span className="text-body-5-5 text-gray-200 font-medium">
          {dueDate}
        </span>
      )}
    </div>
  );
}
