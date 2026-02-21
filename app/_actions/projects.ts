"use server";

import { revalidatePath } from "next/cache";
import { apiFetch, API_ENDPOINTS } from "@/libs/api-client";
import type {
  Project,
  ProjectCreate,
  ProjectCreateResponse,
  ProjectListItem,
  Question,
  QuestionCreate,
  QuestionListItem,
  QuestionUpdate,
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
export async function createProject(
  data: ProjectCreate,
): Promise<ProjectCreateResponse> {
  const result = await apiFetch<ProjectCreateResponse>(API_ENDPOINTS.projects, {
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

/**
 * 문항 생성
 */
export async function createQuestion(
  projectId: string,
  data: QuestionCreate,
): Promise<QuestionListItem> {
  const result = await apiFetch<QuestionListItem>(
    API_ENDPOINTS.questions(projectId),
    { method: "POST", body: JSON.stringify(data) },
  );
  revalidatePath(`/chat/${projectId}`);
  return result;
}

/**
 * 문항 수정
 */
export async function updateQuestion(
  projectId: string,
  questionId: string,
  data: QuestionUpdate,
): Promise<Question> {
  const result = await apiFetch<Question>(
    API_ENDPOINTS.question(projectId, questionId),
    { method: "PATCH", body: JSON.stringify(data) },
  );
  revalidatePath(`/chat/${projectId}`);
  return result;
}

/**
 * 문항 작성완료 토글
 */
export async function toggleQuestionComplete(
  projectId: string,
  questionId: string,
): Promise<Question> {
  const result = await apiFetch<Question>(
    API_ENDPOINTS.questionComplete(projectId, questionId),
    { method: "PATCH" },
  );
  revalidatePath(`/chat/${projectId}`);
  return result;
}

/**
 * 프로젝트 삭제
 */
export async function deleteProject(projectId: string): Promise<void> {
  await apiFetch<void>(API_ENDPOINTS.project(projectId), {
    method: "DELETE",
  });
  revalidatePath("/");
}

/**
 * 문항 삭제
 */
export async function deleteQuestion(
  projectId: string,
  questionId: string,
): Promise<void> {
  await apiFetch<void>(API_ENDPOINTS.question(projectId, questionId), {
    method: "DELETE",
  });
  revalidatePath(`/chat/${projectId}`);
}
