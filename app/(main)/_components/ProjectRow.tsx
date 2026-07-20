"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import type { ProjectListItem } from "@/types/api";
import { deleteProject } from "@/app/_actions/projects";
import { showToast } from "@/libs/toast";
import { DueBadge } from "@/components/common/DueBadge";
import { ProjectOptionsMenu } from "./ProjectOptionsMenu";
import { DeleteProjectDialog } from "./DeleteProjectDialog";

interface ProjectRowProps {
  project: ProjectListItem;
  onClick: () => void;
}

export function ProjectRow({ project, onClick }: ProjectRowProps) {
  const router = useRouter();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const title = `${project.company}_${project.job_position}`;
  const isAllComplete =
    project.total_questions > 0 &&
    project.completed_questions === project.total_questions;

  const handleDelete = () => {
    startTransition(async () => {
      try {
        await deleteProject(project.id);
        setDeleteOpen(false);
        router.refresh();
        showToast.success("프로젝트가 삭제되었습니다.");
      } catch {
        showToast.error("삭제 중 오류가 발생했습니다.");
      }
    });
  };

  return (
    <>
      <div
        onClick={onClick}
        className="flex items-center justify-between py-3.5 border-b border-gray-70 w-full cursor-pointer hover:bg-gray-20 transition-colors"
      >
        <div className="flex items-center gap-5">
          <DueBadge dueDate={project.due_date} />
          <span className="text-body-5-5 text-primary-600">{title}</span>
        </div>

        <div className="flex items-center gap-8">
          <div className="flex items-center gap-4">
            <Image
              src={
                isAllComplete ? "/icons/editComlete.svg" : "/icons/editing.svg"
              }
              alt={isAllComplete ? "작성완료" : "작성중"}
              width={34}
              height={34}
            />
            <span
              className={`text-base font-normal leading-140 tabular-nums text-right min-w-8 ${isAllComplete ? "text-[#00D173]" : "text-primary-600"}`}
            >
              {project.completed_questions} / {project.total_questions}
            </span>
          </div>
          <ProjectOptionsMenu onDelete={() => setDeleteOpen(true)} />
        </div>
      </div>

      <DeleteProjectDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleDelete}
        isPending={isPending}
      />
    </>
  );
}
