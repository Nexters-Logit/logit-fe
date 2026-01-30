import {
  getAuthToken,
  API_BASE_URL,
  API_ENDPOINTS,
} from "@/libs/api-client";
import type { ExperienceCreate } from "@/types/api";

/**
 * POST /api/experiences
 * 경험 등록 - 백엔드 API로 프록시
 */
export async function POST(req: Request) {
  const body = (await req.json()) as ExperienceCreate;

  const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.experiences}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getAuthToken()}`,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    return Response.json(
      { detail: (error as { detail?: string })?.detail || "Backend API error" },
      { status: response.status }
    );
  }

  if (response.status === 204) {
    return new Response(null, { status: 204 });
  }

  const data = await response.json();
  return Response.json(data);
}
