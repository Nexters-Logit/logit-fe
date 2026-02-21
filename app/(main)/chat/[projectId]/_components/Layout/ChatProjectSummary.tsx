import { ChatProjectSummaryKebab } from "./ChatProjectSummaryKebab";

interface ChatProjectSummaryProps {
  company: string;
  jobPosition: string;
  dueDate?: string | null;
  onEdit: () => void;
  onDelete: () => void;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}.${month}.${day}`;
}

function getDueBadge(dueDate: string | null | undefined): {
  label: string;
  className: string;
} {
  if (!dueDate) {
    return {
      label: "상시",
      className: "bg-primary-20 text-primary-200",
    };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0);
  const diff = Math.ceil(
    (due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (diff < 0) {
    return {
      label: "마감",
      className: "bg-gray-20 text-gray-200",
    };
  }

  return {
    label: diff === 0 ? "D-Day" : `D-${diff}`,
    className: "bg-primary-20 text-primary-200",
  };
}

export function ChatProjectSummary({
  company,
  jobPosition,
  dueDate,
  onEdit,
  onDelete,
}: ChatProjectSummaryProps) {
  const title = jobPosition ? `${company}_${jobPosition}` : company;
  const badge = getDueBadge(dueDate);

  return (
    <div className="flex items-center justify-between">
      <h1 className="text-headline-1 text-gray-400 font-bold">{title}</h1>
      <div className="flex items-center gap-4.25">
        {dueDate && (
          <span className="text-body-4 text-gray-200 font-medium">
            {formatDate(dueDate)}
          </span>
        )}
        <span
          className={`flex items-center justify-center h-7 min-w-12.5 px-2.5 rounded-lg font-semibold text-base leading-140 ${badge.className}`}
        >
          {badge.label}
        </span>
        <ChatProjectSummaryKebab onEdit={onEdit} onDelete={onDelete} />
      </div>
    </div>
  );
}
