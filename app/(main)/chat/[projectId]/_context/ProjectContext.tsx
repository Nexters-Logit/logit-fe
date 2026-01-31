"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { QuestionListItem } from "@/types/api";

interface ProjectContextValue {
  projectId: string;
  company: string;
  jobPosition: string;
  questions: QuestionListItem[];
}

const ProjectContext = createContext<ProjectContextValue | null>(null);

interface ProjectProviderProps {
  children: ReactNode;
  value: ProjectContextValue;
}

export function ProjectProvider({ children, value }: ProjectProviderProps) {
  return (
    <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>
  );
}

export function useProjectContext() {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error("useProjectContext must be used within ProjectProvider");
  }
  return context;
}
