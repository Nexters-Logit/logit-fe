"use client";

import { useRouter } from "next/navigation";
import StatusEmpty from "@/components/StatusEmpty";
import type { ProjectListItem } from "@/types/api";
import { ProjectRow } from "./ProjectRow";

interface ProjectListProps {
  projects: ProjectListItem[];
}

export function ProjectList({ projects }: ProjectListProps) {
  const router = useRouter();

  const handleProjectClick = (projectId: string, questionId: string) => {
    router.push(`/chat/${projectId}/${questionId}`);
  };

  if (projects.length === 0) {
    return (
      <div className="mt-5 flex justify-center py-10">
        <StatusEmpty message="생성된 프로젝트가 없어요" />
      </div>
    );
  }

  return (
    <div className="mt-5">
      {projects.map((project) => (
        <ProjectRow
          key={project.id}
          project={project}
          onClick={() => handleProjectClick(project.id, project.question_id)}
        />
      ))}
    </div>
  );
}
