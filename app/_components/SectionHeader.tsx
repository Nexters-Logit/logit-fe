interface SectionHeaderProps {
  title: string;
  buttonText: string;
  onClick?: () => void;
  isPending?: boolean;
  pendingText?: string;
}

export function SectionHeader({
  title,
  buttonText,
  onClick,
  isPending,
  pendingText,
}: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between w-full">
      <h2 className="text-title-2-2 text-gray-400">{title}</h2>
      <button
        onClick={onClick}
        disabled={isPending}
        className="bg-primary-100 text-white text-body-3-2 px-6 py-3.5 rounded-3.5 h-11 flex items-center justify-center disabled:opacity-50"
      >
        {isPending ? pendingText : buttonText}
      </button>
    </div>
  );
}
