import Image from "next/image";
import { getCategoryConfig } from "../../_constants";

interface CategoryTagProps {
  category: string;
}

export function CategoryTag({ category }: CategoryTagProps) {
  const config = getCategoryConfig(category);

  return (
    <div
      className={`flex items-center gap-1.5 h-6.5 px-1.5 rounded-lg ${config.bg}`}
    >
      <Image src={config.icon} alt="" width={11} height={11} />
      <span className="text-body-9-3 text-primary-600">{config.label}</span>
    </div>
  );
}
