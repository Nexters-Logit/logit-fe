"use server";

import { apiFetch, API_ENDPOINTS } from "@/libs/api-client";
import type { ExperienceSummaryResponse } from "@/types/api";

export async function getExperienceSummary(): Promise<ExperienceSummaryResponse> {
  return apiFetch<ExperienceSummaryResponse>(API_ENDPOINTS.experienceSummary);
}

