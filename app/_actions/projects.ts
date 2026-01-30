'use server';

import { apiFetch, API_ENDPOINTS } from '@/libs/api-client';
import type { ProjectCreate, ProjectListItem, QuestionListItem } from '@/types/api';

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
 */
export async function createProject(data: ProjectCreate) {
  return apiFetch(API_ENDPOINTS.projects, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * 프로젝트의 문항 목록 조회
 */
export async function getQuestions(projectId: string): Promise<QuestionListItem[]> {
  return apiFetch<QuestionListItem[]>(API_ENDPOINTS.questions(projectId));
}
