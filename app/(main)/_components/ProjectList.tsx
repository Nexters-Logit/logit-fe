"use client";

import { useRouter } from "next/navigation";
import StatusEmpty from "@/components/StatusEmpty";
import type { ProjectListItem } from "@/types/api";
import { ProjectRow } from "./ProjectRow";

interface ProjectListProps {
  projects: ProjectListItem[];
  hasToken: boolean;
}

export function ProjectList({ projects, hasToken }: ProjectListProps) {
  const router = useRouter();

  const handleProjectClick = (
    projectId: string,
    questionId: string | null,
  ) => {
    if (!questionId) return;
    router.push(`/chat/${projectId}/${questionId}`);
  };

  if (!hasToken) {
    return (
      <div className="mt-5 flex justify-center py-10">
        <StatusEmpty message="로그인하고 자소서를 작성해보세요." />
      </div>
    );
  }

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
