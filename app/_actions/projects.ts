'use server';

import { apiFetch, API_ENDPOINTS } from '@/libs/api-client';
import type { ProjectCreate, ProjectListItem, QuestionListItem } from '@/types/api';

/**
 * 프로젝트 목록 조회
 */
export async function getProjects(): Promise<ProjectListItem[]> {
  return apiFetch<ProjectListItem[]>(API_ENDPOINTS.projects);
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
