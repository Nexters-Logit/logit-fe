import type { ProjectListItem } from "@/types/api";

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
  isLoading: boolean;
}

export function ProjectRow({ project, onClick, isLoading }: ProjectRowProps) {
  const title = `${project.company} ${project.job_position} 자기소개서`;
  const date = formatDate(project.updated_at);

  return (
    <div
      onClick={onClick}
      className={`flex items-center justify-between py-3.5 border-b border-gray-70 w-full cursor-pointer hover:bg-gray-20 transition-colors ${
        isLoading ? "opacity-50" : ""
      }`}
    >
      <div className="flex items-center gap-6">
        <div className="w-1.25 h-8 bg-primary-70 rounded-lg" />
        <span className="text-body-5-5 text-primary-600">{title}</span>
      </div>
      <span className="text-body-5-5 text-primary-600">{date}</span>
    </div>
  );
}
