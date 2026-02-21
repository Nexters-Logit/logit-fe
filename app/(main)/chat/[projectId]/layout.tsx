import { type ReactNode } from "react";
import { apiFetch, API_ENDPOINTS } from "@/libs/api-client";
import type { Project, QuestionListItem } from "@/types/api";
import { ProjectProvider } from "./_context";

interface ChatProjectLayoutProps {
  children: ReactNode;
  params: Promise<{
    projectId: string;
  }>;
}

export default async function ChatProjectLayout({
  children,
  params,
}: ChatProjectLayoutProps) {
  const { projectId } = await params;

  // 프로젝트 정보와 문항 목록을 병렬로 가져오기
  const [project, questions] = await Promise.all([
    apiFetch<Project>(API_ENDPOINTS.project(projectId)).catch((error) => {
      console.error("Failed to fetch project:", error);
      return null;
    }),
    apiFetch<QuestionListItem[]>(API_ENDPOINTS.questions(projectId)).catch(
      (error) => {
        console.error("Failed to fetch questions:", error);
        return [];
      },
    ),
  ]);

  return (
    <ProjectProvider
      value={{
        projectId,
        company: project?.company ?? "회사",
        jobPosition: project?.job_position ?? "직무",
        dueDate: project?.due_date ?? null,
        questions,
      }}
    >
      {children}
    </ProjectProvider>
  );
}
