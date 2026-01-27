interface HashtagBadgeProps {
  tag: string;
  highlighted: boolean;
}

export function HashtagBadge({ tag, highlighted }: HashtagBadgeProps) {
  return (
    <div
      className={`h-6.5 px-2 rounded-lg ${highlighted ? "bg-primary-50" : "bg-gray-20"}`}
    >
      <span className="text-body-9-3 text-gray-300">{tag}</span>
    </div>
  );
}
