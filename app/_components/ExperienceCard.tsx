import Image from "next/image";

interface ExperienceCardProps {
  title: string;
  illustration: string;
}

export function ExperienceCard({ title, illustration }: ExperienceCardProps) {
  return (
    <div className="w-full lg:w-65.25 aspect-[261/190] rounded-5 overflow-hidden shrink-0 select-none">
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
