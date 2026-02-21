interface DueBadgeProps {
  dueDate: string | null | undefined;
}

function getDueBadgeData(dueDate: string | null | undefined): {
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

export function DueBadge({ dueDate }: DueBadgeProps) {
  const badge = getDueBadgeData(dueDate);

  return (
    <span
      className={`flex items-center justify-center h-7 min-w-12.5 px-2.5 rounded-lg font-semibold text-base leading-140 ${badge.className}`}
    >
      {badge.label}
    </span>
  );
}
