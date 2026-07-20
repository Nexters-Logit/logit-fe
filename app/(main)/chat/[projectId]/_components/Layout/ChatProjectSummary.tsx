import { ChatProjectSummaryKebab } from "./ChatProjectSummaryKebab";
import { DueBadge } from "@/components/common/DueBadge";

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

export function ChatProjectSummary({
  company,
  jobPosition,
  dueDate,
  onEdit,
  onDelete,
}: ChatProjectSummaryProps) {
  const title = jobPosition ? `${company}_${jobPosition}` : company;

  return (
    <div className="flex items-center justify-between">
      <h1 className="text-headline-1 text-gray-400 font-bold">{title}</h1>
      <div className="flex items-center gap-4.25">
        {dueDate && (
          <span className="text-body-4 text-gray-200 font-medium">
            {formatDate(dueDate)}
          </span>
        )}
        <DueBadge dueDate={dueDate} />
        <ChatProjectSummaryKebab onEdit={onEdit} onDelete={onDelete} />
      </div>
    </div>
  );
}
