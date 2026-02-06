import type { ProjectListItem } from "@/types/api";
import Image from "next/image";

function getStableDday(seed: string): number {
  const hash = seed.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return (hash % 7) + 1;
}

function getRandomStatus(seed: string): number {
  const hash = seed.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return hash % 2;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}.${month}.${day}`;
}

interface ProjectRowProps {
  project: ProjectListItem;
  onClick: () => void;
}

export function ProjectRow({ project, onClick }: ProjectRowProps) {
  const title = `${project.company}_${project.job_position}`;
  const date = formatDate(project.updated_at);

  const dDay = getStableDday(project.id);
  return (
    <div
      onClick={onClick}
      className={`flex items-center justify-between py-3.5 border-b border-gray-70 w-full cursor-pointer hover:bg-gray-20 transition-colors`}
    >
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-6">
          <span className="regular_14 text-gray-200">{date}</span>
          <div className="w-[50px] h-[28px] bg-primary-20 rounded-lg flex items-center justify-center semibold_16 text-primary-200">
            D-{dDay}
          </div>
          <span className="text-body-5-5 text-primary-600">{title}</span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span>{getRandomStatus(project.id)} / 3</span>
            {getRandomStatus(project.id) === 0 ? (
              <Image
                src="/icons/editing.svg"
                alt="edit"
                width={32}
                height={32}
              />
            ) : (
              <Image
                src="/icons/editComlete.svg"
                alt="editComplete"
                width={32}
                height={32}
              />
            )}
          </div>
          <Image src="/icons/kebab.svg" alt="kebab" width={3} height={3} />
        </div>
      </div>
    </div>
  );
}
