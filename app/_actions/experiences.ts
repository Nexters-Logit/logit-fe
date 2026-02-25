"use server";

import { apiFetch, API_ENDPOINTS } from "@/libs/api-client";
import type {
  ExperienceCreate,
  ExperienceUpdate,
  Experience,
  ExperienceListResponse,
} from "@/types/api";

/**
 * 경험 목록 조회
 */
export async function getExperiences(): Promise<Experience[]> {
  const response = await apiFetch<ExperienceListResponse>(
    API_ENDPOINTS.experiences,
  );
  return response.experiences;
}

/**
 * 경험 상세 조회
 */
export async function getExperience(id: string): Promise<Experience> {
  return apiFetch<Experience>(API_ENDPOINTS.experience(id));
}

/**
 * 경험 생성
 */
export async function createExperience(
  data: ExperienceCreate,
): Promise<Experience> {
  return apiFetch<Experience>(API_ENDPOINTS.experiences, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

/**
 * 경험 수정
 */
export async function updateExperience(
  id: string,
  data: ExperienceUpdate,
): Promise<Experience> {
  return apiFetch<Experience>(API_ENDPOINTS.experience(id), {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

/**
 * 경험 삭제
 */
export async function deleteExperience(id: string): Promise<void> {
  return apiFetch<void>(API_ENDPOINTS.experience(id), {
    method: "DELETE",
  });
}

export async function getMatchQuestion(questionId: string) {
  return apiFetch(API_ENDPOINTS.matchQuestion(questionId));
}
