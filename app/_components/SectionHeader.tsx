import { Button } from "@/components/ui/button";
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
      <Button
        onClick={onClick}
        disabled={isPending}
        className="w-41.25"
      >
        {isPending ? pendingText : buttonText}
      </Button>
    </div>
  );
}
