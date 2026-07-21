import Image from "next/image";

interface ExperienceCardProps {
  title: string;
  illustration: string;
}

export function ExperienceCard({ title, illustration }: ExperienceCardProps) {
  return (
    <div className="w-65.25 h-47.5 rounded-5 overflow-hidden shrink-0 select-none">
      <Image
        src={illustration}
        alt={title}
        width={261}
        height={190}
        className="w-full h-full object-cover"
      />
    </div>
  );
}
