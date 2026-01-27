import Image from "next/image";

interface ExperienceCardProps {
  title: string;
  count: number;
  bgColor: string;
  illustration: string;
}

export function ExperienceCard({
  title,
  count,
  bgColor,
  illustration,
}: ExperienceCardProps) {
  return (
    <div
      className={`${bgColor} w-65.25 h-47.5 rounded-5 overflow-hidden relative shrink-0`}
    >
      <div className="p-6.5">
        <h3 className="text-body-1 text-primary-600">{title}</h3>
        <p className="text-body-5-5 text-primary-600 opacity-50">
          관련경험 {count}개
        </p>
      </div>
      <div className="absolute right-0 bottom-0 w-32.5 h-30">
        <Image src={illustration} alt={title} fill className="object-contain" />
      </div>
    </div>
  );
}
