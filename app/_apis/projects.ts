import { apiFetch, API_ENDPOINTS } from '@/libs/api-client';
import type { ProjectListItem } from '@/types/api';

/**
 * 프로젝트 목록 조회 (서버용 - 직접 API 호출)
 * GET /api/v1/projects/ 는 ProjectListItem[] 배열을 직접 반환
 */
export async function getProjectsServer(): Promise<ProjectListItem[]> {
  return apiFetch<ProjectListItem[]>(API_ENDPOINTS.projects);
}
