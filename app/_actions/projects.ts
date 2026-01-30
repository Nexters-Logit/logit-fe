"use server";

import { revalidatePath } from "next/cache";
import { apiFetch, API_ENDPOINTS } from "@/libs/api-client";
import type {
  ProjectCreate,
  ProjectListItem,
  QuestionListItem,
} from "@/types/api";

/**
 * 프로젝트 목록 조회
 * @param skip - 건너뛸 항목 수 (페이지네이션)
 * @param limit - 최대 반환 항목 수
 */
export async function getProjects(params?: {
  skip?: number;
  limit?: number;
}): Promise<ProjectListItem[]> {
  const endpoint = params
    ? API_ENDPOINTS.projectsList(params)
    : API_ENDPOINTS.projects;
  return apiFetch<ProjectListItem[]>(endpoint);
}

/**
 * 프로젝트 생성
 * 생성 성공 시 홈 페이지 캐시를 무효화하여 프로젝트 목록이 갱신됩니다.
 */
export async function createProject(data: ProjectCreate) {
  const result = await apiFetch(API_ENDPOINTS.projects, {
    method: "POST",
    body: JSON.stringify(data),
  });

  revalidatePath("/");

  return result;
}

/**
 * 프로젝트의 문항 목록 조회
 */
export async function getQuestions(
  projectId: string,
): Promise<QuestionListItem[]> {
  return apiFetch<QuestionListItem[]>(API_ENDPOINTS.questions(projectId));
}
