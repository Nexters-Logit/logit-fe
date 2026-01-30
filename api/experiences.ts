import type { ExperienceCreate } from "@/types/api";

/**
 * 경험 등록 API
 * POST /api/v1/experiences
 * STAR 형식으로 새로운 경험을 등록합니다.
 */
export async function createExperienceApi(
  data: ExperienceCreate
): Promise<unknown> {
  const response = await fetch("/api/experiences", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(
      (error as { detail?: string })?.detail || `API Error: ${response.status}`
    );
  }

  if (response.status === 204) {
    return undefined;
  }

  return response.json();
}
