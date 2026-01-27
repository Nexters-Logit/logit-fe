"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import StatusEmpty from "@/components/StatusEmpty";
import { getQuestions } from "@/app/_actions/projects";
import type { ProjectListItem } from "@/types/api";
import { ProjectRow } from "./ProjectRow";

interface ProjectListProps {
  projects: ProjectListItem[];
}

export function ProjectList({ projects }: ProjectListProps) {
  const router = useRouter();

  const handleProjectClick = async (projectId: string) => {
    try {
      const questions = await getQuestions(projectId);

      if (questions.length === 0) {
        alert("이 프로젝트에 문항이 없습니다.");
        return;
      }

      router.push(`/chat/${questions[0].id}`);
    } catch (error) {
      console.error("Failed to navigate to chat:", error);
      alert("채팅 페이지로 이동할 수 없습니다.");
    }
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
          onClick={() => handleProjectClick(project.id)}
        />
      ))}
    </div>
  );
}
